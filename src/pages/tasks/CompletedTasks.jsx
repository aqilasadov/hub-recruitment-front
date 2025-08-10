import {useEffect, useState} from "react";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import {Autocomplete, Icon, IconButton, TextField} from "@mui/material";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import FormField from "../../layouts/applications/wizard/components/FormField";
import {useNavigate} from "react-router-dom";
import Edit from "../../assets/images/icons/pencil-alt.svg";
import Delete from "../../assets/images/icons/trash.svg";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import download from "../../assets/images/icons/download.svg";
import filter from "../../assets/images/icons/filter.svg";
import DataTable from "../../examples/Tables/DataTable";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import {saveAs} from 'file-saver';
import * as XLSX from "xlsx";
import Loader from "../../components/loader/Loader";
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import {toast} from "react-toastify";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import Eyes from "../../assets/images/icons/eye-svgrepo-com.svg";

const CompletedListFilter = ({isOpen, onClose, onApplyFilter, setFilters, setCompletedList, filters}) => {
    console.log('filters', filters);
    const [employeeList, setEmployeeList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const fetchCompletedTaskList = (filterItems = {}) => {
        if (filterItems.executiveEmployeeId === null || filterItems.executiveEmployeeId === undefined) {
            filterItems.executiveEmployeeId = -1;
        }
        const obj = {
            ...filterItems,
            taskStatus: 2
        }
        setLoading(true);
        try {
            const response = apiClient.post(`${baseURL}/task/filter`, obj);
            if (response.status >= 200 && response.status < 300) {
                const data = response?.data.data || response?.data;
                setCompletedList(data);
            }

        } catch (error) {
            toast.error(error);
            setLoading(false);
        } finally {
            setLoading(false)
        }

    }

    const handleApply = () => {
        fetchCompletedTaskList(filters)
        onClose();
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
        fetchCompletedTaskList(filters);
    }, []);


    if (!isOpen) return null;

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
                        <Autocomplete
                            options={employeeList}
                            getOptionLabel={(option) =>
                                option.firstName + " " + option.lastName || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                                option.empId === value.empId
                            }
                            value={employeeList.find(
                                (emp) =>
                                    emp.empId === filters.executiveEmployeeId || null
                            )}
                            onChange={(event, newValue) => {
                                setFilters(prev => ({
                                    ...prev,
                                    executiveEmployeeId: newValue?.empId || null
                                }));
                            }}
                            renderInput={(params) => (
                                <FormField
                                    {...params}
                                    label="İcraçı"
                                    InputLabelProps={{shrink: true}}
                                />
                            )}
                            sx={{width: "100%"}}
                        />
                        <Autocomplete
                            options={["option1", "option2"]}
                            value={filters.taskStatus}
                            renderInput={(params) => (
                                <FormField {...params} placeholder="Status" InputLabelProps={{shrink: true}}/>
                            )}
                        />
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="az"
                        >
                            <DatePicker
                                label="Başlama tarixi"
                                format="DD-MM-YYYY"
                                inputFormat="DD-MM-YYYY"
                                value={filters.startDate || null}
                                onChange={(newValue) => {
                                    setFilters(prev => ({
                                        ...prev,
                                        startDate: newValue
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        variant="standard"
                                        InputLabelProps={{shrink: true}}
                                        name="startDate"
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="az"
                        >
                            <DatePicker
                                label="Bitmə tarixi"
                                format="DD-MM-YYYY"
                                inputFormat="DD-MM-YYYY"
                                value={filters.endDate || null}
                                onChange={(newValue) => {
                                    setFilters(prev => ({
                                        ...prev,
                                        endDate: newValue
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        variant="standard"
                                        InputLabelProps={{shrink: true}}
                                        name="endDate"
                                    />
                                )}
                            />
                        </LocalizationProvider>


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
    const [completedList, setCompletedList] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [datatableData, setDatatableData] = useState({columns: [], rows: []});
    const [loading, setLoading] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] = useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [filters, setFilters] = useState({
        executiveEmployeeId: null,
        taskStatus: null,
        startDate: null,
        endDate: null,
    })
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowUpdating(privilege.includes('TASKS_EDIT'));
        setAllowDeleting(privilege.includes('TASKS_DELETE'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);

    const columns = [
        {Header: "İcraçı", accessor: "employee"},
        {Header: "Tapşırıq başlığı", accessor: "taskTitle"},
        {Header: "Tapşırıq məzmunu", accessor: "taskContent"},
        {Header: "Tapşırığın son icra tarixi", accessor: "taskDeadlineDate"},
        {Header: "Müraciət tarixi", accessor: "createDate"},
        {Header: "Status", accessor: "isActive"},
        {Header: "Qeyd", accessor: "note"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];

    const handleEdit = (row) => {
        navigate(`/modules/task/edit/${row.original.id}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);
        setOpenConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/task/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
                    setDatatableData((prevData) => {
                        const updatedRows = prevData.rows.filter(
                            (i) => i.taskId !== selectedClientIdToDelete
                        );
                        return {
                            ...prevData,
                            rows: updatedRows,
                        };
                    });
                    setOpenConfirmationModal(false);
                }
            } catch (error) {

            }
        }
    };

    const fetchCompletedTaskList = async (filterItems = {}) => {
        filterItems.executiveEmployeeId = -1;
        const obj = {
            ...filterItems,
            taskStatus: 2
        }
        setLoading(true);
        try {
            const response = await apiClient.post(`${baseURL}/task/filter`, obj);
            if (response.status >= 200 && response.status < 300) {
                const data = response?.data.data || response?.data;
                setCompletedList(data);
                console.log('completedList', completedList)
            }

        } catch (error) {
            toast.error(error);
            setLoading(false);
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchCompletedTaskList(filters);
    }, []);

    useEffect(() => {
        const updateRows = completedList?.map((item) => ({
            taskId: item.taskId,
            executiveEmployeeId: item.executiveEmployeeId,
            employee: item.employee,
            taskTitle: item.taskTitle,
            taskContent: item.taskContent,
            taskDeadlineDate: item.taskDeadlineDate,
            note: item.note,
            isActive: item.isActive ? 'Aktiv' : 'Passiv'
        }))
        setDatatableData((prev) => ({
            ...prev,
            columns: columns,
            rows: updateRows
        }))
    }, [completedList]);
    const handleView = (id) => {
        navigate(`/modules/task/view/${id}`);
    };

    const renderActions = (row) => {
        const id = row.original?.taskId;
        return (
            <MDBox
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
            >
                <>
                    <IconButton
                        size="small"
                        onClick={() => {
                            handleView(id);
                        }}
                    >
                        <img src={Eyes} alt="Baxış"/>
                    </IconButton>
                    {
                        allowUpdating && (
                            <IconButton size="small" onClick={() => {
                                handleEdit(row);
                            }}>
                                <img src={Edit} alt="Edit"/>
                            </IconButton>
                        )
                    }
                    {
                        allowDeleting && (
                            <IconButton size="small" onClick={() => {
                                handleDelete(id);
                            }}>
                                <img src={Delete} alt="Delete"/>
                            </IconButton>
                        )
                    }
                </>
            </MDBox>
        );
    };

    const exportableColumns = columns.filter((col) => col.accessor !== "actions");

    const prepareExportData = () => {
        return completedList.map((row) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bitmiş tapşırıqlar");
        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(data, 'bitmistapsiriqlar.xlsx');
    };

    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
        console.log(isFilterModalOpen);
    };

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
        console.log("close");
    };


    const applyFilter = (filterValues) => {
        setFilters(filterValues);
    };

    if (loading) return <Loader/>
    return (
        <>
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
                                    İcrası bitmiş tapşırıqlar
                                </MDTypography>

                            </MDBox>
                            <MDBox display="flex" gap={2} alignItems="center" pr={3} m={3}>
                                <MDButton variant="text" color="darkBlue" onClick={handleExportAsXlsx}>
                                    <img
                                        src={download}
                                        alt="download"
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            marginRight: "8px",
                                        }}
                                    />
                                    Excel faylı endir
                                </MDButton>
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
                            </MDBox>
                        </MDBox>
                        <DataTable table={datatableData} canSearch/>
                    </Card>
                    <CompletedListFilter

                        isOpen={isFilterModalOpen}
                        onClose={handleFilterModalClose}
                        onApplyFilter={applyFilter}
                        setFilters={setFilters}
                        filters={filters}
                        setCompletedList={setCompletedList}
                    />
                    <DeleteConfirmation
                        open={openConfirmationModal}
                        onClose={() => setOpenConfirmationModal(false)}
                        onConfirm={handleConfirmDelete}/>
                </MDBox>
            </MDBox>
        </>
    )
}

export default DataTables;