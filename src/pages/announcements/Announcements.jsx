// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import MDButton from "components/MDButton";
import {Autocomplete, Icon, IconButton, Tooltip} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import Edit from "assets/images/icons/pencil-alt.svg";
import Delete from "assets/images/icons/trash.svg";
import download from "assets/images/icons/download.svg";
import apiClient from "apiClient";
import {baseURL} from "utils/Url";
import Loader from "components/loader/Loader";
import DeleteConfirmation from "components/Modals/DeleteConfirmation";
import {toast} from "react-toastify";

const AnnouncementFilter = ({isOpen, onClose, onApplyFilter}) => {
    const [name, setName] = useState("");

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
                            placeholder="Elanın adı"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
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

function DataTables() {
    const navigate = useNavigate();
    const [announcementList, setAnnouncementList] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        name: "",
    });
    const [datatableData, setDatatableData] = useState({columns: [], rows: []});
    const [loading, setLoading] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
        useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);

    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('ANNOUNCEMENTS_ADD'));
        setAllowUpdating(privilege.includes('ANNOUNCEMENTS_EDIT'));
        setAllowDeleting(privilege.includes('ANNOUNCEMENTS_DELETE'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);
    const columns = [
        {Header: "Elan adı", accessor: "announcementName", width: "20%"},
        {Header: "Yaranma tarixi", accessor: "createDate", width: "25%"},

        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];

    const fetchAnnouncementList = async (payload = {}) => {
        setLoading(true);
        try {
            const response = await apiClient.post(`${baseURL}/announcements/filter`, {
                announcementName: payload.announcementName || "",
            });
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setAnnouncementList(data);
                const rows = data.map((item) => ({
                    announcementId: item.announcementId,
                    announcementName: item.announcementName,
                    createDate: new Date(item.createDate).toLocaleString(),
                }));
                setDatatableData({columns, rows});
                setLoading(false);
            }
        } catch (error) {

            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (filterValues) => {
        setFilters(filterValues);
        fetchAnnouncementList({announcementName: filterValues.name});
    };


    const handleEdit = (row) => {

        navigate(`/modules/announcements/edit/${row.original.announcementId}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);

        setOpenConfirmationModal(true); // Open confirmation modal
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/announcements/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
                    setDatatableData((prevData) => {
                        const updatedRows = prevData.rows.filter(
                            (a) => a.announcementId !== selectedClientIdToDelete
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

    const handleRowClick = (row) => {
        const id = row.original.announcementId;
        navigate(`/modules/announcements/${id}`);
    };

    const renderActions = (row) => {
        const id = row.original?.announcementId;
        return (
            <MDBox
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
            >
                <Tooltip title="Baxış">
                    <Icon
                        sx={{mr: 1}}
                        fontSize="small"
                        onClick={() => handleRowClick(row)}
                    >
                        visibility
                    </Icon>
                </Tooltip>
                <>
                    {
                        allowUpdating && (
                            <Tooltip title="Redaktə et">
                                <IconButton size="small" onClick={() => handleEdit(row)}>
                                    <img src={Edit} alt="Edit"/>
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        allowDeleting && (
                            <Tooltip title="Sil">
                                <IconButton size="small" onClick={() => handleDelete(id)}>
                                    <img src={Delete} alt="Delete"/>
                                </IconButton>
                            </Tooltip>
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
        fetchAnnouncementList();
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
                                    Elanlar
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
                                            onClick={() => navigate("/modules/announcements/new")}
                                        >
                                            <Icon sx={{mr: 1}} fontSize="small">
                                                add
                                            </Icon>
                                            Yeni Elan
                                        </MDButton>
                                    )
                                }
                            </MDBox>
                        </MDBox>
                        <DataTable
                            table={datatableData}
                            onRowClick={handleRowClick}
                            canSearch
                        />
                    </Card>
                    <AnnouncementFilter
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
    );
}

export default DataTables;
