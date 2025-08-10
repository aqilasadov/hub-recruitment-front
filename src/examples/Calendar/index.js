// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @fullcalendar components
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom styles for Calendar
import CalendarRoot from "examples/Calendar/CalendarRoot";

// Material Dashboard 3 PRO React context
import { useMaterialUIController } from "context";
import { baseURL } from "utils/Url";
import apiClient from "apiClient";
import MDButton from "components/MDButton";
import { useState } from "react";
import Loader from "components/loader/Loader";
import DeleteConfirmation from "components/Modals/DeleteConfirmation";
import { toast } from "react-toastify";
import { Icon, IconButton, Tooltip } from "@mui/material";

function Calendar({
  header = {},
  events = [],
  roomColors = {},
  onUpdate,
  handleOpenReserveModal,
  ...rest
}) {
  console.log("Rest props:", rest);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const validClassNames = [
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
    "gold",
  ];

  const formattedEvents = events
    ? events.map((el) => ({
        ...el,
        className: validClassNames.includes(el.className)
          ? `event-${el.className}`
          : "event-info",
      }))
    : [];

  function handleEventDidMount(info) {
    const roomId = info.event.extendedProps.roomId;
    const backgroundImage =
      roomColors[roomId] || "linear-gradient(180deg, #ccc, #ccc)";

    info.el.style.backgroundImage = backgroundImage;
    info.el.style.color = "#fff";
    info.el.style.borderRadius = "8px";
  }

  function renderEventContent(eventInfo) {
    const start = eventInfo.event.start;
    const { startHour, endHour } = eventInfo.event.extendedProps;
    const timeText = startHour && endHour ? `${startHour} - ${endHour}` : "";
    const roomId = eventInfo.event.extendedProps.roomId;
    const backgroundImage =
      roomColors[roomId] || "linear-gradient(180deg, #ccc, #ccc)";

    const handleConfirmDelete = async () => {
      setLoading(true);
      try {
        await apiClient.delete(`${baseURL}/rezervation/${eventInfo.event.id}`);
        toast.success("Rezervasiya silindi!");
        if (typeof rest.onDelete === "function") rest.onDelete();
        onUpdate();
      } catch (err) {
        toast.error("Silinmə zamanı xəta baş verdi.");
      } finally {
        setLoading(false);
        setShowModal(false);
      }
    };

 

    return (
      <>
        <style>
          {`
    .event-container {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-radius: 8px;
      padding: 8px 12px;
      font-weight: 400;
      font-size: 12px;
      box-shadow: 0 2px 6px #0001;
      min-width: 90px;
      width: 100%;
      height: 100%;
      background-image: ${backgroundImage};
      {/* overflow: hidden; */}
    }

    .hovered-button {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
      background: #E91F63;
      border-radius: 10%;
      padding: 2px 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px
    }

    .event-container:hover{
    .hovered-button {
       opacity: 1;
       background: #E91F63;
       top:-40px;
       transition: 0.3s ease;
       z-index: 2;
    }
    } 
  `}
        </style>

        <div
          className="event-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div>
            Dolu <span style={{ fontSize: 12 }}>{timeText}</span>
          </div>
          <MDBox className="hovered-button">
            <Tooltip title="Rezervasiyanı sil">
              <IconButton
                variant="text"
                color="error"
                widthFull
                onClick={() => setShowModal(true)}
              >
                <Icon fontSize="small" color="error">
                  close
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Rezervasiyanı dəyiş">
              <IconButton
                variant="text"
                color="success"
                widthFull
                onClick={() => handleOpenReserveModal(eventInfo.event.id)}
              >
                <Icon fontSize="small" color="success">
                  edit
                </Icon>
              </IconButton>
            </Tooltip>
          </MDBox>
        </div>
        <DeleteConfirmation
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      {/* Header */}
      <MDBox pt={2} px={2} lineHeight={1}>
        {/* Yeni: header.roomsJSX varsa onu göstər */}
        {header.title && (
          <MDBox display="flex" gap={2} alignItems="center" flexWrap="wrap">
            {header.title}
          </MDBox>
        )}

        {/* {header.title ? (
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize" mb={1}>
            {header.title}
          </MDTypography>
        ) : null} */}

        {header.date && (
          <MDTypography
            component="p"
            variant="button"
            color="text"
            fontWeight="regular"
            mb={1}
          >
            {header.date}
          </MDTypography>
        )}
      </MDBox>

      <CalendarRoot p={2} ownerState={{ darkMode }}>
        <FullCalendar
          {...rest}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          events={formattedEvents}
          eventContent={renderEventContent}
          height="100%"
          displayEventTime={false}
          eventDidMount={handleEventDidMount}
         
         
        />
      </CalendarRoot>
    </Card>
  );
}

// Typechecking props for the Calendar
Calendar.propTypes = {
  header: PropTypes.shape({
    title: PropTypes.node,
    date: PropTypes.string,
  }),
  events: PropTypes.array,
};

export default Calendar;
