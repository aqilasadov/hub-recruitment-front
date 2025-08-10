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
import SingleSmetaData from "layouts/applications/data-tables/data/SingleSmetaData";
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






function DataTables() {
    const navigate = useNavigate();
    const location = useLocation();
    const { parentYear, parentDescription } = location.state || {};

    const handleExportAll = () => {
        const worksheet = XLSX.utils.json_to_sheet(SingleSmetaData.rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Smetalar");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'smetalar.xlsx');
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
                                    {parentYear || "2025"}
                                </MDTypography>
                                <MDTypography variant="button" color="text">
                                    {parentDescription || "A lightweight, extendable, dependency-free javascript HTML table plugin."}
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

                                <MDButton
                                    variant="gradient"
                                    color="primary"
                                    sx={{
                                        boxShadow: "none",
                                        "&:hover": {
                                            boxShadow: "none"
                                        }
                                    }}
                                    onClick={() => navigate("/modules/smeta/new")}
                                >
                                    <Icon sx={{ mr: 1 }} fontSize="small">add</Icon>
                                    Yeni Smeta yarat
                                </MDButton>
                            </MDBox>
                        </MDBox>
                        <CollapseDataTable table={SingleSmetaData} canSearch />
                    </Card>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default DataTables;
