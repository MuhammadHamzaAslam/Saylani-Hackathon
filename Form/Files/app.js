import { analytics, app, auth, db, firebaseApp, storage } from "../../firebase/firebase.mjs";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach(password => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    })

  })
})

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault(); //preventing form submit
    forms.classList.toggle("show-signup");
  })
})

// form js ended

// main logic started


let loginBtn = document.getElementById('loginBtn')
let signUpBtn = document.getElementById('signUpBtn')

signUpBtn.addEventListener('click', (e) => {
  let userName = document.getElementById('userName').value;
  let createEmail = document.getElementById('createEmail').value.trim();
  let createPassword = document.getElementById('createPassword').value;
  e.preventDefault()
  signUpBtn.innerText += '.....'
  createUserWithEmailAndPassword(auth, createEmail, createPassword)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      console.log('uid: ', uid);

      try {
        await addDoc(collection(db, "usersData"), {
          uid: uid,
          userName: userName,
          emailAddress: createEmail,
          password: createPassword
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
        Swal.fire({
          title: "Error!",
          text: "Failed to save user data. Please try again.",
          icon: "error",
        });
      }

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating user: ", errorCode, errorMessage);

      let errorMsg = "An error occurred. Please try again.";
      if (errorCode === 'auth/email-already-in-use') {
        errorMsg = "This email is already in use. Please use a different email.";
      } else if (errorCode === 'auth/invalid-email') {
        errorMsg = "Invalid email format. Please enter a valid email address.";
      } else if (errorCode === 'auth/weak-password') {
        errorMsg = "Weak password. Please enter a stronger password.";
      }

      Swal.fire({
        title: "Error!",
        text: errorMsg,
        icon: "error",
      }).then(() => {
        location.reload();
      });
    });
});

loginBtn.addEventListener('click', (e) => {
  e.preventDefault()
  loginBtn.innerText += '.....'
  let loginEmail = document.getElementById('loginEmail').value.trim()
  let loginPassword = document.getElementById('loginPassword').value
  if (!loginEmail || !loginPassword) {
    Swal.fire({
      title: "Oppss!",
      text: "Plz fill all fields",
      icon: "error",
    }).then(()=>{
      loginBtn.innerText = 'Login'

    })
  }else{

    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
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
      console.log(errorCode);
      
      let errorMsg = "An error occurred. Please try again.";
        if (errorCode === 'auth/user-not-found') {
          errorMsg = "No user found with this email. Please sign up first.";
        } else if (errorCode === 'auth/wrong-password') {
          errorMsg = "Incorrect password. Please try again.";
        } else if (errorCode === 'auth/invalid-email') {
          errorMsg = "Invalid email format. Please enter a valid email address.";
        } else if (errorCode === 'auth/invalid-credential') {
          errorMsg = 'Email Or Password Is Wrong'
        }
        

        Swal.fire({
          title: "Error!",
          text: errorMsg,
          icon: "error",
        }).then(() => {
          loginBtn.innerText = 'Login';
          location.reload()
        })
    });
  }
  })
  
  const querySnapshot = await getDocs(collection(db, "usersData"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
