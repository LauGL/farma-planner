import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginUser(email, password);
      setMessage("Inicio de sesión correcto ✅");
      setMessageType("success");

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      console.error(error); // ahora sí se está usando
      setMessage("Correo o contraseña incorrectos ❌");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4">
      <h1 className="text-4xl font-bold text-primary mb-2">FarmaPlanner</h1>

      <Link
        to="/"
        className="mb-6 text-sm text-primary hover:underline font-medium"
      >
        ← Volver al inicio
      </Link>

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-primary mb-6">
          Iniciar sesión
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-sm font-semibold ${
              messageType === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-green-900 transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
