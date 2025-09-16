import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/auth";

const Requirement = ({ label, isValid }) => (
  <li
    className={`flex items-center gap-2 ${
      isValid ? "text-green-600" : "text-gray-500"
    }`}
  >
    {isValid ? "✅" : "❌"} {label}
  </li>
);

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2E7D32");
  const [shift, setShift] = useState("morning");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Validación de contraseña
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[@$!%*?&#]/.test(password);
  const isPasswordSecure =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSymbol;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordSecure) {
      setMessage("La contraseña no cumple los requisitos de seguridad.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden ❌");
      setMessageType("error");
      return;
    }

    try {
      await registerUser(email, password, name, color, shift);
      setMessage("¡Usuario registrado correctamente!");
      setMessageType("success");

      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setColor("#2E7D32");
      setShift("morning");
    } catch (error) {
      setMessage(error.message || "Error al registrar usuario ❌");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4">
      {/* Nombre de la App */}
      <h1 className="text-4xl font-bold text-primary mb-2">FarmaPlanner</h1>

      {/* Botón volver al inicio */}
      <Link
        to="/"
        className="mb-6 text-sm text-primary hover:underline font-medium"
      >
        ← Volver al inicio
      </Link>

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-primary mb-6">
          Crear cuenta
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
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="text-sm text-gray-600 mt-2">
              <p>La contraseña debe contener al menos:</p>
              <ul className="list-none ml-2 mt-1 space-y-1">
                <Requirement label="8 caracteres" isValid={hasMinLength} />
                <Requirement
                  label="Una letra mayúscula"
                  isValid={hasUppercase}
                />
                <Requirement
                  label="Una letra minúscula"
                  isValid={hasLowercase}
                />
                <Requirement label="Un número" isValid={hasNumber} />
                <Requirement
                  label="Un símbolo especial (@, #, !, etc.)"
                  isValid={hasSymbol}
                />
              </ul>
            </div>
          </div>

          <input
            type="password"
            placeholder="Repetir contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Color identificativo
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 p-0 border-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Turno asignado
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="morning">Mañana</option>
              <option value="afternoon">Tarde</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-green-900 transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
