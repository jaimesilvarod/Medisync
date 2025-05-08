'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useState } from 'react';

export default function CalendarView() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/appointments', { headers: { Authorization: 'Bearer your-token' } })
            .then((res) => res.json())
            .then((data) => {
                const calendarEvents = data.map((appt: any) => ({
                    title: `Cita: ${appt.patient.name}`,
                    start: `${appt.date}T${appt.time}`,
                }));
                setEvents(calendarEvents);
            });
    }, []);

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
        />
    );
}