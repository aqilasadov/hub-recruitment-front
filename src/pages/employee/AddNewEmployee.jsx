import MDBox from "../../components/MDBox";
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Autocomplete,
    FormControlLabel,
    Switch,
    TextField,
    IconButton,
} from "@mui/material";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";
import {useContext, useEffect, useState} from "react";
import upload from "../../assets/images/icons/cloud-upload.svg";
import MDTypography from "../../components/MDTypography";
import FormField from "../../layouts/applications/wizard/components/FormField";
import AddIcon from "@mui/icons-material/Add";
import {useLocation, useNavigate} from "react-router-dom";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import {StoreContext} from "../../context/StoreContext";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify";
import Loader from "../../components/loader/Loader";
import validationSchema from "./validationSchema";
import DeleteIcon from "@mui/icons-material/Delete";

const steps = [
    "Şəxsİ məlumatlar",
    "İş təcrübəsİ",
    "Aİlə üzvlərİ",
    "Təhsİl və bacarıqlar",
    "Hərbİ mükəlləfİyyət",
    "Əlaqə məlumatları",
    "CV'lərim",
];

function NewEmployee() {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [experiences, setExperiences] = useState([{id: Date.now()}]);
    const [familyMembers, setFamilyMembers] = useState([{id: Date.now()}]);
    const [course, setCourse] = useState([{id: Date.now()}]);
    const [language, setLanguage] = useState([{id: Date.now()}]);
    const [computerSkills, setComputerSkills] = useState([{id: Date.now()}]);
    const [militaryConscripts, setMilitaryConscripts] = useState([
        {id: Date.now()},
    ]);
    const [contactDetail, setContactDetail] = useState([{id: Date.now()}]);
    const [employeeList, setEmployeeList] = useState([]);
    const [langLevel, setLangLevel] = useState([]);
    const [compLevel, setCompLevel] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const {
        gender,
        bloodType,
        identityDocs,
        maritalStatuses,
        regions,
        kinshipTypes,
        educationTypes,
        languageType,
        computerSkill,
        militaryObligation,
        militaryRank,
        contactTypes,
        authorities,
    } = useContext(StoreContext);
    const initialValues = {
        employee: {
            firstName: "",
            lastName: "",
            fatherName: "",
            username: "",
            tableNumber: null,
            identityDocId: null,
            docNumber: "",
            authorityId: null,
            dateOfIssue: "",
            dateOfExpire: "",
            fin: "",
            bloodTypeId: null,
            birthDate: null,
            birthplaceId: null,
            regAddr: "",
            curAddr: "",
            countryId: null,
            maritalStatusId: null,
            genderId: null,
             note: "",
        },
        empEducationAndSkills: {
            educationRequestDto: [
                {
                    educationTypeId: null,
                    schoolName: "",
                    profession: "",
                    entryScore: null,
                    gpuResult: null,
                    countryId: null,
                    startDate: null,
                    endDate: null,
                },
            ],
            courseCertificateRequestDto: [
                {
                    courseName: "",
                    startDate: null,
                    endDate: null,
                    certificateFileId: null,
                },
            ],
            langSkillRequestDto: [
                {
                    languageTypeId: null,
                    levelId: null,
                },
            ],
            compSkillRequestDto: [
                {
                    computerSkillId: null,
                    levelId: null,
                },
            ],
        },
        empMilitaryObligations: [
            {
                militaryObligationId: null,
                militaryRankId: null,
                note: "",
            },
        ],
        empContacts: [
            {
                contact: "",
                contactTypeId: null,
                note: "",
            },
        ],
        empJobExperiences: [
            {
                companyName: "",
                departmentUnit: "",
                position: "",
                startDate: null,
                endDate: null,
            },
        ],
        empFamilyMembers: [
            {
                kinshipTypeId: null,
                name: "",
                surname: "",
                fatherName: "",
                birthdate: null,
                workPlace: "",
                disabilityStatus: false,
            },
        ],
        cv: [],
    };

    const [initialNewValues, setInitialNewValues] = useState({
        isNewWorkExperience: false,
        isNewFamilyMembers: false,
        isNewEducation: false,
        isNewCourse: false,
        isNewLang: false,
        isNewComp: false,
        isNewMilitaryObligation: false,
        isNewContact: false,
    });

    useEffect(() => {
        console.log("location.state", location.state);
        if (location.state) {
            const {stepIndex, id} = location.state;
            if (stepIndex !== undefined) {
                setActiveStep(stepIndex);
            }
            if (id !== undefined) {
                setSelectedId(id);
            }
        }
    }, [location.state]);

    useEffect(() => {
        console.log("selectedId", selectedId);
    }, [selectedId]);

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


    const fetchLangLevelList = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/skills/language-level`);
            if (response.status >= 200 && response.status < 300) {
                setLangLevel(response.data);
            }
        } catch (error) {
            toast.error(error);
        }
    };
    const fetchCompLevelList = async () => {
        try {
            const response = await apiClient.get(`${baseURL}/skills/comp`);
            if (response.status >= 200 && response.status < 300) {
                setCompLevel(response.data);
            }
        } catch (error) {
            toast.error(error);
        }
    };


    const handleAddExperience = (formik) => {
        setInitialNewValues((prev) => ({
            ...prev,
            isNewWorkExperience: true,
        }));
        setExperiences([...experiences, {id: Date.now()}]);
        const newExperience = {
            companyName: "",
            departmentUnit: "",
            position: "",
            startDate: null,
            endDate: null,
        };
        formik.setFieldValue("empJobExperiences", [
            ...formik.values.empJobExperiences,
            newExperience,
        ]);
    };

    const handleAddFamilyMembers = (formik) => {
        setInitialNewValues((prev) => ({
            ...prev,
            isNewFamilyMembers: true,
        }));
        setFamilyMembers([...familyMembers, {id: Date.now()}]);

        const newFamilyMembers = {
            kinshipTypeId: null,
            name: "",
            surname: "",
            fatherName: "",
            birthdate: null,
            workPlace: "",
            disabilityStatus: null,
        };
        formik.setFieldValue("empFamilyMembers", [
            ...formik.values.empFamilyMembers,
            newFamilyMembers,
        ]);
    };

    const handleAddContactDetail = (formik) => {
        setInitialNewValues((prev) => ({
            ...prev,
            isNewContact: true,
        }));
        setContactDetail([...contactDetail, {id: Date.now()}]);
        const newContact = {
            contact: "",
            contactTypeId: null,
        };
        formik.setFieldValue("empContacts", [
            ...formik.values.empContacts,
            newContact,
        ]);
    };

    const handleAddMilitaryConscripts = (formik) => {
        setInitialNewValues((prev) => ({
            ...prev,
            isNewMilitaryObligation: true,
        }));
        setMilitaryConscripts([...militaryConscripts, {id: Date.now()}]);
        const newMilitaryConscripts = {
            militaryObligationId: null,
            militaryRankId: null,
            note: "",
        };
        formik.setFieldValue("empMilitaryObligations", [
            ...formik.values.empMilitaryObligations,
            newMilitaryConscripts,
        ]);
    };

    const handleAddEducation = (formik) => {
        setInitialNewValues((prev) => ({
            ...prev,
            isNewEducation: true,
        }));
        const newEdu = {
            educationTypeId: null,
            schoolName: "",
            profession: "",
            entryScore: null,
            gpuResult: null,
            countryId: null,
            startDate: null,
            endDate: null,
        };

        formik.setFieldValue("empEducationAndSkills.educationRequestDto", [
            ...formik.values.empEducationAndSkills.educationRequestDto,
            newEdu,
        ]);
    };

    const handleAddCourse = (formik) => {
        setInitialNewValues((prev) => ({
            ...prev,
            isNewCourse: true,
        }));
        setCourse([...course, {id: Date.now()}]);
        const newCourse = {
            courseName: "",
            startDate: null,
            endDate: null,
            certificateFileId: null,
        };

        formik.setFieldValue("empEducationAndSkills.courseCertificateRequestDto", [
            ...formik.values.empEducationAndSkills.courseCertificateRequestDto,
            newCourse,
        ]);
    };

    const handleAddLanguage = (formik) => {
        setInitialNewValues((prev) => ({
            ...prev,
            isNewLang: true,
        }));
        setLanguage([...language, {id: Date.now()}]);
        const newLang = {
            skillId: null,
            levelId: null,
        };

        formik.setFieldValue("empEducationAndSkills.langSkillRequestDto", [
            ...formik.values.empEducationAndSkills.langSkillRequestDto,
            newLang,
        ]);
    };

    const handleAddComputerSkill = (formik) => {
        setInitialNewValues((prev) => ({
            ...prev,
            isNewComp: true,
        }));
        setComputerSkills([...computerSkills, {id: Date.now()}]);
        const newComp = {
            skillId: null,
            levelId: null,
        };

        formik.setFieldValue("empEducationAndSkills.compSkillRequestDto", [
            ...formik.values.empEducationAndSkills.compSkillRequestDto,
            newComp,
        ]);
    };


    const flattenErrors = (errors, prefix = "") => {
        if (!errors) return {};

        if (typeof errors === "string") {
            return {[prefix]: errors};
        }

        if (Array.isArray(errors)) {
            return errors.reduce((acc, err, idx) => {
                const nested = flattenErrors(err, `${prefix}[${idx}]`);
                return {...acc, ...nested};
            }, {});
        }

        if (typeof errors === "object") {
            return Object.entries(errors).reduce((acc, [key, value]) => {
                const path = prefix ? `${prefix}.${key}` : key;
                return {...acc, ...flattenErrors(value, path)};
            }, {});
        }

        return {};
    };

    const handleRemoveItem = (fieldNamePath, index, formik) => {
        const keys = fieldNamePath.split(".");

        let arr = formik.values;
        for (const key of keys) {
            if (arr && typeof arr === "object") {
                arr = arr[key];
            } else {
                arr = undefined;
                break;
            }
        }

        if (!Array.isArray(arr)) {
            console.error(
                `Error: '${fieldNamePath}' is not an array in formik.values.`
            );
            return;
        }

        const newArr = [...arr];
        newArr.splice(index, 1);

        formik.setFieldValue(fieldNamePath, newArr);
    };

    const getStepTouchedFields = (step) => {
        switch (step) {
            case 0:
                return [
                    "employee.tableNumber",
                    "employee.firstName",
                    "employee.lastName",
                    "employee.identityDocId",
                    "employee.birthDate",
                    "employee.dateOfIssue",
                    "employee.dateOfIssue",
                    "employee.dateOfExpire",
                    "employee.ownerEmpId",
                    "employee.regAddr",
                ];
            case 1:
                return ["empJobExperiences"];
            case 2:
                return ["empFamilyMembers"];
            case 3:
                return [
                    "empEducationAndSkills.educationRequestDto",
                    "empEducationAndSkills.langSkillRequestDto",
                    "empEducationAndSkills.courseCertificateRequestDto",
                    "empEducationAndSkills.compSkillRequestDto",
                ];
            case 4:
                return ["empMilitaryObligations"];
            case 5:
                return ["empContacts"];
            case 6:
                return ["cv"];
            default:
                return [];
        }
    };
    const setNestedValue = (obj, path, value) => {
        const keys = path
            .replace(/\[(\d+)\]/g, ".$1") // [0] => .0
            .split(".");
        let current = obj;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i === keys.length - 1) {
                current[key] = value;
            } else {
                if (!current[key] || typeof current[key] !== "object") {
                    current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
                }
                current = current[key];
            }
        }
    };

    const handleNext = async (formik) => {
        console.log("step", activeStep);
        const errors = await formik.validateForm();
        const flatErrors = flattenErrors(errors);
        const touchedFields = getStepTouchedFields(activeStep);

        const arrayFields = [
            "empJobExperiences",
            "empFamilyMembers",
            "empMilitaryObligations",
            "empContacts",
            "empEducationAndSkills.educationRequestDto",
            "empEducationAndSkills.langSkillRequestDto",
            "empEducationAndSkills.courseCertificateRequestDto",
            "empEducationAndSkills.compSkillRequestDto",
        ];

        const stepHasError = touchedFields.some((field) => {
            const isArrayField = arrayFields.some((arrayField) =>
                field.startsWith(arrayField)
            );
            if (isArrayField) {
                return Object.keys(flatErrors).some((key) => key.startsWith(field));
            }
            return flatErrors.hasOwnProperty(field);
        });

        if (!stepHasError) {
            if (activeStep < steps.length - 1) {
                setActiveStep((prev) => prev + 1);
            }
        } else {
            const touchedUpdates = {...formik.touched};
            Object.keys(flatErrors).forEach((key) => {
                touchedFields.forEach((field) => {
                    if (key.startsWith(field)) {
                        setNestedValue(touchedUpdates, key, true);
                    }
                });
            });

            formik.setTouched(touchedUpdates, true);

            toast.error("Məcburi xanaları doldurun", {
                autoClose: 8000,
                pauseOnHover: true,
                closeOnClick: true,
            });
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        fetchEmployeeList();
        fetchCompLevelList();
        fetchLangLevelList();
    }, []);

    if (loading) return <Loader/>;

    const handleSubmit = async (values) => {
        console.log("Formik submit values:", values);
        try {
            const payload = {
                ...values,
                empEducationAndSkills: values.empEducationAndSkills,
            };

            const response = await apiClient.post(`${baseURL}/employees`, payload);

            if (response.status === 201) {
                toast.success("Əməliyyat Uğurludur!", {
                    autoClose: 8000,
                    pauseOnHover: true,
                    closeOnClick: true,
                });
                navigate("/modules/employees");
            } else {
                toast.error("Xəta baş verdi: " + response.status, {
                    autoClose: 8000,
                    pauseOnHover: true,
                    closeOnClick: true,
                });
            }
        } catch (error) {
            toast.error("Xəta baş verdi");
            console.log("Error saving Employee", error);
        }
    };

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

        return data.data && data.data.length > 0 ? data.data[0].fileId : null;
    };

    const renderStepContent = (step, formik) => {
        switch (step) {
            case 0:
                return (
                    <MDBox>
                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                        >
                            <Typography variant="body1">Şəxsi məlumatlar</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        <MDBox
                            sx={{
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
                            }}
                        >
                            <MDBox
                                display="flex"
                                flexDirection="column"
                                sx={{width: "100%"}}
                                gap={5}
                                mt={4}
                                mb={4}
                                px={2}
                            >
                                <MDBox display="flex" gap={5}>
                                    <Field name="employee.firstName">
                                        {({field, meta}) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    InputLabelProps={{shrink: true}}
                                                    variant="standard"
                                                    type="text"
                                                    name="employee.firstName"
                                                    label="Adı"
                                                    required
                                                    fullWidth
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                />
                                            </>
                                        )}
                                    </Field>
                                    <Field name="employee.lastName">
                                        {({field, meta}) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    required
                                                    InputLabelProps={{shrink: true}}
                                                    fullWidth
                                                    name="employee.lastName"
                                                    label="Soyadı"
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                    sx={{width: "100%"}}
                                                />
                                            </>
                                        )}
                                    </Field>
                                    <Field name="employee.fatherName">
                                        {({field, meta}) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    fullWidth
                                                    InputLabelProps={{shrink: true}}
                                                    name="employee.fatherName"
                                                    label="Ata adı"
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                    sx={{width: "100%"}}
                                                />
                                            </>
                                        )}
                                    </Field>
                                </MDBox>
                                <MDBox display="flex" gap={5}>
                                    <Field name="employee.username">
                                        {({field, meta}) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                    type="text"
                                                    name="employee.username"
                                                    label="İstifadəçi adı"
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                    sx={{width: "100%"}}
                                                />
                                            </>
                                        )}
                                    </Field>
                                    <Field name="employee.genderId">
                                        {({field, form, meta}) => (
                                            <Autocomplete
                                                options={gender}
                                                getOptionLabel={(option) => option.title || ""}
                                                value={
                                                    gender.find((item) => item.id === field.value) ||
                                                    null
                                                }
                                                onChange={(event, newValue) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        newValue ? newValue.id : ""
                                                    );
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Cinsi"
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(meta.touched && meta.error)}
                                                        helperText={meta.touched && meta.error}
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                        <MDBox mt={2}>
                            <MDBox
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                gap={1}
                            >
                                <Typography variant="body1">Sənəd məlumatları</Typography>
                                <MDBox
                                    flex={1}
                                    sx={{borderBottom: "2px solid #E5E9EF"}}
                                />{" "}
                            </MDBox>
                            <MDBox
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s",
                                    "&:hover": {
                                        borderColor: "#B0B8C1",
                                    },
                                    color: "#8B95A1",
                                    textAlign: "center",
                                }}
                            >
                                <MDBox
                                    display="flex"
                                    flexDirection="column"
                                    gap={5}
                                    mt={4}
                                    mb={4}
                                    px={2}
                                >
                                    <MDBox display="flex" gap={5}>
                                        <Field name="employee.countryId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={regions.filter(
                                                        (item) => item.regionTypeId === 1
                                                    )}
                                                    getOptionLabel={(option) => option.region || ""}
                                                    value={
                                                        regions.find(
                                                            (item) => item.regionId === field.value
                                                        ) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.regionId : null
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Vətəndaşlığı"
                                                            variant="standard"
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
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
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        identityDocs.find(
                                                            (item) => item.id === field.value
                                                        ) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.id : null
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            name="employee.identityDocId"
                                                            label="Vətəndaşlığı təsdiq edən sənəd"
                                                            variant="standard"
                                                            required
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                        <Field name="employee.lastDate">
                                            {({field, form, meta}) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="az"
                                                >
                                                    <DatePicker
                                                        label="Son tarix"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY"
                                                        value={field.value || null}
                                                        onChange={(value) =>
                                                            form.setFieldValue(field.name, value)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                InputLabelProps={{shrink: true}}
                                                                 variant="standard"
                                                                name={field.name}
                                                                error={Boolean(meta.touched && meta.error)}
                                                                helperText={meta.touched && meta.error}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>

                                        <Field name="employee.docNumber">
                                            {({field, meta}) => (
                                                <>
                                                    <TextField
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        name="employee.docNumber"
                                                        label="Sənədin nömrəsi"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(meta.touched && meta.error)}
                                                        helperText={meta.touched && meta.error}
                                                        sx={{width: "100%"}}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                        <Field name="employee.authorityId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={authorities}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        authorities.find(
                                                            (item) => item.id === field.value
                                                        ) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.id : null
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            fullWidth
                                                            label="Sənədi verən orqan"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                    <MDBox display="flex" gap={5}>

                                        <Field name="employee.dateOfIssue">
                                            {({field, form, meta}) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="az"
                                                >
                                                    <DatePicker
                                                        label="Sənədin verilmə tarixi"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY"
                                                        value={field.value || null}
                                                        onChange={(value) =>
                                                            form.setFieldValue(field.name, value)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                InputLabelProps={{shrink: true}}
                                                                required
                                                                variant="standard"
                                                                name={field.name}
                                                                error={Boolean(meta.touched && meta.error)}
                                                                helperText={meta.touched && meta.error}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>

                                        <Field name="employee.dateOfExpire">
                                            {({field, form, meta}) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="az"
                                                >
                                                    <DatePicker
                                                        label="Sənədin bitmə tarixi"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY"
                                                        value={field.value || null}
                                                        onChange={(value) =>
                                                            form.setFieldValue(field.name, value)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                required
                                                                variant="standard"
                                                                InputLabelProps={{shrink: true}}
                                                                name={field.name}
                                                                error={Boolean(meta.touched && meta.error)}
                                                                helperText={meta.touched && meta.error}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>
                                        <Field name="employee.fin">
                                            {({field, meta}) => (
                                                <>
                                                    <TextField
                                                        {...field}
                                                        variant="standard"
                                                        type="text"
                                                        name="employee.fin"
                                                        InputLabelProps={{shrink: true}}
                                                        label="Finkod"
                                                        sx={{width: "100%"}}
                                                        error={Boolean(meta.touched && meta.error)}
                                                        helperText={meta.touched && meta.error}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                        <MDBox mt={2}>
                            <MDBox
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                gap={1}
                            >
                                <Typography variant="body1">Digər məlumatlar</Typography>
                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                            </MDBox>
                            <MDBox
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s",
                                    "&:hover": {
                                        borderColor: "#B0B8C1",
                                    },
                                    color: "#8B95A1",
                                    textAlign: "center",
                                }}
                            >
                                <MDBox
                                    display="flex"
                                    flexDirection="column"
                                    gap={5}
                                    mt={4}
                                    mb={4}
                                    px={2}
                                >
                                    <MDBox display="flex" gap={5}>
                                        <Field name="employee.birthplaceId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={regions.filter(
                                                        (item) => item.regionTypeId === 2
                                                    )}
                                                    getOptionLabel={(option) => option.region || ""}
                                                    value={
                                                        regions.find(
                                                            (item) => item.regionId === field.value
                                                        ) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.regionId : ""
                                                        );
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Doğulduğu yer"
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                        <Field name="employee.birthDate">
                                            {({field, form, meta}) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="az"
                                                >
                                                    <DatePicker
                                                        label="Doğum tarixi"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY"
                                                        value={field.value || null}
                                                        onChange={(value) =>
                                                            form.setFieldValue(field.name, value)
                                                        }
                                                        onBlur={() =>
                                                            form.setFieldTouched(field.name, true)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                required
                                                                variant="standard"
                                                                InputLabelProps={{shrink: true}}
                                                                error={Boolean(meta.touched && meta.error)}
                                                                helperText={meta.touched && meta.error}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>

                                        <Field name="employee.bloodTypeId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={bloodType}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        bloodType.find((item) => item.id === field.value) ||
                                                        null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.id : ""
                                                        );
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Qan qrupu"
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                    <MDBox display="flex" gap={5}>
                                        <Field name="employee.regAddr">
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    required
                                                    variant="standard"
                                                    type="text"
                                                    label="Qeydiyyat ünvanı"
                                                    InputLabelProps={{shrink: true}}
                                                    sx={{width: "100%"}}
                                                    name={field.name}
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                />
                                            )}
                                        </Field>

                                        <Field name="employee.curAddr">
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    InputLabelProps={{shrink: true}}
                                                    label="Faktiki yaşadığı ünvan"
                                                    sx={{width: "100%"}}
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                    onBlur={field.onBlur}
                                                />
                                            )}
                                        </Field>

                                        <Field name="employee.maritalStatusId">
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={maritalStatuses}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        maritalStatuses.find(
                                                            (item) => item.id === field.value
                                                        ) || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.id : ""
                                                        );
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Ailə vəziyyəti"
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                    <MDBox display="flex" gap={5}>
                                        <Field name="employee.note">
                                            {({field, form, meta}) => (
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    InputLabelProps={{shrink: true}}
                                                    label="Qeyd"
                                                    sx={{width: "100%"}}
                                                    onBlur={field.onBlur}
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
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
                    <MDBox>
                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                        >
                            <Typography variant="body1">İş təcrübəsi</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>

                        {formik.values.empJobExperiences.map((item, index) => (
                            <MDBox
                                key={index}
                                mt={4}
                                mb={4}
                                px={2}
                                display="flex"
                                flexDirection="column"
                                gap={5}
                            >
                                <MDBox display="flex" gap={5}>
                                    {initialNewValues.isNewWorkExperience && index > 0 && (
                                        <MDBox
                                            sx={{
                                                display: "flex",
                                                justifyContent: "end",
                                                marginLeft: "auto",
                                            }}
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    handleRemoveItem("empJobExperiences", index, formik)
                                                }
                                                color="error"
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </MDBox>
                                    )}
                                    <Field name={`empJobExperiences[${index}].companyName`}>
                                        {({field, form, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                InputLabelProps={{shrink: true}}
                                                label="İşlədiyi qurum"
                                                sx={{width: "100%"}}
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                onBlur={field.onBlur}
                                                required
                                            />
                                        )}
                                    </Field>

                                    <Field name={`empJobExperiences[${index}].departmentUnit`}>
                                        {({field, form, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                label="İdarə və ya şöbə"
                                                sx={{width: "100%"}}
                                                InputLabelProps={{shrink: true}}
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                onBlur={field.onBlur}
                                                required
                                            />
                                        )}
                                    </Field>

                                    <Field name={`empJobExperiences[${index}].position`}>
                                        {({field, form, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                InputLabelProps={{shrink: true}}
                                                type="text"
                                                label="Vəzifə"
                                                required
                                                sx={{width: "100%"}}
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                onBlur={field.onBlur}
                                            />
                                        )}
                                    </Field>
                                </MDBox>

                                <MDBox display="flex" gap={5}>
                                    <Field name={`empJobExperiences[${index}].startDate`}>
                                        {({field, form, meta}) => (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="az"
                                            >
                                                <DatePicker
                                                    label="Başladığı tarix"
                                                    format="DD-MM-YYYY"
                                                    inputFormat="DD-MM-YYYY"
                                                    value={field.value || null}
                                                    onChange={(value) =>
                                                        form.setFieldValue(field.name, value)
                                                    }
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            required
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                            name={field.name}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Field>

                                    <Field name={`empJobExperiences[${index}].endDate`}>
                                        {({field, form, meta}) => (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="az"
                                            >
                                                <DatePicker
                                                    label="Bitiş tarixi"
                                                    format="DD-MM-YYYY"
                                                    inputFormat="DD-MM-YYYY"
                                                    value={field.value || null}
                                                    onChange={(value) =>
                                                        form.setFieldValue(field.name, value)
                                                    }
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            required
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            name={field.name}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Field>
                                </MDBox>
                            </MDBox>
                        ))}

                        <MDBox display="flex" justifyContent="center" px={4}>
                            <MDButton
                                onClick={() => handleAddExperience(formik)}
                                variant="outlined"
                                color="info"
                                fullWidth
                            >
                                <AddIcon/>
                                Yeni İş təcrübəsi əlavə et
                            </MDButton>
                        </MDBox>
                    </MDBox>
                );
            case 2:
                return (
                    <MDBox>
                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                        >
                            <Typography variant="body1">Ailə üzvləri</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        {formik.values.empFamilyMembers.map((_, index) => (
                            <MDBox
                                key={index}
                                mt={4}
                                mb={4}
                                px={2}
                                display="flex"
                                flexDirection="column"
                                gap={5}
                            >
                                <MDBox display="flex" gap={5}>
                                    {initialNewValues.isNewFamilyMembers && index > 0 && (
                                        <IconButton
                                            onClick={() =>
                                                handleRemoveItem("empFamilyMembers", index, formik)
                                            }
                                            color="error"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    )}
                                    <Field name={`empFamilyMembers[${index}].kinshipTypeId`}>
                                        {({field, form, meta}) => (
                                            <Autocomplete
                                                options={kinshipTypes}
                                                getOptionLabel={(option) => option?.title || ""}
                                                value={
                                                    kinshipTypes.find(
                                                        (item) => item.id === field.value
                                                    ) || null
                                                }
                                                onChange={(e, newValue) =>
                                                    form.setFieldValue(field.name, newValue?.id || "")
                                                }
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        label="Növü"
                                                        required
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(meta.touched && meta.error)}
                                                        helperText={meta.touched && meta.error}
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>

                                    <Field name={`empFamilyMembers[${index}].name`}>
                                        {({field, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                required
                                                label="Adı"
                                                InputLabelProps={{shrink: true}}
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>

                                    <Field name={`empFamilyMembers[${index}].surname`}>
                                        {({field, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                InputLabelProps={{shrink: true}}
                                                label="Soyadı"
                                                sx={{width: "100%"}}
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                required
                                            />
                                        )}
                                    </Field>

                                    <Field name={`empFamilyMembers[${index}].fatherName`}>
                                        {({field, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                InputLabelProps={{shrink: true}}
                                                label="Ata adı"
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>
                                </MDBox>
                                <MDBox display="flex" gap={5}>
                                    <Field name={`empFamilyMembers[${index}].birthdate`}>
                                        {({field, form, meta}) => (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="az"
                                            >
                                                <DatePicker
                                                    label="Doğum tarixi"
                                                    format="DD-MM-YYYY"
                                                    inputFormat="DD-MM-YYYY"
                                                    value={field.value || null}
                                                    onChange={(value) =>
                                                        form.setFieldValue(field.name, value)
                                                    }
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            required
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                            name={field.name}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    </Field>

                                    <Field name={`empFamilyMembers[${index}].workPlace`}>
                                        {({field, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                InputLabelProps={{shrink: true}}
                                                label="İşlədiyi müəssisə"
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>

                                    <MDBox display="flex" alignItems="center" gap={1}>
                                        <MDTypography variant="body2" fontSize={14}>
                                            Sağlamlıq məhdudiyyəti
                                        </MDTypography>
                                        <Field name={`empFamilyMembers[${index}].disabilityStatus`}>
                                            {({field, form}) => (
                                                <Switch
                                                    checked={field.value || false}
                                                    onChange={(e) =>
                                                        form.setFieldValue(field.name, e.target.checked)
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        ))}

                        <MDBox display="flex" justifyContent="center" px={4}>
                            <MDButton
                                onClick={() => {
                                    handleAddFamilyMembers(formik);
                                }}
                                variant="outlined"
                                color="info"
                                fullWidth
                            >
                                <AddIcon></AddIcon> Yeni Ailə üzvü əlavə et
                            </MDButton>
                        </MDBox>
                    </MDBox>
                );
            case 3:
                return (
                    <MDBox>
                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                        >
                            <Typography variant="body1">Təhsil</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        {formik.values.empEducationAndSkills.educationRequestDto.map(
                            (_, index) => (
                                <MDBox
                                    key={index}
                                    mt={4}
                                    mb={4}
                                    px={2}
                                    display="flex"
                                    flexDirection="column"
                                    gap={3}
                                >
                                    <MDBox display="flex" gap={3}>
                                        {initialNewValues.isNewEducation && index > 0 && (
                                            <IconButton
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        "empEducationAndSkills.educationRequestDto",
                                                        index,
                                                        formik
                                                    )
                                                }
                                                color="error"
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        )}
                                        <Field
                                            name={`empEducationAndSkills.educationRequestDto[${index}].educationTypeId`}
                                        >
                                            {({field, meta}) => (
                                                <Autocomplete
                                                    options={educationTypes}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        educationTypes.find(
                                                            (item) => item.id === field.value
                                                        ) || null
                                                    }
                                                    onChange={(_, value) =>
                                                        formik.setFieldValue(
                                                            field.name,
                                                            value ? value.id : null
                                                        )
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Növü"
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            fullWidth
                                                            required
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.educationRequestDto[${index}].profession`}
                                        >
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    label="İxtisas"
                                                    variant="standard"
                                                    InputLabelProps={{shrink: true}}
                                                    fullWidth
                                                    required
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                />
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.educationRequestDto[${index}].entryScore`}
                                        >
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
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
                                        <Field
                                            name={`empEducationAndSkills.educationRequestDto[${index}].countryId`}
                                        >
                                            {({field, meta}) => (
                                                <Autocomplete
                                                    options={regions.filter((r) => r.regionTypeId === 1)}
                                                    getOptionLabel={(option) => option.region || ""}
                                                    value={
                                                        regions.find(
                                                            (item) => item.regionId === field.value
                                                        ) || null
                                                    }
                                                    onChange={(_, value) =>
                                                        formik.setFieldValue(
                                                            field.name,
                                                            value ? value.regionId : null
                                                        )
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Ölkə"
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            fullWidth
                                                            required
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.educationRequestDto[${index}].schoolName`}
                                        >
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    label="Təhsil müəssisəsinin adı"
                                                    InputLabelProps={{shrink: true}}
                                                    variant="standard"
                                                    fullWidth
                                                    required
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                />
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.educationRequestDto[${index}].gpuResult`}
                                        >
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    label="GPU Balı"
                                                    InputLabelProps={{shrink: true}}
                                                    type="number"
                                                    variant="standard"
                                                    fullWidth
                                                />
                                            )}
                                        </Field>
                                    </MDBox>

                                    <MDBox display="flex" gap={5}>
                                        <Field
                                            name={`empEducationAndSkills.educationRequestDto[${index}].startDate`}
                                        >
                                            {({field, form, meta}) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="az"
                                                >
                                                    <DatePicker
                                                        label="Başladığı tarix"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY"
                                                        name={field.name}
                                                        value={field.value || null}
                                                        onChange={(value) =>
                                                            form.setFieldValue(field.name, value)
                                                        }
                                                        onBlur={() =>
                                                            form.setFieldTouched(field.name, true)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="standard"
                                                                fullWidth
                                                                required
                                                                InputLabelProps={{shrink: true}}
                                                                error={Boolean(meta.touched && meta.error)}
                                                                helperText={meta.touched && meta.error}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.educationRequestDto[${index}].endDate`}
                                        >
                                            {({field, form, meta}) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="az"
                                                >
                                                    <DatePicker
                                                        label="Bitdiyi tarix"
                                                        format="DD-MM-YYYY"
                                                        value={field.value || null}
                                                        onChange={(value) =>
                                                            form.setFieldValue(field.name, value)
                                                        }
                                                        onBlur={() =>
                                                            form.setFieldTouched(field.name, true)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="standard"
                                                                fullWidth
                                                                InputLabelProps={{shrink: true}}
                                                                error={Boolean(meta.touched && meta.error)}
                                                                helperText={meta.touched && meta.error}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>
                                    </MDBox>
                                </MDBox>
                            )
                        )}

                        <MDBox display="flex" justifyContent="center" px={4}>
                            <MDButton
                                onClick={() => {
                                    handleAddEducation(formik);
                                }}
                                variant="outlined"
                                color="info"
                                fullWidth
                            >
                                <AddIcon></AddIcon> Yeni Təhsil əlavə et
                            </MDButton>
                        </MDBox>
                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                            mt={5}
                        >
                            <Typography variant="body1">Kurs və sertifikatlar</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>

                        {formik.values.empEducationAndSkills.courseCertificateRequestDto.map(
                            (_, index) => (
                                <MDBox
                                    key={index}
                                    mt={4}
                                    mb={4}
                                    px={2}
                                    display="flex"
                                    flexDirection="column"
                                    gap={5}
                                >
                                    <MDBox display="flex" gap={5}>
                                        {initialNewValues.isNewCourse && index > 0 && (
                                            <IconButton
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        "empEducationAndSkills.courseCertificateRequestDto",
                                                        index,
                                                        formik
                                                    )
                                                }
                                                color="error"
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        )}
                                        <Field
                                            name={`empEducationAndSkills.courseCertificateRequestDto[${index}].courseName`}
                                        >
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    variant="standard"
                                                    type="text"
                                                    label="Kursun adı"
                                                    name={field.name}
                                                    required
                                                    fullWidth
                                                    InputLabelProps={{shrink: true}}
                                                    error={Boolean(meta.touched && meta.error)}
                                                    helperText={meta.touched && meta.error}
                                                />
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.courseCertificateRequestDto[${index}].startDate`}
                                        >
                                            {({field, form, meta}) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="az"
                                                >
                                                    <DatePicker
                                                        label="Başladığı tarix"
                                                        format="DD-MM-YYYY"
                                                        value={field.value || null}
                                                        onChange={(value) =>
                                                            form.setFieldValue(field.name, value)
                                                        }
                                                        onBlur={() =>
                                                            form.setFieldTouched(field.name, true)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                required
                                                                variant="standard"
                                                                InputLabelProps={{shrink: true}}
                                                                name={field.name}
                                                                error={Boolean(meta.touched && meta.error)}
                                                                helperText={meta.touched && meta.error}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.courseCertificateRequestDto[${index}].endDate`}
                                        >
                                            {({field, form, meta}) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="az"
                                                >
                                                    <DatePicker
                                                        label="Bitdiyi tarix"
                                                        format="DD-MM-YYYY"
                                                        inputFormat="DD-MM-YYYY"
                                                        value={field.value || null}
                                                        onChange={(value) =>
                                                            form.setFieldValue(field.name, value)
                                                        }
                                                        onBlur={() =>
                                                            form.setFieldTouched(field.name, true)
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                variant="standard"
                                                                InputLabelProps={{shrink: true}}
                                                                name={field.name}
                                                                error={Boolean(meta.touched && meta.error)}
                                                                helperText={meta.touched && meta.error}
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
                                            id={`certification-upload-${index}`}
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                try {
                                                    const uploadedFileId = await uploadFileWithAuth(file);
                                                    formik.setFieldValue(
                                                        `empEducationAndSkills.courseCertificateRequestDto[${index}].certificateFileId`,
                                                        uploadedFileId
                                                    );
                                                } catch (error) {
                                                    console.error("Fayl yükləmə xətası", error);
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={`certification-upload-${index}`}
                                            style={{width: "100%", cursor: "pointer"}}
                                        >
                                            <MDBox
                                                display="flex"
                                                flexDirection="row"
                                                gap={2}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <img
                                                    src={upload}
                                                    alt="upload"
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        marginBottom: "8px",
                                                    }}
                                                />
                                                <MDTypography
                                                    variant="button"
                                                    color="text"
                                                    fontWeight="regular"
                                                >
                                                    Sertifikat yüklə
                                                </MDTypography>
                                            </MDBox>
                                        </label>
                                    </MDBox>
                                </MDBox>
                            )
                        )}

                        <MDBox display="flex" justifyContent="center" px={4}>
                            <MDButton
                                onClick={() => handleAddCourse(formik)}
                                variant="outlined"
                                color="info"
                                fullWidth
                            >
                                <AddIcon></AddIcon> Yeni Kurs əlavə et
                            </MDButton>
                        </MDBox>

                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                            mt={5}
                        >
                            <Typography variant="body1">Dil bilikləri</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        {formik.values.empEducationAndSkills.langSkillRequestDto.map(
                            (_, index) => (
                                <MDBox
                                    key={index}
                                    mt={4}
                                    mb={4}
                                    px={2}
                                    display="flex"
                                    flexDirection="column"
                                    gap={5}
                                >
                                    <MDBox display="flex" gap={5}>
                                        {initialNewValues.isNewLang && index > 0 && (
                                            <IconButton
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        "empEducationAndSkills.langSkillRequestDto",
                                                        index,
                                                        formik
                                                    )
                                                }
                                                color="error"
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        )}

                                        <Field
                                            name={`empEducationAndSkills.langSkillRequestDto[${index}].languageTypeId`}
                                        >
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={languageType}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        languageType.find(
                                                            (item) => item.id === field.value
                                                        ) || null
                                                    }
                                                    onChange={(e, newValue) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.id : ""
                                                        )
                                                    }
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Dil"
                                                            required
                                                            variant="standard"
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.langSkillRequestDto[${index}].levelId`}
                                        >
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={langLevel}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        langLevel.find((item) => item.id === field.value) ||
                                                        null
                                                    }
                                                    onChange={(e, newValue) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.id : ""
                                                        )
                                                    }
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Səviyyə"
                                                            variant="standard"
                                                            required
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                </MDBox>
                            )
                        )}

                        <MDBox display="flex" justifyContent="center" px={4}>
                            <MDButton
                                onClick={() => {
                                    handleAddLanguage(formik);
                                }}
                                variant="outlined"
                                color="info"
                                fullWidth
                            >
                                <AddIcon></AddIcon> Yeni dil biliyi əlavə et
                            </MDButton>
                        </MDBox>

                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                            mt={5}
                        >
                            <Typography variant="body1">Komputer bacarıqları</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        {formik.values.empEducationAndSkills.compSkillRequestDto.map(
                            (_, index) => (
                                <MDBox
                                    key={index}
                                    mt={4}
                                    mb={4}
                                    px={2}
                                    display="flex"
                                    flexDirection="column"
                                    gap={5}
                                >
                                    {initialNewValues.isNewComp && index > 0 && (
                                        <IconButton
                                            onClick={() =>
                                                handleRemoveItem(
                                                    "empEducationAndSkills.compSkillRequestDto",
                                                    index,
                                                    formik
                                                )
                                            }
                                            color="error"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    )}
                                    <MDBox display="flex" gap={5}>
                                        <Field
                                            name={`empEducationAndSkills.compSkillRequestDto[${index}].computerSkillId`}
                                        >
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={computerSkill}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        computerSkill.find(
                                                            (item) => item.id === field.value
                                                        ) || null
                                                    }
                                                    onChange={(e, newValue) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.id : ""
                                                        );
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Komputer proqramının adı"
                                                            variant="standard"
                                                            required
                                                            fullWidth
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                />
                                            )}
                                        </Field>

                                        <Field
                                            name={`empEducationAndSkills.compSkillRequestDto[${index}].levelId`}
                                        >
                                            {({field, form, meta}) => (
                                                <Autocomplete
                                                    options={compLevel}
                                                    getOptionLabel={(option) => option.title || ""}
                                                    value={
                                                        compLevel.find((item) => item.id === field.value) ||
                                                        null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            newValue ? newValue.id : ""
                                                        );
                                                    }}
                                                    onBlur={() => form.setFieldTouched(field.name, true)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Səviyyə"
                                                            required
                                                            variant="standard"
                                                            InputLabelProps={{shrink: true}}
                                                            error={Boolean(meta.touched && meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                    sx={{width: "100%"}}
                                                    required
                                                />
                                            )}
                                        </Field>
                                    </MDBox>
                                </MDBox>
                            )
                        )}
                        <MDBox display="flex" justifyContent="center" px={4}>
                            <MDButton
                                onClick={() => {
                                    handleAddComputerSkill(formik);
                                }}
                                variant="outlined"
                                color="info"
                                fullWidth
                            >
                                <AddIcon></AddIcon> Yeni komputer bacarığı əlavə et
                            </MDButton>
                        </MDBox>
                    </MDBox>
                );
            case 4:
                return (
                    <MDBox>
                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                            mt={5}
                        >
                            <Typography variant="body1">Hərbi mükəlləfiyyət</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        {formik.values.empMilitaryObligations.map((item, index) => (
                            <MDBox
                                key={item.id || index}
                                mt={4}
                                mb={4}
                                px={2}
                                display="flex"
                                flexDirection="column"
                                gap={5}
                            >
                                <MDBox display="flex" gap={5}>
                                    {initialNewValues.isNewMilitaryObligation && index > 0 && (
                                        <IconButton
                                            onClick={() =>
                                                handleRemoveItem(
                                                    "empMilitaryObligations",
                                                    index,
                                                    formik
                                                )
                                            }
                                            color="error"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    )}
                                    <Field
                                        name={`empMilitaryObligations[${index}].militaryObligationId`}
                                    >
                                        {({field, form, meta}) => (
                                            <Autocomplete
                                                options={militaryObligation}
                                                getOptionLabel={(option) => option.title || ""}
                                                value={
                                                    militaryObligation.find(
                                                        (opt) => opt.id === field.value
                                                    ) || null
                                                }
                                                onChange={(e, newValue) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        newValue ? newValue.id : ""
                                                    );
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Hərbi mükəlləfiyyət"
                                                        variant="standard"
                                                        required
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(
                                                            form.touched.empMilitaryObligations?.[index]
                                                                ?.militaryObligationId &&
                                                            form.errors.empMilitaryObligations?.[index]
                                                                ?.militaryObligationId
                                                        )}
                                                        helperText={
                                                            form.touched.empMilitaryObligations?.[index]
                                                                ?.militaryObligationId &&
                                                            form.errors.empMilitaryObligations?.[index]
                                                                ?.militaryObligationId
                                                        }
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                                required
                                            />
                                        )}
                                    </Field>

                                    <Field
                                        name={`empMilitaryObligations[${index}].militaryRankId`}
                                    >
                                        {({field, form, meta}) => (
                                            <Autocomplete
                                                options={militaryRank}
                                                getOptionLabel={(option) => option.title || ""}
                                                value={
                                                    militaryRank.find((opt) => opt.id === field.value) ||
                                                    null
                                                }
                                                onChange={(e, newValue) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        newValue ? newValue.id : null
                                                    );
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Rütbə"
                                                        variant="standard"
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(
                                                            form.touched.empMilitaryObligations?.[index]
                                                                ?.militaryRankId &&
                                                            form.errors.empMilitaryObligations?.[index]
                                                                ?.militaryRankId
                                                        )}
                                                        helperText={
                                                            form.touched.empMilitaryObligations?.[index]
                                                                ?.militaryRankId &&
                                                            form.errors.empMilitaryObligations?.[index]
                                                                ?.militaryRankId
                                                        }
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>
                                </MDBox>

                                <MDBox display="flex" gap={5}>
                                    <Field name={`empMilitaryObligations[${index}].note`}>
                                        {({field, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                label="Qeyd"
                                                InputLabelProps={{shrink: true}}
                                                sx={{width: "100%"}}
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                onBlur={field.onBlur}
                                                required
                                            />
                                        )}
                                    </Field>
                                </MDBox>
                            </MDBox>
                        ))}

                        <MDBox display="flex" justifyContent="center" px={4}>
                            <MDButton
                                onClick={() => {
                                    handleAddMilitaryConscripts(formik);
                                }}
                                variant="outlined"
                                color="info"
                                fullWidth
                            >
                                <AddIcon></AddIcon> Yeni Hərbi mükəlləfiyyət əlavə et
                            </MDButton>
                        </MDBox>
                    </MDBox>
                );
            case 5:
                return (
                    <MDBox>
                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                            mt={5}
                        >
                            <Typography variant="body1">Əlaqə məlumatları</Typography>
                            <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                        </MDBox>
                        {formik.values.empContacts.map((item, index) => (
                            <MDBox
                                key={item.id || index}
                                mt={4}
                                mb={4}
                                px={2}
                                display="flex"
                                flexDirection="column"
                                gap={5}
                            >
                                <MDBox display="flex" gap={5}>
                                    {initialNewValues.isNewContact && index > 0 && (
                                        <IconButton
                                            onClick={() =>
                                                handleRemoveItem("empContacts", index, formik)
                                            }
                                            color="error"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    )}
                                    <Field name={`empContacts[${index}].contactTypeId`}>
                                        {({field, form, meta}) => (
                                            <Autocomplete
                                                options={contactTypes}
                                                getOptionLabel={(option) => option.title || ""}
                                                value={
                                                    contactTypes.find((opt) => opt.id === field.value) ||
                                                    null
                                                }
                                                onChange={(e, newValue) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        newValue ? newValue.id : ""
                                                    );
                                                }}
                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Əlaqə növü"
                                                        variant="standard"
                                                        required
                                                        InputLabelProps={{shrink: true}}
                                                        error={Boolean(
                                                            form.touched.empContacts?.[index]
                                                                ?.contactTypeId &&
                                                            form.errors.empContacts?.[index]?.contactTypeId
                                                        )}
                                                        helperText={
                                                            form.touched.empContacts?.[index]
                                                                ?.contactTypeId &&
                                                            form.errors.empContacts?.[index]?.contactTypeId
                                                        }
                                                    />
                                                )}
                                                sx={{width: "100%"}}
                                            />
                                        )}
                                    </Field>

                                    <Field name={`empContacts[${index}].contact`}>
                                        {({field, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                label="Əlaqə"
                                                required
                                                InputLabelProps={{shrink: true}}
                                                sx={{width: "100%"}}
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                onBlur={field.onBlur}
                                            />
                                        )}
                                    </Field>
                                </MDBox>

                                <MDBox display="flex" gap={5}>
                                    <Field name={`empContacts[${index}].note`}>
                                        {({field, meta}) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                type="text"
                                                label="Qeyd"
                                                InputLabelProps={{shrink: true}}
                                                sx={{width: "100%"}}
                                                error={Boolean(meta.touched && meta.error)}
                                                helperText={meta.touched && meta.error}
                                                onBlur={field.onBlur}
                                            />
                                        )}
                                    </Field>
                                </MDBox>
                            </MDBox>
                        ))}

                        <MDBox display="flex" justifyContent="center" px={4}>
                            <MDButton
                                onClick={() => {
                                    handleAddContactDetail(formik);
                                }}
                                variant="outlined"
                                color="info"
                                fullWidth
                            >
                                <AddIcon></AddIcon> Yeni Əlaqə məlumatları əlavə et
                            </MDButton>
                        </MDBox>
                    </MDBox>
                );
            case 6:
                return (
                    <MDBox>
                        CV
                    </MDBox>
                );
            default:
                return "Naməlum addım";
        }
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema}>
            {(formik) => (
                <Form>
                    <DashboardLayout>
                        <DashboardNavbar/>
                        <MDBox py={3} mb={20}>
                            <Box sx={{width: "100%"}}>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel
                                                sx={{
                                                    opacity: activeStep === index ? 1 : 0.5,
                                                    fontWeight: activeStep === index ? "bold" : "normal",
                                                    color: activeStep === index ? "white" : "gray",
                                                }}
                                            >
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>

                                <MDBox mt={4}>{renderStepContent(activeStep, formik)}</MDBox>

                                <MDBox mt={4} display="flex" justifyContent="space-between">
                                    <MDBox display="flex" gap={2}>
                                        <MDButton
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => navigate("/modules/employees")}
                                        >
                                            İmtina et
                                        </MDButton>
                                        <MDButton
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleBack}
                                            disabled={activeStep === 0}
                                        >
                                            Geri
                                        </MDButton>
                                    </MDBox>

                                    {activeStep === steps.length - 1 ? (
                                        <MDButton
                                            type="button"
                                            sx={{
                                                boxShadow: "none",
                                                "&:hover": {
                                                    boxShadow: "none",
                                                },
                                            }}
                                            onClick={() => {
                                                handleSubmit(formik.values);
                                            }}
                                            variant="gradient"
                                            color="primary"
                                        >
                                            Təsdiqlə
                                        </MDButton>
                                    ) : (
                                        <MDButton
                                            type="button"
                                            sx={{
                                                boxShadow: "none",
                                                "&:hover": {
                                                    boxShadow: "none",
                                                },
                                            }}
                                            variant="gradient"
                                            color="primary"
                                            onClick={() => {
                                                handleNext(formik);
                                            }}
                                        >
                                            Növbəti
                                        </MDButton>
                                    )}
                                </MDBox>
                            </Box>
                        </MDBox>
                    </DashboardLayout>
                </Form>
            )}
        </Formik>
    );
}

export default NewEmployee;
