# At5BucksWork — free website setup

This is a professional static website package. Hosting can be free with GitHub Pages. **Real login/signup and automatic email delivery need the free services below to be configured; they cannot work securely from a static page with placeholder credentials.**

## 1. Publish the website free with GitHub Pages
1. Create a GitHub repository, for example `at5buckswork`.
2. Upload all files in this folder to the repository root: `index.html`, `styles.css`, `app.js`, `config.js`, `Code.gs`, and this guide.
3. Open repository **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to show your website URL.

## 2. Enable genuine email/password accounts (Firebase free Spark plan)
1. Open https://console.firebase.google.com/ and create a project.
2. Go to **Build → Authentication → Get started → Sign-in method** and enable **Email/Password**.
3. In Project settings, add a Web app and copy its Firebase config.
4. Edit `config.js`; replace `YOUR_FIREBASE_API_KEY`, `YOUR_PROJECT_ID`, and `YOUR_FIREBASE_APP_ID` with the values from Firebase. Keep `authDomain` and other fields exactly as Firebase provides them.
5. In Firebase Authentication → Settings → Authorized domains, add your GitHub Pages domain.
6. Commit/push the changed `config.js`. Users can now create accounts, log in and request a password reset.

## 3. Enable work requests and email delivery
The site is designed to send name, reply email, service, task details and uploaded attachments to **at5buckswork@hotmail.com**. Do not advertise automatic delivery until this is tested.

For reliable attachment sending, deploy a small backend endpoint. The included `Code.gs` is a Google Apps Script starting point, but browser multipart file uploads do not map directly to its JSON handler. The front-end `app.js` must encode the selected files as base64 JSON before posting, and the Apps Script must be deployed and tested. If you want, ask ChatGPT to complete this integration next; the exact free setup will depend on your account limits and current Google Apps Script deployment options.

**Important:** Do not put email passwords, secret API keys, or mail account credentials in `app.js` or `config.js`. Anything in a static website is public. Never ask clients to send passwords or sensitive identity documents.

## Pricing and deadline wording
The website says **starting at $5** and **target within 5 working days depending on task size and availability**. Confirm scope, final price, and deadline with each customer before accepting work.

## Before sharing the link, test
- Sign up with a test email, log out, and log in again.
- Try password reset.
- Submit a request without files, then with a small non-sensitive file.
- Confirm the email actually arrives in the owner inbox (and check junk/spam).
- Test on mobile.
