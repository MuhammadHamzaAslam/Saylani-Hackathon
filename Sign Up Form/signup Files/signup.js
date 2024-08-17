import { analytics, app, auth, db, firebaseApp } from "../../Firebase/firebase.mjs";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs , addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

let signUpBtn = document.getElementById('signUpBtn');

signUpBtn.addEventListener('click', async (e) => {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const userName = document.getElementById('userName').value.trim();
    const gender = document.getElementById('gender').value;
    const emailAddress = document.getElementById('createEmail').value.trim();
    const password = document.getElementById('createPassword').value;
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    e.preventDefault();

    createUserWithEmailAndPassword(auth, emailAddress, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;
            console.log('uid', uid);

            try {
                await addDoc(collection(db, "usersData"), {
                    uid: uid,
                    fName: firstName,
                    lName: lastName,
                    userEmail: emailAddress,
                    phoneNumber: phoneNumber,
                    genderSelect: gender,
                    userName: userName,
                    password: password
                });
                Swal.fire({
                    title: "Good job!",
                    text: "You Signed up Our Page",
                    icon: "success",
                    footer: `<p>Your Information Has Saved</p>`
                }).then(() => {
                    window.location.href = '../../Dashboard/dashboard.html';
                });

            } catch (e) {
                console.error("Error adding document: ", e);
            }

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
                Swal.fire({
                    title: "Error!",
                    text: "This email is already in use. Please use a different email.",
                    icon: "error",
                }).then(() => {
                    location.reload()
                });
            } else if (error.code === 'auth/invalid-email') {
                Swal.fire({
                    title: "Error!",
                    text: "Invalid email format. Please enter a valid email address.",
                    icon: "error",
                }).then(() => {
                    location.reload()
                });
            } else if (error.code === 'auth/weak-password') {
                Swal.fire({
                    title: "Error!",
                    text: "Weak password. Please enter a stronger password.",
                    icon: "error",
                }).then(() => {
                    location.reload()
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