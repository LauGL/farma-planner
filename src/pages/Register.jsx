import { useState } from "react";
import { registerUser } from "../services/auth";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0000ff");
  const [shift, setShift] = useState("morning");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password, name, color, shift);
      alert("Usuario registrado ✅");
    } catch (error) {
      console.error(error);
      alert("Error al registrar usuario ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <label>Color identificativo:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <label>Turno:</label>
      <select value={shift} onChange={(e) => setShift(e.target.value)}>
        <option value="morning">Mañana</option>
        <option value="afternoon">Tarde</option>
      </select>

      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;
