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
import { useNavigate } from "react-router-dom";

const currencies = ["AZN", "USD", "EUR"];
const units = ["Ədəd", "Kq", "Litr"];
const edvOptions = ["0%", "1%", "18%"];



function NewPosition() {
    const navigate = useNavigate();
    const [position, setPosition] = useState([
        {
            tableNumber: "",
            status: "",
           
        },
    ]);
  

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1}>
                            <Formik initialValues={{}} onSubmit={() => {}}>
                                <Form>
                                    <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={4}>
                                        <MDBox>
                                            <MDTypography variant="h5" fontWeight="medium" mb={1}>
                                                Yeni Vəzifə 
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
                        
                                               
                                                <MDInput variant="standard" type="text" placeholder="Vəzifə" required sx={{ width: "100%" }} />
                                                <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="Status" InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "100%" }}
                                                />
                                                
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

export default NewPosition;














