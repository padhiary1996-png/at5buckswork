/**
 * Google Apps Script email endpoint for At5BucksWork.
 * Deploy as a Web App (execute as you; access: anyone).
 * The website sends JSON as text/plain to avoid a browser CORS preflight.
 * Test the deployed endpoint from the published site before relying on it.
 */
const OWNER_EMAIL = "at5buckswork@hotmail.com";
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const name = String(data.name || "").slice(0, 150);
    const email = String(data.email || "").slice(0, 250);
    const service = String(data.service || "").slice(0, 150);
    const message = String(data.message || "").slice(0, 8000);
    const accountEmail = String(data.accountEmail || "Not logged in").slice(0, 250);
    const files = Array.isArray(data.files) ? data.files : [];
    const attachments = files.map(f => {
      const bytes = Utilities.base64Decode(f.base64);
      return Utilities.newBlob(bytes, f.mimeType || "application/octet-stream", String(f.name || "attachment").slice(0, 150));
    });
    const body = "New At5BucksWork request\n\nName: " + name + "\nReply email: " + email +
      "\nService: " + service + "\nAccount: " + accountEmail + "\n\nDetails:\n" + message +
      "\n\nAttachments: " + attachments.length;
    GmailApp.sendEmail(OWNER_EMAIL, "New work request — " + service, body, {
      replyTo: email, name: "At5BucksWork Website", attachments: attachments
    });
    return json({success:true});
  } catch(err) {
    return json({success:false, message:String(err)});
  }
}
function doGet() { return json({service:"At5BucksWork email endpoint",status:"ready"}); }
function json(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }