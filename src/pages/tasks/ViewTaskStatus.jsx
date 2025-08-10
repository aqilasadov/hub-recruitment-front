import {Autocomplete, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import apiClient from "apiClient";
import Card from "components/Card/Card";
import Loader from "components/loader/Loader";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {Formik, Form} from "formik";
import FormField from "layouts/applications/wizard/components/FormField";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {baseURL} from "utils/Url";
import upload from "../../assets/images/icons/cloud-upload.svg";
import {Box, Typography, IconButton, Tooltip} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckIcon from "@mui/icons-material/Check";
import {downloadFileWithAuth} from "utils/fetchFileWithAuth";
import {fetchFileWithAuth} from "utils/fetchFileWithAuth";

export const handleOpen = async (fileId) => {
    try {
        const response = await apiClient.get(`/file/view/${fileId}`, {
            responseType: "blob",
        });

        const blob = response.data;
        const fileURL = URL.createObjectURL(blob);

        window.open(fileURL, "_blank");
    } catch (error) {
        console.error("Dosya görüntülenemedi", error);
    }
};

const handleDownload = async (fileId, fileName) => {
    try {
        const response = await apiClient.get(`/file/view/${fileId}`, {
            responseType: "blob",
        });
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], {type: contentType});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("File download error:", error);
    }
};

const FileCard = ({files, onView, onDownload}) => {
    console.log("files", files);

    return (
        <Box>
            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                <Typography variant="body2">Tapşırıq faylları</Typography>
                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
            </Box>

            <Card
                sx={{
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: "sm",
                    backgroundColor: "#f9f9f9",
                }}
            >
                {files?.map((file, index) => (
                    <Box
                        key={file.fileId}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                    >
                        <Typography variant="body2" noWrap>
                            file_{file?.originalFileName}
                        </Typography>

                        <Box>
                            <Tooltip title="Bax">
                                <IconButton
                                    onClick={() => onView(file?.fileId, file?.fileName)}
                                >
                                    <VisibilityIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Yüklə">
                                <IconButton
                                    sx={{color: "#5398dd"}}
                                    onClick={() => onDownload(file.fileId, `file_${index + 1}`)}
                                >
                                    <DownloadIcon/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                ))}
            </Card>
        </Box>
    );
};

function ViewTaskStatus() {
    const navigate = useNavigate();
    const {id} = useParams();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [initialValues, setInitialValues] = useState({
        executiveEmpId: null,
        taskTitle: null,
        taskContent: null,
        taskDeadlineDate: null,
        note: null,
        taskFilesList: [
            {
                fileId: null,
            },
        ],
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchTaskId = async () => {
                try {
                    const response = apiClient.get(`${baseURL}/task/${id}`);
                    const item = response.data;
                    setInitialValues({
                        taskId: item.taskId,
                        executiveEmpId: item.executiveEmpId,
                        taskTitle: item.taskTitle,
                        taskContent: item.taskContent,
                        taskDeadlineDate: item.taskDeadlineDate,
                        note: item.note,
                        taskFilesList: item.taskFilesList,
                    });
                } catch (error) {
                    toast.error(error);
                }
            };
            fetchTaskId();
        }
    }, [id]);

    const handleSubmit = async (values) => {

    };

    const fetchEmployeeList = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/employees`);
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setEmployeeList(data);
            }
        } catch (error) {
            console.log("Error fetching product list", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeList();
    }, []);

    if (loading) return <Loader/>;

    const uploadFileWithAuth = async (file) => {
        const formData = new FormData();
        formData.append("files[]", file);

        const token = localStorage.getItem("authToken");

        const response = await fetch(`${baseURL}/file`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            toast.error("Yükləmə zamanı xəta baş verdi");
            throw new Error("Failed photo upload");
        }

        const data = await response.json();
        if (data) {
            toast.success("Əməliyyat Uğurludur");
        }
        console.log("data", data);
        setUploadedFiles((prev) => {
            const prevFiles = prev?.data || [];
            const newFiles = data.data || [];

            return {
                ...prev,
                data: [...prevFiles, ...newFiles],
            };
        });
        return data.data && data.data.length > 0 ? data.data[0].fileId : null;
    };

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
                                        <MDBox
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="start"
                                            mb={4}
                                        >
                                            <MDBox>
                                                <MDTypography variant="h5" fontWeight="medium" mb={1}>
                                                    Taşırığa baxış
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" gap={2}>
                                                <MDButton
                                                    variant="default"
                                                    color="white"
                                                    disabled="true"
                                                    sx={{
                                                        border: "1px solid",
                                                    }}
                                                    onClick={() => navigate("/modules/tasks")}
                                                >
                                                    İmtina et
                                                </MDButton>
                                                <MDButton
                                                    type="submit"
                                                    variant="gradient"
                                                    color="info"
                                                    disabled='true'
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
                                                        disabled="true"
                                                        options={employeeList}
                                                        getOptionLabel={(option) =>
                                                            option.firstName + " " + option.lastName || ""
                                                        }
                                                        isOptionEqualToValue={(option, value) =>
                                                            option.empId === value.empId
                                                        }
                                                        value={employeeList.find(
                                                            (emp) =>
                                                                emp.empId === values.executiveEmpId || null
                                                        )}
                                                        onChange={(event, newValue) => {
                                                            setFieldValue(
                                                                "executiveEmpId",
                                                                newValue ? newValue.empId : null
                                                            );
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="standard"
                                                                label="İcraçı"
                                                                InputLabelProps={{shrink: true}}
                                                            />
                                                        )}
                                                        sx={{width: "100%"}}
                                                    />
                                                    <TextField
                                                        disabled="true"
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        type="text"
                                                        name="taskTitle"
                                                        label="Tapşırıq başlığı"
                                                        value={values.taskTitle}
                                                        onChange={handleChange}
                                                        sx={{width: "100%"}}
                                                    />
                                                </MDBox>
                                                <MDBox display="flex" gap={5}>
                                                    <TextField
                                                        disabled="true"
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        type="text"
                                                        name="taskContent"
                                                        label="Tapşırıq məzmunu"
                                                        value={values.taskContent}
                                                        onChange={handleChange}
                                                        sx={{width: "100%"}}
                                                    />
                                                </MDBox>
                                                <MDBox display="flex" gap={5}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        adapterLocale="az"
                                                    >
                                                        <DatePicker
                                                            label="Tapşırığın son icra tarixi"
                                                            format="DD-MM-YYYY"
                                                            disabled="true"
                                                            inputFormat="DD-MM-YYYY"
                                                            value={values.taskDeadlineDate || null}
                                                            onChange={(newValue) => {
                                                                setFieldValue("taskDeadlineDate", newValue);
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    fullWidth
                                                                    required
                                                                    variant="standard"
                                                                    InputLabelProps={{shrink: true}}
                                                                    name="taskDeadlineDate"
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </MDBox>
                                                <FileCard
                                                    files={uploadedFiles?.data}
                                                    onView={handleOpen}
                                                    onDownload={handleDownload}
                                                />
                                                <MDBox display="flex" gap={5}>
                                                    <TextField
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        type="text"
                                                        name="note"
                                                        label="Qeyd"
                                                        value={values.note}
                                                        onChange={handleChange}
                                                        sx={{width: "100%"}}
                                                        disabled="true"
                                                    />
                                                </MDBox>
                                            </MDBox>
                                        </MDBox>
                                        <MDBox display="flex" justifyContent="end" gap={2}>
                                            <MDButton
                                                variant="default"
                                                color="white"
                                                sx={{
                                                    border: "1px solid",
                                                }}
                                                onClick={() => navigate("/modules/tasks")}
                                            >
                                                Bağla
                                            </MDButton>
                                            <MDButton
                                                variant="gradient"
                                                color="dark"
                                                sx={{
                                                    color: "darkBlue.main",
                                                    background:
                                                        "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                                                    boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)",
                                                    "&:hover": {
                                                        background:
                                                            "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                                                        boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)",
                                                    },
                                                }}
                                            >
                                                Ləğv et
                                            </MDButton>
                                            <MDButton
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
                                                startIcon={<CheckIcon/>}
                                            >
                                                Təsdiq et
                                            </MDButton>
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

export default ViewTaskStatus;
