// @mui material components
import Card from "@mui/material/Card";
import { Paper, Divider, Grid, Typography, Box, capitalize } from "@mui/material";

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
import { Autocomplete, FormControl, Icon, IconButton, Menu, MenuItem, Modal, Select } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import LeadershipCard from "examples/Cards/LeadershipCard";
import leadership from "assets/images/leader.png";
import leadership2 from "assets/images/myImg.jpg";


function LeaderShipDetail() {
    const navigate = useNavigate();
    // const { userId } = useParams();
    const { title } = useParams();

    // Məlumatlar nümunə üçün birbaşa yazılıb, istəsəniz ayrıca faylda saxlayıb import edə bilərsiniz
    const leadersData = [
        {
            id: 1,
            image: leadership,
            title: "Fazil Məmmədov İslam Oğlu",
            position: "Müşahidə Şurasının Üzvü",
            about: `Müşahidə Şurasının üzvü olan Fazil Məmmədov, mühasibat və maliyyə sahəsində geniş təcrübəyə malikdir. O, 15 ildən artıqdır ki, müxtəlif şirkətlərdə maliyyə analitiki və mühasib vəzifələrində çalışır. Fazil, mühasibat sistemlərinin optimallaşdırılması və maliyyə strategiyalarının inkişaf etdirilməsi üzrə mütəxəssisdir. Fazil, həmçinin, müasir texnologiyaların tətbiqi ilə maliyyə əməliyyatlarının daha səmərəli və şəffaf aparılmasına yönəlik layihələrdə iştirak etmişdir. Onun rəhbərliyi altında, şirkətimizdə yeni mühasibat sisteminin tətbiqi prosesi uğurla həyata keçirilmişdir. Fazil Məmmədov, mühasibat sahəsindəki yenilikləri izləyərək, komanda üzvlərinə təlimlər keçmək və onların peşəkar inkişafına da dəstək olur.`,
            education: [
                { label: "Ali Təhsil", value: "Bakı Dövlət Universiteti, Mühasibat və Maliyyə, 2005-2009" },
                { label: "Magistratura", value: "Azərbaycan Dövlət İqtisad Universiteti, Maliyyə İdarəetməsi, 2010-2012" },
            ],
            certificates: [
                "Mühasibatlıq üzrə Beynəlxalq Sertifikat (ACCA), 2014",
                "Maliyyə Analizi üzrə Sertifikat, 2016"
            ],
            trainings: [
                "Mühasibat sistemlərinin optimallaşdırılması, 2018",
                "Müasir maliyyə texnologiyaları, 2020"
            ],
            experience: [
                { years: "2008 - 2012", role: "Baş Mühasib" },
                { years: "2012 - 2020", role: "Şöbə müdiri" },
                { years: "2020 - Hazırda", role: "Müşahidə şurasının üzvü" }
            ]
        },
        {
            id: 2,
            image: leadership2,
            title: "Rauf Rzayev Zöhrab Oğlu",
            position: "Müşahidə Şurasının Üzvü",
            about: `Müşahidə Şurasının üzvü olan Fazil Məmmədov, mühasibat və maliyyə sahəsində geniş təcrübəyə malikdir. O, 15 ildən artıqdır ki, müxtəlif şirkətlərdə maliyyə analitiki və mühasib vəzifələrində çalışır. Fazil, mühasibat sistemlərinin optimallaşdırılması və maliyyə strategiyalarının inkişaf etdirilməsi üzrə mütəxəssisdir. Fazil, həmçinin, müasir texnologiyaların tətbiqi ilə maliyyə əməliyyatlarının daha səmərəli və şəffaf aparılmasına yönəlik layihələrdə iştirak etmişdir. Onun rəhbərliyi altında, şirkətimizdə yeni mühasibat sisteminin tətbiqi prosesi uğurla həyata keçirilmişdir. Fazil Məmmədov, mühasibat sahəsindəki yenilikləri izləyərək, komanda üzvlərinə təlimlər keçmək və onların peşəkar inkişafına da dəstək olur.`,
            education: [
                { label: "Ali Təhsil", value: "Bakı Dövlət Universiteti, Mühasibat və Maliyyə, 2005-2009" },
                { label: "Magistratura", value: "Azərbaycan Dövlət İqtisad Universiteti, Maliyyə İdarəetməsi, 2010-2012" },
            ],
            certificates: [
                "Mühasibatlıq üzrə Beynəlxalq Sertifikat (ACCA), 2014",
                "Maliyyə Analizi üzrə Sertifikat, 2016"
            ],
            trainings: [
                "Mühasibat sistemlərinin optimallaşdırılması, 2018",
                "Müasir maliyyə texnologiyaları, 2020"
            ],
            experience: [
                { years: "2008 - 2012", role: "Baş Mühasib" },
                { years: "2012 - 2020", role: "Şöbə müdiri" },
                { years: "2020 - Hazırda", role: "Müşahidə şurasının üzvü" }
            ]
        },
        {
            id: 3,
            image: leadership,
            title: "Nahid Heydərov Alim Oğlu",
            position: "Müşahidə Şurasının Üzvü",
            about: `Müşahidə Şurasının üzvü olan Fazil Məmmədov, mühasibat və maliyyə sahəsində geniş təcrübəyə malikdir. O, 15 ildən artıqdır ki, müxtəlif şirkətlərdə maliyyə analitiki və mühasib vəzifələrində çalışır. Fazil, mühasibat sistemlərinin optimallaşdırılması və maliyyə strategiyalarının inkişaf etdirilməsi üzrə mütəxəssisdir. Fazil, həmçinin, müasir texnologiyaların tətbiqi ilə maliyyə əməliyyatlarının daha səmərəli və şəffaf aparılmasına yönəlik layihələrdə iştirak etmişdir. Onun rəhbərliyi altında, şirkətimizdə yeni mühasibat sisteminin tətbiqi prosesi uğurla həyata keçirilmişdir. Fazil Məmmədov, mühasibat sahəsindəki yenilikləri izləyərək, komanda üzvlərinə təlimlər keçmək və onların peşəkar inkişafına da dəstək olur.`,
            education: [
                { label: "Ali Təhsil", value: "Bakı Dövlət Universiteti, Mühasibat və Maliyyə, 2005-2009" },
                { label: "Magistratura", value: "Azərbaycan Dövlət İqtisad Universiteti, Maliyyə İdarəetməsi, 2010-2012" },
            ],
            certificates: [
                "Mühasibatlıq üzrə Beynəlxalq Sertifikat (ACCA), 2014",
                "Maliyyə Analizi üzrə Sertifikat, 2016"
            ],
            trainings: [
                "Mühasibat sistemlərinin optimallaşdırılması, 2018",
                "Müasir maliyyə texnologiyaları, 2020"
            ],
            experience: [
                { years: "2008 - 2012", role: "Baş Mühasib" },
                { years: "2012 - 2020", role: "Şöbə müdiri" },
                { years: "2020 - Hazırda", role: "Müşahidə şurasının üzvü" }
            ]
        },
        {
            id: 4,
            image: leadership,
            title: "Orxan Məmmədov Hüseyn Oğlu",
            position: "Müşahidə Şurasının Üzvü",
            about: `Müşahidə Şurasının üzvü olan Fazil Məmmədov, mühasibat və maliyyə sahəsində geniş təcrübəyə malikdir. O, 15 ildən artıqdır ki, müxtəlif şirkətlərdə maliyyə analitiki və mühasib vəzifələrində çalışır. Fazil, mühasibat sistemlərinin optimallaşdırılması və maliyyə strategiyalarının inkişaf etdirilməsi üzrə mütəxəssisdir. Fazil, həmçinin, müasir texnologiyaların tətbiqi ilə maliyyə əməliyyatlarının daha səmərəli və şəffaf aparılmasına yönəlik layihələrdə iştirak etmişdir. Onun rəhbərliyi altında, şirkətimizdə yeni mühasibat sisteminin tətbiqi prosesi uğurla həyata keçirilmişdir. Fazil Məmmədov, mühasibat sahəsindəki yenilikləri izləyərək, komanda üzvlərinə təlimlər keçmək və onların peşəkar inkişafına da dəstək olur.`,
            education: [
                { label: "Ali Təhsil", value: "Bakı Dövlət Universiteti, Mühasibat və Maliyyə, 2005-2009" },
                { label: "Magistratura", value: "Azərbaycan Dövlət İqtisad Universiteti, Maliyyə İdarəetməsi, 2010-2012" },
            ],
            certificates: [
                "Mühasibatlıq üzrə Beynəlxalq Sertifikat (ACCA), 2014",
                "Maliyyə Analizi üzrə Sertifikat, 2016"
            ],
            trainings: [
                "Mühasibat sistemlərinin optimallaşdırılması, 2018",
                "Müasir maliyyə texnologiyaları, 2020"
            ],
            experience: [
                { years: "2008 - 2012", role: "Baş Mühasib" },
                { years: "2012 - 2020", role: "Şöbə müdiri" },
                { years: "2020 - Hazırda", role: "Müşahidə şurasının üzvü" }
            ]
        },
    ];

    // URL-dən gələn title-ı qarşılaşdırmaq üçün sadələşdir
    const normalize = (str) => str.toLowerCase().replace(/\s+/g, "-");

    const selectedLeader = leadersData.find(
        (item) => normalize(item.title) === title.toLowerCase()
    );

    if (!selectedLeader) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Box pt={6} pb={3}>
                    <Card>
                        <Box p={3}>
                            <Typography variant="h5">Rəhbər tapılmadı</Typography>
                        </Box>
                    </Card>
                </Box>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card >
                <MDBox p={2}>
                    <Grid container spacing={3}>
                        {/* Sol blok */}
                        <Grid item xs={12} md={4}>
                            <MDBox sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
                                <MDBox
                                    component="img"
                                    src={selectedLeader.image}
                                    alt={selectedLeader.title}
                                    sx={{
                                        width: "100%",
                                        height: 420,
                                        objectFit: "cover",
                                        borderRadius: 3,
                                        mb: 2,
                                    }}
                                />
                                <MDTypography variant="h2" fontWeight={600} sx={{ mb: 1, textAlign: "left" }}>
                                    {selectedLeader.title}
                                </MDTypography>
                                <MDTypography variant="subtitle1" color="customGrey2" sx={{ mb: 1, textAlign: "left" }}>
                                    {selectedLeader.position}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        {/* Sağ blok */}
                        <Grid item xs={12} md={8}>
                            <MDBox sx={{}}>
                                {/* Haqqında */}
                                <MDTypography variant="h5" fontWeight={500} sx={{ mb: 1 }}>
                                    Haqqında
                                </MDTypography>
                                <MDTypography variant="body2" sx={{ mb: 2 }}>
                                    {selectedLeader.about}
                                </MDTypography>
                                {/* Təhsili */}
                                <MDBox sx={{ mb: 3 }}>
                                    <MDTypography variant="h5" fontWeight={500} sx={{ mb: 1 }}>
                                        Təhsili
                                    </MDTypography>
                                    {selectedLeader.education.map((edu, idx) => (
                                        <MDBox key={idx} sx={{ mb: 1 }}>

                                            <MDTypography variant="body3" color="customGrey2" sx={{ textTransform: "capitalize" }} display="flex" gap={1}>
                                                {edu.label}:<Divider variant="middle"
                                                    sx={{ backgroundColor: "#EEEEEE", height: "1px", flexGrow: 1 }}
                                                />
                                            </MDTypography>
                                            <MDBox sx={{ backgroundColor: "grey.100", padding: "8px 12px", borderRadius: "12px" }}>
                                                <MDTypography variant="body3" color="customGrey2">{edu.label}:</MDTypography>
                                                <MDTypography variant="body2">{edu.value}</MDTypography>
                                            </MDBox>

                                        </MDBox>
                                    ))}
                                    {/* Sertifikatlar */}
                                    <MDTypography variant="body3" color="customGrey2" sx={{ mb: 1 }} display="flex" gap={1}>
                                        Sertifikatlar: <Divider variant="middle" sx={{ backgroundColor: "#EEEEEE", height: "1px", flexGrow: 1 }} />
                                    </MDTypography>
                                    {selectedLeader.certificates.map((cert, idx) => (
                                        <MDTypography key={idx} variant="body2" sx={{ backgroundColor: "grey.100", padding: "8px 12px", borderRadius: "12px", mb: 1 }}>
                                            {cert}
                                        </MDTypography>
                                    ))}
                                    {/* Təlimlər */}
                                    <MDBox>
                                        <MDTypography variant="body3" color="customGrey2" sx={{ mb: 1 }} display="flex">
                                            Təlimlər <Divider variant="middle" sx={{ backgroundColor: "#EEEEEE", height: "1px", flexGrow: 1 }} />
                                        </MDTypography>
                                        {selectedLeader.trainings.map((train, idx) => (
                                            <MDTypography key={idx} variant="body2" sx={{ backgroundColor: "grey.100", padding: "8px 12px", borderRadius: "12px", mb: 1 }}>
                                                {train}
                                            </MDTypography>
                                        ))}
                                    </MDBox>
                                </MDBox>



                                {/* İş təcrübəsi */}
                                <MDBox>
                                    <MDTypography variant="h5" fontWeight={500} sx={{ mb: 1 }}>
                                        İş təcrübəsi
                                    </MDTypography>
                                    <MDTypography variant="body3" color="customGrey2" sx={{ mb: 1 }} display="flex">
                                        Fondda: <Divider variant="middle" sx={{ backgroundColor: "#EEEEEE", height: "1px", flexGrow: 1 }} />
                                    </MDTypography>
                                    {selectedLeader.experience.map((exp, idx) => (
                                        <MDBox key={idx} sx={{ mb: 1 }}>
                                            <MDBox sx={{ backgroundColor: "grey.100", padding: "8px 12px", borderRadius: "12px" }}>
                                                <MDTypography variant="subtitle2" color="customGrey2">
                                                    {exp.years}:
                                                </MDTypography>
                                                <MDTypography variant="body2" sx={{ color: "#333232" }}>{exp.role}</MDTypography>
                                            </MDBox>

                                        </MDBox>
                                    ))}
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </Card>
        </DashboardLayout>
    );
}

export default LeaderShipDetail;
