import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import CalendarComponent from "../components/Calendar";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-secondary px-4 py-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-primary mb-2">FarmaPlanner</h1>
      <p className="text-lg text-gray-700 mb-6">
        Panel de gestión de turnos y vacaciones
      </p>

      <div className="w-full max-w-5xl">
        <CalendarComponent />
      </div>
    </div>
  );
}

export default Dashboard;
