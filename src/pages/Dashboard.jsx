import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import FullCalendarComponent from "../components/FullCalendarComponent";
import { toast } from "react-hot-toast";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vacationTramos, setVacationTramos] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [events, setEvents] = useState([]);
  const [userColor, setUserColor] = useState("#2196f3");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserColor(data.color);
        setUserName(data.name);
        setUserRole(data.role || "user");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchVacations = async () => {
      const querySnapshot = await getDocs(collection(db, "vacations"));
      const fetchedEvents = querySnapshot.docs.map((doc) => {
        const vac = doc.data();
        return {
          id: doc.id,
          title: `${vac.name} (Vacaciones${
            vac.status === "pendiente" ? " - Pendiente" : ""
          })`,
          start: new Date(vac.start.seconds * 1000),
          end: new Date(vac.end.seconds * 1000 + 86400000),
          color: vac.color,
          uid: vac.uid,
        };
      });

      setEvents(fetchedEvents);
    };

    fetchVacations();
  }, []);

  const addTramo = () => {
    if (!start || !end) return toast.error("Selecciona fechas válidas");

    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    const total = vacationTramos.reduce((acc, t) => acc + t.days, 0);
    if (total + days > 30) return toast.error("No puedes exceder los 30 días");

    const newTramo = {
      start: startDate,
      end: new Date(endDate.getTime() + 86400000),
      days,
    };

    setVacationTramos([...vacationTramos, newTramo]);
    setStart("");
    setEnd("");
  };

  const deleteTramo = (index) => {
    const updated = [...vacationTramos];
    updated.splice(index, 1);
    setVacationTramos(updated);
  };

  const saveVacations = async () => {
    if (vacationTramos.length === 0) return;
    for (const tramo of vacationTramos) {
      await addDoc(collection(db, "vacations"), {
        name: userName,
        uid: user.uid,
        color: userColor,
        start: Timestamp.fromDate(tramo.start),
        end: Timestamp.fromDate(new Date(tramo.end.getTime() - 86400000)),
        status: "pendiente",
      });
    }
    toast.success("Vacaciones enviadas para revisión ✅");
    setVacationTramos([]);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-secondary px-4 py-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-primary mb-2">FarmaPlanner</h1>

      <div className="flex justify-between w-full max-w-5xl mb-4">
        <button
          onClick={() => navigate("/profile")}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition mx-auto block mb-4"
        >
          Mi perfil
        </button>

        {userRole === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Panel de administrador
          </button>
        )}
      </div>

      <p className="text-lg text-gray-700 mb-6">
        Panel de gestión de turnos y vacaciones
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Agregar vacaciones (por tramos)
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
          <button
            onClick={addTramo}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Añadir tramo
          </button>
        </div>

        {vacationTramos.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Tramos añadidos:</h3>
            <ul className="space-y-2">
              {vacationTramos.map((tramo, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-gray-100 p-2 rounded"
                >
                  <span>
                    {tramo.start.toLocaleDateString()} →{" "}
                    {tramo.end.toLocaleDateString()} ({tramo.days} días)
                  </span>
                  <button
                    onClick={() => deleteTramo(i)}
                    className="text-red-600 hover:underline"
                  >
                    ❌ Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={saveVacations}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enviar para revisión
        </button>
      </div>

      <div className="w-full max-w-5xl">
        <FullCalendarComponent
          events={[
            // solo mostramos los tramos no guardados del usuario actual
            ...events,
            ...vacationTramos.map((tramo) => ({
              title: `${userName} (sin guardar)`,
              start: tramo.start,
              end: tramo.end,
              color: userColor,
              uid: user?.uid,
            })),
          ]}
          userId={user?.uid}
          editable
        />
      </div>
    </div>
  );
}

export default Dashboard;
