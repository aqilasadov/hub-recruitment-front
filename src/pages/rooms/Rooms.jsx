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
    const [roomsList, setRoomList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
        useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('ROOM_ADD'));
        setAllowUpdating(privilege.includes('ROOM_EDIT'));
        setAllowDeleting(privilege.includes('ROOM_DELETE\t\n'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);


    const columns = [
        {Header: "Adı", accessor: "roomName", width: "20%"},

        {
            Header: "",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "5%",
        },
    ];

    const [datatableData, setDatatableData] = useState({columns, rows: []});

    const fetchRoomList = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${baseURL}/room/room-type`);
            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setRoomList(data);
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const updatedRows = roomsList.map((room) => ({
            roomId: room.roomId,
            roomName: room.roomName,
            isActive: room.isActive === 1 ? "Active" : "Passive",
            isArchive: room.isArchive === 1 ? "NotArchive" : "Archived",
            actions: renderActions(room),
        }));

        setDatatableData((prevData) => ({
            ...prevData,
            rows: updatedRows,
        }));
    }, [roomsList]);

    const handleEdit = (row) => {

        navigate(`/modules/settings/rooms/edit/${row.original.roomId}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);

        setOpenConfirmationModal(true); // Open confirmation modal
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/room/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
                    setDatatableData((prevData) => {
                        const updatedRows = prevData.rows.filter(
                            (i) => i.roomId !== selectedClientIdToDelete
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
        const id = row.original?.roomId;

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
        fetchRoomList();
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
                                        Otaqlar
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
                                                onClick={() => navigate("/modules/settings/rooms/new")}
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
