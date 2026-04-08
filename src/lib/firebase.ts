import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjpYHg2t9GM_F_T6Onp0G2njxf3Z28Z2M",
  authDomain: "bolaobrasil-6af5e.firebaseapp.com",
  projectId: "bolaobrasil-6af5e",
  storageBucket: "bolaobrasil-6af5e.firebasestorage.app",
  messagingSenderId: "382835705405",
  appId: "1:382835705405:web:9e2ad91d3aed54461b8c54",
  measurementId: "G-0VZ7PLN7E2"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);