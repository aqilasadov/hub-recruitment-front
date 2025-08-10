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
import {Icon, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import Edit from "assets/images/icons/pencil-alt.svg";
import Delete from "assets/images/icons/trash.svg";
import apiClient from "apiClient";
import {baseURL} from "utils/Url";
import Loader from "components/loader/Loader";
import DeleteConfirmation from "components/Modals/DeleteConfirmation";
import {toast} from "react-toastify";


function DataTables() {
    const navigate = useNavigate();
    const [bankList, setBankList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
        useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('BANK_ADD'));
        setAllowUpdating(privilege.includes('BANK_EDIT'));
        setAllowDeleting(privilege.includes('BANK_DELETE'));
    }
    useEffect(() => {
        checkPrivileges();
    }, []);
    const columns = [
        {Header: "Adı", accessor: "bankName", width: "20%"},

        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];

    const [datatableData, setDatatableData] = useState({columns, rows: []});

    const fetchBankList = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(
                `${baseURL}/bank`
            );
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setBankList(data);

            }
        } catch (error) {

            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const updatedRows = bankList.map((bank) => ({
            bankId: bank.bankId,
            bankName: bank.bankName,
            bankShortName: bank.bankShortName,
            isActive: bank.isActive === 1 ? "Active" : "Passive",
            actions: renderActions(bank),
        }));

        setDatatableData((prevData) => ({
            ...prevData,
            rows: updatedRows,
        }));
    }, [bankList]);


    const handleEdit = (row) => {

        navigate(`/modules/settings/banks/edit/${row.original.bankId}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);

        setOpenConfirmationModal(true); // Open confirmation modal
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/bank/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
                    setDatatableData((prevData) => {
                        const updatedRows = prevData.rows.filter(
                            (i) => i.bankId !== selectedClientIdToDelete
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
        const id = row.original?.bankId;

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

    useEffect(() => {
        fetchBankList();
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
                                        Banklar
                                    </MDTypography>
                                </MDBox>
                                <MDBox display="flex" gap={2} alignItems="center" pr={3}>

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
                                                onClick={() => navigate("/modules/settings/banks/new")}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">
                                                    add
                                                </Icon>
                                                Yeni
                                            </MDButton>
                                        )
                                    }
                                </MDBox>
                            </MDBox>
                            <DataTable table={datatableData} canSearch/>
                        </Card>
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
