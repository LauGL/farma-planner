import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-hot-toast";

function FullCalendarComponent({ events = [], userId, editable = false }) {
  const [loadedEvents, setLoadedEvents] = useState([]);

  const fetchVacations = async () => {
    const querySnapshot = await getDocs(collection(db, "vacations"));
    const data = querySnapshot.docs.map((docSnap) => {
      const vac = docSnap.data();
      return {
        id: docSnap.id,
        title: `${vac.name} (${
          vac.status === "pendiente" ? "Pendiente" : "Aprobado"
        })`,
        start: new Date(vac.start.seconds * 1000).toISOString().split("T")[0],
        end: new Date(vac.end.seconds * 1000 + 86400000)
          .toISOString()
          .split("T")[0],
        color: vac.color,
        uid: vac.uid,
        status: vac.status,
      };
    });
    setLoadedEvents(data);
  };

  useEffect(() => {
    fetchVacations();
  }, []);

  // ✅ Eliminar vacaciones
  const handleEventClick = async (clickInfo) => {
    const event = clickInfo.event;
    const eventId = event.id;

    // Busca el evento original para verificar si es del usuario actual
    const original = loadedEvents.find((e) => e.id === eventId);

    if (!original) return;

    if (original.uid !== userId) {
      toast.error("Solo puedes cancelar tus propias vacaciones");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Quieres cancelar tus vacaciones del ${event.startStr} al ${event.endStr}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "vacations", eventId));
      toast.success("Vacaciones canceladas ✅");
      fetchVacations(); // recargar eventos
    } catch (error) {
      toast.error("Error al cancelar vacaciones ❌");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-full">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[...loadedEvents, ...events]}
        eventColor="#2196f3"
        height={500}
        locale="es"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        eventClick={editable ? handleEventClick : null}
      />
    </div>
  );
}

export default FullCalendarComponent;
