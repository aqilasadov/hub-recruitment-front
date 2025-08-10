

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/applications/data-tables/data/dataTableData";
import MDButton from "components/MDButton";
import linearGradient from "assets/theme/functions/linearGradient";
import { Autocomplete, FormControl, Grid, Icon, IconButton, Menu, MenuItem, Modal, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import LeadershipCard from "examples/Cards/LeadershipCard";
import leadership from "assets/images/leader.png";
import leadership2 from "assets/images/myImg.jpg"






function LeaderShip() {
    const navigate = useNavigate();

    const leadersData = [
        {
            id: 1,
            image: leadership,
            title: "Fazil Məmmədov İslam Oğlu",
            position: "Müşahidə Şurasının Üzvü",
            
        },
        {
            id: 2,
            image: leadership2,
            title: "Rauf Rzayev Zöhrab Oğlu",
            position: "İcraçı Direktor",
            
        },
        {
            id: 3,
            image: leadership,
            title: "Nahid Heydərov Alim Oğlu",
            position: "Texniki Direktor",
           
        },
        {
            id: 4,
            image: leadership,
            title: "Orxan Məmmədov Hüseyn Oğlu",
            position: "Hüquqşünas",
           
        },
    ];


    const normalize = (str) => str.toLowerCase().replace(/\s+/g, "-");


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox mb={3} position="relative">
                    <Card>
                        <MDBox display="flex" justifyContent="space-between" gap={2} alignItems="center">
                            <MDBox p={3} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    Rəhbərlik
                                </MDTypography>
                                <MDTypography variant="button" color="text">
                                    A lightweight, extendable, dependency-free javascript HTML table plugin.
                                </MDTypography>
                            </MDBox>

                        </MDBox>
                        <MDBox p={3}>

                            <Grid container spacing={2}>
                                {leadersData.map((item) => (
                                    <Grid item xs={12} sm={6} md={3} key={item.id}>
                                        <LeadershipCard
                                            image={item.image}
                                            title={item.title}
                                            position={item.position}
                                            action={{
                                                route: `/modules/leadership/${normalize(item.title)}`,
                                              }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </MDBox>
                    </Card>

                </MDBox>
            </MDBox>



        </DashboardLayout>
    );
}



export default LeaderShip;
