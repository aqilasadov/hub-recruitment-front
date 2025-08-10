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
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/az";

function NewProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { itemTypeOptions } = useContext(StoreContext);
  const { itemCategories } = useContext(StoreContext);
  const [loading, setLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    itemCode: "",
    itemName: "",
    itemTypeId: null,
    itemCategoryId: null,
    amortizationPercent: null,
    showcaseNumber: "",
    note: "",
    serialNumber: "",
    warrantyExpireDate: null,
  });



  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await apiClient.get(`${baseURL}/item/${id}`);
          const item = response.data;
          setInitialValues({
            itemCode: item.itemCode || "",
            itemName: item.itemName || "",
            itemTypeId: item.itemTypeId || null,
            itemCategoryId: item.itemCategoryId || null,
            amortizationPercent: item.amortizationPercent || null,
            showcaseNumber: item.showcaseNumber || "",
            note: item.note || "",
            serialNumber: item.serialNumber || "",
            warrantyExpireDate: item.warrantyExpireDate || "",
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
    itemName: Yup.string().required("Malın adı mütləqdir"),
    itemTypeId: Yup.number().required("Malın növü mütləq seçilməlidir"),
    itemCategoryId: Yup.number().required(
      "Malın kateqoriyası mütləq seçilməlidir"
    ),
    amortizationPercent: Yup.number()
      .typeError("Faiz yalnız rəqəm ola bilər")
      .min(0, "Minimum 0 ola bilər")
      .max(100, "100-dən çox ola bilməz")
      .required("Amartizasiya faizi mütləqdir"),
    warrantyExpireDate: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Tarix düzgün daxil edilməlidir (gün.ay.il)"),
  });

  // 🔹 Submit funksiyası
  const handleSubmit = async (values) => {
    try {
      const payload = {
        itemName: values.itemName,
        itemTypeId: values.itemTypeId,
        itemCategoryId: values.itemCategoryId,
        amortizationPercent: Number(values.amortizationPercent),
        showcaseNumber: values.showcaseNumber,
        note: values.note,
        serialNumber: values.serialNumber,
        warrantyExpireDate: values.warrantyExpireDate
          ? (() => {
              const d = dayjs(values.warrantyExpireDate);
              const ms = d
                .millisecond()
                .toString()
                .padStart(3, "0")
                .slice(0, 2); // yalnız ilk 2 rəqəm
              return `${d.format("YYYY-MM-DDTHH:mm:ss")}.${ms}`;
            })()
          : null,
      };

      if (isEditMode) {
        payload.itemId = Number(id);
        payload.itemCode = values.itemCode;

        await apiClient.put(`${baseURL}/item`, payload);
        toast.success("Mal uğurla redaktə olundu");
      } else {
        await apiClient.post(`${baseURL}/item`, payload);
        toast.success("Yeni mal uğurla əlavə olundu");
      }

      navigate("/modules/products");
    } catch (error) {
      toast.error("Əməliyyat zamanı xəta baş verdi");
      
    }
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
                          {isEditMode ? "Malı redaktə et" : "Yeni Mal"}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="dark"
                          onClick={() => navigate("/modules/products")}
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
                          <Autocomplete
                            options={itemTypeOptions}
                            getOptionLabel={(option) => option.label}
                            value={
                              itemTypeOptions.find(
                                (opt) => opt.id === values.itemTypeId
                              ) || null
                            }
                            onChange={(e, newValue) =>
                              setFieldValue(
                                "itemTypeId",
                                newValue ? newValue.id : null
                              )
                            }
                            renderInput={(params) => (
                              <FormField
                                {...params}
                                label="Malın növü"
                                error={Boolean(
                                  touched.itemTypeId && errors.itemTypeId
                                )}
                                helperText={
                                  touched.itemTypeId && errors.itemTypeId ? (
                                    <span style={{ color: "#f44336" }}>
                                      {errors.itemTypeId}
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
                            name="itemName"
                            value={values.itemName}
                            onChange={handleChange}
                            error={Boolean(touched.itemName && errors.itemName)}
                            helperText={
                              touched.itemName && errors.itemName ? (
                                <span style={{ color: "#f44336" }}>
                                  {errors.itemName}
                                </span>
                              ) : null
                            }
                            label="Malın adı"
                            sx={{ width: "100%" }}
                          />
                        </MDBox>
                        <MDBox display="flex" gap={5}>
                          <Autocomplete
                            options={itemCategories}
                            getOptionLabel={(option) =>
                              option.itemCategoryName || ""
                            }
                            value={
                              itemCategories.find(
                                (opt) =>
                                  opt.itemCategoryId === values.itemCategoryId
                              ) || null
                            }
                            onChange={(e, newValue) =>
                              setFieldValue(
                                "itemCategoryId",
                                newValue ? newValue.itemCategoryId : null
                              )
                            }
                            renderInput={(params) => (
                              <FormField
                                {...params}
                                label="Malın kateqoriyası"
                                error={Boolean(
                                  touched.itemCategoryId &&
                                    errors.itemCategoryId
                                )}
                                helperText={
                                  touched.itemCategoryId &&
                                  errors.itemCategoryId ? (
                                    <span style={{ color: "#f44336" }}>
                                      {errors.itemCategoryId}
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
                            name="amortizationPercent"
                            value={values.amortizationPercent}
                            onChange={handleChange}
                            label="Amartizasiya faizi"
                            error={Boolean(
                              touched.amortizationPercent &&
                                errors.amortizationPercent
                            )}
                            helperText={
                              touched.amortizationPercent &&
                              errors.amortizationPercent ? (
                                <span style={{ color: "#f44336" }}>
                                  {errors.amortizationPercent}
                                </span>
                              ) : null
                            }
                            sx={{ width: "100%" }}
                          />
                          <MDInput
                            variant="standard"
                            type="text"
                            name="showcaseNumber"
                            value={values.showcaseNumber}
                            onChange={handleChange}
                            label="Vitrin nömrəsi"
                            sx={{ width: "100%" }}
                          />
                        </MDBox>
                        <MDBox display="flex" gap={5} alignItems="end">
                          <MDInput
                            variant="standard"
                            type="text"
                            name="serialNumber"
                            value={values.serialNumber}
                            onChange={handleChange}
                            label="Seriya nömrəsi"
                            error={Boolean(
                              touched.serialNumber && errors.serialNumber
                            )}
                            helperText={
                              touched.serialNumber && errors.serialNumber ? (
                                <span style={{ color: "#f44336" }}>
                                  {errors.serialNumber}
                                </span>
                              ) : null
                            }
                            sx={{ width: "100%" }}
                          />

                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="az"
                          >
                            <DatePicker
                              label="Qarantiyanın bitmə tarixi"
                              value={values.warrantyExpireDate}
                              onChange={(newValue) =>
                                setFieldValue("warrantyExpireDate", newValue)
                              }
                              format="DD/MM/YYYY"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  variant="standard"
                                  name="warrantyExpireDate"
                                 
                                  error={Boolean(
                                    touched.warrantyExpireDate &&
                                      errors.warrantyExpireDate
                                  )}
                                  helperText={
                                    touched.warrantyExpireDate &&
                                    errors.warrantyExpireDate
                                  }
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </MDBox>
                        <MDBox>
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

export default NewProduct;
