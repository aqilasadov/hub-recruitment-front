import Card from "components/Card/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Formik } from "formik";
import { Autocomplete, Icon, MenuItem, TextField, Box, Typography, IconButton } from "@mui/material";
import FormField from "layouts/applications/wizard/components/FormField";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const currencies = ["AZN", "USD", "EUR"];
const units = ["Ədəd", "Kq", "Litr"];
const edvOptions = ["0%", "1%", "18%"];



function NewSmeta() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [initialValues, setInitialValues] = useState({
        year: '',
        description: '',
    });


    // Mövcud smetanın məlumatlarını yükləyirik
    useEffect(() => {
        if (userId) {
            setIsEditMode(true);
            // API-dən müqavilə məlumatlarını alırıq
            const fetchSmetaData = async () => {
                try {
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${userId}`);
                    // API-dən gələn məlumatları initialValues formatına çeviririk
                    setInitialValues({
                        ...initialValues,
                        registrationNumber: response.data.userId,
                        purchaseSubject: response.data.id,
                        customer: response.data.title,
                        // Digər məlumatları da əlavə edirik
                    });
                } catch (error) {
                
                }
            };
            fetchSmetaData();
        }
    }, [userId]);

    const handleSubmit = async (values) => {
        try {
            if (isEditMode) {
                // Mövcud müqaviləni yeniləyirik
                await axios.put(`https://jsonplaceholder.typicode.com/todos/${userId}`, values);
            } else {
                // Yeni müqavilə yaradırıq
                await axios.post('https://jsonplaceholder.typicode.com/todos', values);
            }
            navigate('/modules/smeta');
        } catch (error) {
           
        }
    };



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
                                enableReinitialize
                            >
                                {({ values, handleChange, handleSubmit }) => (
                                    <Form>
                                        <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={4}>
                                            <MDBox>
                                                <MDTypography variant="h5" fontWeight="medium" mb={1}>
                                                    {isEditMode ? 'Smeta məlumatlarını redaktə et' : 'Yeni smeta əlavə et'}
                                                </MDTypography>
                                                <MDTypography variant="body2" color="text" fontSize={14}>
                                                    Smeta məlumatlarını daxil edin
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" gap={2}>
                                                <MDButton variant="gradient" color="dark" onClick={() => navigate("/modules/smetas")} sx={{
                                                    color: "darkBlue.main",
                                                    background: "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                                                    boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)",
                                                    "&:hover": {
                                                        background: "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                                                        boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)"
                                                    }
                                                }}>
                                                    İmtina et
                                                </MDButton>
                                                <MDButton variant="gradient" color="info" sx={{
                                                    background: "linear-gradient(45deg, #3E3D45, #202020)",
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                                                    "&:hover": {
                                                        background: "linear-gradient(45deg, #3E3D45, #202020)",
                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)"
                                                    }
                                                }}>
                                                    Yadda saxla
                                                </MDButton>
                                            </MDBox>
                                        </MDBox>
                                        <MDBox>

                                            <MDBox display="flex" gap={5}>

                                                <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="İl" InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "30%" }}
                                                />
                                                <MDInput variant="standard" type="text" placeholder="Qeyd" required sx={{ width: "100%" }} />

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

export default NewSmeta;














