import React, { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
// import Calendar from "@fullcalendar/react";
// import calendarEl from "@fullcalendar/react";
// import getEventById from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { TextField, Button, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./calendar.css";

// var calendar = new Calendar(calendarEl, {
//   timeZone: 'UTC',
//   events: [
//     {
//       id: 'a',
//       title: 'my event',
//       start: '2018-09-01'
//     }
//   ]
// })

// var event = calendar.getEventById('a') // an event object!
// var start = event.start // a property (a Date object)
// console.log(start.toISOString()) // "2018-09-01T00:00:00.000Z"

function CalendarS() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date().toISOString().slice(0, 16),
    end: new Date().toISOString().slice(0, 16),
    id: null, // Add an ID for the new event
  });
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleEventAdd = () => {
    // Validate event data
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all required fields: Title, Start, and End.");
      return;
    }

    // Add new event with a unique ID
    setNewEvent({ ...newEvent, id: Math.random() * 100000 }); // Generate a random ID
    setEvents([...events, newEvent]);

    // Clear the new event form
    setNewEvent({ title: "", start: "", end: "", id: null });

    // Close the modal
    handleClose();
  };

  const handleEventDelete = (eventId) => {
    // Filter the events array, ensuring strict comparison
    const filteredEvents = events.filter(
      (event) => event.id !== eventId
    );
  
    // Update the events state with the filtered array
    setEvents(filteredEvents);
  
    // Clear the new event form after deletion
    setNewEvent({ title: "", start: "", end: "", id: null });
    handleClose();
  };

  const handleEventClick = (info) => {
    // Open modal in edit mode with pre-filled event details
    setNewEvent({
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      id: info.event.id,
    });
    handleOpen();
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);

    // Apply CSS classes based on the theme state
    const calendarContainer = document.getElementById("calendar");
    if (isDarkTheme) {
      calendarContainer.classList.add("dark-theme");
    } else {
      calendarContainer.classList.remove("dark-theme");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div id="calendar">
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "prev,next",
          center: "title",
          end: "today",
        }}
        height={"90vh"}
        events={events}
        eventClick={handleEventClick}
        eventDidMount={(info) => {
          return new bootstrap.Popover(info.el, {
            title: info.event.title,
            placement: "auto",
            trigger: "hover",
            customClass: "popoverStyle",
            html: true,
          });
        }}
      />

      {/* Add Event Button */}
      <Button onClick={handleOpen}>Add Event</Button>
      <Button onClick={toggleTheme}>
        {isDarkTheme ? "Light Theme" : "Dark Theme"}
      </Button>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {newEvent.id ? "Edit Event" : "Add Event"}
        </Typography>
<TextField
  label="Title"
  value={newEvent.title}
  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
/>
<TextField
  label="Start Date/Time"
  type="datetime-local"
  value={newEvent.start}
  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
/>
<TextField
  label="End Date/Time"
  type="datetime-local"
  value={newEvent.end}
  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
/>
<Button onClick={handleEventAdd}>
  {newEvent.id ? "Save Changes" : "Save"}
</Button>
{newEvent.id && (
  <Button onClick={() => handleEventDelete(newEvent.id)}>Delete</Button>
)}
</Box>
</Modal>
</div>
);
}

export default CalendarS;