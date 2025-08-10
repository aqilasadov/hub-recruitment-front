// @mui material components
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Data
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Calendar from "examples/Calendar";
import ReservationModal from "components/Modals/ReservationModal";
import { baseURL } from "utils/Url";
import apiClient from "apiClient";
import { StoreContext } from "context/StoreContext";
import Loader from "components/loader/Loader";

function Reservation() {
  const navigate = useNavigate();
  const [reservedRooms, setReservedRooms] = useState([]);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const { rooms, hours } = useContext(StoreContext);

  const fetchReservedRooms = async (shouldSetActiveRoomId = false) => {
    if (rooms.length === 0) return;

    setLoading(true);
    try {
      const response = await apiClient.get(`${baseURL}/rezervation`);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data.data || response.data;
        setReservedRooms(data);

        if (shouldSetActiveRoomId) {
          const lastReservedRoom = [...data]
            .reverse()
            .find((r) => rooms.some((room) => room.roomId === r.roomId));

          if (lastReservedRoom) {
            setActiveRoomId(lastReservedRoom.roomId);
          } else {
            setActiveRoomId(rooms[0]?.roomId);
          }
        }
      }
    } catch (error) {
      console.error(
        "Rezervasiya məlumatları yüklənərkən xəta baş verdi:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservedRooms(true);
  }, [rooms]);

  const handleOpenReserveModal = (eventId = null) => {
    setSelectedEventId(eventId);
    setIsReserveModalOpen(true);
  };

  const handleReserveModalClose = () => {
    setSelectedEventId(null);
    setIsReserveModalOpen(false);
    fetchReservedRooms(true);
  };

  const roomColors = {
    1: "linear-gradient(180deg, #C62126 0%, #8C171B 100%)",
    2: "linear-gradient(180deg, #A23995 0%, #6D2665 100%)",
    3: "linear-gradient(180deg, #006A38 0%, #00381E 100%)",
    4: "linear-gradient(180deg, #C2AA57 0%, #87732E 100%)",
    5: "linear-gradient(180deg, #00529B 0%, #002B52 100%)",
    6: "linear-gradient(180deg, #E97451 0%, #C1440E 100%)",
    7: "linear-gradient(180deg, #4A148C 0%, #12005E 100%)",
    8: "linear-gradient(180deg, #009688 0%, #004D40 100%)",
    9: "linear-gradient(180deg, #FFB300 0%, #FF6F00 100%)",
    10: "linear-gradient(180deg, #8E24AA 0%, #4A148C 100%)",
    11: "linear-gradient(180deg, #3949AB 0%, #1A237E 100%)",
    12: "linear-gradient(180deg, #1DE9B6 0%, #00BFA5 100%)",
  };

  const filteredEvents = reservedRooms
    .filter((r) => r.roomId === activeRoomId)
    .map((r) => {
      const startHourTitle =
        hours.find((h) => h.id === r.startHourId)?.title || "";
      const endHourTitle = hours.find((h) => h.id === r.endHourId)?.title || "";

      return {
        id: r.roomRezervationId,
        title: r.status,
        start: r.startDate,
        backgroundColor: roomColors[r.roomId] || "#ccc",
        extendedProps: {
          startHour: startHourTitle,
          endHour: endHourTitle,
          roomId: r.roomId,
        },
      };
    });

  console.log("FilteredEvents", filteredEvents);
  console.log("ReservedRooms", reservedRooms);

  const reservedRoomIds = [...new Set(reservedRooms.map((r) => r.roomId))];
  const filteredRooms = rooms.filter((room) =>
    reservedRoomIds.includes(room.roomId)
  );

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={6} px={3}>
          <Loader />
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={3}
          >
            <MDTypography variant="h5" fontWeight="medium">
              Otaqların Rezervasiyası
            </MDTypography>
            <MDButton
              onClick={() => handleOpenReserveModal()}
              variant="gradient"
              color="primary"
              sx={{
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              <Icon sx={{ mr: 1 }}>add</Icon>
              Rezerv et
            </MDButton>
          </MDBox>

          <Tabs
            value={activeRoomId}
            onChange={(e, newValue) => setActiveRoomId(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            // textColor="secondary"
            // indicatorColor="secondary"
            sx={{
              px: 2,
              maxWidth: "100%",
              width: "fit-content",
              backgroundColor: "transparent !important",
            }}
          >
            {filteredRooms.map((room, index) => (
              <Tab
                key={room.roomId}
                value={room.roomId}
                label={
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <MDBox
                      sx={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: roomColors[room.roomId] || "#ccc",
                      }}
                    />
                    <MDTypography
                      variant="text"
                      sx={{
                        fontSize: "16px",
                        fontWeight:
                          activeRoomId === room.roomId ? "regular" : "regular",
                        color:
                          activeRoomId === room.roomId ? "#344767" : "#344767",
                      }}
                    >
                      {room.roomName}
                    </MDTypography>
                  </MDBox>
                }
                sx={{
                  minWidth: 100,
                  px: 1,
                  py: 0.5,
                  backgroundColor: "transparent !important",
                  "&.Mui-selected": {
                    backgroundColor: "transparent !important",
                  },
                  borderBottom:
                    activeRoomId === room.roomId
                      ? "3px solid #344767"
                      : "3px solid transparent",
                  transition: "border-bottom 0.3s ease",
                  borderRadius: 0,
                  textTransform: "none",
                  justifyContent: "center",
                }}
              />
            ))}
          </Tabs>

          {filteredEvents.length === 0 ? (
            <MDBox py={6} px={3}>
              <MDTypography variant="h6" color="text" align="center">
                Rezerv edilmiş hər hansı otaq yoxdur.
              </MDTypography>
            </MDBox>
          ) : (
            <Calendar
              events={filteredEvents}
              header={{ title: null }}
              roomColors={roomColors}
              onUpdate={fetchReservedRooms}
              handleOpenReserveModal={handleOpenReserveModal}
              selectable={true}
              selectAllow={(selectInfo) => {
                const day = new Date(selectInfo.start).getDay();
                return day !== 0 && day !== 6; // Şənbə & Bazar seçimə icazə vermir
              }}
            />
          )}
        </Card>

        <ReservationModal
          isOpen={isReserveModalOpen}
          onClose={handleReserveModalClose}
          onUpdate={fetchReservedRooms}
          selectedRoomId={activeRoomId}
          selectedEventId={selectedEventId}
          reservedRooms={reservedRooms}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default Reservation;
