import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import {toast} from "react-toastify";
import Loader from "../../components/loader/Loader";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import MDBox from "../../components/MDBox";
import Card from "@mui/material/Card";
import {Form, Formik} from "formik";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";
import {Autocomplete, Switch} from "@mui/material";
import FormField from "../../layouts/applications/wizard/components/FormField";

function AddPrivileges() {
    const navigate = useNavigate();
    const {id} = useParams();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        privilegeTitle: null,
        privilegeCode: null,
    });


    useEffect(() => {
        if (isEditMode) {
            const fetchPrivId = async () => {
                try {
                    const response = await apiClient.get(`${baseURL}/privileges/${id}`);
                    const item = response.data;
                    setInitialValues({
                        privilegeId:item.privilegeId,
                        privilegeTitle: item.privilegeTitle,
                        privilegeCode: item.privilegeCode
                    });
                } catch (error) {

                } finally {
                    setLoading(false);
                }
            };
            fetchPrivId();
        }
    }, [id]);


    const handleSubmit = async (values) => {
        try {
            const payload = {
                privilegeTitle: values.privilegeTitle,
                privilegeCode: values.privilegeCode
            };

            if (isEditMode) {
                await apiClient.put(`${baseURL}/privileges`, {
                    privilegeId: values.privilegeId,
                    ...payload,
                });
                toast.success("Uğurla redaktə olundu");
            } else {
                await apiClient.post(`${baseURL}/privileges`, payload);
                toast.success("Uğurla əlavə olundu");
            }

            navigate("/modules/privileges");
        } catch (error) {
            toast.error("Əməliyyat zamanı xəta baş verdi");

        }
    }

    if (loading) return <Loader/>;

    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox pt={6} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1}>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({values, handleChange, setFieldValue, errors, touched}) => (
                                    <Form>
                                        <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={4}>
                                            <MDBox>
                                                <MDTypography variant="h5" fontWeight="medium" mb={1}>
                                                    {isEditMode ? 'İcazəni redaktə et' : 'Yeni İcazə əlavə et'}
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" gap={2}>
                                                <MDButton variant="gradient" color="dark"
                                                          onClick={() => navigate("/modules/privileges")} sx={{
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
                                                <MDButton type="submit" variant="gradient" color="info" sx={{
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
                                            <MDBox display="flex" flexDirection="column" gap={5} mb={4}>
                                                <MDBox display="flex" gap={5}>
                                                    <MDInput
                                                        variant="standard"
                                                        type="text"
                                                        name="privilegeTitle"
                                                        value={values.privilegeTitle}
                                                        InputLabelProps={{shrink: true}}
                                                        onChange={handleChange}
                                                        label="İcazə adı"
                                                        sx={{width: "100%"}}/>
                                                    <MDInput
                                                        variant="standard"
                                                        type="text"
                                                        name="privilegeCode"
                                                        InputLabelProps={{shrink: true}}
                                                        value={values.privilegeCode}
                                                        onChange={handleChange}
                                                        label="İcazə kodu"
                                                        sx={{width: "100%"}}/>

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

export default AddPrivileges;