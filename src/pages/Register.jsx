// src/pages/Register.jsx
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userColor, setUserColor] = useState("#2196f3");

  const adminEmails = ["admin1@mail.com", "admin2@mail.com"];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const role = adminEmails.includes(email) ? "admin" : "user";

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        color: userColor,
        role,
        turno: "mañana",
      });

      toast.success("Registro exitoso ✅");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error al registrar ❌");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Registro</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color identificativo:
        </label>
        <input
          type="color"
          value={userColor}
          onChange={(e) => setUserColor(e.target.value)}
          className="mb-4 w-20 h-10 p-1 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;
