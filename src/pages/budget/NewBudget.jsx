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
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const currencies = ["AZN", "USD", "EUR"];
const units = ["Ədəd", "Kq", "Litr"];
const edvOptions = ["0%", "1%", "18%"];



function NewBudget() {
    const navigate = useNavigate();
    const { userId } = useParams(); // URL-dən ID parametrini alırıq
    const [isEditMode, setIsEditMode] = useState(false);
    const [initialValues, setInitialValues] = useState({
        registrationNumber: '',
        purchaseSubject: '',
        customer: '',
        contractor: '',
        contractorType: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        amount: '',
        currency: '',
        paymentType: '',
    });
    const [budget, setBudget] = useState([
        {
            code: "ORD-2025-007",
            name: "MQ-26-007",
            currency: "AZN",
            quantity: "12",
            unit: "Ədəd",
            edv: "120",
            smeta: "123456",
            total: "720",
        },
    ]);

    // Mövcud müqavilənin məlumatlarını yükləyirik
    useEffect(() => {
        if (userId) {
            setIsEditMode(true);
            // API-dən müqavilə məlumatlarını alırıq
            const fetchBudgetData = async () => {
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
            fetchBudgetData();
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
            navigate('/modules/budgets');
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
                                                    {isEditMode ? 'Büdcəni redaktə et' : 'Yeni büdcə əlavə et'}
                                                </MDTypography>
                                                <MDTypography variant="body2" color="text" fontSize={14}>
                                                    Büdcənin məlumatlarını daxil edin
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" gap={2}>
                                                <MDButton variant="gradient" color="dark" onClick={() => navigate("/modules/budget")} sx={{
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
                                                    sx={{ width: "100%" }}
                                                />
                                                <MDInput variant="standard" type="text" placeholder="Göstərici" required sx={{ width: "100%" }} />
                                                <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="Göstərici növü" InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "100%" }}
                                                />
                                                <MDInput variant="standard" type="text" placeholder="Məbləğ" required sx={{ width: "100%" }} />
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

export default NewBudget;














