// src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [vacations, setVacations] = useState([]);
  const navigate = useNavigate();

  const fetchPending = async () => {
    const querySnapshot = await getDocs(collection(db, "vacations"));
    const all = querySnapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .filter((vac) => vac.status === "pendiente");

    setVacations(all);
  };

  const approve = async (id) => {
    await updateDoc(doc(db, "vacations", id), { status: "aprobado" });
    fetchPending();
  };

  const reject = async (id) => {
    await updateDoc(doc(db, "vacations", id), { status: "rechazado" });
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="min-h-screen bg-secondary p-8">
      <h1 className="text-3xl font-bold mb-4 text-primary">
        Panel de administrador
      </h1>

      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        Volver al dashboard
      </button>

      {vacations.length === 0 ? (
        <p className="text-gray-700">No hay solicitudes pendientes</p>
      ) : (
        <ul className="space-y-4">
          {vacations.map((vac) => (
            <li
              key={vac.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{vac.name}</p>
                <p className="text-sm">
                  Del{" "}
                  <strong>
                    {new Date(vac.start.seconds * 1000).toLocaleDateString()}
                  </strong>{" "}
                  al{" "}
                  <strong>
                    {new Date(vac.end.seconds * 1000).toLocaleDateString()}
                  </strong>
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => approve(vac.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  ✅ Aprobar
                </button>
                <button
                  onClick={() => reject(vac.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  ❌ Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;
