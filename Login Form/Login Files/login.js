import { app, analytics, db, auth, firebaseApp } from "../../Firebase/firebase.mjs";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection,addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let loginEmail = document.getElementById('loginEmail')
let loginPassword = document.getElementById('loginPassword')
let loginBtn = document.getElementById('loginBtn')
loginBtn.addEventListener('click', () => {

    signInWithEmailAndPassword(auth, loginEmail.value.trim(), loginPassword.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            Swal.fire({
                title: "Good job!",
                text: "You Signed in Our Page",
                icon: "success",
                footer: `<p>Your Information Has Saved</p>`
            }).then(() => {
                window.location.href = '../../Dashboard/dashboard.html';
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            if (errorCode === 'auth/user-not-found') {
                Swal.fire({
                    title: "Error!",
                    text: "No user found with this email. Please check and try again.",
                    icon: "error",
                });
            } else if (errorCode === 'auth/wrong-password') {
                Swal.fire({
                    title: "Error!",
                    text: "Incorrect password. Please try again.",
                    icon: "error",
                });
            } else if (errorCode === 'auth/invalid-email') {
                Swal.fire({
                    title: "Error!",
                    text: "Invalid email format. Please enter a valid email address.",
                    icon: "error",
                });
            } else if (errorCode === 'auth/user-disabled') {
                Swal.fire({
                    title: "Error!",
                    text: "This user has been disabled. Please contact support.",
                    icon: "error",
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: errorMessage,
                    icon: "error",
                });
            }
        });

});
const querySnapshot = await getDocs(collection(db, "usersData"));
querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
});
async function displayUserData(uid) {
    try {
        const q = query(collection(db, "usersData"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.error('No matching documents.');
            return;
        }

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            console.log('User Data:', userData);  

            document.getElementById('spanOfFirstName').innerText = userData.fName || 'N/A';
            document.getElementById('spanOfLastName').innerText = userData.lName || 'N/A';
            document.getElementById('spanOfEmail').innerText = userData.userEmail || 'N/A';
            document.getElementById('spanOfPhoneNumber').innerText = userData.phoneNumber || 'N/A';
            document.getElementById('spanOfGender').innerText = userData.genderSelect || 'N/A';
            document.getElementById('spanOfUserName').innerText = userData.userName || 'N/A';
            document.getElementById('spanOfPassword').innerText = userData.password || 'N/A';
        });
    } catch (error) {
        console.error('Error retrieving user data:', error);
    }
}
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        displayUserData(uid);  // Ensure this function is being called here
    } else {
        // window.location.href = '../../Login Form/login.html';
    }
});
