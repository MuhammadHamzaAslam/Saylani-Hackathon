import { auth } from "../../firebase/firebase.mjs"; 
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
import { collection, addDoc , getDocs ,getDoc} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db } from "../../firebase/firebase.mjs";
const userNameElem = document.getElementById('userName');
const loginBtn = document.getElementById('loginBtno');
const addBlogBtn = document.getElementById('addblog');
const signOutBtn = document.getElementById('signOut');
const postSection = document.getElementById('postSection');
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    const usersRef = collection(db, "usersData");
    getDocs(usersRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().uid === uid) {
          const userName = doc.data().userName;
          userNameElem.textContent = `👋 ${userName}`;
        }
      });
    });
    loginBtn.style.display = 'none'; 
    addBlogBtn.style.display = 'block'; 
    signOutBtn.style.display = 'block'; 
  } else {
    // User is signed out
    userNameElem.textContent = '';
    loginBtn.style.display = 'block'; 
    addBlogBtn.style.display = 'none'; 
    signOutBtn.style.display = 'none'; 
  }
});

signOutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    // Sign-out successful.
    window.location.href = '../../index.html'; 
  }).catch((error) => {
    // An error happened.
    console.error("Sign out error: ", error);
  });
});
async function loadBlogPosts() {
  const querySnapshot = await getDocs(collection(db, "blogs"));
  for (const doc of querySnapshot.docs) {
    const postData = doc.data();
    let userName = "Unknown"; // declare the variable here
    const userDocSnapshot = await getDocs(collection(db, "usersData"));
    userDocSnapshot.forEach((userDoc) => {
      if (userDoc.data().uid === postData.uid) {
        userName = userDoc.data().userName; // update the variable here
      }
    });

    postSection.innerHTML += `
      <div id="postDiv" class="p-2">
        <div style="display: flex;">
          <img
            src="${postData.imgUrl}"
            alt="img" style="height: 150px; border-radius: 50%; width: 150px; margin-right: 10px;">
          <div class="mt-5">
            <span style="display: flex; font-weight: bold;">${postData.blogName}</span>
            <span style="display: flex; color: gray;">${new Date().toDateString()}</span>
            <span style="display: flex; color: gray;">${userName}</span>
          </div>
        </div>
        <div id="postDescription" style="width: 100%;height: 145px;overflow-y: scroll;margin-top: 10px;" class="pb-2 text-center">
          <p>${postData.blogDescription}</p>
        </div>
      </div>
    `;
  }
}

loadBlogPosts();