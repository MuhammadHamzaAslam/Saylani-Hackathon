import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
import { collection, addDoc , getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db } from "../../firebase/firebase.mjs";
import { app ,auth ,analytics } from "../../firebase/firebase.mjs";
import { onAuthStateChanged ,signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', async () => {
    let blogName = document.getElementById('blogName').value;
    let blogDescription = document.getElementById('blogDescription').value;
    let blogPic = document.getElementById('blogPic').files[0];
    submitBtn.innerText += '.....'
    if (!blogName || !blogDescription || !blogPic) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all fields",
        });
    } else {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${blogPic.name}`);
        
        const uploadTask = uploadBytesResumable(storageRef, blogPic);
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            console.error('Upload failed:', error);
            Swal.fire({
              icon: "error",
              title: "Upload Failed",
              text: `Error: ${error.message}`,
            });
          }, 
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);

            try {
                const docRef = await addDoc(collection(db, "blogs"), {
                  blogName: blogName,
                  blogDescription: blogDescription,
                  imgUrl: downloadURL
                });
                console.log("Document written with ID: ", docRef.id);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Blog added successfully!",
                }).then(()=>{
                    window.location.href = '../../Dashboard/dashboard.html'
                });
            } catch (e) {
                console.error("Error adding document: ", e);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error adding blog: ${e.message}`,
                });
            }
          }
        );
    }
});