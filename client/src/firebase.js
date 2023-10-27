// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "home-sync-bde0b.firebaseapp.com",
  projectId: "home-sync-bde0b",
  storageBucket: "home-sync-bde0b.appspot.com",
  messagingSenderId: "172897037145",
  appId: "1:172897037145:web:d73e0c5dfdfa1b073eba48",
  measurementId: "G-FVCW5ZKWLL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
