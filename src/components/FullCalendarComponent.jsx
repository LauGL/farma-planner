// src/components/FullCalendarComponent.jsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Swal from "sweetalert2";

function FullCalendarComponent({ events = [], userId, editable = false }) {
  // ✅ Manejador de clic en evento (modificar o eliminar)
  const handleEventClick = async (clickInfo) => {
    const event = clickInfo.event;
    const eventId = event.extendedProps.id;
    const uid = event.extendedProps.uid;

    if (!uid || uid !== userId) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Solo puedes modificar tus propias vacaciones",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const { isConfirmed, dismiss } = await Swal.fire({
      title: "¿Qué quieres hacer?",
      html: `<b>Del:</b> ${event.startStr} <br /><b>Al:</b> ${event.endStr}`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Modificar fechas",
      denyButtonText: "Cancelar vacaciones",
      cancelButtonText: "Salir",
      confirmButtonColor: "#1976d2",
      denyButtonColor: "#d33",
    });

    if (isConfirmed) {
      // 🟢 Modificar fechas
      const { value: formValues } = await Swal.fire({
        title: "Modificar fechas",
        html:
          `<label>Inicio:</label><input type="date" id="start" class="swal2-input" value="${event.startStr}"/>` +
          `<label>Fin:</label><input type="date" id="end" class="swal2-input" value="${event.endStr}"/>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const start = document.getElementById("start").value;
          const end = document.getElementById("end").value;
          if (!start || !end) {
            Swal.showValidationMessage("Ambas fechas son obligatorias");
            return;
          }
          return { start, end };
        },
      });

      if (formValues) {
        try {
          await updateDoc(doc(db, "vacations", eventId), {
            start: new Date(formValues.start),
            end: new Date(formValues.end),
          });
          Swal.fire({
            icon: "success",
            title: "Vacaciones modificadas",
            text: "Fechas actualizadas correctamente",
            confirmButtonColor: "#3085d6",
          });
          window.location.reload();
        } catch {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo actualizar la solicitud",
            confirmButtonColor: "#d33",
          });
        }
      }
    } else if (dismiss === Swal.DismissReason.deny) {
      // 🔴 Eliminar vacaciones
      const confirmDelete = await Swal.fire({
        title: "¿Cancelar vacaciones?",
        html: `<b>Del:</b> ${event.startStr} <br /><b>Al:</b> ${event.endStr}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
      });

      if (confirmDelete.isConfirmed) {
        try {
          await deleteDoc(doc(db, "vacations", eventId));
          Swal.fire({
            icon: "success",
            title: "Vacaciones canceladas",
            text: "El tramo ha sido eliminado correctamente",
            confirmButtonColor: "#3085d6",
          });
          window.location.reload();
        } catch {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cancelar el tramo",
            confirmButtonColor: "#d33",
          });
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-full">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events} // ✅ ahora solo recibe eventos desde Dashboard
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
