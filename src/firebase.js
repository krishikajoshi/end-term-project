import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLYLOPvIRi7L620esTfgoXNm2qctjPGOo",
  authDomain: "habit-tracker-aa3cb.firebaseapp.com",
  projectId: "habit-tracker-aa3cb",
  storageBucket: "habit-tracker-aa3cb.firebasestorage.app",
  messagingSenderId: "864826828183",
  appId: "1:864826828183:web:3b030780a53a9845b6d0d2",
  measurementId: "G-GN5Z92B2R6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 📦 Firestore DB
export const db = getFirestore(app);