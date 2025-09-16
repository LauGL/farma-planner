// src/services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// Registrar usuario y guardar datos en Firestore
export const registerUser = async (email, password, name, color, shift) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  // Guardar perfil en Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    color,
    shift,
  });

  return user;
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
};
