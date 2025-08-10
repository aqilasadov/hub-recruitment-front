

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/applications/data-tables/data/dataTableData";
import MDButton from "components/MDButton";
import linearGradient from "assets/theme/functions/linearGradient";
import { Autocomplete, Icon, IconButton, MenuItem, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import download from "assets/images/icons/download.svg";
import Edit from "assets/images/icons/pencil-alt.svg";
import Delete from "assets/images/icons/trash.svg";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';





const BudgetFilter = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
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
                        <MDInput placeholder="İl" />
                        <MDBox sx={{
                            border: "1px solid #C7CCD0",
                            borderRadius: "6px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "8px",
                        }}>
                            <Autocomplete
                                variant=""
                                options={["option1", "option2"]}
                                renderInput={(params) => (
                                    <FormField {...params} placeholder="Valyuta" InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                border: "none",
                                                width: '100%',
                                                padding: "0"
                                            },
                                            '& .MuiAutocomplete-input': {
                                                border: "none",
                                                height: "100%",



                                            },

                                            "& .MuiInput-root": {

                                                '&::before': {
                                                    border: 'none',

                                                },
                                                '&::after': {
                                                    border: 'none',

                                                },

                                                '&::hover': {
                                                    border: 'none',

                                                },


                                                '&:hover:not(.Mui-disabled):before': {
                                                    borderBottom: 'none'
                                                },
                                                '&:focus': {
                                                    borderBottom: 'none'
                                                },



                                            },

                                            "& .MuiAutocomplete-inputRoot": {
                                                padding: "0",



                                            }
                                        }}
                                    />
                                )}
                                sx={{ width: "100%" }}
                            />
                        </MDBox>
                    </MDBox>
                    <MDBox display="flex" justifyContent="center" mt={2}>
                        <MDButton sx={{ fontSize: "14px", opacity: 0.5 }} variant="text" color="gold" onClick={onClose}>Tətbiq et <Icon sx={{ ml: 1 }} fontSize="small">arrow_forward</Icon></MDButton>
                    </MDBox>
                </MDBox>
            </MDBox>
        </>


    )
}


function DataTables() {
    const navigate = useNavigate();
    const [budgetList, setBudgetList] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
        useState(null);

    const columns = [
        { Header: "İl", accessor: "userId", width: "20%" },
        { Header: "Göstərici", accessor: "id", width: "25%" },
        { Header: "Göstərici növü", accessor: "title" },
        { Header: "Məbləğ", accessor: "completed", width: "" },



        {
            Header: "",
            accessor: "actions",
            Cell: ({ row }) => renderActions(row),
            width: "5%",
        },
    ];

    const [datatableData, setDatatableData] = useState({ columns, rows: budgetList });

    const fetchContractList = async () => {
        const response = await axios.get(
            "https://jsonplaceholder.typicode.com/todos"
        );
        setBudgetList(response.data);
    };

    useEffect(() => {
        fetchContractList();
    }, []);

    const handleEdit = (row) => {
       
        navigate(`/modules/budget/edit/${row.original.userId}`);
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);
      
        // setOpenConfirmationModal(true); // Open confirmation modal
    };

    const renderActions = (row) => {
        return (
            <MDBox
                display="flex"
                gap={1}
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
            >
                <IconButton size="small" onClick={() => handleEdit(row)}>
                    <img src={Edit} alt="Edit" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(row.userId)}>
                    <img src={Delete} alt="Delete" />
                </IconButton>
            </MDBox>
        );
    };

    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
       
    };

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
       
    };

    const exportableColumns = columns.filter((col) => col.accessor !== "actions");

    const prepareExportData = () => {
      return budgetList.map((row) => {
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Büdcə");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, 'büdcə.xlsx');
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
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
                                        Büdcə
                                    </MDTypography>
                                    <MDTypography variant="button" color="text">
                                        A lightweight, extendable, dependency-free javascript HTML
                                        table plugin.
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
                                    <MDButton
                                        variant="gradient"
                                        color="primary"
                                        sx={{
                                            boxShadow: "none",
                                            "&:hover": {
                                                boxShadow: "none",
                                            },
                                        }}
                                        onClick={() => navigate("/modules/budget/new")}
                                    >
                                        <Icon sx={{ mr: 1 }} fontSize="small">
                                            add
                                        </Icon>
                                        Yeni Büdcə yarat
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                            <DataTable table={{columns, rows: budgetList}} canSearch />
                        </Card>
                        <BudgetFilter
                            isOpen={isFilterModalOpen}
                            onClose={handleFilterModalClose}
                        />
                    </MDBox>
                </MDBox>
            </DashboardLayout>
        </>
    );
}

export default DataTables;
