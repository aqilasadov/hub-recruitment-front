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
import MDButton from "components/MDButton";
import {
    Autocomplete,
    FormControl,
    Grid,
    Icon,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Select,
    Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import NotificationItem from "examples/Items/NotificationItem";
import MDPagination from "components/MDPagination";
import NotificationModal from "components/Modals/NotificationModal";

const PressFilter = ({ isOpen, onClose }) => {
    const [age, setAge] = useState("");

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <MDBox
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: "80%", md: "400px" }, // responsive width
                    bgcolor: "background.paper",
                    borderRadius: "16px",
                    boxShadow: 24,
                    p: { xs: 2, sm: 3 },
                }}
            >
                {/* Header */}
                <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <MDTypography
                        variant="body3"
                        fontWeight="regular"
                        color="grey.900"
                        sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                    >
                        Filterlər
                    </MDTypography>
                    <IconButton onClick={onClose}>
                        <Icon>close</Icon>
                    </IconButton>
                </MDBox>

                {/* Fields */}
                <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDInput placeholder="Qeydiyyat nömrəsi" />
                    <MDInput type="date" placeholder="Başlama tarixi" />
                    <MDInput type="date" placeholder="Bitmə tarixi" />
                    <MDInput placeholder="Müqavilənin müddəti" />

                    <MDBox
                        sx={{
                            border: "1px solid #C7CCD0",
                            borderRadius: "6px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "8px",
                        }}
                    >
                        <Autocomplete
                            options={["option1", "option2"]}
                            renderInput={(params) => (
                                <FormField
                                    {...params}
                                    placeholder="Valyuta"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        "& .MuiInputBase-input": {
                                            border: "none",
                                            width: "100%",
                                            padding: "0",
                                        },
                                        "& .MuiAutocomplete-input": {
                                            border: "none",
                                            height: "100%",
                                        },
                                        "& .MuiInput-root": {
                                            "&::before, &::after": { border: "none" },
                                            "&:hover:not(.Mui-disabled):before": {
                                                borderBottom: "none",
                                            },
                                        },
                                        "& .MuiAutocomplete-inputRoot": { padding: "0" },
                                    }}
                                />
                            )}
                            sx={{ width: "100%" }}
                        />
                    </MDBox>
                </MDBox>

                {/* Footer */}
                <MDBox display="flex" justifyContent="center" mt={2}>
                    <MDButton
                        sx={{ fontSize: "14px", opacity: 0.5 }}
                        variant="text"
                        color="gold"
                        onClick={onClose}
                    >
                        Tətbiq et
                        <Icon sx={{ ml: 1 }} fontSize="small">
                            arrow_forward
                        </Icon>
                    </MDButton>
                </MDBox>
            </MDBox>
        </Modal>
    );
};

function Notification() {
    const navigate = useNavigate();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const notificationsData = [
        {
            title: "Kofe Sifarişiniz təsdiqləndi",
            content:
                "Orci proin est nisi viverra tellus. Netus dui quis elit morbi. Posuere id felis aliquam phasellus ultrices orci amet aliquam non. Eu diam vitae amet curabitur. Ultrices sed neque fermentum feugiat consectetur. Fusce lacus mauris faucibus justo sed at. Ac congue tellus tempus mi. Bibendum scelerisque facilisi placerat vel quis sit nec molestie. Ut tincidunt sapien morbi tellus faucibus odio. Dis tristique at a erat quis aliquam.",
        },
        {
            title: "Kamran H. yeni vəzifəyə təyin olundu",
            content: "HR məlumatına əsasən yeni dəyişiklik var.",
        },
        {
            title: "Şəbnəm S.-in ad günüdür.",
            content: "Əməkdaşınızın bu gün ad günüdür, təbrik edin!",
        },
        {
            title: "Rauf M. əməkdaşlığa başlayır",
            content: "Yeni əməkdaş bu gündən komandaya qatılır.",
        },
        {
            title: "Aysel T. yeni məhsul təqdim edir",
            content: "Məhsul təqdimatı çərşənbə axşamı olacaq.",
        },
        {
            title: "Elvin B. yeni layihəyə rəhbərlik edir",
            content: "Layihə rəhbəri vəzifəsinə yeni təyinat.",
        },
        {
            title: "Nigar X. tətilə çıxır",
            content: "Əməkdaş bu tarixdən etibarən məzuniyyətdədir.",
        },
    ];

    // State-lər
    const [notifications, setNotifications] = useState(notificationsData);
    const [pageIndex, setPageIndex] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const pageSize = 3;
    const totalPages = Math.ceil(notifications.length / pageSize);
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i);

    // Hesablamalar
    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < totalPages - 1;

    const gotoPage = (index) => {
        if (index >= 0 && index < totalPages) {
            setPageIndex(index);
        }
    };

    const previousPage = () => {
        if (canPreviousPage) gotoPage(pageIndex - 1);
    };

    const nextPage = () => {
        if (canNextPage) gotoPage(pageIndex + 1);
    };

    // Cari səhifəyə uyğun slice
    const currentNotifications = notifications.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
    );

    const handleItemClick = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    const handleMarkRead = (notification) => {
        // Burada "oxunmuş" statusu üçün backend çağırışı və ya state yeniləməsi edə bilərsən.
        // Məsələn oxunmuşları filter etmək və ya statusunu dəyişmək:
        alert(`"${notification.title}" oxunmuş kimi işarələndi!`);
    };

    // Səhifə düymələrinin renderi
    const renderPagination = () =>
        pageOptions.map((p) => (
            <MDPagination
                item
                key={p}
                onClick={() => gotoPage(p)}
                active={pageIndex === p}
            >
                {p + 1}
            </MDPagination>
        ));

    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
    };

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
    };

    return (
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
                                    Xəbərdarlıqlar
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" gap={2} alignItems="center" pr={3}>
                                <Tooltip title="Filterlər">
                                    <MDButton
                                        variant="outlined"
                                        color="darkBlue"
                                        onClick={handleFilterModalOpen}
                                        position="relative"
                                    >
                                        <img
                                            src={filter}
                                            alt="filter"
                                            sx={{
                                                width: "18px",
                                                height: "18px",
                                                marginRight: { xs: 0, sm: "8px" },
                                            }}
                                        />
                                        <MDTypography
                                            component="span"
                                            sx={{
                                                display: { xs: "none", sm: "inline" }, // xs-də gizlə, sm və yuxarıda göstər
                                                fontSize: { sm: "0.9rem", md: "1rem" },
                                            }}
                                        >
                                            Filterlər
                                        </MDTypography>
                                    </MDButton>
                                </Tooltip>
                            </MDBox>
                        </MDBox>
                        <MDBox p={3}>
                            <MDBox>
                                {currentNotifications.map((notification, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleItemClick(notification)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <NotificationItem
                                            icon={<Icon>arrow_forward</Icon>}
                                            title={notification.title}
                                        />
                                    </div>
                                ))}
                            </MDBox>
                            {/* Pagination */}
                            <MDBox mt={2} display="flex" justifyContent="center">
                                {pageOptions.length > 1 && (
                                    <MDPagination variant="gradient" color="gold">
                                        {canPreviousPage && (
                                            <MDPagination item onClick={previousPage}>
                                                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
                                            </MDPagination>
                                        )}

                                        {renderPagination()}

                                        {canNextPage && (
                                            <MDPagination item onClick={nextPage}>
                                                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
                                            </MDPagination>
                                        )}
                                    </MDPagination>
                                )}
                            </MDBox>
                        </MDBox>
                    </Card>
                    <PressFilter
                        isOpen={isFilterModalOpen}
                        onClose={handleFilterModalClose}
                    />
                    {/* Modal importdan istifadə */}
                    <NotificationModal
                        open={Boolean(selectedNotification)}
                        onClose={handleCloseModal}
                        notification={selectedNotification}
                        onMarkRead={handleMarkRead}
                    />
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default Notification;
