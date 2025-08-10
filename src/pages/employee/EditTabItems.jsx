import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import MDBox from "../../components/MDBox";
import {Autocomplete, Box, Step, StepLabel, Stepper, Switch, TextField, Typography} from "@mui/material";
import upload from "../../assets/images/icons/cloud-upload.svg";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import MDButton from "../../components/MDButton";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import {toast} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {StoreContext} from "../../context/StoreContext";
import * as Yup from "yup";


const steps = [
    "Şəxsi məlumatlar",
    "Vəzifə",
    "İş təcrübəsi",
    "Ailə üzvləri",
    "Təhsil və bacarıqlar",
    "Hərbi mükəlləfiyyət",
    "Əlaqə məlumatları",
];

function EditTabItems() {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [employeeList, setEmployeeList] = useState([]);
    const [depList, setDepList] = useState([]);
    const [posList, setPosList] = useState([]);
    const [langLevel, setLangLevel] = useState([]);
    const [compLevel, setCompLevel] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const location = useLocation();
    const {
        gender,
        bloodType,
        identityDocs,
        maritalStatuses,
        trialPeriods,
        contractTerms,
        regions,
        kinshipTypes,
        educationTypes,
        languageType,
        computerSkill,
        militaryObligation,
        militaryRank,
        contactTypes,
        authorities,
        procedureTypes
    } = useContext(StoreContext);


    const validationSchema = Yup.object().shape({
        tableNumber: Yup.number()
            .required('Cədvəl nömrəsi mütləqdir'),

        firstName: Yup.string()
            .required('Ad mütləqdir'),

        lastName: Yup.string()
            .required('Soyad mütləqdir'),

        dateOfIssue: Yup.string()
            .required('Verilmə tarixi mütləqdir'),

        dateOfExpire: Yup.string()
            .required('Bitmə tarixi mütləqdir'),

        birthDate: Yup.string()
            .required('Doğum tarixi mütləqdir'),

        identityDocId: Yup.number()
            .typeError('Yalnızca rəqəm daxil edin')
            .required('Şəxsiyyət sənədi növü mütləqdir'),
    });


    const [initialValues, setInitialValues] = useState({
        empContacts: {},
        empMilitaryObligations: {},
        compSkillRequestDto: {},
        langSkillRequestDto: {},
        courseCertificateRequestDto: {},
        educationRequestDto: {},
        empFamilyMembers: {},
        empJobExperiences: {},
        empPosition: {},
        empRoles: {},
        employee: {},
    })

    const uploadFileWithAuth = async (file) => {
        const formData = new FormData();
        formData.append('files[]', file);

        const token = localStorage.getItem('authToken');

        const response = await fetch(`${baseURL}/file`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            toast.error('Yükləmə zamanı xəta baş verdi');
            throw new Error('Failed photo upload');
        }

        const data = await response.json();
        if (data) {
            toast.success('Əməliyyat Uğurludur');
        }
        console.log('data', data);

        return data.data && data.data.length > 0 ? data.data[0].fileId : null;
    };

    useEffect(() => {
        const empId = Number(location.state.employeeId);
        if (empId) {
            setInitialValues({
                empContacts: {empId},
                empMilitaryObligations: {empId},
                compSkillRequestDto: {empId},
                langSkillRequestDto: {empId},
                courseCertificateRequestDto: {empId},
                educationRequestDto: {empId},
                empFamilyMembers: {empId},
                empJobExperiences: {empId},
                empPosition: {empId},
                employee: {empId},
                empRoles: {empId}
            });
        }
    }, [location.state.empId]);

    const handleSubmit = async (values) => {
        console.log('update values', values);
        if (location.state.empSkill?.courseCertificationId || location.state.stepIndex === 'course') {
            handleUpdateCourseCertification(values.courseCertificateRequestDto);
        }
        if (location.state.empSkill?.langId || location.state.stepIndex === 'lang') {
            handleUpdateLanguage(values.langSkillRequestDto);
        }
        if (location.state.empSkill?.jobExperienceId || location.state.stepIndex === 2) {
            handleUpdateWorkExperience(values.empJobExperiences);
        }
        if (location.state.empSkill?.familyMemberId || location.state.stepIndex === 3) {
            handleUpdateFamilyMembers(values.empFamilyMembers);
        }
        if (location.state.empSkill?.contactId || location.state.stepIndex === 6) {
            handleUpdateContact(values.empContacts);
        }

        if (location.state.empSkill?.compId || location.state.stepIndex === 'comp') {
            handleUpdateComputer(values.compSkillRequestDto);
        }
        if (location.state.empSkill?.empMilitaryObligationId || location.state.stepIndex === 5) {
            handleUpdateMilitaryObligation(values.empMilitaryObligations);
        }
        if (location.state.empSkill?.empPosId || location.state.stepIndex === 1) {
            handleUpdatePosition(values.empPosition);
        }
        if (location.state.empSkill?.roleId || location.state.stepIndex === 7) {
            handleUpdateRoles(values.empRoles);
        }
        if (location.state.empSkill?.empEducationId || location.state.stepIndex === 'education') {
            handleUpdateEducation(values.educationRequestDto);
        }
    };

    const handleUpdatePosition = async (values) => {
        const isUpdate = values.empPosId && typeof values.empPosId === 'number';
        try {
            let response;

            if (isUpdate) {
                response = await apiClient.put(`${baseURL}/employee-positions`, values);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Yeniləmə uğursuz oldu: ' + response.status);
                }
            } else {
                response = await apiClient.post(`${baseURL}/employee-positions`, values);
                if (response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Əlavə etmə uğursuz oldu: ' + response.status);
                }
            }

        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Position Update Error:', error);
        }
    };


    const handleUpdateWorkExperience = async (values) => {
        try {
            let response;

            if (values.jobExperienceId) {
                response = await apiClient.put(`${baseURL}/job-experiences`, values);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Yeniləmə uğursuz oldu: ' + response.status);
                }
            } else {
                response = await apiClient.post(`${baseURL}/job-experiences`, values);
                if (response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Əlavə etmə uğursuz oldu: ' + response.status);
                }
            }

        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Work Experience Update Error:', error);
        }
    };

    const handleUpdateFamilyMembers = async (values) => {
        try {
            let response;

            if (values.familyMemberId) {
                response = await apiClient.put(`${baseURL}/family-members`, values);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Yeniləmə uğursuz oldu: ' + response.status);
                }
            } else
                response = await apiClient.post(`${baseURL}/family-members`, values);
            if (response.status === 201) {
                toast.success('Əməliyyat Uğurludur');
                navigate(`/modules/employees/edit/${location.state.employeeId}`);
            } else {
                toast.error('Əlavə etmə uğursuz oldu: ' + response.status);
            }
        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Family Member Update Error:', error);
        }
    };


    const handleUpdateEducation = async (values) => {
        try {
            let response;

            if (values.empEducationId) {
                response = await apiClient.put(`${baseURL}/emp-educations`, values);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Yeniləmə uğursuz oldu: ' + response.status);
                }
            } else {
                response = await apiClient.post(`${baseURL}/emp-educations`, values);
                if (response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Əlavə etmə uğursuz oldu: ' + response.status);
                }
            }

        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Education Update Error:', error);
        }
    };
    const handleUpdateRoles = async (values) => {
        console.log('role values', values);
        try {
            let response;
            response = await apiClient.post(`${baseURL}/roles/emp-role`, values);
            if (response.status === 201) {
                toast.success('Əməliyyat Uğurludur');
                navigate(`/modules/employees/edit/${location.state.employeeId}`);
            } else {
                toast.error('Əlavə etmə uğursuz oldu: ' + response.status);
            }

        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Education Update Error:', error);
        }
    };


    const handleUpdateCourseCertification = async (values) => {
        try {
            let response;

            if (values.empCourseCertificateId) {
                response = await apiClient.put(`${baseURL}/emp-course-certificates`, values);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Yeniləmə uğursuz oldu: ' + response.status);
                }
            } else {
                response = await apiClient.post(`${baseURL}/emp-course-certificates`, values);
                if (response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Əlavə etmə uğursuz oldu: ' + response.status);
                }
            }

        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Course Certificate Update Error:', error);
        }
    };

    const handleUpdateLanguage = async (values) => {
        if (values.empSkillId) {
            try {
                await apiClient.put(`${baseURL}/emp-lang-skills`, values);
                toast.success('Əməliyyat Uğurludur');
                navigate(`/modules/employees/edit/${location.state.employeeId}`)
            } catch (error) {
                toast.error(error);
            }
        } else {
            try {
                await apiClient.post(`${baseURL}/emp-lang-skills`, values);
                toast.success('Əməliyyat Uğurludur');
                navigate(`/modules/employees/edit/${location.state.employeeId}`)
            } catch (error) {
                toast.error(error);
            }
        }
    }
    const handleUpdateComputer = async (values) => {
        try {
            let response;

            if (values.empSkillId) {
                response = await apiClient.put(`${baseURL}/emp-comp-skills`, values);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Yeniləmə uğursuz oldu: ' + response.status);
                }
            } else {
                response = await apiClient.post(`${baseURL}/emp-comp-skills`, values);
                if (response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Əlavə etmə uğursuz oldu: ' + response.status);
                }
            }

        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Computer Skill Update Error:', error);
        }
    };

    const handleUpdateMilitaryObligation = async (values) => {
        try {
            let response;

            if (values.empMilitaryObligationId) {
                response = await apiClient.put(`${baseURL}/emp-military-obligations`, values);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Yeniləmə uğursuz oldu: ' + response.status);
                }
            } else {
                response = await apiClient.post(`${baseURL}/emp-military-obligations`, values);
                if (response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Əlavə etmə uğursuz oldu: ' + response.status);
                }
            }

        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Military Obligation Update Error:', error);
        }
    };


    const handleUpdateContact = async (values) => {
        try {
            let response;
            if (values.contactId) {
                response = await apiClient.put(`${baseURL}/contacts`, values);
                if (response.status === 200 || response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Yeniləmə uğursuz oldu: ' + response.status);
                }
            } else {
                response = await apiClient.post(`${baseURL}/contacts`, values);
                if (response.status === 201) {
                    toast.success('Əməliyyat Uğurludur');
                    navigate(`/modules/employees/edit/${location.state.employeeId}`);
                } else {
                    toast.error('Əlavə uğursuz oldu: ' + response.status);
                }
            }

        } catch (error) {
            toast.error('Xəta baş verdi');
            console.error('Contact Update Error:', error);
        }
    };


    const fetchRoles = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/roles`);
            if (response.status >= 200 && response.status < 300) {
                setRoles(response.data);
            }
        } catch (error) {
            toast.error(error);
        }
    }

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

    const fetchPosList = async (id) => {

        try {
            const response = await apiClient.get(`${baseURL}/employee-positions/by-dep-id/${id}`);
            if (response) {
                const data = response.data;
                setPosList(data);
            } else {
                setPosList(null);
            }
        } catch (error) {
            console.log('Error fetching posList', error)
        } finally {

        }
    }

    const fetchDepList = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/departments`);
            if (response) {
                const data = response.data;
                setDepList(data);
            }
        } catch (error) {
            console.log('Error fetching deplist', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmpPosition = async (id) => {
        setLoading(true)
        try {
            const response = await apiClient.get(`${baseURL}/employee-positions/${id}`);
            if (response) {
                const data = response.data;
                fetchPosList(data.depId);
                console.log('data depId', data.depId);
                setInitialValues((prev) => ({
                    ...prev,
                    empPosition: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }
    const fetchJobExperiences = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/job-experiences/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    empJobExperiences: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }

    const fetchFamilyMembers = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/family-members/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    empFamilyMembers: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }
    const fetchEducation = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/emp-educations/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    educationRequestDto: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }


    const fetchCourseCertification = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/emp-course-certificates/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    courseCertificateRequestDto: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }

    const fetchLangSkills = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/emp-lang-skills/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    langSkillRequestDto: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }
    const fetchComputerSkills = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/emp-comp-skills/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    compSkillRequestDto: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }
    const fetchMilitaryObligations = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/emp-military-obligations/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    empMilitaryObligations: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }
    const fetchContacts = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/contacts/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    empContacts: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }

    const fetchRolesById = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/roles/${id}`);
            if (response) {
                const data = response.data;
                setInitialValues((prev) => ({
                    ...prev,
                    empRoles: data
                }))
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false)
        }
    }


    const fetchLangLevelList = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/skills/language-level`);
            if (response.status >= 200 && response.status < 300) {
                setLangLevel(response.data);
            }
        } catch (error) {
            toast.error(error);
        }
    }
    const fetchCompLevelList = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/skills/comp`);
            if (response.status >= 200 && response.status < 300) {
                setCompLevel(response.data);
            }
        } catch (error) {
            toast.error(error);
        }
    }


    useEffect(() => {
        fetchEmployeeList();
        fetchDepList();
        fetchLangLevelList();
        fetchCompLevelList();
        fetchRoles();
    }, []);


    useEffect(() => {
        console.log('location.state', location.state);
        if (location.state) {
            const {stepIndex, id} = location.state;
            if (stepIndex !== undefined) {
                setActiveStep(stepIndex);
            }
            if (id !== undefined) {
                setSelectedId(id);
            }
            if (location.state.empSkill?.courseCertificationId) {
                fetchCourseCertification(location.state.empSkill?.courseCertificationId);
            }
            if (location.state.empSkill?.langId) {
                fetchLangSkills(location.state.empSkill?.langId);
            }
            if (location.state.empSkill?.jobExperienceId) {
                fetchJobExperiences(location.state.empSkill?.jobExperienceId);
            }
            if (location.state.empSkill?.familyMemberId) {
                fetchFamilyMembers(location.state.empSkill?.familyMemberId);
            }
            if (location.state.empSkill?.compId) {
                fetchComputerSkills(location.state.empSkill?.compId);
            }
            if (location.state.empSkill?.empMilitaryObligationId) {
                fetchMilitaryObligations(location.state.empSkill?.empMilitaryObligationId);
            }
            if (location.state.empSkill?.empPosId) {
                fetchEmpPosition(location.state.empSkill?.empPosId);

            }
            if (location.state.empSkill?.empEducationId) {
                fetchEducation(location.state.empSkill?.empEducationId);
            }
            if (location.state.empSkill?.contactId) {
                fetchContacts(location.state.empSkill?.contactId);
            }
            if (location.state.empSkill?.roleId) {
                fetchRolesById(location.state.empSkill?.roleId);
            }
        }
    }, [location.state]);

    useEffect(() => {
        console.log("selectedId", selectedId);
    }, [selectedId]);


    const renderStepContent = (step, formik) => {
        switch (step) {
            case 0:
                return (
                    <MDBox>
                        <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                            <Typography variant="body1">Şəxsi məlumatlar</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        <MDBox sx={{
                            borderRadius: "12px",
                            minHeight: "80px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
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
                                style={{display: "none"}}
                                id="personal-info-file-upload"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    try {
                                        const uploadedFileId = await uploadFileWithAuth(file);
                                        setFile(uploadedFileId);
                                        formik.setFieldValue("employee.fileId", uploadedFileId);
                                    } catch (error) {
                                        console.error("Fayl yükləmə xətası", error);
                                    }
                                }}
                            />
                            <label htmlFor="personal-info-file-upload" style={{width: "100%", cursor: "pointer"}}>
                                <MDBox display="flex" flexDirection="row" gap={2} alignItems="center"
                                       justifyContent="center">
                                    <img src={upload} alt="upload"
                                         style={{width: "32px", height: "32px", marginBottom: "8px"}}/>
                                    <MDTypography variant="button" color="text" fontWeight="regular">
                                        Şəkil yüklə
                                    </MDTypography>
                                </MDBox>
                                <MDBox display="flex" flexDirection="column" gap={5} mt={4} mb={4} px={2}>
                                    <MDBox display="flex" gap={5}>
                                        <Field name="employee.tableNumber">
                                            {({field, meta}) => (
                                                <>
                                                    <MDInput
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        placeholder="Table Nömrəsi*"
                                                        helperText={
                                                            meta.touched && meta.error ? (
                                                                <span style={{color: "#f44336"}}>
                                                           {meta.error}
                                                                 </span>
                                                            ) : null
                                                        }
                                                        sx={{width: "100%"}}
                                                        required
                                                    />
                                                </>
                                            )}
                                        </Field>

                                        <Field name="employee.username">
                                            {({field, meta}) => (
                                                <>
                                                    <MDInput
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        name="employee.username"
                                                        placeholder="İstifadəçi adı"
                                                        sx={{width: "100%"}}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </MDBox>
                                    <MDBox display='flex' gap={5}>
                                        <Field name="employee.firstName">
                                            {({field, meta}) => (
                                                <>
                                                    <MDInput
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        name="employee.firstName"
                                                        placeholder="Adı*"
                                                        sx={{width: "100%"}}
                                                        helperText={
                                                            meta.touched && meta.error ? (
                                                                <span style={{color: "#f44336"}}>
                                                           {meta.error}
                                                                 </span>
                                                            ) : null
                                                        }
                                                        required
                                                    />

                                                </>
                                            )}
                                        </Field>
                                        <Field name="employee.lastName">
                                            {({field, meta}) => (
                                                <>
                                                    <MDInput
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        name="employee.lastName"
                                                        placeholder="Soyadı*"
                                                        helperText={
                                                            meta.touched && meta.error ? (
                                                                <span style={{color: "#f44336"}}>
                                                           {meta.error}
                                                                 </span>
                                                            ) : null
                                                        }
                                                        sx={{width: "100%"}}
                                                        required
                                                    />
                                                </>
                                            )}
                                        </Field>
                                        <Field name="employee.fatherName">
                                            {({field, meta}) => (
                                                <>
                                                    <MDInput
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        name="employee.fatherName"
                                                        placeholder="Ata adı"
                                                        sx={{width: "100%"}}
                                                    />
                                                </>
                                            )}
                                        </Field>

                                    </MDBox>
                                </MDBox>
                            </label>
                        </MDBox>
                        <MDBox mt={2}>
                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                <Typography variant="body1">Sənəd məlumatları</Typography>
                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/> </MDBox>
                            <MDBox sx={{
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "border-color 0.2s",
                                "&:hover": {
                                    borderColor: "#B0B8C1",
                                },
                                color: "#8B95A1",
                                textAlign: "center",
                            }}>
                                <MDBox display="flex" flexDirection="column" gap={5} mt={4} mb={4} px={2}>
                                    <MDBox display='flex' gap={5}>
                                        <Field name="employee.countryId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={regions.filter((item) => item.regionTypeId === 1)}
                                                    getOptionLabel={(option) => option.region || ""}
                                                    value={
                                                        regions.find((item) => item.regionId === field.value) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(field.name, newValue ? newValue.regionId : null);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            placeholder="Vətəndaşlığı"
                                                            InputLabelProps={{shrink: true}}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                        <Field name="employee.identityDocId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={identityDocs}
                                                    getOptionLabel={(option) => option.title || ''}
                                                    value={
                                                        identityDocs.find((item) => item.id === field.value) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(field.name, newValue ? newValue.id : null);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Vətəndaşlığı təsdiq edən sənəd*"
                                                            required
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                        <Field name="employee.docNumber">
                                            {({field, meta}) => (
                                                <>
                                                    <MDInput
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        name="employee.docNumber"
                                                        placeholder="Sənədin nömrəsi"
                                                        sx={{width: "100%"}}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                        <Field name="employee.ownerEmpId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={employeeList}
                                                    getOptionLabel={(option) => option.firstName + " " + option.lastName || ""}
                                                    value={
                                                        employeeList.find((item) => item.empId === field.value) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(field.name, newValue ? newValue.empId : null);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            placeholder="Birbaşa rəhbəri"
                                                            InputLabelProps={{shrink: true}}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                    <MDBox display='flex' gap={5}>
                                        <Field name="employee.authorityId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={authorities}
                                                    getOptionLabel={(option) => option.title || ''}
                                                    value={
                                                        authorities.find((item) => item.id === field.value) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(field.name, newValue ? newValue.id : null);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            placeholder="Sənədi verən orqan"
                                                            InputLabelProps={{shrink: true}}/>
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                        <Field name="employee.dateOfIssue">
                                            {({field, form}) => (
                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                                    <DatePicker
                                                        label="Sənədin verilmə tarixi"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY"
                                                        value={field.value || null}
                                                        onChange={(value) => form.setFieldValue(field.name, value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                InputLabelProps={{shrink: true}}
                                                                required
                                                                variant="standard"
                                                                error={Boolean(form.touched.dateOfIssue && form.errors.dateOfIssue)}
                                                                helperText={form.touched.dateOfIssue && form.errors.dateOfIssue}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>
                                        <Field name="employee.dateOfExpire">
                                            {({field, form}) => (
                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                                    <DatePicker
                                                        label="Sənədin bitmə tarixi"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY" value={field.value || null}
                                                        onChange={(value) => form.setFieldValue(field.name, value)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                required
                                                                variant="standard"
                                                                InputLabelProps={{shrink: true}}
                                                                error={Boolean(form.touched.dateOfExpire && form.errors.dateOfExpire)}
                                                                helperText={form.touched.dateOfExpire && form.errors.dateOfExpire}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>
                                        <Field name="employee.fin">
                                            {({field, meta}) => (
                                                <>
                                                    <MDInput
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        name="employee.fin"
                                                        placeholder="Finkod"
                                                        sx={{width: "100%"}}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                        <MDBox mt={2}>
                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                <Typography variant="body1">Digər məlumatlar</Typography>
                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                            </MDBox>
                            <MDBox sx={{
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "border-color 0.2s",
                                "&:hover": {
                                    borderColor: "#B0B8C1",
                                },
                                color: "#8B95A1",
                                textAlign: "center",
                            }}>
                                <MDBox display="flex" flexDirection="column" gap={5} mt={4} mb={4} px={2}>
                                    <MDBox display='flex' gap={5}>
                                        <Field name="employee.birthplaceId">
                                            {({field, form}) => (
                                                <Autocomplete
                                                    options={regions.filter(item => item.regionTypeId === 2)}
                                                    getOptionLabel={(option) => option.region || ''}
                                                    value={regions.find(item => item.regionId === field.value) || null}
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(field.name, newValue ? newValue.regionId : '');
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            placeholder="Doğulduğu yer"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(form.touched.birthplaceId && form.errors.birthplaceId)}
                                                            helperText={form.touched.birthplaceId && form.errors.birthplaceId}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                        <Field name="employee.birthDate">
                                            {({field, form}) => (
                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                                    <DatePicker
                                                        label="Doğum tarixi"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY" value={field.value || null}
                                                        onChange={(value) => {
                                                            form.setFieldValue(field.name, value);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                required
                                                                variant="standard"
                                                                InputLabelProps={{shrink: true}}
                                                                error={Boolean(form.touched.birthDate && form.errors.birthDate)}
                                                                helperText={form.touched.birthDate && form.errors.birthDate}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>
                                        <Field name="employee.bloodTypeId">
                                            {({field, form}) => (
                                                <Autocomplete
                                                    options={bloodType}
                                                    getOptionLabel={(option) => option.title || ''}
                                                    value={bloodType.find(item => item.id === field.value) || null}
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(field.name, newValue ? newValue.id : '');
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            placeholder="Qan qrupu"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(form.touched.bloodTypeId && form.errors.bloodTypeId)}
                                                            helperText={form.touched.bloodTypeId && form.errors.bloodTypeId}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>

                                    </MDBox>
                                    <MDBox display='flex' gap={5}>
                                        <Field name="employee.regAddr">
                                            {({field, form}) => (
                                                <MDInput
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    placeholder="Qeydiyyat ünvanı"
                                                    sx={{width: "100%"}}
                                                    error={Boolean(form.touched.regAddr && form.errors.regAddr)}
                                                    helperText={form.touched.regAddr && form.errors.regAddr}
                                                    onBlur={field.onBlur}
                                                />
                                            )}
                                        </Field>

                                        <Field name="employee.curAddr">
                                            {({field, form}) => (
                                                <MDInput
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    placeholder="Faktiki yaşadığı ünvan"
                                                    sx={{width: "100%"}}
                                                    error={Boolean(form.touched.curAddr && form.errors.curAddr)}
                                                    helperText={form.touched.curAddr && form.errors.curAddr}
                                                    onBlur={field.onBlur}
                                                />
                                            )}
                                        </Field>
                                        <Field name="employee.maritalStatusId">
                                            {({field, form}) => (
                                                <Autocomplete
                                                    options={maritalStatuses}
                                                    getOptionLabel={(option) => option.title || ''}
                                                    value={maritalStatuses.find(item => item.id === field.value) || null}
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(field.name, newValue ? newValue.id : '');
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            placeholder="Ailə vəziyyəti"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(form.touched.maritalStatusId && form.errors.maritalStatusId)}
                                                            helperText={form.touched.maritalStatusId && form.errors.maritalStatusId}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>

                                    </MDBox>
                                    <MDBox display='flex' gap={5}>
                                        <Field name="employee.genderId">
                                            {({field, form}) => (
                                                <Autocomplete
                                                    options={gender}
                                                    getOptionLabel={(option) => option.title || ''}
                                                    value={gender.find(item => item.id === field.value) || null}
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(field.name, newValue ? newValue.id : '');
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Cinsi"
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(form.touched.genderId && form.errors.genderId)}
                                                            helperText={form.touched.genderId && form.errors.genderId}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                        <Field name="employee.dsmfCardNo">
                                            {({field, form}) => (
                                                <MDInput
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    placeholder="DSMF Kart no"
                                                    sx={{width: "100%"}}
                                                    error={Boolean(form.touched.dsmfCardNumber && form.errors.dsmfCardNumber)}
                                                    helperText={form.touched.dsmfCardNumber && form.errors.dsmfCardNumber}
                                                    onBlur={field.onBlur}
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                    <MDBox display='flex' gap={5}>
                                        <Field name="employee.note">
                                            {({field, form}) => (
                                                <MDInput
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    placeholder="Qeyd"
                                                    sx={{width: "100%"}}
                                                    error={Boolean(form.touched.note && form.errors.note)}
                                                    helperText={form.touched.note && form.errors.note}
                                                    onBlur={field.onBlur}
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                );
            case 1:
                return (
                    <MDBox mt={2}>
                        <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                            <Typography variant="body1">Vəzifə</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        <MDBox sx={{
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "border-color 0.2s",
                            "&:hover": {
                                borderColor: "#B0B8C1",
                            },
                            color: "#8B95A1",
                            textAlign: "center",
                        }}>
                            <MDBox display="flex" flexDirection="column" gap={5} mt={4} mb={4} px={2}>
                                <MDBox display='flex' gap={5}>
                                    <Field name='empPosition.depId'>
                                        {({field, form}) => (
                                            <Autocomplete
                                                options={depList}
                                                getOptionLabel={(option) => option.depTitle || ''}
                                                value={depList.find(item => Number(item.depId) === Number(field.value)) || null}
                                                onChange={async (e, newValue) => {
                                                    form.setFieldValue(field.name, newValue ? Number(newValue.depId) : '');
                                                    if (newValue) {
                                                        await fetchPosList(newValue.depId);
                                                    } else {
                                                        setPosList([]);
                                                    }
                                                    form.setFieldValue('empPosition.posId', null);
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        placeholder="Struktur qurum"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(form.touched.empPosition?.depId && form.errors.empPosition?.depId)}
                                                        helperText={form.touched.empPosition?.depId && form.errors.empPosition?.depId}
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>
                                    <Field name="empPosition.procedureTypeId">
                                        {({field, form}) => (
                                            <Autocomplete
                                                options={procedureTypes}
                                                getOptionLabel={(option) => option.title || ''}
                                                value={procedureTypes.find(item => item.id === field.value) || null}
                                                onChange={(e, newValue) => {
                                                    form.setFieldValue(field.name, newValue ? newValue.id : '');
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        placeholder="Əməliyyat növü"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(form.touched.empPosition?.procedureTypeId && form.errors.empPosition?.procedureTypeId)}
                                                        helperText={form.touched.empPosition?.procedureTypeId && form.errors.empPosition?.procedureTypeId}
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>

                                    <Field name='empPosition.posId'>
                                        {({field, form}) => (
                                            <Autocomplete
                                                options={posList}
                                                getOptionLabel={(option) => option.title || ''}
                                                value={posList.find(item => item.id === field.value) || null}
                                                onChange={(e, newValue) => {
                                                    form.setFieldValue(field.name, newValue ? Number(newValue.id) : '');
                                                    form.setFieldValue('empPosition.posId', newValue?.id || '');
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        placeholder="Vəzifə"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(form.touched.empPosition?.posId && form.errors.empPosition?.posId)}
                                                        helperText={form.touched.empPosition?.posId && form.errors.empPosition?.posId}
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>
                                </MDBox>
                                <MDBox display='flex' gap={5}>
                                    <Field name="empPosition.trialPeriodId">
                                        {({field, form}) => (
                                            <Autocomplete
                                                options={trialPeriods}
                                                getOptionLabel={(option) => option.title || ''}
                                                value={trialPeriods.find(item => item.id === field.value) || null}
                                                onChange={(e, newValue) => {
                                                    form.setFieldValue(field.name, newValue ? newValue.id : '');
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        placeholder="Sınaq müddəti"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(form.touched.empPosition?.trialPeriodId && form.errors.empPosition?.trialPeriodId)}
                                                        helperText={form.touched.empPosition?.trialPeriodId && form.errors.empPosition?.trialPeriodId}
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>

                                    <Field name="empPosition.startDate">
                                        {({field, form}) => (
                                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                                <DatePicker
                                                    label="Başladığı tarix"
                                                    format="DD-MM-YYYY"
                                                    inputFormat="DD-MM-YYYY"
                                                    value={field.value || null}
                                                    onChange={(value) => form.setFieldValue(field.name, value)}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            required
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(form.touched.empPosition?.startDate && form.errors.empPosition?.startDate)}
                                                            helperText={form.touched.empPosition?.startDate && form.errors.empPosition?.startDate}
                                                            name={field.name}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Field>
                                    <Field name="empPosition.endDate">
                                        {({field, form}) => (
                                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                                <DatePicker
                                                    label="Bitiş tarixi"
                                                    format="DD-MM-YYYY"
                                                    inputFormat="DD-MM-YYYY"
                                                    value={field.value || null}
                                                    onChange={(value) => form.setFieldValue(field.name, value)}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            required
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(form.touched.empPosition?.endDate && form.errors.empPosition?.endDate)}
                                                            helperText={form.touched.empPosition?.endDate && form.errors.empPosition?.endDate}
                                                            name={field.name}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Field>

                                    <Field name="empPosition.contractTermId">
                                        {({field, form}) => (
                                            <Autocomplete
                                                options={contractTerms}
                                                getOptionLabel={(option) => option.title || ''}
                                                value={contractTerms.find(item => item.id === field.value) || null}
                                                onChange={(e, newValue) => {
                                                    form.setFieldValue(field.name, newValue ? newValue.id : '');
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        placeholder="Müqavilə müddəti"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(form.touched.empPosition?.contractTermId && form.errors.empPosition?.contractTermId)}
                                                        helperText={form.touched.empPosition?.contractTermId && form.errors.empPosition?.contractTermId}
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                );
            case 2:
                return (
                    <MDBox>
                        <MDBox display="flex" justifyContent="center" alignItems="center" gap={1}>
                            <Typography variant="body1">İş təcrübəsi</Typography>
                            <MDBox flex={1} sx={{borderBottom: '2px solid #E5E9EF'}}/>
                        </MDBox>

                        <MDBox mt={4} mb={4} px={2} display="flex" flexDirection="column" gap={5}>
                            <MDBox display="flex" gap={5}>
                                <Field name="empJobExperiences.companyName">
                                    {({field, form}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="İşlədiyi qurum"
                                            sx={{width: '100%'}}
                                            error={Boolean(
                                                form.touched.empJobExperiences?.companyName &&
                                                form.errors.empJobExperiences?.companyName
                                            )}
                                            helperText={
                                                form.touched.empJobExperiences?.companyName &&
                                                form.errors.empJobExperiences?.companyName
                                            }
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                </Field>

                                <Field name="empJobExperiences.departmentUnit">
                                    {({field, form}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="İdarə və ya şöbə"
                                            sx={{width: '100%'}}
                                            error={Boolean(
                                                form.touched.empJobExperiences?.departmentUnit &&
                                                form.errors.empJobExperiences?.departmentUnit
                                            )}
                                            helperText={
                                                form.touched.empJobExperiences?.departmentUnit &&
                                                form.errors.empJobExperiences?.departmentUnit
                                            }
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                </Field>

                                <Field name="empJobExperiences.position">
                                    {({field, form}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="Vəzifə"
                                            sx={{width: '100%'}}
                                            error={Boolean(
                                                form.touched.empJobExperiences?.position &&
                                                form.errors.empJobExperiences?.position
                                            )}
                                            helperText={
                                                form.touched.empJobExperiences?.position &&
                                                form.errors.empJobExperiences?.position
                                            }
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                </Field>
                            </MDBox>

                            <MDBox display="flex" gap={5}>
                                <Field name="empJobExperiences.startDate">
                                    {({field, form}) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                            <DatePicker
                                                label="Başladığı tarix"
                                                format="DD-MM-YYYY"
                                                inputFormat="DD-MM-YYYY"
                                                value={field.value || null}
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        required
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(
                                                            form.touched.empJobExperiences?.startDate &&
                                                            form.errors.empJobExperiences?.startDate
                                                        )}
                                                        helperText={
                                                            form.touched.empJobExperiences?.startDate &&
                                                            form.errors.empJobExperiences?.startDate
                                                        }
                                                        name={field.name}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                </Field>

                                <Field name="empJobExperiences.endDate">
                                    {({field, form}) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                            <DatePicker
                                                label="Bitiş tarixi"
                                                format="DD-MM-YYYY"
                                                inputFormat="DD-MM-YYYY"
                                                value={field.value || null}
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        required
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(
                                                            form.touched.empJobExperiences?.endDate &&
                                                            form.errors.empJobExperiences?.endDate
                                                        )}
                                                        helperText={
                                                            form.touched.empJobExperiences?.endDate &&
                                                            form.errors.empJobExperiences?.endDate
                                                        }
                                                        name={field.name}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                </Field>
                            </MDBox>
                        </MDBox>
                    </MDBox>


                );
            case 3:
                return (
                    <MDBox>
                        <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                            <Typography variant="body1">Ailə üzvü</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>

                        <MDBox mt={4} mb={4} px={2} display="flex" flexDirection="column" gap={5}>
                            <MDBox display="flex" gap={5}>
                                <Field name="empFamilyMembers.kinshipTypeId">
                                    {({field, form}) => (
                                        <Autocomplete
                                            options={kinshipTypes}
                                            getOptionLabel={(option) => option?.title || ""}
                                            value={kinshipTypes.find((item) => item.id === field.value) || null}
                                            onChange={(e, newValue) => form.setFieldValue(field.name, newValue?.id || "")}
                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Növü"
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                />
                                            )}
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>

                                <Field name="empFamilyMembers.name">
                                    {({field}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="Adı"
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>

                                <Field name="empFamilyMembers.surname">
                                    {({field}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="Soyadı"
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>

                                <Field name="empFamilyMembers.fatherName">
                                    {({field}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="Ata adı"
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>
                            </MDBox>

                            <MDBox display="flex" gap={5}>
                                <Field name="empFamilyMembers.birthdate">
                                    {({field, form}) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                            <DatePicker
                                                label="Doğum tarixi"
                                                format="DD-MM-YYYY"
                                                inputFormat="DD-MM-YYYY"
                                                value={field.value || null}
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        required
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(form.touched.empFamilyMembers?.birthdate && form.errors.empFamilyMembers?.birthdate)}
                                                        helperText={form.touched.empFamilyMembers?.birthdate && form.errors.empFamilyMembers?.birthdate}
                                                        name={field.name}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                </Field>

                                <Field name="empFamilyMembers.workPlace">
                                    {({field}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="İşlədiyi müəssisə"
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>

                                <MDBox display="flex" alignItems="center" gap={1}>
                                    <MDTypography variant="body2" fontSize={14}>
                                        Sağlamlıq məhdudiyyəti
                                    </MDTypography>
                                    <Field name="empFamilyMembers.disabilityStatus">
                                        {({field, form}) => (
                                            <Switch
                                                checked={!!field.value}
                                                onChange={(e) => form.setFieldValue(field.name, e.target.checked)}
                                            />
                                        )}
                                    </Field>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                    </MDBox>


                );
            case 4:
                return (
                    <MDBox>
                        <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                            <Typography variant="body1">Təhsil</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        <MDBox mt={4} mb={4} px={2} display="flex" flexDirection="column" gap={3}>
                            <MDBox display="flex" gap={3}>
                                <Field name="educationRequestDto.educationTypeId">
                                    {({field}) => (
                                        <Autocomplete
                                            options={educationTypes}
                                            disabled={location.state.type !== 'education'}
                                            getOptionLabel={(option) => option.title || ""}
                                            value={educationTypes.find((item) => item.id === field.value) || null}
                                            onChange={(_, value) =>
                                                formik.setFieldValue(field.name, value ? value.id : null)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Növü"
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                    fullWidth
                                                />
                                            )}
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>

                                <Field name="educationRequestDto.profession">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            disabled={location.state.type !== 'education'}
                                            label="İxtisas"
                                            variant="standard"
                                            InputLabelProps={{shrink: true}}
                                            fullWidth
                                        />
                                    )}
                                </Field>

                                <Field name="educationRequestDto.entryScore">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            disabled={location.state.type !== 'education'}
                                            label="Qəbul balı"
                                            type="number"
                                            InputLabelProps={{shrink: true}}
                                            variant="standard"
                                            fullWidth
                                        />
                                    )}
                                </Field>
                            </MDBox>

                            <MDBox display="flex" gap={3}>
                                <Field name="educationRequestDto.countryId">
                                    {({field}) => (
                                        <Autocomplete
                                            options={regions.filter((r) => r.regionTypeId === 1)}
                                            disabled={location.state.type !== 'education'}
                                            getOptionLabel={(option) => option.region || ""}
                                            value={regions.find((item) => item.regionId === field.value) || null}
                                            onChange={(_, value) =>
                                                formik.setFieldValue(field.name, value ? value.regionId : null)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Ölkə"
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                    fullWidth

                                                />
                                            )}
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>

                                <Field name="educationRequestDto.schoolName">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="Təhsil müəssisəsinin adı"
                                            disabled={location.state.type !== 'education'}
                                            InputLabelProps={{shrink: true}}
                                            variant="standard"
                                            fullWidth

                                        />
                                    )}
                                </Field>

                                <Field name="educationRequestDto.gpuResult">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="GPU Balı"
                                            variant="standard"
                                            InputLabelProps={{shrink: true}}
                                            disabled={location.state.type !== 'education'}
                                            type="number"
                                            variant="standard"
                                            fullWidth
                                        />
                                    )}
                                </Field>
                            </MDBox>

                            <MDBox display="flex" gap={5}>
                                <Field name="educationRequestDto.startDate">
                                    {({field, form}) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                            <DatePicker
                                                label="Başladığı tarix"
                                                format="DD-MM-YYYY"
                                                disabled={location.state.type !== 'education'}
                                                value={field.value || null}
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        fullWidth
                                                        InputLabelProps={{shrink: true}}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                </Field>

                                <Field name="educationRequestDto.endDate">
                                    {({field, form}) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                            <DatePicker
                                                label="Bitdiyi tarix"
                                                format="DD-MM-YYYY"
                                                disabled={location.state.type !== 'education'}
                                                value={field.value || null}
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        fullWidth
                                                        InputLabelProps={{shrink: true}}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                </Field>
                            </MDBox>
                        </MDBox>
                        <MDBox display='flex' justifyContent='center' alignItems='center' gap={1} mt={5}>
                            <Typography variant="body1">Kurs və sertifikatlar</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        <MDBox mt={4} mb={4} px={2} display="flex" flexDirection="column" gap={5}>
                            <MDBox display="flex" gap={5}>
                                <Field name={`courseCertificateRequestDto.courseName`}>
                                    {({field, meta}) => (
                                        <TextField
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            disabled={location.state.type !== 'course'}
                                            InputLabelProps={{shrink: true}}
                                            placeholder="Kursun adı"
                                            sx={{width: "100%"}}
                                            error={Boolean(meta.touched && meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>

                                <Field name={`courseCertificateRequestDto.startDate`}>
                                    {({field, form}) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                            <DatePicker
                                                label="Başladığı tarix"
                                                format="DD-MM-YYYY"
                                                disabled={location.state.type !== 'course'}
                                                inputFormat="DD-MM-YYYY"
                                                value={field.value || null}
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        name={field.name}
                                                        error={Boolean(
                                                            form.touched.courseCertificateRequestDto?.startDate &&
                                                            form.errors.courseCertificateRequestDto?.startDate
                                                        )}
                                                        helperText={
                                                            form.touched.courseCertificateRequestDto?.startDate &&
                                                            form.errors.courseCertificateRequestDto?.startDate
                                                        }
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                </Field>

                                <Field name={`courseCertificateRequestDto.endDate`}>
                                    {({field, form}) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                                            <DatePicker
                                                label="Bitdiyi tarix"
                                                format="DD-MM-YYYY"
                                                disabled={location.state.type !== 'course'}
                                                inputFormat="DD-MM-YYYY"
                                                value={field.value || null}
                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        name={field.name}
                                                        error={Boolean(
                                                            form.touched.courseCertificateRequestDto?.endDate &&
                                                            form.errors.courseCertificateRequestDto?.endDate
                                                        )}
                                                        helperText={
                                                            form.touched.courseCertificateRequestDto?.endDate &&
                                                            form.errors.courseCertificateRequestDto?.endDate
                                                        }
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                </Field>
                            </MDBox>

                            <MDBox
                                sx={{
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
                                }}
                            >
                                <input
                                    type="file"
                                    style={{display: "none"}}
                                    id="certification-upload"
                                    disabled={location.state.type !== 'course'}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        try {
                                            const uploadedFileId = await uploadFileWithAuth(file);
                                            formik.setFieldValue(`courseCertificateRequestDto.certificateFileId`, uploadedFileId);
                                        } catch (error) {
                                            console.error("Fayl yükləmə xətası", error);
                                        }
                                    }}
                                />
                                <label htmlFor="certification-upload" style={{width: "100%", cursor: "pointer"}}>
                                    <MDBox display="flex" flexDirection="row" gap={2} alignItems="center"
                                           justifyContent="center">
                                        <img src={upload} alt="upload"
                                             style={{width: "32px", height: "32px", marginBottom: "8px"}}/>
                                        <MDTypography variant="button" color="text" fontWeight="regular">
                                            Sertifikat yüklə
                                        </MDTypography>
                                    </MDBox>
                                </label>
                            </MDBox>
                        </MDBox>
                        <MDBox mt={4} mb={4} px={2} display="flex" flexDirection="column" gap={5}>
                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                <Typography variant="body1">Dil bilikləri</Typography>
                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                            </MDBox>
                            <MDBox display="flex" gap={5}>
                                <Field name="langSkillRequestDto.skillId">
                                    {({field, form}) => (
                                        <Autocomplete
                                            options={languageType}
                                            disabled={location.state.type !== 'lang'}
                                            getOptionLabel={(option) => option.title || ''}
                                            value={languageType.find(item => item.id === field.value) || null}
                                            onChange={(e, newValue) => {
                                                form.setFieldValue(field.name, newValue ? newValue.id : '');
                                            }}
                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Dil"
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                    error={Boolean(
                                                        form.touched.langSkillRequestDto?.languageTypeId &&
                                                        form.errors.langSkillRequestDto?.languageTypeId
                                                    )}
                                                    helperText={
                                                        form.touched.langSkillRequestDto?.languageTypeId &&
                                                        form.errors.langSkillRequestDto?.languageTypeId
                                                    }
                                                />
                                            )}
                                            sx={{width: '100%'}}
                                        />
                                    )}
                                </Field>

                                <Field name="langSkillRequestDto.levelId">
                                    {({field, form}) => (
                                        <Autocomplete
                                            options={langLevel}
                                            disabled={location.state.type !== 'lang'}
                                            getOptionLabel={(option) => option.title || ''}
                                            value={langLevel.find(item => item.id === field.value) || null}
                                            onChange={(e, newValue) => {
                                                form.setFieldValue(field.name, newValue ? newValue.id : '');
                                            }}
                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    placeholder="Səviyyə"
                                                    InputLabelProps={{shrink: true}}
                                                    error={Boolean(
                                                        form.touched.langSkillRequestDto?.level &&
                                                        form.errors.langSkillRequestDto?.level
                                                    )}
                                                    helperText={
                                                        form.touched.langSkillRequestDto?.level &&
                                                        form.errors.langSkillRequestDto?.level
                                                    }
                                                />
                                            )}
                                            sx={{width: '100%'}}
                                        />
                                    )}
                                </Field>
                            </MDBox>
                        </MDBox>
                        <MDBox mt={4} mb={4} px={2} display="flex" flexDirection="column" gap={5}>
                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                <Typography variant="body1">Komputer bilikləri</Typography>
                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                            </MDBox>
                            <MDBox display="flex" gap={5}>
                                <Field name="compSkillRequestDto.skillId">
                                    {({field, form}) => (
                                        <Autocomplete
                                            options={computerSkill}
                                            disabled={location.state.type !== 'comp'}
                                            getOptionLabel={(option) => option.title || ''}
                                            value={computerSkill.find(item => item.id === field.value) || null}
                                            onChange={(e, newValue) => {
                                                form.setFieldValue(field.name, newValue ? newValue.id : '');
                                            }}
                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    placeholder="Komputer proqramının adı"
                                                    InputLabelProps={{shrink: true}}
                                                    error={Boolean(
                                                        form.touched.compSkillRequestDto?.computerSkillId &&
                                                        form.errors.compSkillRequestDto?.computerSkillId
                                                    )}
                                                    helperText={
                                                        form.touched.compSkillRequestDto?.computerSkillId &&
                                                        form.errors.compSkillRequestDto?.computerSkillId
                                                    }
                                                />
                                            )}
                                            sx={{width: '100%'}}
                                        />
                                    )}
                                </Field>

                                <Field name="compSkillRequestDto.levelId">
                                    {({field, form}) => (
                                        <Autocomplete
                                            options={compLevel}
                                            disabled={location.state.type !== 'comp'}
                                            getOptionLabel={(option) => option.title || ''}
                                            value={compLevel.find(item => item.id === field.value) || null}
                                            onChange={(e, newValue) => {
                                                form.setFieldValue(field.name, newValue ? newValue.id : '');
                                            }}
                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Səviyyə"
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                    error={Boolean(
                                                        form.touched.compSkillRequestDto?.level &&
                                                        form.errors.compSkillRequestDto?.level
                                                    )}
                                                    helperText={
                                                        form.touched.compSkillRequestDto?.level &&
                                                        form.errors.compSkillRequestDto?.level
                                                    }
                                                />
                                            )}
                                            sx={{width: '100%'}}
                                        />
                                    )}
                                </Field>
                            </MDBox>
                        </MDBox>

                    </MDBox>
                );
            case 5:
                return (
                    <MDBox>
                        <MDBox display="flex" justifyContent="center" alignItems="center" gap={1} mt={5}>
                            <Typography variant="body1">Hərbi mükəlləfiyyət</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>

                        <MDBox mt={4} mb={4} px={2} display="flex" flexDirection="column" gap={5}>
                            <MDBox display="flex" gap={5}>
                                <Field name="empMilitaryObligations.militaryObligationId">
                                    {({field, form}) => (
                                        <Autocomplete
                                            options={militaryObligation}
                                            getOptionLabel={(option) => option.title || ''}
                                            value={militaryObligation.find(opt => opt.id === field.value) || null}
                                            onChange={(e, newValue) => {
                                                form.setFieldValue(field.name, newValue ? newValue.id : '');
                                            }}
                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Hərbi mükəlləfiyyət"
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                    error={Boolean(form.touched.empMilitaryObligations?.militaryObligationId && form.errors.empMilitaryObligations?.militaryObligationId)}
                                                    helperText={form.touched.empMilitaryObligations?.militaryObligationId && form.errors.empMilitaryObligations?.militaryObligationId}
                                                />
                                            )}
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>

                                <Field name="empMilitaryObligations.militaryRankId">
                                    {({field, form}) => (
                                        <Autocomplete
                                            options={militaryRank}
                                            getOptionLabel={(option) => option.title || ''}
                                            value={militaryRank.find(opt => opt.id === field.value) || null}
                                            onChange={(e, newValue) => {
                                                form.setFieldValue(field.name, newValue ? newValue.id : '');
                                            }}
                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Rütbə"
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                    error={Boolean(form.touched.empMilitaryObligations?.militaryRankId && form.errors.empMilitaryObligations?.militaryRankId)}
                                                    helperText={form.touched.empMilitaryObligations?.militaryRankId && form.errors.empMilitaryObligations?.militaryRankId}
                                                />
                                            )}
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>
                            </MDBox>

                            <MDBox display="flex" gap={5}>
                                <Field name="empMilitaryObligations.note">
                                    {({field, meta}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="Qeyd"
                                            sx={{width: "100%"}}
                                            error={Boolean(meta.touched && meta.error)}
                                            helperText={meta.touched && meta.error}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                </Field>
                            </MDBox>
                        </MDBox>
                    </MDBox>


                );
            case 6:
                return (
                    <MDBox>
                        <MDBox display="flex" justifyContent="center" alignItems="center" gap={1} mt={5}>
                            <Typography variant="body1">Əlaqə məlumatları</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>

                        <MDBox mt={4} mb={4} px={2} display="flex" flexDirection="column" gap={5}>
                            <MDBox display="flex" gap={5}>
                                <Field name="empContacts.contactTypeId">
                                    {({field, form}) => (
                                        <Autocomplete
                                            options={contactTypes}
                                            getOptionLabel={(option) => option.title || ''}
                                            value={contactTypes.find(opt => opt.id === field.value) || null}
                                            onChange={(e, newValue) => {
                                                form.setFieldValue(field.name, newValue ? newValue.id : '');
                                            }}
                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    placeholder="Əlaqə növü"
                                                    InputLabelProps={{shrink: true}}
                                                    error={Boolean(form.touched.empContacts?.contactTypeId && form.errors.empContacts?.contactTypeId)}
                                                    helperText={form.touched.empContacts?.contactTypeId && form.errors.empContacts?.contactTypeId}
                                                />
                                            )}
                                            sx={{width: "100%"}}
                                        />
                                    )}
                                </Field>

                                <Field name="empContacts.contact">
                                    {({field, meta}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="Əlaqə"
                                            sx={{width: "100%"}}
                                            error={Boolean(meta.touched && meta.error)}
                                            helperText={meta.touched && meta.error}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                </Field>
                            </MDBox>

                            <MDBox display="flex" gap={5}>
                                <Field name="empContacts.note">
                                    {({field, meta}) => (
                                        <MDInput
                                            {...field}
                                            variant="standard"
                                            type="text"
                                            placeholder="Qeyd"
                                            sx={{width: "100%"}}
                                            error={Boolean(meta.touched && meta.error)}
                                            helperText={meta.touched && meta.error}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                </Field>
                            </MDBox>
                        </MDBox>
                    </MDBox>

                );
            case 7:
                return (
                    <MDBox>
                        <MDBox display='flex' justifyContent='center' alignItems='center' gap={1} mt={5}>
                            <Typography variant="body1">Rol təyinatı</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        <MDBox mt={5} gap={5}>
                            <Field name='empRoles.roleId'>
                                {({field, form}) => (
                                    <Autocomplete
                                        options={roles}
                                        getOptionLabel={(option) => option.title || ''}
                                        value={roles.find(opt => opt.id === field.value) || null}
                                        onChange={(e, newValue) => {
                                            form.setFieldValue(field.name, newValue ? newValue.id : '');
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                placeholder="Rollar"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        )}
                                        sx={{width: "100%"}}
                                    />

                                )}
                            </Field>
                        </MDBox>
                    </MDBox>
                )
                    ;
            default:
                return "Naməlum addım";
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {(formik) => (
                <Form>
                    <DashboardLayout>
                        <DashboardNavbar/>
                        <MDBox py={3} mb={20}>
                            <Box sx={{width: "100%"}}>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>

                                <MDBox mt={4}>
                                    {renderStepContent(activeStep, formik)}


                                    <MDBox mt={4} display="flex" justifyContent="space-between">
                                        <MDBox display='flex' gap={2}>
                                            <MDButton
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => navigate(`/modules/employees/edit/${location.state.employeeId}`)}
                                            >
                                                İmtina et
                                            </MDButton>
                                        </MDBox>
                                        <MDButton
                                            type="submit"
                                            onClick={() => {
                                                handleSubmit(formik.values);
                                            }}
                                            sx={{
                                                boxShadow: "none",
                                                "&:hover": {
                                                    boxShadow: "none",
                                                },
                                            }}
                                            variant="gradient" color="primary">
                                            Təsdiqlə
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                            </Box>
                        </MDBox>
                    </DashboardLayout>
                </Form>
            )}
        </Formik>
    );

}

export default EditTabItems;