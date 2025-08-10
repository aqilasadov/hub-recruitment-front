import { useContext, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import { ReactComponent as ContractIcon } from "assets/images/icons/contract.svg";
import { ReactComponent as StructureIcon } from "assets/images/icons/user-group.svg";
import { ReactComponent as OrderIcon } from "assets/images/icons/collection.svg";
import { ReactComponent as PaymentIcon } from "assets/images/icons/database.svg";
import { ReactComponent as QuestionIcon } from "assets/images/icons/database2.svg";
import { ReactComponent as DocumentIcon } from "assets/images/icons/documents.svg";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDBadgeDot from "components/MDBadgeDot";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultStatisticsCard from "examples/Cards/StatisticsCards/DefaultStatisticsCard";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";

import HorizontalBarChart from "examples/Charts/BarCharts/HorizontalBarChart";
import SalesTable from "examples/Tables/SalesTable";
import DataTable from "examples/Tables/DataTable";

// Sales dashboard components
import ChannelsChart from "layouts/dashboards/sales/components/ChannelsChart";

// Data
import defaultLineChartData from "layouts/dashboards/sales/data/defaultLineChartData";
import horizontalBarChartData from "layouts/dashboards/sales/data/horizontalBarChartData";
import salesTableData from "layouts/dashboards/sales/data/salesTableData";
import dataTableData from "layouts/dashboards/sales/data/dataTableData";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import AnnouncementCard from "myComponents/Cards/annuncementCard";
import MainPaymentsCard from "myComponents/Cards/mainPaymentsCard";
import VacationCard from "myComponents/Cards/vacationCard";
import PathModuleCard from "myComponents/Cards/pathModuleCard";
import CalendarDashboard from "examples/CalendarDashboard";
import BlogCard from "myComponents/Cards/blogCard";
import DayCard from "myComponents/Cards/dayCard";
import WeatherCard from "myComponents/Cards/weatherCard";
import CurrencyCard from "myComponents/Cards/currencyCard";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "context/AuthContext";

function Dashboard() {
    // DefaultStatisticsCard state for the dropdown value
    const [salesDropdownValue, setSalesDropdownValue] = useState("6 May - 7 May");
    const [customersDropdownValue, setCustomersDropdownValue] = useState("6 May - 7 May");
    const [revenueDropdownValue, setRevenueDropdownValue] = useState("6 May - 7 May");
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    // DefaultStatisticsCard state for the dropdown action
    const [salesDropdown, setSalesDropdown] = useState(null);
    const [customersDropdown, setCustomersDropdown] = useState(null);
    const [revenueDropdown, setRevenueDropdown] = useState(null);

    // DefaultStatisticsCard handler for the dropdown action
    const openSalesDropdown = ({ currentTarget }) => setSalesDropdown(currentTarget);
    const closeSalesDropdown = ({ currentTarget }) => {
        setSalesDropdown(null);
        setSalesDropdownValue(currentTarget.innerText || salesDropdownValue);
    };
    const openCustomersDropdown = ({ currentTarget }) => setCustomersDropdown(currentTarget);
    const closeCustomersDropdown = ({ currentTarget }) => {
        setCustomersDropdown(null);
        setCustomersDropdownValue(currentTarget.innerText || salesDropdownValue);
    };
    const openRevenueDropdown = ({ currentTarget }) => setRevenueDropdown(currentTarget);
    const closeRevenueDropdown = ({ currentTarget }) => {
        setRevenueDropdown(null);
        setRevenueDropdownValue(currentTarget.innerText || salesDropdownValue);
    };

    // Dropdown menu template for the DefaultStatisticsCard
    const renderMenu = (state, close) => (
        <Menu
            anchorEl={state}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            open={Boolean(state)}
            onClose={close}
            keepMounted
            disableAutoFocusItem
        >
            <MenuItem onClick={close}>Last 7 days</MenuItem>
            <MenuItem onClick={close}>Last week</MenuItem>
            <MenuItem onClick={close}>Last 30 days</MenuItem>
        </Menu>
    );

    // Add state for MainPaymentsCard period
    const [paymentsPeriod, setPaymentsPeriod] = useState("daily");

    // Add handlers for MainPaymentsCard period changes
    const handleDailyClick = () => setPaymentsPeriod("daily");
    const handleWeeklyClick = () => setPaymentsPeriod("weekly");

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <MDBox mb={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <MDBox p={2}>
                                    <MDTypography variant="h6" fontWeight="medium" color="customGrey" sx={{ fontSize: "16px", fontWeight: "600", lineHeight: "24px", marginBottom: "8px" }} >
                                        Xoş Gəlmişsiniz
                                    </MDTypography>
                                    <MDTypography variant="h6" fontWeight="medium" color="gold" sx={{ fontSize: "30px", fontWeight: "500", lineHeight: "150%" }} >
                                        {user}
                                    </MDTypography>
                                </MDBox>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MainPaymentsCard
                                title="Toplam ödənişlər"
                                dailyData={{
                                    count: "12.600 AZN",
                                    percentage: {
                                        color: "success",
                                        value: "+12%",
                                        label: "since last Day",
                                    }
                                }}
                                weeklyData={{
                                    count: "45.800 AZN",
                                    percentage: {
                                        color: "success",
                                        value: "+28%",
                                        label: "since last Week",
                                    }
                                }}
                                onDailyClick={handleDailyClick}
                                onWeeklyClick={handleWeeklyClick}
                                activePeriod={paymentsPeriod}
                            />
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox mb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                            <DayCard day="Cümə axşamı" month="25 May" year="2025" />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <WeatherCard title="Hava durumu" degree="17 °C" weather="Tutqun buludlu" />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <CurrencyCard title="Valyuta" date="25 May 2025" currencies={[{label: "USD/AZN", value: "1.7000", status: "neutral"}, {label: "EUR/AZN", value: "1.7000", status: "up"}, {label: "RUB/AZN", value: "1.7000", status: "down"}]} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        <WeatherCard title="Hava durumu" degree="17 °C" weather="Tutqun buludlu" />
                    
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox mb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <DefaultStatisticsCard
                                title="Aktiv Müqavilələr"
                                count="25"
                                percentage={{
                                    color: "success",
                                    value: "+55%",
                                    label: "since last month",
                                }}
                                dropdown={{
                                    action: openSalesDropdown,
                                    menu: renderMenu(salesDropdown, closeSalesDropdown),
                                    value: salesDropdownValue,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DefaultStatisticsCard
                                title="Bugün bağlanan müqavilə sayı"
                                count="7"
                                percentage={{
                                    color: "success",
                                    value: "+12%",
                                    label: "since last month",
                                }}

                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <VacationCard
                                title="Qalan Məzuniyyət günləri"
                                count="16"
                                percentage={{
                                    color: "secondary",
                                    value: "40",
                                    label: "Ümumi gün",
                                }}

                            />
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox mb={3} sx={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "20px" }}>
                    <MDTypography variant="h6" fontWeight="medium" color="text" sx={{ fontSize: "16px", color: "##737373", fontWeight: "600", lineHeight: "24px", marginBottom: "8px" }} >
                        Sürətli Keçidlər
                    </MDTypography>
                    <MDBox display="flex" gap={2}>
                        <MDButton onClick={() => navigate("/modules/contracts/new")} variant="outlined" color="secondary" size="small" sx={{ borderRadius: "32px", border: "1px solid #B39DDB", color: "#311B92", fontWeight: "700" }} >
                            Yeni Müqavilə yarat
                        </MDButton>
                        <MDButton onClick={() => navigate("/modules/orders/new")} variant="outlined" color="secondary" size="small" sx={{ borderRadius: "32px", border: "1px solid #90CAF9", color: "#0D47A1", fontWeight: "700" }} >
                            Yeni Sifariş yarat
                        </MDButton>
                        <MDButton  variant="outlined" color="secondary" size="small" sx={{ borderRadius: "32px", border: "1px solid #FFAB91", color: "#BF360C", fontWeight: "700" }} >
                            Təhsil Bölməsi
                        </MDButton>
                        <MDButton variant="outlined" color="secondary" size="small" sx={{ borderRadius: "32px", border: "1px solid #A5D6A7", color: "#1B5E20", fontWeight: "700" }} >
                            Yeni Sifariş yarat
                        </MDButton>
                        <MDButton variant="outlined" color="secondary" size="small" sx={{ borderRadius: "32px", border: "1px solid #90CAF9", color: "#311B92", fontWeight: "700" }} >
                            Yeni Müqavilə yarat
                        </MDButton>
                    </MDBox>
                </MDBox>
                <MDBox mb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} lg={8}>
                            <DefaultLineChart
                                title="Builki Büdcə"
                                description={
                                    <MDBox display="flex" justifyContent="space-between">
                                        <MDBox display="flex" ml={-1}>
                                            <MDBadgeDot color="error" size="sm" badgeContent="Təsdiqlənmiş - 56.600.300.32 AZN" />
                                            <MDBadgeDot color="dark" size="sm" badgeContent="Faktiki - 45.600.300.32 AZN" />
                                        </MDBox>
                                        <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem">
                                            <MDButton sx={{ color: "#87732E", fontWeight: "700" }}
                                                variant="text"
                                                color="secondary"
                                                size="small"
                                                onClick={() => navigate("/modules/budget")}

                                            >
                                                Büdcə Modulu
                                                <Icon sx={{ marginLeft: "5px" }}>arrow_forward</Icon>
                                            </MDButton>

                                        </MDBox>
                                    </MDBox>
                                }
                                chart={defaultLineChartData}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <AnnouncementCard />
                        </Grid>

                    </Grid>
                </MDBox>
                <MDBox mb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={7}>
                            <MDBox sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px", padding: "16px" }}>
                                <MDTypography variant="h6" fontWeight="medium" color="text" sx={{ fontSize: "16px", color: "##737373", fontWeight: "600", lineHeight: "24px", marginBottom: "8px" }} >
                                    Modula Keçidlər
                                </MDTypography>
                                <MDBox>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <PathModuleCard link="/modules/contracts" title="Müqavilələr" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." titleColor="#BF360C" icon={<ContractIcon />} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <PathModuleCard link="*" title="Struktur" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." titleColor="#F57F17" icon={<StructureIcon />} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <PathModuleCard link="/modules/orders" title="Sifarişlər" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." titleColor="#1B5E20" icon={<OrderIcon />} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <PathModuleCard link="/modules/payments" title="Ödənişlər" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." titleColor="#0D47A1" icon={<PaymentIcon />} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <PathModuleCard link="Sorğular" title="Sorğular" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." titleColor="#880E4F" icon={<QuestionIcon />} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <PathModuleCard link="/modules/documents" title="Sənədlər" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." titleColor="#263238" icon={<DocumentIcon />} />
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} lg={5}>
                            <CalendarDashboard
                                initialView="dayGridMonth"
                                initialDate="2021-11-10"
                                events={[
                                    {
                                        title: "All day conference",
                                        start: "2021-11-04",
                                        end: "2021-11-06",
                                        className: "success",
                                    },
                                    {
                                        title: "Meeting with Mary",
                                        start: "2021-11-10",
                                        end: "2021-11-10",
                                        className: "info",
                                    },
                                    {
                                        title: "Winter Hackaton",
                                        start: "2021-11-22",
                                        end: "2021-11-25",
                                        className: "error",
                                    },
                                ]}
                                selectable
                                editable
                            />
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox sx={{ backgroundColor: "#FFFFFF", borderRadius: "8px", padding: "16px" }}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDTypography variant="h6" fontWeight="medium" color="dark" sx={{ fontSize: "size.md", fontWeight: "600", lineHeight: "24px", marginBottom: "8px" }} >
                        Mətbuatda Bugün
                        </MDTypography>
                        <MDButton variant="text"onClick={() => navigate("/modules/presstoday")} color="darkBlue" sx={{ padding: "0px", textTransform: "UpperCase" }}>
                        Hamısına Bax
                        <Icon sx={{ marginLeft: "5px" }}>chevron_right</Icon>
                    </MDButton>
                    </MDBox>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                     <BlogCard enterpriseName="Müəssisə Adı" title="Blog Başlığı" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." link="Read More"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                    <BlogCard enterpriseName="Müəssisə Adı" title="Blog Başlığı" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." link="Read More"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>  
                    <BlogCard enterpriseName="Müəssisə Adı" title="Blog Başlığı" description="Lorem ipsum dolor sit amet consectetur. At tempus nunc nisl malesuada lacinia." link="Read More"/>
                    </Grid>
                </Grid>
                </MDBox>
            </MDBox>
         
        </DashboardLayout>
    );
}

export default Dashboard;
