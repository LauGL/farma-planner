import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Asegúrate que este archivo existe

// Verifica si el color ya está en uso por otro usuario
const isColorInUse = async (color) => {
  const q = query(collection(db, "users"), where("color", "==", color));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Registrar usuario y guardar datos en Firestore
export const registerUser = async (email, password, name, color, shift) => {
  // Verificar si el color ya está usado
  const colorTaken = await isColorInUse(color);
  if (colorTaken) {
    throw new Error("El color ya está en uso. Elige otro color.");
  }

  // Crear usuario en Firebase Auth
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  // Guardar perfil en Firestore usando el uid como ID del documento
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    color,
    shift,
    createdAt: new Date(),
  });

  return user;
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
};
