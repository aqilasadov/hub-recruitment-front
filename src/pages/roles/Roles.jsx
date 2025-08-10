import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import {Autocomplete, Icon, IconButton} from "@mui/material";
import MDInput from "../../components/MDInput";
import FormField from "../../layouts/applications/wizard/components/FormField";
import MDButton from "../../components/MDButton";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Edit from "../../assets/images/icons/pencil-alt.svg";
import Delete from "../../assets/images/icons/trash.svg";
import * as XLSX from "xlsx";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Loader from "../../components/loader/Loader";
import Card from "@mui/material/Card";
import download from "../../assets/images/icons/download.svg";
import filter from "../../assets/images/icons/filter.svg";
import DataTable from "../../examples/Tables/DataTable";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import {saveAs} from 'file-saver';
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import {toast} from "react-toastify";


const RolesFilter = ({isOpen, onClose, onApplyFilter}) => {
    const [roleName, setRoleName] = useState([]);
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleApply = () => {
        onApplyFilter({roleName});
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
                        <MDInput placeholder="Rol adı"
                                 value={roleName}
                                 onChange={(e) => setRoleName(e.target.value)}/>
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
    const [roleList, setRoleList] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({privilegesName: ""});
    const [datatableData, setDatatableData] = useState({columns: [], rows: []});
    const [loading, setLoading] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] = useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('ROLES_ADD'));
        setAllowUpdating(privilege.includes('ROLES_EDIT'));
        setAllowDeleting(privilege.includes('ROLES_DELETE'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);


    const columns = [
        {Header: "İmtiyaz adı", accessor: "title"},
        {Header: "Status", accessor: "isActive"},

        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];


    const fetchRoleList = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(
                `${baseURL}/roles`
            );
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setRoleList(data);

            }
        } catch (error) {

            setLoading(false);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRoleList();
    }, []);

    useEffect(() => {
        const updatedRows = roleList.map((item) => ({
            id: item.id,
            title: item.title,
            isActive: item.isActive ? 'Aktiv' : 'Passiv',
            actions: renderActions(item),
        }));

        setDatatableData((prevData) => ({
            ...prevData,
            columns: columns,
            rows: updatedRows,
        }));
    }, [roleList]);


    const handleEdit = (row) => {

        navigate(`/modules/roles/edit/${row.original.id}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);
        setOpenConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/roles/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
                    setDatatableData((prevData) => {
                        const updatedRows = prevData.rows.filter(
                            (i) => i.id !== selectedClientIdToDelete
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
        const id = row.original?.id;
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
                            <IconButton size="small" onClick={() => {
                                handleEdit(row)
                            }}>
                                <img src={Edit} alt="Edit"/>
                            </IconButton>
                        )
                    }
                    {
                        allowDeleting && (
                            <IconButton size="small" onClick={() => {
                                handleDelete(id)
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
        return roleList.map((row) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "roles");
        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(data, 'roles.xlsx');
    };

    const applyFilter = (filterValues) => {
        setFilters(filterValues);
    };

    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
    };

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
    };


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
                                        İmtiyazlar
                                    </MDTypography>

                                </MDBox>
                                <MDBox display="flex" gap={2} alignItems="center" pr={3}>
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
                                    {
                                        allowAdding && (
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                onClick={() => navigate('/modules/roles/new')}
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">
                                                    add
                                                </Icon>
                                                Yeni İmtiyaz yarat
                                            </MDButton>
                                        )
                                    }
                                </MDBox>
                            </MDBox>
                            <DataTable table={datatableData} canSearch/>
                        </Card>
                        <RolesFilter
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