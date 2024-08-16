import { analytics, app, auth, db, firebaseApp, storage } from "../../Firebase/firebase.mjs";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";
let signUpBtn = document.getElementById('signUpBtn');
signUpBtn.addEventListener('click', async () => {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const userName = document.getElementById('userName').value.trim();
    const gender = document.getElementById('gender').value;
    const emailAddress = document.getElementById('createEmail').value.trim();
    const password = document.getElementById('createPassword').value;
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const file = document.getElementById('file').files[0];

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailAddress, password);
        const user = userCredential.user;

        await addDoc(collection(db, "usersData"), {
            uid: user.uid,
            fName: firstName,
            lName: lastName,
            userEmail: emailAddress,
            phoneNumber: phoneNumber,
            genderSelect: gender,
            userName: userName,
            password: password
        });
        file.addEventListener('click',()=>{
            const storageRef = ref(storage, `images/ ${file.files[0].name}`);
            const uploadTask = uploadBytesResumable(storageRef, file.files[0]);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
    
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                    });
                }
            );
        })


        Swal.fire({
            title: "Good job!",
            text: "You Signed up to Our Page",
            icon: "success",
            footer: `<p>Your Information Has Been Saved</p>`
        }).then(() => {
            window.location.href = '../../Dashboard/dashboard.html';
        });
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('userName').value = '';
        document.getElementById('gender').value = '';
        document.getElementById('createEmail').value = '';
        document.getElementById('createPassword').value = '';
        document.getElementById('phoneNumber').value = '';
        document.getElementById('file').value = '';

    } catch (error) {
        console.error("Error adding document: ", error);

        let errorMessage;

        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email is already in use. Please use a different email.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email format. Please enter a valid email address.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Weak password. Please enter a stronger password.";
        } else {
            errorMessage = error.message;
        }

        Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
        }).then(() => {
            location.reload();
        });
    }
});

