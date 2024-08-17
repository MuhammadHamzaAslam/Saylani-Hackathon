import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
import { collection, addDoc , getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db } from "../../Firebase/firebase.mjs";
let postSection = document.getElementById('postSection') 
const querySnapshot = await getDocs(collection(db, "blogs"));
querySnapshot.forEach((doc) => {
//   console.log(`${doc.id} => ${doc.data()}`);
let postData = doc.data()
console.log(postData);
postSection.innerHTML += `
      <div id="postDiv">
              <div id="imgSection">
                <img src="${postData.imgUrl}" height="100px" alt="">
                <p>${postData.blogName}</p>
                <p>${new Date()}</p>
              </div>
              <p>${postData.blogDescription}</p>
      </div>
  `
});
SignOutBtn.addEventListener('click',()=>{
    signOut(auth).then(() => {
        window.location.href = '../../Login Form/login.html'
      }).catch((error) => {
        alert('you dont have account')
      });
})
