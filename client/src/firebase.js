// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  // apiKey: "AIzaSyCpfFKdhDZRHod5KuI302MOb6m7WO2N6BE",
  authDomain: "mern-blog-6638a.firebaseapp.com",
  projectId: "mern-blog-6638a",
  storageBucket: "mern-blog-6638a.appspot.com",
  messagingSenderId: "168095437820",
  appId: "1:168095437820:web:b0bb04b79a07190bbf1879",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
