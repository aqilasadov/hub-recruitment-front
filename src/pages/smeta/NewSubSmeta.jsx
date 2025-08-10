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
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Edit from "assets/images/icons/pencil-alt.svg";
import Delete from "assets/images/icons/trash.svg";
import { useNavigate, useLocation } from "react-router-dom";

function NewSubSmeta() {
    const navigate = useNavigate();
    const location = useLocation();
    const { parentYear, parentDescription, parentId } = location.state || {};

    const [formData, setFormData] = useState([
        {
            year: parentYear || "",
            description: parentDescription || "",
            SubstanceName: ["Ştatdankənar işçilərin ə/h", "Ştatdankənar işçilərin ə/h"],
            BalanceSheet: "73108/84001",
            Department: ["İnsan resursları departamenti", "İT departamenti"],
            Etiket: "Əmək haqqı",
            SubstanceCode: [211900, 212910],
            section: ["Köməkçi bölmə", "Köməkçi bölmə"],
            ApprovedAmount: 100000,
        },
    ]);

    const handleAdd = () => {
        setFormData([...formData, {
            year: parentYear || "",
            description: parentDescription || "",
            SubstanceName: [],
            BalanceSheet: "",
            Department: [],
            Etiket: "",
            SubstanceCode: [],
            section: [],
            ApprovedAmount: "",
        }]);
    };
    

    const handleDelete = (index) => {
        setFormData(formData.filter((_, i) => i !== index));
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1}>
                            <Formik initialValues={{}} onSubmit={() => { }}>
                                <Form>
                                    <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={4}>
                                        <MDBox>
                                            <MDTypography variant="h5" fontWeight="medium" mb={1}>
                                                Yeni Smeta Yarat
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
                                            <MDButton 
                                                variant="gradient" 
                                                color="info" 
                                                onClick={() => navigate("/modules/smeta/singlesmeta", { 
                                                    state: { 
                                                        parentYear: parentYear,
                                                        parentDescription: parentDescription
                                                    } 
                                                })} 
                                                sx={{
                                                    background: "linear-gradient(45deg, #3E3D45, #202020)",
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                                                    "&:hover": {
                                                        background: "linear-gradient(45deg, #3E3D45, #202020)",
                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)"
                                                    }
                                                }}
                                            >
                                                Yadda saxla
                                            </MDButton>
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mb={4}>
                                        <MDBox display="flex" gap={5}>
                                            <MDInput
                                                variant="standard"
                                                type="text"
                                                label="İl"
                                                value={parentYear}
                                                fullWidth
                                            />
                                            <MDInput 
                                                variant="standard" 
                                                type="text" 
                                                label="Açıqlama"
                                                value={parentDescription}
                                                fullWidth
                                            />
                                        </MDBox>
                                    </MDBox>
                                    <MDBox>
                                        <MDBox display="flex" flexDirection="column" gap={1} border="1px solid" borderColor="customGrey3.main" sx={{ backgroundColor: "customGrey3.main" }} py="8px" px="16px" borderRadius="8px" mb={4}>
                                            <MDTypography variant="h6" fontWeight="medium" color="gold" >Alt bölmə parametrləri</MDTypography>
                                            <MDTypography variant="subtitle2" color="customGrey2">Məcburi məlumatlar</MDTypography>
                                        </MDBox>
                                        <MDBox display="flex" flexDirection="column" gap={5} mb={4} px={2}>
                                            <MDBox display="flex" gap={5} >
                                                <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="Maddənin adı" InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "100%" }}
                                                />
                                                <MDInput variant="standard" type="text" placeholder="Balans hesabı" required sx={{ width: "100%" }} />
                                                <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="Departament" InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "100%" }}
                                                />
                                                <MDInput variant="standard" type="text" placeholder="Etiket" required sx={{ width: "100%" }} />
                                            </MDBox>
                                            <MDBox display="flex" gap={5}>
                                                <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="Maddənin kodu" InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "100%" }}
                                                />
                                                <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="Bölmə" required InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "100%" }}
                                                />
                                                <MDInput variant="standard" type="text" placeholder="Təsdiqlənmiş məbləğ" required sx={{ width: "100%" }} />
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                </Form>
                            </Formik>
                        </MDBox>
                    </Card>
                </MDBox>

            </MDBox>
        </DashboardLayout>
    );
}

NewSubSmeta.defaultProps = {
    formData: {
        SubstanceName: [],
        Department: [],
        SubstanceCode: [],
        section: [],
    },
};
export default NewSubSmeta;














