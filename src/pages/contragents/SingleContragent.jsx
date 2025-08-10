// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CollapseDataTable from "examples/Tables/CollapseDataTable";
import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/applications/data-tables/data/dataTableData";
import SingleContragentData from "layouts/applications/data-tables/data/SingleContragentData";
import MDButton from "components/MDButton";
import linearGradient from "assets/theme/functions/linearGradient";
import { Autocomplete, Icon, IconButton, MenuItem, Modal } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import download from "assets/images/icons/download.svg";
import Edit from 'assets/images/icons/pencil-alt.svg';
import Delete from 'assets/images/icons/trash.svg';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SingleContragentFilter = ({ isOpen, onClose }) => {

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
                        <MDInput placeholder="Kontragentin adı" />
                        <MDInput placeholder="Kontragentin VÖENİ" />
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
    const location = useLocation();
    const { ContragentCode } = location.state || {};
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
       
    }

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
        
    }




    const handleExportAll = () => {
        const worksheet = XLSX.utils.json_to_sheet(SingleContragentData.rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Kontragent");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'kontragent.xlsx');
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox mb={3} position="relative">
                    <Card>
                        <MDBox display="flex" justifyContent="space-between" gap={2} alignItems="center">
                            <MDBox p={3} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    {ContragentCode || ""}
                                </MDTypography>
                                <MDTypography variant="button" color="text">
                                    { "A lightweight, extendable, dependency-free javascript HTML table plugin."}
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" gap={2} alignItems="center" pr={3}>
                                <MDButton 
                                    variant="text" 
                                    color="darkBlue"
                                    onClick={handleExportAll}
                                >
                                    <img src={download} alt="download" style={{ width: "18px", height: "18px", marginRight: "8px" }} />
                                    Excel faylı endir
                                </MDButton>
                                <MDButton variant="outlined" color="darkBlue" onClick={handleFilterModalOpen} position="relative">
                                    <img src={filter} alt="filter" style={{ width: "18px", height: "18px", marginRight: "8px" }} />
                                    Filterlər
                                </MDButton>

                               
                            </MDBox>
                        </MDBox>
                        <DataTable table={SingleContragentData} canSearch />
                    </Card>
                    <SingleContragentFilter isOpen={isFilterModalOpen} onClose={handleFilterModalClose} />
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default DataTables;
