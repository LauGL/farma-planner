// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [color, setColor] = useState("");
  const [shift, setShift] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setColor(data.color);
        setShift(data.shift);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]); // ✅ Agregamos 'navigate' como dependencia

  const isColorInUse = async (newColor) => {
    const q = query(collection(db, "users"), where("color", "==", newColor));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.some((doc) => doc.id !== auth.currentUser.uid);
  };

  const handleUpdate = async () => {
    if (!color || !shift) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (color !== userData.color) {
      const colorExists = await isColorInUse(color);
      if (colorExists) {
        toast.error("Este color ya está en uso. Elige otro");
        return;
      }
    }

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        color,
        shift,
      });
      toast.success("Perfil actualizado ✅");
    } catch {
      toast.error("Error al actualizar el perfil ❌");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Mi Perfil</h1>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <p>
          <strong>Nombre:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>

        <div className="mt-4">
          <label className="block mb-1 font-semibold">Turno actual:</label>
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="morning">Mañana</option>
            <option value="afternoon">Tarde</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-semibold">
            Color identificativo:
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

export default Profile;
