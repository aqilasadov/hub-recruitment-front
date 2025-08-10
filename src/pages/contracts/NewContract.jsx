import Card from "components/Card/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Formik } from "formik";
import { Autocomplete, InputAdornment, MenuItem } from "@mui/material";
import FormField from "layouts/applications/wizard/components/FormField";
import { useState, useEffect } from "react";
import upload from "assets/images/icons/cloud-upload.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function NewContract() {
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
        taxAmount: '',
        currency: '',
        total: '',
        contractType: '',
        contractDuration: '',
        purchaseType: '',
        note: '',
        description: '',
        files: []
    });

    // Mövcud müqavilənin məlumatlarını yükləyirik
    useEffect(() => {
        if (userId) {
            setIsEditMode(true);
            // API-dən müqavilə məlumatlarını alırıq
            const fetchContractData = async () => {
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
            fetchContractData();
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
            navigate('/modules/contracts');
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
                                                    {isEditMode ? 'Müqaviləni redaktə et' : 'Yeni müqavilə əlavə et'}
                                                </MDTypography>
                                                <MDTypography variant="body2" color="text" fontSize={14}>
                                                    Müqavilənin məlumatlarını daxil edin
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" gap={2}>
                                                <MDButton 
                                                    variant="gradient" 
                                                    color="dark" 
                                                    onClick={() => navigate("/modules/contracts")} 
                                                    sx={{
                                                        color: "darkBlue.main",
                                                        background: "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                                                        boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)",
                                                        "&:hover": {
                                                            background: "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                                                            boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)"
                                                        }
                                                    }}
                                                >
                                                    İmtina et
                                                </MDButton>
                                                <MDButton 
                                                    type="submit"
                                                    variant="gradient" 
                                                    color="info" 
                                                    sx={{
                                                        background: "linear-gradient(45deg, #3E3D45, #202020)",
                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                                                        "&:hover": {
                                                            background: "linear-gradient(45deg, #3E3D45, #202020)",
                                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)"
                                                        }
                                                    }}
                                                >
                                                    {isEditMode ? 'Yadda saxla' : 'Yeni müqavilə yarat'}
                                                </MDButton>
                                            </MDBox>
                                        </MDBox>

                                        <MDBox>
                                            <MDBox display="flex" flexDirection="column" gap={1} border="1px solid" borderColor="customGrey3.main" sx={{ backgroundColor: "customGrey3.main" }} py="8px" px="16px" borderRadius="8px" mb={4}>
                                                <MDTypography variant="h6" fontWeight="medium" color="gold">İlkin məlumatlar</MDTypography>
                                                <MDTypography variant="subtitle2" color="customGrey2">Məcburi məlumatlar</MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" flexDirection="column" gap={5} mb={4} px={2}>
                                                <MDBox display="flex" gap={5}>
                                                    <MDInput 
                                                        variant="standard" 
                                                        type="text" 
                                                        name="registrationNumber"
                                                        value={values.registrationNumber}
                                                        onChange={handleChange}
                                                        placeholder="Qeydiyyat nömrəsi*" 
                                                        required 
                                                        sx={{ width: "100%" }} 
                                                    />
                                                    <MDInput 
                                                        variant="standard" 
                                                        type="text" 
                                                        name="purchaseSubject"
                                                        value={values.purchaseSubject}
                                                        onChange={handleChange}
                                                        placeholder="Satınalma predmeti*" 
                                                        required 
                                                        sx={{ width: "100%" }} 
                                                    />
                                                </MDBox>
                                                <MDBox display="flex" gap={5}>
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="Sifarişçi*" InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="Kontragent*" required InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="Kontragent növü*" required InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                </MDBox>
                                            </MDBox>
                                        </MDBox>
                                        <MDBox >
                                            <MDBox display="flex" flexDirection="column" gap={1} border="1px solid" borderColor="customGrey3.main" sx={{ backgroundColor: "customGrey3.main" }} py="8px" px="16px" borderRadius="8px" mb={4}>
                                                <MDTypography variant="h6" fontWeight="medium" color="gold" >Müddət və Məbləğ</MDTypography>
                                                <MDTypography variant="subtitle2" color="customGrey2">Məcburi məlumatlar</MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" flexDirection="column" gap={5} px={2} mb={4}>
                                                <MDBox display="flex" gap={5} sx={{ width: "100%" }}>
                                                    <MDInput variant="standard" type="date" value={values.startDate} onChange={handleChange} placeholder="Müqavilənin başlama tarixi" sx={{
                                                        width: "100%"
                                                    }}
                                                    />
                                                    <MDInput variant="standard" type="date" value={values.endDate} onChange={handleChange} placeholder="Müqavilənin bitmə tarixi" sx={{
                                                        width: "100%"
                                                    }}
                                                    />
                                                </MDBox>
                                                <MDBox display="flex" gap={5}>
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="Məbləğ*" InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="Vergi məbləği*" InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="valyuta*" InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                    <MDInput variant="standard" type="text" name="total" value={values.total} onChange={handleChange} placeholder="Yekun" sx={{ width: "100%" }} />
                                                </MDBox>
                                            </MDBox>
                                        </MDBox>
                                        <MDBox>
                                            <MDBox display="flex" flexDirection="column" gap={1} border="1px solid" borderColor="customGrey3.main" sx={{ backgroundColor: "customGrey3.main" }} py="8px" px="16px" borderRadius="8px" mb={4}>
                                                <MDTypography variant="h6" fontWeight="medium" color="gold" >Ümumi məlumatlar</MDTypography>
                                                <MDTypography variant="subtitle2" color="customGrey2">Məcburi məlumatlar</MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" flexDirection="column" gap={5} px={2} mb={4}>
                                                <MDBox display="flex" gap={5}>
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="Müqavilə növü*" InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="Müqavilə müddəti*" InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                    <Autocomplete
                                                        options={["option1", "option2"]}
                                                        renderInput={(params) => (
                                                            <FormField {...params} placeholder="Satınalma növü*" InputLabelProps={{ shrink: true }} />
                                                        )}
                                                        sx={{ width: "100%" }}
                                                    />
                                                </MDBox>
                                                <MDBox display="flex" gap={5}>
                                                    <MDInput variant="standard" type="text" name="note" value={values.note} onChange={handleChange} placeholder="Qeyd" sx={{
                                                        width: "100%"
                                                    }}
                                                    />
                                                    <MDInput variant="standard" type="text" name="description" value={values.description} onChange={handleChange} placeholder="Açıqlama" sx={{ width: "100%" }} />
                                                </MDBox>
                                                <MDBox sx={{
                                                    border: "2px dashed #E5E9EF",
                                                    borderRadius: "12px",
                                                    minHeight: "80px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                    transition: "border-color 0.2s",
                                                    "&:hover": {
                                                        borderColor: "#B0B8C1",
                                                    },
                                                    color: "#8B95A1",
                                                    textAlign: "center",
                                                    py: 2,
                                                    px: 1,
                                                }}>
                                                    <input
                                                        type="file"
                                                        style={{
                                                            display: "none",
                                                        }}
                                                        id="contract-file-upload"
                                                        multiple
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor="contract-file-upload" style={{ width: "100%", cursor: "pointer" }}>
                                                        <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                                            <img src={upload} alt="upload" style={{ width: "32px", height: "32px", marginBottom: "8px" }} />
                                                            <MDTypography variant="button" color="text" fontWeight="regular">
                                                                Müqaviləyə aid fayllar
                                                            </MDTypography>
                                                        </MDBox>
                                                    </label>
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

export default NewContract;