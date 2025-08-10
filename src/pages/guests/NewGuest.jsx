import Card from "components/Card/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Formik } from "formik";
import { Autocomplete, TextField } from "@mui/material";
import FormField from "layouts/applications/wizard/components/FormField";
import { useState, useEffect, useContext } from "react";
import { baseURL } from "utils/Url";
import apiClient from "apiClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "components/loader/Loader";
import { StoreContext } from "context/StoreContext";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/az";

function NewGuest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { itemCategories } = useContext(StoreContext);
  const [loading, setLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    participantFullname: "",
    participantCompanyName: "",
    inDate: "",
    outDate: "",
    participantStatusId: null,
    roomId: null,
    note: "",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await apiClient.get(
            `${baseURL}/participant-register/${id}`
          );
          const item = response.data;
          setInitialValues({
            participantRegisterId: item.participantRegisterId,
            participantFullname: item.participantFullname || "",
            participantCompanyName: item.participantCompanyName || "",
            inDate: item.inDate || "",
            outDate: item.outDate || "",
            participantStatusId: item.participantStatusId || null,
            roomId: item.roomId || null,
            note: item.note || "",
          });
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    participantFullname: Yup.string().required("Qonaq adı mütləqdir"),
    participantCompanyName: Yup.string().required("Şirkət adı mütləqdir"),
    inDate: Yup.date().required("Gəlmə tarixi mütləqdir"),
    outDate: Yup.date().required("Çıxma tarixi mütləqdir"),
  });

  // 🔹 Submit funksiyası
  const handleSubmit = async (values) => {
    try {
      const payload = {
        participantFullname: values.participantFullname,
        participantCompanyName: values.participantCompanyName,
        inDate: values.inDate,
        outDate: values.outDate,
        participantStatusId: values.participantStatusId,
        roomId: values.roomId,
        // note: values.note,
      };

      if (isEditMode) {
        await apiClient.put(`${baseURL}/participant-register`, {
          participantRegisterId: values.participantRegisterId,
          ...payload,
        });
        toast.success("Qonaq məlumatları uğurla redaktə olundu");
      } else {
        await apiClient.post(`${baseURL}/participant-register`, payload);
        toast.success("Yeni qonaq uğurla əlavə olundu");
      }

      navigate("/modules/guests");
    } catch (error) {
      toast.error("Əməliyyat zamanı xəta baş verdi");
    }
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1}>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                enableReinitialize
              >
                {({ values, handleChange, setFieldValue, errors, touched }) => (
                  <Form>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                      mb={4}
                    >
                      <MDBox>
                        <MDTypography variant="h5" fontWeight="medium" mb={1}>
                          {isEditMode
                            ? "Qonaq məlumatlarını redaktə et"
                            : "Yeni qonaq"}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="dark"
                          onClick={() => navigate("/modules/guests")}
                          sx={{
                            color: "darkBlue.main",
                            background:
                              "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                            boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                              boxShadow:
                                "0px 4px 10px rgba(151, 172, 198, 0.25)",
                            },
                          }}
                        >
                          İmtina et
                        </MDButton>
                        <MDButton
                          type="submit"
                          variant="gradient"
                          color="info"
                          sx={{
                            background:
                              "linear-gradient(45deg, #3E3D45, #202020)",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #3E3D45, #202020)",
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                            },
                          }}
                        >
                          Yadda saxla
                        </MDButton>
                      </MDBox>
                    </MDBox>
                    <MDBox>
                      <MDBox
                        display="flex"
                        flexDirection="column"
                        gap={5}
                        mb={4}
                      >
                        <MDBox display="flex" gap={5}>
                          <MDInput
                            variant="standard"
                            type="text"
                            name="participantFullname"
                            value={values.participantFullname}
                            onChange={handleChange}
                            label="Qonaq adı *"
                            error={Boolean(
                              touched.participantFullname &&
                                errors.participantFullname
                            )}
                            helperText={
                              touched.participantFullname &&
                              errors.participantFullname ? (
                                <span style={{ color: "#f44336" }}>
                                  {errors.participantFullname}
                                </span>
                              ) : null
                            }
                            sx={{ width: "100%" }}
                          />

                          <MDInput
                            variant="standard"
                            type="text"
                            name="participantCompanyName"
                            value={values.participantCompanyName}
                            onChange={handleChange}
                            label="Şirkət *"
                            error={Boolean(
                              touched.participantCompanyName &&
                                errors.participantCompanyName
                            )}
                            helperText={
                              touched.participantCompanyName &&
                              errors.participantCompanyName ? (
                                <span style={{ color: "#f44336" }}>
                                  {errors.participantCompanyName}
                                </span>
                              ) : null
                            }
                            sx={{ width: "100%" }}
                          />
                        </MDBox>
                        <MDBox display="flex" gap={5} alignItems="end">
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="az"
                          >
                            <DatePicker
                              label="Gəlmə tarixi *"
                              value={values.inDate}
                              onChange={(newValue) =>
                                setFieldValue("inDate", newValue)
                              }
                              format="MM/DD/YYYY"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="standard"
                                  name="inDate"
                                  error={Boolean(
                                    touched.inDate && errors.inDate
                                  )}
                                  helperText={touched.inDate && errors.inDate}
                                  placeholder="MM/DD/YYYY" // əlavə olaraq placeholder da qoyun
                                  inputProps={{
                                    ...params.inputProps,
                                    placeholder: "MM/DD/YYYY", // əgər avtomatik gəlmirsə
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>

                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="az"
                          >
                            <DatePicker
                              label="Çıxma tarixi *"
                              value={values.outDate}
                              onChange={(newValue) =>
                                setFieldValue("outDate", newValue)
                              }
                              format="DD/MM/YYYY"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="standard"
                                  name="outDate"
                                  error={Boolean(
                                    touched.outDate && errors.outDate
                                  )}
                                  helperText={touched.outDate && errors.outDate}
                                />
                              )}
                            />
                          </LocalizationProvider>

                          <MDInput
                            variant="standard"
                            type="text"
                            name="note"
                            value={values.note}
                            onChange={handleChange}
                            multiline
                            label="Qeyd"
                            sx={{ width: "100%" }}
                          />
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </Form>
                )}
              </Formik>
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default NewGuest;
