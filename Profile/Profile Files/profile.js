import { app ,auth ,db ,analytics ,firebaseApp ,storage } from "../../firebase/firebase.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
import { collection, addDoc , getDocs ,getDoc} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const postSection = document.getElementById('postSection');

// Fetch and display the user's blogs
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const userBlogs = querySnapshot.docs.filter((doc) => doc.data().uid === user.uid);

    postSection.innerHTML = ''; // clear the post section

    for (const doc of userBlogs) {
      const postData = doc.data();
      let userName = "Unknown";
      const userDocSnapshot = await getDocs(collection(db, "usersData"));
      userDocSnapshot.forEach((userDoc) => {
        if (userDoc.data().uid == postData.uid) {
          userName = userDoc.data().userName; 
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
});