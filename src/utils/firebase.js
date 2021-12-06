import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb-Cf9dVon4sZnHO9_vnGBKoZ11nh41sM",
  authDomain: "flow-club-starter-code.firebaseapp.com",
  projectId: "flow-club-starter-code",
  storageBucket: "flow-club-starter-code.appspot.com",
  messagingSenderId: "652086100601",
  appId: "1:652086100601:web:f001ea6d9dabfcbf374aa8",
};

export function firebaseSlugBase() {
  return ref(getDatabase(), slug);
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const slug = "2205619bfd";
export const db = getDatabase();
