// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de tu app (copiada de Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDeJCtp5Adrj1QNxCar73wGNAg6507iApc",
  authDomain: "farmaplanner-8f4eb.firebaseapp.com",
  projectId: "farmaplanner-8f4eb",
  storageBucket: "farmaplanner-8f4eb.appspot.com",
  messagingSenderId: "526484964413",
  appId: "1:526484964413:web:16417dfc54e347ef749654",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
