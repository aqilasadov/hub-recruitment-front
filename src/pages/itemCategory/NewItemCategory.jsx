import Card from "components/Card/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Formik } from "formik";
import { Autocomplete } from "@mui/material";
import FormField from "layouts/applications/wizard/components/FormField";
import { useState, useEffect, useContext } from "react";
import { baseURL } from "utils/Url";
import apiClient from "apiClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "components/loader/Loader";
import { toast } from "react-toastify";
import * as Yup from "yup";

function NewItemCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    itemCategoryName: "",
    isActive: 1,
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchItemCategory = async () => {
        try {
          const response = await apiClient.get(`${baseURL}/item-category/${id}`);
          const item = response.data;
          setInitialValues({
            itemCategoryId: item.itemCategoryId || "",
            itemCategoryName: item.itemCategoryName || "",
            isActive: item.isActive !== undefined ? item.isActive : 1,
          });
        } catch (error) {
         
        } finally {
          setLoading(false);
        }
      };
      fetchItemCategory();
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    itemCategoryName: Yup.string().required("Mal kateqoriyası mütləqdir"),
  });

  // 🔹 Submit funksiyası
  const handleSubmit = async (values) => {
    try {
      const payload = {
        itemCategoryName: values.itemCategoryName,
        isActive: values.isActive ? 1 : 0,
      };

      if (isEditMode) {
        await apiClient.put(`${baseURL}/item-category`, {
          itemCategoryId: values.itemCategoryId,
          ...payload,
        });
        toast.success("Mal kateqoriyası uğurla redaktə olundu");
      } else {
        await apiClient.post(`${baseURL}/item-category`, payload);
        toast.success("Mal kateqoriyası uğurla əlavə olundu");
      }

      navigate("/modules/settings/item-category");
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
                          {isEditMode
                            ? "Mal kateqoriyasını redaktə et"
                            : "Yeni Mal kateqoriyası"}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="dark"
                          onClick={() =>
                            navigate("/modules/settings/item-category")
                          }
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
                            name="itemCategoryName"
                            value={values.itemCategoryName}
                            onChange={handleChange}
                            label="Mal kateqoriyası *"
                            error={Boolean(
                              touched.itemCategoryName && errors.itemCategoryName
                            )}
                            helperText={
                              touched.itemCategoryName && errors.itemCategoryName ? (
                                <span style={{ color: "#f44336" }}>
                                  {errors.itemCategoryName}
                                </span>
                              ) : null
                            }
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

export default NewItemCategory;
