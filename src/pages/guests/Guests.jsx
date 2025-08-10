// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import MDButton from "components/MDButton";
import {Icon, IconButton, Menu, MenuItem, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import MDInput from "components/MDInput";
import filter from "assets/images/icons/filter.svg";
import Edit from "assets/images/icons/pencil-alt.svg";
import Delete from "assets/images/icons/trash.svg";
import apiClient from "apiClient";
import {baseURL} from "utils/Url";
import Loader from "components/loader/Loader";
import DeleteConfirmation from "components/Modals/DeleteConfirmation";
import {toast} from "react-toastify";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/az";

const GuestsFilter = ({isOpen, onClose, onApplyFilter}) => {
    const [participantFullname, setParticipantFullname] = useState("");
    const [participantCompanyName, setParticipantCompanyName] = useState("");
    const [inDate, setInDate] = useState(null);
    const [outDate, setOutDate] = useState(null);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleApply = () => {
        onApplyFilter({
            participantFullname,
            participantCompanyName,
            inDate,
            outDate,
        });
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
                    zIndex: 999,
                }}
            />
            {/* Modal */}
            <MDBox
                sx={{
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
                    zIndex: 1000,
                }}
            >
                <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <MDTypography variant="body3" fontWeight="regular" color="grey.900">
                        Filterlər
                    </MDTypography>
                    <IconButton onClick={onClose}>
                        <Icon>close</Icon>
                    </IconButton>
                </MDBox>
                <MDBox>
                    <MDBox display="flex" flexDirection="column" gap={1}>
                        <MDInput
                            placeholder="Qonaqın adı"
                            value={participantFullname}
                            onChange={(e) => setParticipantFullname(e.target.value)}
                        />
                        <MDInput
                            placeholder="Şirkət"
                            value={participantCompanyName}
                            onChange={(e) => setParticipantCompanyName(e.target.value)}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                            <DatePicker
                                label="Gəlmə tarix"
                                value={inDate}
                                onChange={(newValue) => setInDate(newValue)}
                                format="DD/MM/YYYY"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        name="inDate"
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
                            <DatePicker
                                label="Çıxma tarix"
                                value={outDate}
                                onChange={(newValue) => setOutDate(newValue)}
                                format="DD/MM/YYYY"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        name="outDate"
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </MDBox>
                    <MDBox display="flex" justifyContent="center" mt={2}>
                        <MDButton
                            sx={{fontSize: "14px", opacity: 0.5}}
                            variant="text"
                            color="gold"
                            onClick={handleApply}
                        >
                            Tətbiq et{" "}
                            <Icon sx={{ml: 1}} fontSize="small">
                                arrow_forward
                            </Icon>
                        </MDButton>
                    </MDBox>
                </MDBox>
            </MDBox>
        </>
    );
};

function ActionsMenu({row}) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon fontSize="small" color="darkBlue"/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                transformOrigin={{vertical: "top", horizontal: "right"}}
            >
                <MenuItem>
                    <Icon sx={{mr: 1}} fontSize="small">
                        check
                    </Icon>
                    Təsdiqlə
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleClose();
                    }}
                >
                    <Icon sx={{mr: 1}} fontSize="small">
                        close
                    </Icon>{" "}
                    Ləğv et
                </MenuItem>
            </Menu>
        </>
    );
}

function DataTables() {
    const navigate = useNavigate();
    const [guestList, setGuestList] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        participantFullname: "",
        participantCompanyName: "",
        inDate: "",
        outDate: "",
    });
    const [datatableData, setDatatableData] = useState({columns: [], rows: []});
    const [loading, setLoading] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
        useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);
    const [allowStatusChange, setAllowStatusChange] = useState(false);

    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('GUESTS_ADD'));
        setAllowUpdating(privilege.includes('GUESTS_EDIT'));
        setAllowDeleting(privilege.includes('GUESTS_DELETE'));
        setAllowStatusChange(privilege.includes('GUESTS_STATUS_CHANGE'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);


    const columns = [
        {Header: "Qonaq adı", accessor: "participantFullname", width: "20%"},
        {Header: "Şirkət", accessor: "participantCompanyName", width: "25%"},
        {Header: "Girmə tarixi", accessor: "inDate", width: ""},
        {Header: "Çıxma tarixi", accessor: "outDate"},
        {Header: "Status", accessor: "participantStatusId"},
        {Header: "Qeyd", accessor: "email"},
        {Header: "Qəbul edən şəxs", accessor: "legalAdress"},
        {Header: "Müraciət tarixi", accessor: "note"},

        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];

    const fetchGuestList = async () => {
        setLoading(true);
        try {
            const requestedPayload = {
                participantFullname: "",
                participantCompanyName: "",
                inDate: "",
                outDate: "",
            };
            const response = await apiClient.post(
                `${baseURL}/participant-register/filter-participant-register`,
                requestedPayload
            );
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setGuestList(data);

                const rows = data.map((guest) => ({
                    participantRegisterId: guest.participantRegisterId,
                    participantFullname: guest.participantFullname || "N/A",
                    participantCompanyName: guest.participantCompanyName || "N/A",
                    inDate: guest.inDate
                        ? new Date(guest.inDate).toLocaleString()
                        : "N/A",
                    outDate: guest.outDate
                        ? new Date(guest.outDate).toLocaleString()
                        : "N/A",
                    participantStatusId: guest.participantStatusId || "N/A",
                    email: guest.email || "N/A",
                    legalAdress: guest.legalAdress || "N/A",
                    note: guest.note || "N/A",
                }));
                setDatatableData({columns, rows});
            }
        } catch (error) {

            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (filterValues) => {
        setFilters(filterValues);
    };


    const handleEdit = (row) => {

        navigate(`/modules/guests/edit/${row.original.participantRegisterId}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);

        setOpenConfirmationModal(true); // Open confirmation modal
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/participant-register/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
                    setDatatableData((prevData) => {
                        const updatedRows = prevData.rows.filter(
                            (k) => k.participantRegisterId !== selectedClientIdToDelete
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

    const renderActions = (row) => {
        const id = row.original?.participantRegisterId;
        return (
            <MDBox
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
            >
                {
                    allowStatusChange && (
                        <ActionsMenu row={row}/>
                    )
                }
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

    useEffect(() => {
        fetchGuestList();
    }, []);

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
                                        Qonaqlar
                                    </MDTypography>
                                </MDBox>
                                <MDBox display="flex" gap={2} alignItems="center" pr={3}>
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
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                                onClick={() => navigate("/modules/guests/new")}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">
                                                    add
                                                </Icon>
                                                Yeni Qonaq
                                            </MDButton>
                                        )
                                    }
                                </MDBox>
                            </MDBox>
                            <DataTable table={datatableData} canSearch/>
                        </Card>
                        <GuestsFilter
                            isOpen={isFilterModalOpen}
                            onClose={handleFilterModalClose}
                            onApplyFilter={applyFilter}
                        />
                        <DeleteConfirmation
                            open={openConfirmationModal}
                            onClose={() => setOpenConfirmationModal(false)}
                            onConfirm={handleConfirmDelete}
                        />
                    </MDBox>
                </MDBox>
            </DashboardLayout>
        </>
    );
}

export default DataTables;
