import Tab from "@mui/material/Tab";
import {Autocomplete, Box, CardContent, Icon, IconButton, TextField, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import Tabs from "@mui/material/Tabs";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Edit from "../../assets/images/icons/pencil-alt.svg";
import Delete from "../../assets/images/icons/trash.svg";
import DataTable from "../../examples/Tables/DataTable";
import MDInput from "../../components/MDInput";
import FormField from "../../layouts/applications/wizard/components/FormField";
import {DatePicker, DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Field, Form, Formik, useFormikContext} from "formik";
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import Card from "@mui/material/Card";
import {StoreContext} from "../../context/StoreContext";
import {toast} from "react-toastify";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import ProfilePhotoCard from "./ProfilePhotoCard";


function TabPanel({children, value, index}) {
    return (
        <div hidden={value !== index}>
            {
                value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )
            }
        </div>
    )
}


function EditEmployee() {
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] = useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();
    const location = useLocation();

    const {
        gender,
        bloodType,
        identityDocs,
        maritalStatuses,
        regions,
        authorities,
    } = useContext(StoreContext);


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

    const handleDelete = (selectedId, endpoint, idKey, fieldKey) => {
        setSelectedClientIdToDelete({selectedId, endpoint, idKey, fieldKey});
        setOpenConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        const {selectedId, endpoint, idKey, fieldKey} = selectedClientIdToDelete;
        if (endpoint === 'roles/emp-role-list') {
            const obj = {
                empId: Number(id),
                roleId: selectedId
            }
            console.log('obj deleted', obj);
            try {
                const response = await apiClient.delete(`${baseURL}/${endpoint}`, obj);
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi!");
                    setInitialValues((prev) => ({
                        ...prev,
                        [fieldKey]: prev[fieldKey].filter((item) => item[idKey] !== selectedId)
                    }));
                    setOpenConfirmationModal(false);
                }
            } catch (error) {
                console.log("Error deleting:", error);
            }
        } else {
            if (selectedId && fieldKey) {
                try {
                    const response = await apiClient.delete(`${baseURL}/${endpoint}/${selectedId}`);
                    if (response.status >= 200 && response.status < 300) {
                        toast.success("Məlumat müvəffəqiyyətlə silindi!");
                        setInitialValues((prev) => ({
                            ...prev,
                            [fieldKey]: prev[fieldKey].filter((item) => item[idKey] !== selectedId)
                        }));
                        setOpenConfirmationModal(false);
                    }
                } catch (error) {
                    console.log("Error deleting:", error);
                }
            }

        }
    };


    const fetchAllEmployeeData = async (id) => {
        setLoading(true);
        try {
            const results = await Promise.allSettled([
                apiClient.get(`${baseURL}/employees/${id}`),
                apiClient.get(`${baseURL}/job-experiences/emp-id/${id}`),
                apiClient.get(`${baseURL}/family-members/emp-id/${id}`),
                apiClient.get(`${baseURL}/emp-educations/emp-id/${id}`),
                apiClient.get(`${baseURL}/emp-military-obligations/emp-id/${id}`),
                apiClient.get(`${baseURL}/contacts/emp-id/${id}`),
                apiClient.get(`${baseURL}/emp-course-certificates/emp-id/${id}`),
                apiClient.get(`${baseURL}/emp-lang-skills/emp-id/${id}`),
                apiClient.get(`${baseURL}/emp-comp-skills/emp-id/${id}`),
                apiClient.get(`${baseURL}/roles/emp-id/${id}`),
            ]);

            const [
                employeeRes,
                jobExpRes,
                memberFamily,
                education,
                empMilitary,
                contact,
                courseAndCertification,
                languageSkill,
                computerSkill,
                roles,
            ] = results;

            const safeData = (res, fallback) =>
                res.status === 'fulfilled' && res.value?.data
                    ? res.value.data
                    : fallback;

            const withEmpId = (data) => Array.isArray(data)
                ? data.map((item) => ({...item, empId: Number(id)}))
                : {...data, empId: Number(id)};
            setInitialValues((prev) => ({
                ...prev,
                employee: withEmpId(safeData(employeeRes, {})),
                employeeExperience: withEmpId(safeData(jobExpRes, [])),
                empFamilyMembers: withEmpId(safeData(memberFamily, [])),
                employeeEducation: withEmpId(safeData(education, [])),
                employeeMilitary: withEmpId(safeData(empMilitary, [])),
                employeeContact: withEmpId(safeData(contact, [])),
                employeeCourseAndCertification: withEmpId(safeData(courseAndCertification, [])),
                employeeLanguageSkill: withEmpId(safeData(languageSkill, [])),
                employeeComputerSkill: withEmpId(safeData(computerSkill, [])),
                employeeRoles: withEmpId(safeData(roles, []))
            }));
        } catch (err) {
            console.log('Unexpected error in fetchAllEmployeeData:', err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (id) fetchAllEmployeeData(id);
    }, [id, location.key]);

    useEffect(() => {
        fetchEmployeeList();
    }, []);


    const columnWorkExperience = [
        {Header: "İşlədiyi qurum", accessor: "companyName"},
        {Header: "İdarə", accessor: "departmentUnit"},
        {Header: "Vəzifə", accessor: "position"},
        {Header: "Başladığı tarix", accessor: "startDate"},
        {Header: "Son tarix", accessor: "endDate"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActionExperience(row),
            width: "5%",
        },
    ];

    const columnFamilyMembers = [
        {Header: "Növü", accessor: "kinshipType"},
        {Header: "Adı", accessor: "name"},
        {Header: "Soyadı", accessor: "surname"},
        {Header: "Ata adı", accessor: "fatherName"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActionFamilyMembers(row),
            width: "5%",
        },
    ];

    const columnEducation = [
        {Header: "Növü", accessor: "educationType"},
        {Header: "Təhsil müəssisənin adı", accessor: "schoolName"},
        {Header: "İxtisas", accessor: "profession"},
        {Header: "Qəbul balı", accessor: "entryScore"},
        {Header: "Başladığı tarix", accessor: "startDate"},
        {Header: "Bitdiyi tarix", accessor: "endDate"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActionEducationSkills(row),
            width: "5%",
        },
    ];

    const columnCourseCertification = [
        {Header: "Kursun adı", accessor: "courseName"},
        {Header: "Başladığı tarix", accessor: "startDate"},
        {Header: "Bitdiyi tarix", accessor: "endDate"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActionCourseCertification(row),
            width: "5%",
        },
    ];

    const columnLanguageSkills = [
        {Header: "Dil", accessor: "skill"},
        {Header: "Səviyyə", accessor: "level"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActionLanguage(row),
            width: "5%",
        },
    ];
    const columnComputerSkills = [
        {Header: "Komputer proqramının adı", accessor: "skill"},
        {Header: "Səviyyə", accessor: "level"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActionComputerSkills(row),
            width: "5%",
        },
    ];

    const columnMilitaryConscripts = [
        {Header: "Hərbi mükəlləfiyyət", accessor: "militaryObligation"},
        {Header: "Rütbə", accessor: "militaryRank"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActionMilitaryConscripts(row),
            width: "5%",
        },
    ];

    const columnContactDetail = [
        {Header: "Əlaqə növü", accessor: "contactType"},
        {Header: "Əlaqə", accessor: "contact"},
        {Header: "Qeyd", accessor: "note"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActionContactDetail(row),
            width: "5%",
        },
    ];

    const columnRolesDetail = [
        {
            Header: 'Rol adı', accessor: 'title',
        },
        {
            Header: '',
            accessor: 'actions',
            Cell: ({row}) => renderActionRolesDetail(row),
            width: '5%'
        }
    ]


    const renderActionExperience = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton size="small"
                        onClick={() => handleEditClick(2, {jobExperienceId: row.original.jobExperienceId})}>
                <img src={Edit} alt="Edit"/>
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.jobExperienceId, "job-experiences", "jobExperienceId", "employeeExperience")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );

    const renderActionFamilyMembers = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton size="small" onClick={() => handleEditClick(3, {familyMemberId: row.original.familyMemberId})}>
                <img src={Edit} alt="Edit"/>
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.familyMemberId, "family-members", "familyMemberId", "empFamilyMembers")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );

    const renderActionEducationSkills = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton size="small"
                        onClick={() => handleEditClick(4, {empEducationId: row.original.empEducationId}, 'education')}>
                <img src={Edit} alt="Edit"/>
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.empEducationId, "emp-educations", "empEducationId", "employeeEducation")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );

    const renderActionCourseCertification = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton size="small"
                        onClick={() => handleEditClick(4, {courseCertificationId: row.original.empCourseCertificateId}, 'course')}>
                <img src={Edit} alt="Edit"/>
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.empCourseCertificateId, "emp-course-certificates", "empCourseCertificateId", "employeeCourseAndCertification")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );

    const renderActionLanguage = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton size="small" onClick={() => handleEditClick(4, {langId: row.original.empSkillId}, 'lang')}>
                <img src={Edit} alt="Edit"/>
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.empSkillId, "emp-lang-skills", "empSkillId", "employeeLanguageSkill")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );

    const renderActionComputerSkills = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton size="small" onClick={() => handleEditClick(4, {compId: row.original.empSkillId}, 'comp')}>
                <img src={Edit} alt="Edit"/>
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.empSkillId, "emp-comp-skills", "empSkillId", "employeeComputerSkill")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );

    const renderActionMilitaryConscripts = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton size="small"
                        onClick={() => handleEditClick(5, {empMilitaryObligationId: row.original.empMilitaryObligationId})}>
                <img src={Edit} alt="Edit"/>
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.empMilitaryObligationId, "emp-military-obligations", "empMilitaryObligationId", "employeeMilitary")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );

    const renderActionContactDetail = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton size="small" onClick={() => handleEditClick(6, {contactId: row.original.contactId})}>
                <img src={Edit} alt="Edit"/>
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.contactId, "contacts", "contactId", "employeeContact")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );
    const renderActionRolesDetail = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <IconButton
                size="small"
                onClick={() => handleDelete(row.original.id, "roles/emp-role-list", "id", "employeeRoles")}
            >
                <img src={Delete} alt="Delete"/>
            </IconButton>
        </MDBox>
    );


    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    }

    const handleEditClick = (stepIndex, empSkill, type) => {
        navigate(`/modules/employees/tabItems`, {
            state: {stepIndex, empSkill, employeeId: id, type}
        });
    }

    const [initialValues, setInitialValues] = useState({
        employee: {
            tableNumber: null,
            username: null,
            ownerEmpId: null,
            firstName: null,
            lastName: null,
            fatherName: null,
            countryId: null,
            identityDocId: null,
            docNumber: null,
            authorityId: null,
            dateOfIssue: null,
            dateOfExpire: null,
            fin: null,
            birthplaceId: null,
            birthDate: null,
            bloodTypeId: null,
            regAddr: null,
            curAddr: null,
            maritalStatusId: null,
            genderId: null,
            dsmfCardNo: null,
            note: null
        },
        employeeExperience: [],
        employeeCourseAndCertification: [],
        employeeLanguageSkill: [],
        employeeComputerSkill: [],
        empFamilyMembers: [
            {
                kinshipTypeId: null,
                name: "",
                surname: "",
                fatherName: "",
                birthdate: null,
                workPlace: "",
                disabilityStatus: null
            },
        ],
        employeeEducation: [],
        employeeMilitary: [],
        employeeContact: [],
        employeeRoles: []
    })


    if (loading) {
        return (
            <DashboardLayout>
                <DashboardNavbar/>
                <MDBox py={6} px={3}>
                    <Loader/>
                </MDBox>
            </DashboardLayout>
        );
    }

    const handleSubmit = async (value) => {
        try {
            await apiClient.put(`${baseURL}/employees`, value);
            toast.success('Əməliyyat Uğurludur');
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({values, submitForm}) => (
                <Form>
                    <Card>
                        <CardContent>
                            <DashboardLayout>
                                <DashboardNavbar/>
                                <Box sx={{width: "100%"}}>
                                    <MDBox mt={4} mr={4} mb={2} display="flex" justifyContent="end"
                                    >
                                        <MDButton
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => navigate('/modules/employees')}
                                        >
                                            İmtina et
                                        </MDButton>
                                    </MDBox>
                                    <Tabs value={tabIndex} onChange={handleChange} centered>
                                        <Tab label="Şəxsi məlumatlar"/>
                                        <Tab label="Vəzifə"/>
                                        <Tab label="İş Təcrübəsi"/>
                                        <Tab label="Ailə üzvləri"/>
                                        <Tab label="Təhsil və bacarıqlar"/>
                                        <Tab label="Hərbi mükəlləfiyyət"/>
                                        <Tab label="Əlaqə məlumatları"/>
                                        <Tab label="Rollar"/>
                                    </Tabs>
                                    <TabPanel value={tabIndex} index={0}>
                                        <ProfilePhotoCard employee={initialValues.employee}
                                                          onFileChange={(newFileId) =>
                                                              setInitialValues((prev) => ({
                                                                  ...prev,
                                                                  employee: {
                                                                      ...prev.employee,
                                                                      fileId: newFileId,
                                                                  },
                                                              }))
                                                          }
                                        />
                                        <MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                                <Typography variant="body1">Şəxsi məlumatlar</Typography>
                                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
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
                                                                    name="employee.tableNumber"
                                                                    placeholder="Table Nömrəsi"
                                                                    sx={{width: "100%"}}
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
                                                                    <FormField
                                                                        {...params}
                                                                        placeholder="Birbaşa rəhbəri"
                                                                        InputLabelProps={{shrink: true}}
                                                                    />
                                                                )}
                                                                sx={{width: "100%"}}
                                                            />
                                                        )}
                                                    </Field>
                                                </MDBox>
                                                <MDBox display="flex" gap={5}>
                                                    <Field name="employee.firstName">
                                                        {({field, meta}) => (
                                                            <>
                                                                <MDInput
                                                                    {...field}
                                                                    variant="standard"
                                                                    type="text"
                                                                    name="employee.firstName"
                                                                    placeholder="Adı"
                                                                    sx={{width: "100%"}}
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
                                                                    placeholder="Soyadı"
                                                                    sx={{width: "100%"}}
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
                                            <MDBox mt={2}>
                                                <MDBox display='flex' justifyContent='center'
                                                       alignItems='center'
                                                       gap={1}>
                                                    <Typography variant="body1">Sənəd məlumatları</Typography>
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
                                                    <MDBox display="flex" flexDirection="column" gap={5} mt={4}
                                                           mb={4}
                                                           px={2}>
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
                                                                            <FormField
                                                                                {...params}
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
                                                                            <FormField
                                                                                {...params}
                                                                                placeholder="Vətəndaşlığı təsdiq edən sənəd*"
                                                                                required
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
                                                                            <FormField
                                                                                {...params}
                                                                                placeholder="Sənədi verən orqan"
                                                                                InputLabelProps={{shrink: true}}/>
                                                                        )}
                                                                        sx={{width: "100%"}}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </MDBox>
                                                        <MDBox display="flex" gap={5}>
                                                            <Field name="employee.dateOfIssue">
                                                                {({field, form}) => (
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}
                                                                                          adapterLocale="az">
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
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}
                                                                                          adapterLocale="az">
                                                                        <DatePicker
                                                                            label="Sənədin bitmə tarixi"
                                                                            format="DD-MM-YYYY"
                                                                            inputFormat="DD-MM-YYYY"
                                                                            value={field.value || null}
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
                                                <MDBox display='flex' justifyContent='center' alignItems='center'
                                                       gap={1}>
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
                                                    <MDBox display="flex" flexDirection="column" gap={5} mt={4}
                                                           mb={4}
                                                           px={2}>
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
                                                                            <FormField
                                                                                {...params}
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
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}
                                                                                          adapterLocale="az">
                                                                        <DatePicker
                                                                            label="Doğum tarixi"
                                                                            format="DD-MM-YYYY"
                                                                            inputFormat="DD-MM-YYYY"
                                                                            value={field.value || null}
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
                                                                            <FormField
                                                                                {...params}
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
                                                                            <FormField
                                                                                {...params}
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
                                                                            <FormField
                                                                                {...params}
                                                                                placeholder="Cinsi"
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
                                            <MDBox sx={{
                                                display: 'flex',
                                                justifyContent: 'end'
                                            }}>
                                                <MDButton
                                                    onClick={() => {
                                                        handleSubmit(values.employee)
                                                    }}
                                                    variant="gradient" color="info" sx={{
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
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={1}>
                                        <MDBox
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'end'
                                            }}
                                        >
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                onClick={() => handleEditClick(1, null)}
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                İş təcrübəsi əlavə et
                                            </MDButton>
                                        </MDBox>
                                        <DataTable table={{
                                            columns: columnWorkExperience,
                                            rows: initialValues.employeeExperience
                                        }}
                                                   isSorted={false}
                                                   canSearch={false}
                                        />
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={2}>
                                        <MDBox
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'end'
                                            }}
                                        >
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                onClick={() => handleEditClick(2, null)}
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                Ailə üzvü əlavə et
                                            </MDButton>
                                        </MDBox>
                                        <DataTable
                                            table={{columns: columnFamilyMembers, rows: initialValues.empFamilyMembers}}
                                            isSorted={false}
                                            canSearch={false}
                                        />
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={3}>
                                        <MDBox>
                                            <MDBox
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'end'
                                                }}
                                            >
                                                <MDButton
                                                    variant="gradient"
                                                    color="primary"
                                                    onClick={() => handleEditClick(3, null, 'education')}
                                                    sx={{
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            boxShadow: "none",
                                                        },
                                                    }}
                                                >
                                                    <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                    Təhsil əlavə et
                                                </MDButton>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                                <Typography variant="body1">Təhsil</Typography>
                                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                                            </MDBox>
                                            <DataTable table={{
                                                columns: columnEducation,
                                                rows: initialValues.employeeEducation
                                            }}
                                                       isSorted={false}
                                                       canSearch={false}
                                            />
                                        </MDBox>

                                        <MDBox mt={4}>
                                            <MDBox
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'end'
                                                }}
                                            >
                                                <MDButton
                                                    variant="gradient"
                                                    color="primary"
                                                    onClick={() => handleEditClick(3, null, 'course')}
                                                    sx={{
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            boxShadow: "none",
                                                        },
                                                    }}
                                                >
                                                    <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                    Kurs əlavə et
                                                </MDButton>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                                <Typography variant="body1">Kurslar və Sertifikatlar</Typography>
                                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                                            </MDBox>
                                            <DataTable
                                                table={{
                                                    columns: columnCourseCertification,
                                                    rows: initialValues.employeeCourseAndCertification
                                                }}
                                                isSorted={false}
                                                canSearch={false}
                                            />
                                        </MDBox>

                                        <MDBox mt={4}>
                                            <MDBox
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'end'
                                                }}
                                            >
                                                <MDButton
                                                    variant="gradient"
                                                    color="primary"
                                                    onClick={() => handleEditClick(3, null, 'lang')}
                                                    sx={{
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            boxShadow: "none",
                                                        },
                                                    }}
                                                >
                                                    <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                    Dil biliyi əlavə et
                                                </MDButton>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                                <Typography variant="body1">Dil bilikləri</Typography>
                                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                                            </MDBox>
                                            <DataTable table={{
                                                columns: columnLanguageSkills,
                                                rows: initialValues.employeeLanguageSkill
                                            }}
                                                       isSorted={false}
                                                       canSearch={false}
                                            />
                                        </MDBox>
                                        <MDBox mt={4}>
                                            <MDBox
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'end'
                                                }}
                                            >
                                                <MDButton
                                                    variant="gradient"
                                                    color="primary"
                                                    onClick={() => handleEditClick(3, null, 'comp')}
                                                    sx={{
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            boxShadow: "none",
                                                        },
                                                    }}
                                                >
                                                    <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                    Komputer biliyi əlavə et
                                                </MDButton>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='center' gap={1}>
                                                <Typography variant="body1">Komputer bilikləri</Typography>
                                                <MDBox flex={1} sx={{borderBottom: "2px solid #E5E9EF"}}/>
                                            </MDBox>
                                            <DataTable table={{
                                                columns: columnComputerSkills,
                                                rows: initialValues.employeeComputerSkill
                                            }}
                                                       isSorted={false}
                                                       canSearch={false}
                                            />
                                        </MDBox>
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={5}>
                                        <MDBox
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'end'
                                            }}
                                        >
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                onClick={() => handleEditClick(5, null)}
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                Kontakt əlavə et
                                            </MDButton>
                                        </MDBox>
                                        <DataTable
                                            table={{columns: columnContactDetail, rows: initialValues.employeeContact}}
                                            isSorted={false}
                                            canSearch={false}/>
                                    </TabPanel>
                                    <TabPanel value={tabIndex} index={4}>
                                        <MDBox
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'end'
                                            }}
                                        >
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                onClick={() => handleEditClick(4, null)}
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                Hərbi mükəlləfiyyət əlavə et
                                            </MDButton>
                                        </MDBox>
                                        <DataTable table={{
                                            columns: columnMilitaryConscripts,
                                            rows: initialValues.employeeMilitary
                                        }}
                                                   isSorted={false}
                                                   canSearch={false}
                                        /> </TabPanel>
                                    <TabPanel value={tabIndex} index={6}>
                                        <MDBox
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'end'
                                            }}
                                        >
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                onClick={() => handleEditClick(6, null)}
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                Rol əlavə et
                                            </MDButton>
                                        </MDBox>
                                        <DataTable
                                            table={{columns: columnRolesDetail, rows: initialValues.employeeRoles}}
                                            isSorted={false}
                                            canSearch={false}/>
                                    </TabPanel>
                                </Box>
                            </DashboardLayout>
                        </CardContent>
                    </Card>
                    <DeleteConfirmation
                        open={openConfirmationModal}
                        onClose={() => setOpenConfirmationModal(false)}
                        onConfirm={handleConfirmDelete}/>
                </Form>
            )}
        </Formik>
    )
}

export default EditEmployee;