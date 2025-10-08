import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [color, setColor] = useState("");
  const [turno, setTurno] = useState("mañana");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setColor(data.color || "");
        setTurno(data.turno || "mañana");
      }
    };

    fetchData();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const uid = auth.currentUser.uid;
      await updateDoc(doc(db, "users", uid), {
        color,
        turno,
      });
      toast.success("Perfil actualizado ✅");
    } catch (error) {
      toast.error("Error al guardar cambios ❌");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-secondary px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-primary">Mi Perfil</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        {userData && (
          <>
            <p className="mb-4">
              <strong>Nombre:</strong> {userData.name}
            </p>
            <p className="mb-4">
              <strong>Email:</strong> {userData.email}
            </p>

            <label className="block mb-2">Color identificativo:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mb-4 w-full h-10 rounded border"
            />

            <label className="block mb-2">Turno actual:</label>
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="mb-6 w-full p-2 border rounded"
            >
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>

            <button
              onClick={handleSave}
              className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 mb-4"
            >
              Guardar cambios
            </button>

            {/* ✅ Botón para volver atrás */}
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 mb-4"
            >
              ← Atrás
            </button>

            {/* ✅ Botón cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
