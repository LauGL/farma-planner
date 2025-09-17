// src/components/Calendar.jsx
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { parseISO } from "date-fns";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

function CalendarComponent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchVacations = async () => {
      const querySnapshot = await getDocs(collection(db, "vacations"));
      const data = querySnapshot.docs.map((doc) => {
        const vac = doc.data();
        return {
          title: `${vac.name} (Vacaciones)`,
          start: parseISO(vac.start),
          end: parseISO(vac.end),
          allDay: true,
          color: vac.color,
        };
      });
      setEvents(data);
    };

    fetchVacations();
  }, []);

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color || "#2196f3",
      borderRadius: "6px",
      opacity: 0.9,
      color: "white",
      border: "none",
      padding: "4px",
    };
    return { style };
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-full">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay eventos en este rango",
        }}
      />
    </div>
  );
}

export default CalendarComponent;
