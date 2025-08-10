import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Card, Icon, IconButton} from "@mui/material";

// Material Dashboard 3 PRO
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Assets
import filter from "assets/images/icons/filter.svg";
import download from "assets/images/icons/download.svg";
import Edit from "assets/images/icons/pencil-alt.svg";
import Delete from "assets/images/icons/trash.svg";

// Utilities
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import apiClient from "apiClient";
import {baseURL} from "utils/Url";
import Loader from "components/loader/Loader";
import DeleteConfirmation from "components/Modals/DeleteConfirmation";
import {toast} from "react-toastify";
import {StoreContext} from "context/StoreContext";

const ContragentFilter = ({isOpen, onClose, onApplyFilter}) => {
    const [kontragentLegalName, setKontragentLegalName] = useState("");
    const [voen, setVoen] = useState("");

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleApply = () => {
        onApplyFilter({kontragentLegalName, voen});
        onClose();
    };

    return (
        <>
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
            <MDBox
                sx={{
                    display: isOpen ? "block" : "none",
                    position: "absolute",
                    top: "80px",
                    right: "230px",
                    width: "300px",
                    padding: "12px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #e0e0e0",
                    borderRadius: "16px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    zIndex: 1100,
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
                <MDBox mt={2}>
                    <MDInput
                        placeholder="Kontragentin adı"
                        value={kontragentLegalName}
                        onChange={(e) => setKontragentLegalName(e.target.value)}
                        fullWidth
                        sx={{mb: 1}}
                    />
                    <MDInput
                        placeholder="Kontragentin VÖENİ"
                        value={voen}
                        onChange={(e) => setVoen(e.target.value)}
                        fullWidth
                    />
                    <MDBox display="flex" justifyContent="center" mt={2}>
                        <MDButton
                            sx={{fontSize: "14px", opacity: 0.5}}
                            variant="text"
                            color="gold"
                            onClick={handleApply}
                        >
                            Tətbiq et
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
    const [contragentList, setContragentList] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({name: "", voen: ""});
    const [datatableData, setDatatableData] = useState({columns: [], rows: []});
    const [loading, setLoading] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
        useState(null);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const {contragentTypes} = useContext(StoreContext);


    console.log("contTypes", contragentTypes)


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('CONTRACTOR_ADD'));
        setAllowUpdating(privilege.includes('CONTRACTOR_EDIT'));
        setAllowDeleting(privilege.includes('CONTRACTOR_DELETE'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);


    const columns = [
        {Header: "Kontragent Kodu", accessor: "kontragentCode", width: "20%"},
        {Header: "Hüquqi adı", accessor: "kontragentLegalName", width: "25%"},
        {Header: "Qısa adı", accessor: "kontragentShortName"},
        {Header: "VÖEN", accessor: "voen"},
        {Header: "Əlaqə nömrəsi", accessor: "phoneNumber"},
        {Header: "Email", accessor: "email"},
        {Header: "Hüquqi ünvanı", accessor: "legalAdress"},
        {Header: "Kontragent növü", accessor: "kontragentTypeId"},
        {Header: "Qeyd", accessor: "note"},
        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];

    const fetchContragentList = async (payload = {}) => {
        setLoading(true);
        try {
            const response = await apiClient.post(
                `${baseURL}/kontragent/filter-kontragent`,
                {
                    kontragentLegalName: payload.kontragentLegalName || "",
                    voen: payload.voen || "",
                }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setContragentList(data);

                const rows = data?.map((item) => {
                    const contragentType = contragentTypes.find(
                        (type) => type.kontragentTypeId === item.kontragentTypeId
                    );

                    return {
                        kontragentId: item.kontragentId,
                        kontragentCode: item.kontragentCode,
                        kontragentLegalName: item.kontragentLegalName,
                        kontragentShortName: item.kontragentShortName,
                        voen: item.voen,
                        phoneNumber: item.phoneNumber,
                        email: item.email,
                        legalAdress: item.legalAdress,
                        kontragentTypeId: contragentType ? contragentType.title : "",
                        // kontragentTypeId: item.kontragentTypeId,
                        note: item.note,
                        isActive: item.isActive === 1 ? "Active" : "Passive",
                    };

                });

                setDatatableData({columns, rows});
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (filterValues) => {
        setFilters(filterValues);
        fetchContragentList({
            kontragentLegalName: filterValues.kontragentLegalName,
            voen: filterValues.voen,
        });
    };

    const handleEdit = (row) => {
        navigate(`/modules/contragents/edit/${row.original.kontragentId}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);
        setOpenConfirmationModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/kontragent/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi!");
                    fetchContragentList(filters); // filterləri saxlayaraq siyahını yenilə
                }
            } catch (error) {

            } finally {
                setOpenConfirmationModal(false);
            }
        }
    };

    const renderActions = (row) => {
        const id = row.original?.kontragentId;
        return (
            <MDBox
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="flex-end"
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

    const handleExportAsXlsx = () => {
        const exportableColumns = columns.filter(
            (col) => col.accessor !== "actions"
        );
        const exportData = contragentList.map((row) => {
            const filteredRow = {};
            exportableColumns.forEach((col) => {
                filteredRow[col.Header] = row[col.accessor];
            });
            return filteredRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Kontragent");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(data, "kontragent.xlsx");
    };


    useEffect(() => {
        if (contragentTypes?.length > 0) {
            fetchContragentList();
        }

    }, [contragentTypes])


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
                            <MDBox p={3}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    Kontragent
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" gap={2} alignItems="center" pr={3}>
                                <MDButton
                                    variant="text"
                                    color="darkBlue"
                                    onClick={handleExportAsXlsx}
                                >
                                    <img
                                        src={download}
                                        alt="download"
                                        style={{width: "18px", marginRight: "8px"}}
                                    />
                                    Excel faylı endir
                                </MDButton>
                                <MDButton
                                    variant="outlined"
                                    color="darkBlue"
                                    onClick={() => setIsFilterModalOpen(true)}
                                >
                                    <img
                                        src={filter}
                                        alt="filter"
                                        style={{width: "18px", marginRight: "8px"}}
                                    />
                                    Filterlər
                                </MDButton>
                                {
                                    allowAdding && (
                                        <MDButton
                                            variant="gradient"
                                            color="primary"
                                            onClick={() => navigate("/modules/contragents/new")}
                                            sx={{boxShadow: "none"}}
                                        >
                                            <Icon sx={{mr: 1}} fontSize="small">
                                                add
                                            </Icon>
                                            Yeni Kontragent
                                        </MDButton>
                                    )
                                }

                            </MDBox>
                        </MDBox>
                        <DataTable table={datatableData} canSearch/>
                    </Card>

                    <ContragentFilter
                        isOpen={isFilterModalOpen}
                        onClose={() => setIsFilterModalOpen(false)}
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
