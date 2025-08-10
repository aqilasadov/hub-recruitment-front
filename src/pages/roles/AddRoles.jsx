import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Loader from "../../components/loader/Loader";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import {Form, Formik} from "formik";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import Card from "@mui/material/Card";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";
import {Autocomplete, Chip, Switch} from "@mui/material";
import FormField from "../../layouts/applications/wizard/components/FormField";
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import {toast} from "react-toastify";

function AddRoles() {
    const navigate = useNavigate();
    const {id} = useParams();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [privileges, setPrivileges] = useState([]);
    const [initialValues, setInitialValues] = useState({
        title: null,
        shortTitle: null,
        description: null,
        privilegeIds: [],
        isActive: false
    });

    const fetchPrivilegeList = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/privileges`);
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setPrivileges(data);
            }
        } catch (error) {
            console.log('error', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPrivilegeList();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            const fetchRoleId = async () => {
                try {
                    const response = await apiClient.get(`${baseURL}/roles/${id}`);
                    const item = response.data;
                    setInitialValues({
                        roleId:item.roleId,
                        title: item.title,
                        shortTitle: item.shortTitle,
                        description: item.description,
                        privilegeIds: item.privilegeIds || [],
                        isActive: item.isActive !== undefined ? item.isActive : true,
                    });
                } catch (error) {

                } finally {
                    setLoading(false);
                }
            };
            fetchRoleId();
        }
    }, [id]);


    const handleSubmit = async (values) => {
        try {
            const payload = {
                title: values.title,
                shortTitle: values.shortTitle,
                description: values.description,
                privilegeIds: values.privilegeIds,
                isActive: values.isActive ? 1 : 0,
            };

            if (isEditMode) {
                await apiClient.put(`${baseURL}/roles`, {
                    roleId: values.roleId,
                    ...payload,
                });
                toast.success("Uğurla redaktə olundu");
            } else {
                await apiClient.post(`${baseURL}/roles`, payload);
                toast.success("Uğurla əlavə olundu");
            }

            navigate("/modules/roles");
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
                                                    {isEditMode ? 'İmtiyazı redaktə et' : 'Yeni İmtiyaz əlavə et'}
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" gap={2}>
                                                <MDButton variant="gradient" color="dark"
                                                          onClick={() => navigate("/modules/roles")} sx={{
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
                                                        name="title"
                                                        value={values.title}
                                                        InputLabelProps={{shrink: true}}
                                                        onChange={handleChange}
                                                        label="İmtiyaz adı"
                                                        sx={{width: "100%"}}/>
                                                    <MDInput
                                                        variant="standard"
                                                        type="text"
                                                        name="shortTitle"
                                                        InputLabelProps={{shrink: true}}
                                                        value={values.shortTitle}
                                                        onChange={handleChange}
                                                        label="İmtiyazın qısa adı"
                                                        sx={{width: "100%"}}/>
                                                    <Autocomplete
                                                        multiple='true'
                                                        options={privileges}
                                                        getOptionLabel={(option)=>option.privilegeTitle}
                                                        value={privileges.filter((priv) => values.privilegeIds.includes(priv.privilegeId))}
                                                        onChange={(event, selectedOptions) => {
                                                            const selectedIds = selectedOptions.map((option) => option.privilegeId);
                                                            setFieldValue("privilegeIds", selectedIds);
                                                        }}
                                                        isOptionEqualToValue={(option, value) => option.privilegeId === value.privilegeId}
                                                        renderTags={(selected, getTagProps) =>
                                                            selected.length > 2
                                                                ? `${selected.length} seçildi`
                                                                : selected.map((option, index) => (
                                                                    <Chip label={option.privilegeTitle} {...getTagProps({ index })} />
                                                                ))
                                                        }
                                                        renderInput={(params) => (
                                                            <FormField {...params} label="İcazələr"
                                                                       InputLabelProps={{shrink: true}}/>
                                                        )}

                                                        sx={{width: "100%"}}
                                                    />
                                                </MDBox>
                                                <MDBox display='flex' gap={5}>
                                                    <MDInput
                                                        variant="standard"
                                                        type="text"
                                                        name="description"
                                                        InputLabelProps={{shrink: true}}
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        label="İmtiyaz haqqında"
                                                        sx={{width: "100%"}}/>
                                                    <MDBox
                                                        display="flex"
                                                        gap={2}
                                                        alignItems="center"
                                                        justifyContent="end"
                                                        sx={{width: "max-content"}}
                                                    >
                                                        <MDTypography
                                                            variant="body2"
                                                            color="text"
                                                            fontSize={14}
                                                            sx={{width: "max-content"}}
                                                        >
                                                            İmtiyaz aktivdir?
                                                        </MDTypography>
                                                        <Switch
                                                            checked={values.isActive}
                                                            onChange={(e) =>
                                                                setFieldValue("isActive", e.target.checked)
                                                            }
                                                        />
                                                    </MDBox>
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


export default AddRoles;
