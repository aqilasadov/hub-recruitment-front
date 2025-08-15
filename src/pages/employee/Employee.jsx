import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import MDBox from "../../components/MDBox";
import Loader from "../../components/loader/Loader";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";
import * as XLSX from "xlsx";
import saveAs from 'file-saver';
import MDButton from "../../components/MDButton";
import DataTable from "examples/Tables/DataTable";
import download from "../../assets/images/icons/download.svg";
import filter from "../../assets/images/icons/filter.svg";
import {
    Autocomplete,
    FormControl,
    Icon,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import MDInput from "../../components/MDInput";
import Edit from "../../assets/images/icons/pencil-alt.svg";
import Delete from "../../assets/images/icons/trash.svg";
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import {fetchFileWithAuth} from "../../utils/fetchFileWithAuth";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import {toast} from "react-toastify";
import defaultAvatar from '../../assets/images/default-avatar.jpg'
import MoreVertIcon from "@mui/icons-material/MoreVert";


const EmployeeFilter = ({isOpen, onClose, onApplyFilter}) => {
    const [tableNumber, setTableNumber] = useState("");
    const [finCode, setFinCode] = useState("");
    const [name, setName] = useState("");
    const [surName, setSurname] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);


    useEffect(() => {
        const fetchDepList = async () => {
            try {
                const response = await apiClient.get(`${baseURL}/departments`);
                if (response) {
                    const data = response.data;
                    setDepartmentOptions(data);
                }
            } catch (error) {
                console.log("Error fetching deplist", error);
            }
        };

        if (isOpen) {
            fetchDepList();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }

    };

    const handleApply = () => {
        onApplyFilter({name});
        onClose();
    };


    return (
        <>
            {/* Overlay */}
            <MDBox
                onClick={handleOverlayClick}
                sx={{
                    display: isOpen ? "block" : "none",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "transparent",
                    zIndex: 999
                }}
            />
            {/* Modal */}
            <MDBox sx={{
                display: isOpen ? "block" : "none",
                position: "absolute",
                top: "80px",
                right: "230px",
                width: "300px",
                padding: "12px",
                background: "white",
                backgroundColor: "white",
                bgColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                zIndex: 1000
            }}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography variant="body3" fontWeight="regular" color="grey.900">Filterlər</MDTypography>
                    <IconButton onClick={onClose}>
                        <Icon>close</Icon>
                    </IconButton>
                </MDBox>
                <MDBox>

                    <MDBox display="flex" flexDirection="column" gap={1}>
                        <MDInput label="Finkodu"
                                 value={finCode}
                                 onChange={(e) => setFinCode(e.target.value)}/>
                        <MDInput label="Adı"
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}/>
                        <MDInput label="Soyadı"
                                 value={surName}
                                 onChange={(e) => setSurname(e.target.value)}/>

                    </MDBox>
                    <MDBox display="flex" justifyContent="center" mt={2}>
                        <MDButton sx={{fontSize: "14px", opacity: 0.5}} variant="text" color="gold"
                                  onClick={handleApply}>Tətbiq et <Icon sx={{ml: 1}}
                                                                        fontSize="small">arrow_forward</Icon></MDButton>
                    </MDBox>
                </MDBox>
            </MDBox>
        </>


    )

}


function DataTables() {
    const navigate = useNavigate();
    const [employeeList, setEmployeeList] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({name: ''});
    const [dataTableData, setDataTableData] = useState({columns: [], rows: []});
    const [loading, setLoading] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [view, setView] = useState('list');
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEmpId, setSelectedEmpId] = useState(null);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('EMPLOYEE_ADD'));
        setAllowUpdating(privilege.includes('EMPLOYEE_EDIT'));
        setAllowDeleting(privilege.includes('EMPLOYEE_DELETE'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);


    const columns = [
        {
            Header: "Şəkil",
            accessor: "imageUrl",
            Cell: ({row}) => (
                <img
                    loading="lazy"
                    src={row.original.imageUrl}
                    alt="Şəkil"
                    style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        display: "block",
                    }}
                />

            ),
        },
        {Header: 'Tabel nömrəsi', accessor: 'tableNumber'},
        {Header: 'Adı', accessor: 'firstName'},
        {Header: 'Soyadı', accessor: 'lastName'},
        {Header: 'Ata adı', accessor: 'fatherName'},
        {Header: 'Departament', accessor: 'department'},
        {Header: 'İstifadəçi adı', accessor: 'username'},
        {Header: 'Finkod', accessor: 'fin'},
        {Header: 'Vəzifəsi', accessor: 'position'},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];


    const handleEdit = (row) => {
        navigate(`/modules/employees/edit/${row.original.empId}`)
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);
        console.log("Selected ID for delete:", id);
        setOpenConfirmationModal(true);
        handleMenuClose();
    };

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        console.log('id', id)
        setSelectedClientIdToDelete(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEmpId(null);
    };

    const renderActions = (row) => {
        const id = row.original?.empId;
        return (
            <MDBox
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
            >
                <>
                    {
                        allowUpdating && (
                            <IconButton size="small" onClick={() => handleEdit(row)}>
                                <img src={Edit} alt="Edit"/>
                            </IconButton>
                        )
                    }
                    {
                        allowDeleting && (
                            <IconButton size="small" onClick={() => handleDelete(id)}>
                                <img src={Delete} alt="Delete"/>
                            </IconButton>
                        )
                    }
                </>
            </MDBox>
        );
    };


    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
    };

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
    };

    // const applyFilter = (filterValues) => {
    //     setFilters(filterValues);
    //     setFilteredData(employeeList);
    // };

    const fetchEmployeeList = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/employees`);
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;

                const updatedList = await Promise.all(
                    data.map(async (emp) => {
                        if (emp.fileId) {
                            try {
                                const file = await fetchFileWithAuth(emp.fileId);
                                const imageUrl = URL.createObjectURL(file);
                                return {...emp, imageUrl};
                            } catch (error) {
                                console.error("Resim yüklenemedi:", error);
                                return {...emp, imageUrl: null};
                            }
                        } else {
                            return {...emp, imageUrl: null};
                        }
                    })
                );


                setEmployeeList(updatedList);
            }
        } catch (error) {
            console.log("Error fetching product list", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const updatedRows = employeeList.map((emp) => ({
            empId: emp.empId,
            tableNumber: emp.tableNumber,
            firstName: emp.firstName,
            lastName: emp.lastName,
            fatherName: emp.fatherName,
            department: emp.department,
            username: emp.username,
            fin: emp.fin,
            position: emp.position,
            imageUrl: emp.imageUrl,
            actions: renderActions(emp),
        }));

        setDataTableData({
            columns,
            rows: updatedRows,
        });
    }, [employeeList]);


    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/employees/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success(("Məlumat müvəffəqiyyətlə silindi") + "!", {
                        autoClose: 8000,
                        pauseOnHover: true,
                        closeOnClick: true,
                    });
                    setDataTableData((prevData) => {
                        console.log('prevData', prevData);
                        const updatedRows = prevData.rows.filter((i) => i.empId !== selectedClientIdToDelete);
                        return {
                            ...prevData,
                            rows: updatedRows,
                        };
                    });
                    setOpenConfirmationModal(false);
                }
            } catch (error) {
                console.log("Error deleting building:", error);
            }
        }
    };

    useEffect(() => {
        fetchEmployeeList();
    }, []);

    const exportableColumns = columns.filter((col) => col.accessor !== "actions");

    const prepareExportData = () => {
        return employeeList.map((row) => {
            const filteredRow = {};
            exportableColumns.forEach((col) => {
                filteredRow[col.Header] = row[col.accessor];
            });
            return filteredRow;
        });
    };
    const handleExportAsXlsx = () => {
        const exportData = prepareExportData();
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Vakantlar");
        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(data, 'isci-melumatlari.xlsx');
    };

    const applyFilter = () => {

    }

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

    const renderEmployeeCards = () => (
        <MDBox display="grid"
               gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))"
               gap={3}
               p={2}>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    handleDelete(selectedClientIdToDelete)
                }}>Sil</MenuItem>
            </Menu>
            {employeeList.map((employee) => (
                <Card key={employee.empId} sx={{width: '100%'}}>
                    <MDBox p={2} textAlign="center">
                        <img
                            src={employee.imageUrl ? employee.imageUrl : defaultAvatar}
                            alt={`${employee.firstName} ${employee.lastName}`}
                            style={{width: '100%', height: 300, borderRadius: "4%", objectFit: "cover"}}
                        />
                        <MDBox position="absolute" top={20} right={20}>
                            <IconButton onClick={(e) => handleMenuOpen(e, employee.empId)}>
                                <MoreVertIcon/>
                            </IconButton>
                        </MDBox>
                        <MDTypography
                            variant="h6">{`${employee.firstName} ${employee.lastName} ${employee.fatherName}`}</MDTypography>
                        <MDBox mt={1}>
                            {
                                allowUpdating && (
                                    <MDButton
                                        variant="outlined"
                                        color="info"
                                        size="small"
                                        onClick={() => navigate(`/modules/employees/edit/${employee.empId}`)}
                                    >
                                        Detallı bax
                                    </MDButton>
                                )
                            }
                        </MDBox>
                    </MDBox>
                </Card>
            ))}
        </MDBox>
    );


    return (
        <>
            <DashboardLayout>
                <DashboardNavbar/>
                <MDBox pt={6} pb={3}>
                    <MDBox mb={3} position="relative">
                        <Card>
                            <MDBox
                                display="flex"
                                justifyContent="space-between"
                                gap={2}
                                alignItems="center"
                            >
                                <MDBox p={3} lineHeight={1}>
                                    <MDTypography variant="h5" fontWeight="medium">
                                        Vakantlar
                                    </MDTypography>
                                </MDBox>
                                <MDBox display="flex" gap={2} alignItems="center" pr={3}>
                                    <MDBox>
                                        <IconButton sx={{color: '#636366'}} onClick={() => setView("grid")}>
                                            <Icon>grid_view</Icon>
                                        </IconButton>
                                        <IconButton sx={{color: '#636366'}} onClick={() => setView("list")}>
                                            <Icon>list_alt</Icon>
                                        </IconButton>
                                    </MDBox>
                                    <MDButton
                                        variant="outlined"
                                        color="darkBlue"
                                        onClick={handleFilterModalOpen}
                                        position="relative"
                                    >
                                        <img
                                            src={filter}
                                            alt="filter"
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                marginRight: "8px",
                                            }}
                                        />
                                        Filterlər
                                    </MDButton>
                                    {
                                        allowAdding && (
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                onClick={() => navigate('/modules/employees/new')}
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                Yeni İşçi
                                            </MDButton>
                                        )
                                    }
                                </MDBox>
                            </MDBox>
                            {view === "grid" ? (
                                renderEmployeeCards()
                            ) : (
                                <DataTable table={dataTableData} canSearch/>
                            )}
                        </Card>
                        <EmployeeFilter
                            isOpen={isFilterModalOpen}
                            onClose={handleFilterModalClose}
                            onApplyFilter={applyFilter}
                        />
                        <DeleteConfirmation
                            open={openConfirmationModal}
                            onClose={() => setOpenConfirmationModal(false)}
                            onConfirm={handleConfirmDelete}/>
                    </MDBox>

                </MDBox>
            </DashboardLayout>
        </>
    )

}

export default DataTables;