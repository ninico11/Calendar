import React, { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { TextField, Button, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./calendar.css";

function CalendarS() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [events, setEvents] = useState(() => {
    const localData = localStorage.getItem('calendarEvents');
    return localData ? JSON.parse(localData) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({
    title: '',
    start: '',
    end: '',
    id: null
  }); // Track selected event for editing
  
  useEffect(() => {
    // Save updated events to local storage whenever the events state changes
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]); // Only run when the events state changes

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleEventAdd = () => {
    // Validate event data
    if (!selectedEvent.title || !selectedEvent.start || !selectedEvent.end) {
      alert("Please fill in all required fields: Title, Start, and End.");
      return;
    }
    if (selectedEvent.id) {
      // Update existing event
      setEvents(
        events.map((event) => (event.id === selectedEvent.id ? selectedEvent : event))
      );
    } else {
      // Add new event with a unique ID
      setEvents([...events, { ...selectedEvent, id: Math.random() * 100000 }]);
    }
    // Clear the new event form
    setSelectedEvent({ title: "", start: "", end: "", id: null });
    // Close the modal
    handleClose();
  };

  const handleEventDelete = () => {
    if (selectedEvent.id) {
      if (!selectedEvent.id) {
        return; // No event selected for deletion
      }

      // Filter the events array, ensuring strict comparison
      const filteredEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );

      // Update the events state with the filtered array
      setEvents(filteredEvents);
      // Clear the selected event and new event form
      setSelectedEvent({ title: "", start: "", end: "", id: null });
      handleClose();
   }
  };

  const handleEventClick = (info) => {
    console.log(events);
    const matchingEvent = events.find(
      (event) => String(event.id) === String(info.event.id)
    );
    console.log(matchingEvent);
    setSelectedEvent({
      title: matchingEvent.title,
      start: matchingEvent.start,
      end: matchingEvent.end,
      id: matchingEvent.id,
    });; // Pre-fill modal with event details
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
      <Modal open={isModalOpen} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {selectedEvent?.id ? "Edit Event" : "Add Event"}
          </Typography>
          <TextField
            label="Title"
            value={selectedEvent?.title}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, title: e.target.value })
            }
          />
          <TextField
            label="Start Date/Time"
            type="datetime-local"
            value={selectedEvent?.start}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, start: e.target.value })
            }
          />
          <TextField
            label="End Date/Time"
            type="datetime-local"
            value={selectedEvent?.end}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, end: e.target.value })
            }
          />
          <Button onClick={handleEventAdd}>
            {selectedEvent?.id ? "Save Changes" : "Save"}
          </Button>
          {selectedEvent?.id && (
            <Button onClick={handleEventDelete}>Delete</Button>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default CalendarS;