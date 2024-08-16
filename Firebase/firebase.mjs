import { initializeApp ,getApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyCzR4LruLUR8-JiHIfKpDMO2vPyZuB_Jg8",
    authDomain: "hackathon-d8f3e.firebaseapp.com",
    projectId: "hackathon-d8f3e",
    storageBucket: "hackathon-d8f3e.appspot.com",
    messagingSenderId: "138210993659",
    appId: "1:138210993659:web:9d0842964769af67d4d75e",
    measurementId: "G-D4LXRPJ41P"
};
export const app = initializeApp(firebaseConfig);  
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseApp = getApp();
export const storage = getStorage(firebaseApp, "gs://my-custom-bucket");