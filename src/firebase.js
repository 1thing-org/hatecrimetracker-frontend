import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCdt-8N8Em3JHcMeEua-QMR3txkqdR01dg",
    authDomain: "hate-crime-tracker.firebaseapp.com",
    projectId: "hate-crime-tracker",
    storageBucket: "hate-crime-tracker.appspot.com",
    messagingSenderId: "46658644173",
    appId: "1:46658644173:web:c2640c99b9caa1b69e2184",
    measurementId: "G-XS3NGG7FZS"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider)
}