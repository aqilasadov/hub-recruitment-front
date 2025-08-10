import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import MDBox from "../../components/MDBox";
import {Icon, IconButton} from "@mui/material";
import Edit from "../../assets/images/icons/pencil-alt.svg";
import Delete from "../../assets/images/icons/trash.svg";
import apiClient from "../../apiClient";
import {baseURL} from "../../utils/Url";
import {toast} from "react-toastify";
import * as XLSX from "xlsx";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Loader from "../../components/loader/Loader";
import Card from "@mui/material/Card";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import download from "../../assets/images/icons/download.svg";
import filter from "../../assets/images/icons/filter.svg";
import DataTable from "../../examples/Tables/DataTable";
import DeleteConfirmation from "../../components/Modals/DeleteConfirmation";
import {saveAs} from 'file-saver';
import MDInput from "../../components/MDInput";


const PrivilegeFilter = ({isOpen, onClose, onApplyFilter}) => {
    const [privName, setPrivName] = useState([]);
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleApply = () => {
        onApplyFilter({privName});
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
                        <MDInput placeholder="İcazə adı"
                                 value={privName}
                                 onChange={(e) => setPrivName(e.target.value)}/>
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
    const [privilegesList, setPrivilegesList] = useState([]);
    const [dataTableData, setDataTableData] = useState({columns: [], rows: []});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({privilegesName: ""});
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] = useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('PRIVILEGES_ADD'));
        setAllowUpdating(privilege.includes('PRIVILEGES_EDIT'));
        setAllowDeleting(privilege.includes('PRIVILEGES_DELETE'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);


    const columns = [
        {
            Header: "İcazənin adı", accessor: "privilegeTitle"
        },
        {
            Header: "İcazənin kodu", accessor: "privilegeCode"
        },
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];

    const renderActions = (row) => {
        const id = row.original?.privilegeId;
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


    const fetchPrivilegeList = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(
                `${baseURL}/privileges`
            );
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setPrivilegesList(data);

            }
        } catch (error) {

            setLoading(false);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPrivilegeList();
    }, []);

    useEffect(() => {
        const updatedRows = privilegesList.map((item) => ({
            privilegeId: item.privilegeId,
            privilegeTitle: item.privilegeTitle,
            privilegeCode: item.privilegeCode,
            actions: renderActions(item),
        }));

        setDataTableData((prevData) => ({
            ...prevData,
            columns: columns,
            rows: updatedRows,
        }));
    }, [privilegesList]);


    const handleEdit = (row) => {

        navigate(`/modules/privileges/edit/${row.original.privilegeId}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);
        setOpenConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/privileges/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
                    setDataTableData((prevData) => {
                        const updatedRows = prevData.rows.filter(
                            (i) => i.privilegeId !== selectedClientIdToDelete
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


    const exportableColumns = columns.filter((col) => col.accessor !== "actions");

    const prepareExportData = () => {
        return privilegesList.map((row) => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "privileges");
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
                                        İcazələr
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
                                                onClick={() => navigate('/modules/privileges/new')}
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
                                                Yeni İcazə yarat
                                            </MDButton>

                                        )
                                    }
                                </MDBox>
                            </MDBox>
                            <DataTable table={dataTableData} canSearch/>
                        </Card>
                        <PrivilegeFilter
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