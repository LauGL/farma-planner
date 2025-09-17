// src/services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// Verificar si el color ya está en uso
const isColorInUse = async (color) => {
  const q = query(collection(db, "users"), where("color", "==", color));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// 🟢 REGISTRO de usuario
export async function registerUser(email, password, name, color, shift) {
  const colorTaken = await isColorInUse(color);
  if (colorTaken) {
    throw new Error("El color ya está en uso. Elige otro diferente.");
  }

  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    color,
    shift,
    createdAt: new Date(),
  });

  return user;
}

// 🔵 LOGIN de usuario
export async function loginUser(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

// 🔴 LOGOUT de usuario
export async function logoutUser() {
  await signOut(auth);
}
