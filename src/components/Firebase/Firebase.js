import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { serverTimestamp } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyC7CiteD8ll7X_uY4bx4LQp3HYfyTDj430",
  authDomain: "animegpt-afce1.firebaseapp.com",
  projectId: "animegpt-afce1",
  storageBucket: "animegpt-afce1.appspot.com",
  messagingSenderId: "1093486158120",
  appId: "1:1093486158120:web:47c7ce133e18acdeb3701d",
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.useAuthState = useAuthState;
    this.useCollectionData = useCollectionData;
    this.timestamp = serverTimestamp();
  }
  //inscription
  signupUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  //connexion
  loginUser = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  //deconnexion
  signoutUser = () => this.auth.signOut();

  //Récuperer le mot de passe
  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  user = (uid) => this.db.doc(`users/${uid}`);
}

export default Firebase;
