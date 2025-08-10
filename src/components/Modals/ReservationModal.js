import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Autocomplete, Icon, Modal, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "context/StoreContext";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "apiClient";
import { baseURL } from "utils/Url";
import dayjs from "dayjs";
import "dayjs/locale/az"; // Azərbaycan dili dəstəyi
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Loader from "components/loader/Loader";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { DatePicker } from "@mui/x-date-pickers";

const ReservationModal = ({
  isOpen,
  onClose,
  onUpdate,
  selectedRoomId,
  selectedEventId,
  reservationData = null,
  editMode = false,
  reservedRooms,
}) => {
  const { rooms, hours } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const [initialValues, setInitialValues] = useState({
    roomId: "",
    startDate: "",
    startHourId: "",
    endHourId: "",
    participantCount: "",
    note: "",
    isActive: 1,
    isArchive: 0,
    roomRezervationParticipantList: [],
    roomRezervationFoodSupplyList: [],
    roomRezervationTechnicalSupplyList: [],
  });

  const [cateringProducts, setCateringProducts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [guestList, setGuestList] = useState([]);

  console.log("hours", hours);

  useEffect(() => {
    if (rooms) {
      fetchCateringProducts();
      fetchDevices();
      fetchGuestList();
    }
  }, [rooms]);

  const fetchGuestList = async () => {
    try {
      const requestedPayload = {
        participantFullname: "",
        participantCompanyName: "",
        inDate: "",
        outDate: "",
      };
      const response = await apiClient.post(
        `${baseURL}/participant-register/filter-participant-register`,
        requestedPayload
      );
      if (response.status >= 200 && response.status < 300) {
        setGuestList(response.data);
      }
    } catch (error) {}
  };

  const fetchCateringProducts = async () => {
    try {
      const response = await apiClient.post(
        `${baseURL}/requested-item-supplies/requested-item-supplies-names`,
        {
          supplyTypeId: 2,
        }
      );
      setCateringProducts(response.data);
    } catch (error) {}
  };

  const fetchDevices = async () => {
    try {
      const response = await apiClient.post(
        `${baseURL}/requested-item-supplies/requested-item-supplies-names`,
        {
          supplyTypeId: 1, // Katering məhsulları üçün supplyTypeId
        }
      );
      setDevices(response.data);
    } catch (error) {}
  };

  console.log("cateringProducts", cateringProducts);
  console.log("devices", devices);
  console.log("guestList", guestList);

 
  const fetchReservationByEventId = async () => {
    if (!selectedEventId) {
      // Yeni rezervasiya üçün form boş, otaq seçimini təyin et
      setInitialValues((prev) => ({
        ...prev,
        roomId: "",
        startDate: "",
        startHourId: "",
        endHourId: "",
        participantCount: "",
        note: "",
        roomRezervationParticipantList: [],
        roomRezervationFoodSupplyList: [],
        roomRezervationTechnicalSupplyList: [],
      }));
      setIsEditMode(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get(
        `${baseURL}/rezervation/${selectedEventId}`
      );
      if (response.status >= 200 && response.status < 300 && response.data) {
        const reservation = response.data;

        const enrichedParticipants = (
          reservation.roomRezervationParticipantList || []
        ).map((item) => {
          const guest = guestList.find(
            (g) => g.id === item.participantRegisterId
          );
          return {
            ...item,
            participantFullname: guest ? guest.participantFullname : "",
          };
        });
        setInitialValues({
          roomRezervationId: reservation.roomRezervationId,
          roomId: reservation.roomId || "",
          startDate: reservation.startDate ? dayjs(reservation.startDate) : "",
          startHourId: reservation.startHourId,
          endHourId: reservation.endHourId,
          participantCount: reservation.participantCount?.toString() || "",
          note: reservation.note || "",
          isActive: reservation.isActive || 1,
          isArchive: reservation.isArchive || 0,
          roomRezervationTechnicalSupplyList: (
            reservation.roomRezervationTechnicalSupplyList || []
          )
            .map((item) =>
              devices.find((tech) => tech.id === item.requestedItemSupplyId)
            )
            .filter(Boolean),
          roomRezervationFoodSupplyList: (
            reservation.roomRezervationFoodSupplyList || []
          )
            .map((item) =>
              cateringProducts.find(
                (food) => food.id === item.requestedItemSupplyId
              )
            )
            .filter(Boolean),
          roomRezervationParticipantList: (
            reservation.roomRezervationParticipantList || []
          )
            .map((item) =>
              guestList.find((emp) => emp.id === item.participantEmpId)
            )
            .filter(Boolean),
        });
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
      }
    } catch (error) {
      setIsEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReservationByEventId();
    }
  }, [isOpen, selectedEventId, selectedRoomId]);

  if (!isOpen) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // const validationSchema = Yup.object().shape({
  //   roomId: Yup.string().required("Otaq seçimi məcburidir"),
  //   participantCount: Yup.string().required("İştirakçı sayı mütləqdir"),
  //   startDate: Yup.date()
  //     .required("Başlama tarixi mütləqdir")
  //     .min(today, "Başlama vaxtı indiki vaxtdan əvvəl ola bilməz"),
  //   startHourId: Yup.string().required("Başlama saatı məcburidir"),
  // });

 const validationSchema = (reservedRooms) =>
  Yup.object().shape({
    roomId: Yup.string().required("Otaq seçimi məcburidir"),
    participantCount: Yup.string().required("İştirakçı sayı mütləqdir"),
    startDate: Yup.date()
      .required("Başlama tarixi mütləqdir")
      .min(today, "Başlama vaxtı indiki vaxtdan əvvəl ola bilməz"),
    startHourId: Yup.string()
      .required("Başlama saatı məcburidir")
      .test(
        "conflict-check",
        "Bu otaq həmin tarix və saatda artıq rezerv olunub.",
        function (value) {
          const { roomId, startDate, roomRezervationId } = this.parent;

          if (!roomId || !startDate || !value) return true;

          const conflict = reservedRooms.some((r) => {
            if (roomRezervationId && r.roomRezervationId === roomRezervationId) {
            
              return false;
            }
            return (
              r.roomId === roomId &&
              dayjs(r.startDate).format("YYYY-MM-DD") === dayjs(startDate).format("YYYY-MM-DD") &&
              r.startHourId === value
            );
          });

          return !conflict; 
        }
      ),
  });



  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate.toISOString(),
        startHourId: values.startHourId,
        endHourId: values.endHourId,
        participantCount: Number(values.participantCount),
        roomRezervationFoodSupplyList: values.roomRezervationFoodSupplyList.map(
          (item) => ({
            requestedItemSupplyId: item.id || item.requestedItemSupplyId,
            title: item.title,
          })
        ),
        roomRezervationTechnicalSupplyList:
          values.roomRezervationTechnicalSupplyList.map((item) => ({
            requestedItemSupplyId: item.id || item.requestedItemSupplyId,
            title: item.title,
          })),
      };

      if (isEditMode) {
        await apiClient.put(`${baseURL}/rezervation`, payload);
        toast.success("Uğurla redaktə edildi");
      } else {
        await apiClient.post(`${baseURL}/rezervation`, payload);
        toast.success("Uğurla əlavə edildi");
      }
      onClose();
      onUpdate();
    } catch (error) {}
  };

  const addNewGuestOption = {
    participantFullname: "+  Yeni qonaq",
    isAddButton: true,
  };

  const handleClose = () => {
    setInitialValues({
      roomId: "",
      startDate: "",
      startHourId: "",
      endHourId: "",
      participantCount: "",
      note: "",
      isActive: 1,
      isArchive: 0,
      roomRezervationParticipantList: [],
      roomRezervationFoodSupplyList: [],
      roomRezervationTechnicalSupplyList: [],
    });
    setIsEditMode(false);
    onClose();
  };

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
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="reservation-modal-title"
      aria-describedby="reservation-modal-description"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <MDBox
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "16px",
          minWidth: 400,
          maxWidth: "500px",
          width: "100%",
          maxHeight: "100vh",
          border: "1px solid #E5E5E5",
          boxShadow: 24,
          zIndex: 100,
        }}
      >
        <MDTypography variant="h6" mb={2}>
          {isEditMode ? "Redaktə et" : "Rezervasiya et"}
        </MDTypography>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema(reservedRooms)}
          enableReinitialize
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => (
            <Form>
              <MDBox>
                <MDBox display="flex" flexDirection="column" gap={2} mb={4}>
                  <Autocomplete
                    options={rooms}
                    getOptionLabel={(option) => option.roomName || ""}
                    value={
                      rooms.find((opt) => opt.roomId === values.roomId) || null
                    }
                    onChange={(e, newValue) =>
                      setFieldValue("roomId", newValue ? newValue.roomId : "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Otaq *"
                        variant="standard"
                        error={Boolean(touched.roomId && errors.roomId)}
                        helperText={
                          touched.roomId && errors.roomId ? (
                            <span style={{ color: "#f44336" }}>
                              {errors.roomId}
                            </span>
                          ) : null
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                    sx={{ width: "100%" }}
                  />

                  <MDInput
                    variant="standard"
                    type="text"
                    name="participantCount"
                    value={values.participantCount}
                    onChange={handleChange}
                    label="İştirakçı sayı *"
                    error={Boolean(
                      touched.participantCount && errors.participantCount
                    )}
                    helperText={
                      touched.participantCount && errors.participantCount ? (
                        <span style={{ color: "#f44336" }}>
                          {errors.participantCount}
                        </span>
                      ) : null
                    }
                    sx={{ width: "100%" }}
                  />

                  <Autocomplete
                    multiple
                    // disableCloseOnSelect
                    options={[...guestList, addNewGuestOption]}
                    getOptionLabel={(option) =>
                      option.participantFullname || ""
                    }
                    value={values.roomRezervationParticipantList}
                    isOptionEqualToValue={(option, value) =>
                      (option.id || option.participantRegisterId) ===
                      (value.id || value.participantRegisterId)
                    }
                    onChange={(e, newValue) => {
                      const lastItem = newValue[newValue.length - 1];
                      if (lastItem?.isAddButton) {
                        newValue.pop();
                        navigate("/modules/guests/new");
                      } else {
                        setFieldValue(
                          "roomRezervationParticipantList",
                          newValue.map((item) => ({
                            participantRegisterId:
                              item.id || item.participantRegisterId,
                            participantFullname:
                              item.participantFullname || null,
                          }))
                        );
                      }
                    }}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <MDBox
                          key={index}
                          display="flex"
                          alignItems="center"
                          sx={{
                            backgroundColor: "#eee",
                            borderRadius: "12px",
                            px: 1.5,
                            py: 0.5,
                            margin: "4px",
                          }}
                          {...getTagProps({ index })}
                        >
                          <MDTypography
                            variant="button"
                            color="white"
                            fontWeight="regular"
                          >
                            {option.participantFullname}
                          </MDTypography>
                          <Icon
                            fontSize="small"
                            sx={{
                              ml: 1,
                              cursor: "pointer",
                              color: "#7B809A",
                              "&:hover": { color: "#E91F63" },
                            }}
                            onClick={(e) => {
                              const updated = [...tagValue];
                              updated.splice(index, 1);
                              setFieldValue(
                                "roomRezervationParticipantList",
                                updated.map((item) => ({
                                  participantRegisterId:
                                    item.id || item.participantRegisterId,
                                  participantFullname:
                                    item.participantFullname || null,
                                }))
                              );
                            }}
                          >
                            close
                          </Icon>
                        </MDBox>
                      ))
                    }
                    renderOption={(props, option) =>
                      option.isAddButton ? (
                        <li
                          {...props}
                          style={{
                            justifyContent: "center",
                            border: "1px solid #344767",
                            color: "#344767",
                            marginTop: "10px",
                          }}
                        >
                          {option.participantFullname}
                        </li>
                      ) : (
                        <li {...props}>{option.participantFullname}</li>
                      )
                    }
                    renderInput={(params) => (
                      <FormField
                        {...params}
                        label="Qonaqları seçin"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                    sx={{ width: "100%" }}
                  />

                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="az"
                  >
                    <DatePicker
                      label="Başlama tarixi *"
                      value={values.startDate}
                      minDate={values.startDate || dayjs()}
                      onChange={(newValue) =>
                        setFieldValue("startDate", newValue)
                      }
                      format="DD/MM/YYYY HH:mm"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="standard"
                          name="startDate"
                          error={Boolean(touched.startDate && errors.startDate)}
                          helperText={
                            touched.startDate && errors.startDate ? (
                              <span style={{ color: "#f44336" }}>
                                {errors.startDate}
                              </span>
                            ) : null
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <MDBox display="flex" gap={2}>
                    <Autocomplete
                      options={hours}
                      getOptionLabel={(option) => option.title || ""}
                      value={
                        hours.find((opt) => opt.id === values.startHourId) ||
                        null
                      }
                      onChange={(e, newValue) =>
                        setFieldValue(
                          "startHourId",
                          newValue ? newValue.id : ""
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Başlama saatı *"
                          variant="standard"
                          error={Boolean(
                            touched.startHourId && errors.startHourId
                          )}
                          helperText={
                            touched.startHourId && errors.startHourId ? (
                              <span style={{ color: "#f44336" }}>
                                {errors.startHourId}
                              </span>
                            ) : null
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      sx={{ width: "100%" }}
                    />
                    <Autocomplete
                      options={hours}
                      getOptionLabel={(option) => option.title || ""}
                      value={
                        hours.find((opt) => opt.id === values.endHourId) || null
                      }
                      onChange={(e, newValue) =>
                        setFieldValue("endHourId", newValue ? newValue.id : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bitmə saatı *"
                          variant="standard"
                          error={Boolean(touched.endHourId && errors.endHourId)}
                          helperText={
                            touched.endHourId && errors.endHourId ? (
                              <span style={{ color: "#f44336" }}>
                                {errors.endHourId}
                              </span>
                            ) : null
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      sx={{ width: "100%" }}
                    />
                  </MDBox>

                  <Autocomplete
                    multiple
                    options={cateringProducts.filter(
                      (item) =>
                        !values.roomRezervationFoodSupplyList.some(
                          (selected) =>
                            selected.requestedItemSupplyId === item.id
                        )
                    )}
                    getOptionLabel={(option) => option.title || ""}
                    value={values.roomRezervationFoodSupplyList.map((item) => ({
                      ...item,
                      id: item.requestedItemSupplyId, // lazımdır ki isOptionEqualToValue işləsin
                    }))}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.requestedItemSupplyId
                    }
                    onChange={(e, newValue) =>
                      setFieldValue(
                        "roomRezervationFoodSupplyList",
                        newValue.map((item) => ({
                          requestedItemSupplyId: item.id,
                          title: item.title || null,
                        }))
                      )
                    }
                    renderInput={(params) => (
                      <FormField
                        {...params}
                        label="Ehtiyac duyulan qurğular"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                    sx={{ width: "100%" }}
                  />
                  <Autocomplete
                    multiple
                    options={devices.filter(
                      (item) =>
                        !values.roomRezervationTechnicalSupplyList.some(
                          (selected) =>
                            selected.requestedItemSupplyId === item.id
                        )
                    )}
                    getOptionLabel={(option) => option.title || ""}
                    value={values.roomRezervationTechnicalSupplyList.map(
                      (item) => ({
                        ...item,
                        id: item.requestedItemSupplyId, // lazımdır ki isOptionEqualToValue işləsin
                      })
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.requestedItemSupplyId
                    }
                    onChange={(e, newValue) =>
                      setFieldValue(
                        "roomRezervationTechnicalSupplyList",
                        newValue.map((item) => ({
                          requestedItemSupplyId: item.id,
                          title: item.title || null,
                        }))
                      )
                    }
                    renderInput={(params) => (
                      <FormField
                        {...params}
                        label="Ehtiyac duyulan qurğular"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                    sx={{ width: "100%" }}
                  />

                  <MDInput
                    variant="standard"
                    type="text"
                    name="note"
                    value={values.note}
                    onChange={handleChange}
                    label="Açıqlama"
                    sx={{ width: "100%" }}
                  />
                </MDBox>
              </MDBox>

              <MDBox
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <MDButton
                  variant="outlined"
                  color="text"
                  onClick={handleClose}
                  sx={{ width: "100%" }}
                >
                  Bağla
                </MDButton>
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="primary"
                  sx={{
                    boxShadow: "none",
                    width: "100%",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  <Icon sx={{ mr: 1 }} fontSize="small">
                    check
                  </Icon>
                  {isEditMode ? "Yadda Saxla" : "Rezervasiya et "}
                </MDButton>
              </MDBox>
            </Form>
          )}
        </Formik>
      </MDBox>
    </Modal>
  );
};

export default ReservationModal;
