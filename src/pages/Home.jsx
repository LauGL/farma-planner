import Logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary text-dark px-4">
      {/* Logo y nombre */}
      <div className="flex flex-col items-center mb-8">
        <img src={Logo} alt="FarmaPlanner Logo" className="w-28 h-28 mb-4" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary">
          FarmaPlanner
        </h1>
      </div>

      {/* Descripción */}
      <p className="mb-12 text-xl md:text-2xl text-center max-w-2xl leading-relaxed">
        Organiza fácilmente los turnos y vacaciones de tu equipo de farmacia.
      </p>

      {/* Botones */}
      <div className="flex gap-6">
        <Link
          to="/login"
          className="px-8 py-3 bg-primary text-white text-lg rounded-lg shadow hover:bg-green-900 transition"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 bg-white border-2 border-primary text-primary text-lg rounded-lg shadow hover:bg-gray-100 transition"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}

export default Home;
