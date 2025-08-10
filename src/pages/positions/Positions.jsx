

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
import PositionData from "layouts/applications/data-tables/data/PositionData";
import MDButton from "components/MDButton";
import { Autocomplete, Icon, IconButton, MenuItem, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import download from "assets/images/icons/download.svg";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';





const PositionFilter = ({ isOpen, onClose }) => {

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
                        <MDInput placeholder="Tabel nömrəsi" />
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
                                    <FormField {...params} placeholder="Status" InputLabelProps={{ shrink: true }}
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
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
       
    }

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
       
    }




    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox mb={3} position="relative">
                    <Card>
                        <MDBox display="flex" justifyContent="space-between" gap={2} alignItems="center">
                            <MDBox p={3} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    Vəzifələr
                                </MDTypography>
                                <MDTypography variant="button" color="text">
                                    A lightweight, extendable, dependency-free javascript HTML table plugin.
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" gap={2} alignItems="center" pr={3}>
                                <MDButton variant="text" color="darkBlue">
                                    <img src={download} alt="download" style={{ width: "18px", height: "18px", marginRight: "8px" }} />
                                    Excel faylı endir</MDButton>
                                <MDButton variant="outlined" color="darkBlue" onClick={handleFilterModalOpen} position="relative">
                                    <img src={filter} alt="filter" style={{ width: "18px", height: "18px", marginRight: "8px" }} />
                                    Filterlər
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
                                    onClick={() => navigate("/modules/positions/new")}
                                >
                                    <Icon sx={{ mr: 1 }} fontSize="small">add</Icon>
                                    Yeni Vəzifə 
                                </MDButton>
                            </MDBox>
                        </MDBox>
                        <DataTable table={PositionData} canSearch />
                    </Card>
                    <PositionFilter isOpen={isFilterModalOpen} onClose={handleFilterModalClose} />
                </MDBox>
            </MDBox>



        </DashboardLayout>
    );
}

export default DataTables;
