// At5BucksWork frontend. Configure Firebase and Google Apps Script in config.js before publishing.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { SITE_CONFIG } from "./config.js";

const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
const validFirebase = SITE_CONFIG.firebase && SITE_CONFIG.firebase.apiKey && !SITE_CONFIG.firebase.apiKey.includes("YOUR_");
let auth = null, mode = "login", currentUser = null;
if (validFirebase) {
  try {
    const app = initializeApp(SITE_CONFIG.firebase);
    auth = getAuth(app);
    onAuthStateChanged(auth, user => {
      currentUser = user;
      $("loginBtn").classList.toggle("hidden", !!user);
      $("signupBtn").classList.toggle("hidden", !!user);
      $("logoutBtn").classList.toggle("hidden", !user);
      if (user) { $("formStatus").textContent = `Signed in as ${user.email}. Your request will include your account email.`; }
    });
  } catch (e) { console.error(e); }
}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.append(t);setTimeout(()=>t.remove(),3500)}
function openAuth(nextMode){mode=nextMode; $("authModal").classList.remove("hidden");renderAuth()}
function renderAuth(){const signup=mode==="signup";$("modalTitle").textContent=signup?"Create your account":"Welcome back";$("modalSub").textContent=signup?"Create an account to send work requests.":"Log in to your At5BucksWork account.";$("authSubmit").textContent=signup?"Create account":"Log in";$("switchAuth").textContent=signup?"Already have an account? Log in":"New here? Create an account";$("authStatus").textContent=""}
$("loginBtn").onclick=()=>openAuth("login");$("signupBtn").onclick=()=>openAuth("signup");$("closeModal").onclick=()=>$("authModal").classList.add("hidden");$("switchAuth").onclick=()=>{mode=mode==="login"?"signup":"login";renderAuth()};
$("logoutBtn").onclick=async()=>{if(auth){await signOut(auth);toast("You are logged out.")}else toast("Please configure Firebase to enable accounts.")};
$("authForm").addEventListener("submit",async e=>{e.preventDefault();if(!auth){$("authStatus").textContent="Account login is not configured yet. Follow SETUP.md to connect free Firebase Authentication.";return}const email=$("authEmail").value.trim(),password=$("authPassword").value;try{if(mode==="signup"){await createUserWithEmailAndPassword(auth,email,password);$("authStatus").textContent="Account created successfully.";setTimeout(()=>$("authModal").classList.add("hidden"),900)}else{await signInWithEmailAndPassword(auth,email,password);$("authStatus").textContent="Logged in successfully.";setTimeout(()=>$("authModal").classList.add("hidden"),700)}}catch(err){$("authStatus").textContent=humanError(err.code)}});
$("resetPassword").onclick=async()=>{if(!auth){$("authStatus").textContent="Configure Firebase first (see SETUP.md).";return}const email=$("authEmail").value.trim();if(!email){$("authStatus").textContent="Enter your email address first.";return}try{await sendPasswordResetEmail(auth,email);$("authStatus").textContent="Password reset email sent if the account exists."}catch(e){$("authStatus").textContent=humanError(e.code)}};
function humanError(code){return ({'auth/email-already-in-use':'This email already has an account. Try logging in.','auth/invalid-credential':'Email or password is incorrect.','auth/weak-password':'Choose a stronger password (at least 6 characters).','auth/invalid-email':'Please enter a valid email address.','auth/too-many-requests':'Too many attempts. Please try again later.'})[code]||"Could not complete that action. Please check your details and try again."}
$("files").addEventListener("change",()=>{$("fileNames").textContent=[...$("files").files].map(f=>f.name).join(", ")||"No files selected";const total=[...$("files").files].reduce((s,f)=>s+f.size,0);if(total>8*1024*1024){$("fileNames").textContent="Files exceed 8 MB total. Please choose smaller files.";$("files").value=""}});
$("copyEmail").onclick=async()=>{try{await navigator.clipboard.writeText("at5buckswork@hotmail.com");toast("Email address copied.")}catch(e){toast("Email: at5buckswork@hotmail.com")}};
$("requestForm").addEventListener("submit",async e=>{e.preventDefault();const status=$("formStatus");const files=[...$("files").files];if(files.reduce((s,f)=>s+f.size,0)>8*1024*1024){status.textContent="Files exceed the 8 MB total limit.";return}if(!SITE_CONFIG.appsScriptUrl||SITE_CONFIG.appsScriptUrl.includes("PASTE_YOUR")){status.textContent="Email delivery is not connected yet. Follow SETUP.md to enable request emails and file attachments.";return}status.textContent="Preparing your request…";const form=e.currentTarget;const formData=new FormData(form);try{const encodedFiles=await Promise.all(files.map(f=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({name:f.name,mimeType:f.type||"application/octet-stream",base64:String(reader.result).split(",")[1]});reader.onerror=reject;reader.readAsDataURL(f)})));const payload={name:formData.get("name"),email:formData.get("email"),service:formData.get("service"),message:formData.get("message"),accountEmail:currentUser?.email||"Not logged in",files:encodedFiles};status.textContent="Sending your request…";const res=await fetch(SITE_CONFIG.appsScriptUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});const data=await res.json();if(!res.ok||!data.success)throw new Error(data.message||"Send failed");status.textContent="Request sent! We’ll review it and contact you by email.";form.reset();$("fileNames").textContent="No files selected"}catch(err){console.error(err);status.textContent="Could not confirm automatic delivery. Please email your request and files to at5buckswork@hotmail.com."}});
