import Card from "components/Card/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Formik } from "formik";
import { useState, useEffect, useContext } from "react";
import { baseURL } from "utils/Url";
import apiClient from "apiClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "components/loader/Loader";
import { toast } from "react-toastify";
import * as Yup from "yup";

function NewBank() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    bankName: "",
    bankShortName: "",
    isActive: 1,
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchBankById = async () => {
        try {
          const response = await apiClient.get(`${baseURL}/bank/${id}`);
          const item = response.data;
          setInitialValues({
            bankId: item.bankId || "",
            bankName: item.bankName || "",
            isActive: item.isActive !== undefined ? item.isActive : true,
          });
        } catch (error) {
         
        } finally {
          setLoading(false);
        }
      };
      fetchBankById();
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    bankName: Yup.string().required("Bank adı mütləqdir"),
  });

  // 🔹 Submit funksiyası
  const handleSubmit = async (values) => {
    try {
      const payload = {
        bankName: values.bankName,
        bankShortName: values.bankShortName,
        isActive: values.isActive ? 1 : 0,
      };

      if (isEditMode) {
        await apiClient.put(`${baseURL}/bank`, {
          bankId: values.bankId,
          ...payload,
        });
        toast.success("Uğurla redaktə olundu");
      } else {
        await apiClient.post(`${baseURL}/bank`, payload);
        toast.success("Uğurla əlavə olundu");
      }

      navigate("/modules/settings/banks");
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
                            ? "Bank Adını redaktə et"
                            : "Yeni Bank adı"}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="dark"
                          onClick={() => navigate("/modules/settings/banks")}
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
                            name="bankName"
                            value={values.bankName}
                            onChange={handleChange}
                            label="Bank adı *"
                            error={Boolean(
                              touched.bankName && errors.bankName
                            )}
                            helperText={
                              touched.bankName && errors.bankName ? (
                                <span style={{ color: "#f44336" }}>
                                  {errors.bankName}
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

export default NewBank;
