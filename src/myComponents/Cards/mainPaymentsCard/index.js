// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 3 PRO React contexts
import { useMaterialUIController } from "context";

function MainPaymentsCard({ 
    title, 
    dailyData = {
        count: "",
        percentage: {
            color: "success",
            value: "",
            label: "",
        }
    },
    weeklyData = {
        count: "",
        percentage: {
            color: "success",
            value: "",
            label: "",
        }
    },
    onDailyClick, 
    onWeeklyClick, 
    activePeriod = "daily" 
}) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const currentData = activePeriod === "daily" ? dailyData : weeklyData;

    return (
        <Card>
            <MDBox p={2}>
                <Grid container>
                    <Grid item xs={8}>
                        <MDBox mb={0.5} lineHeight={1}>
                            <MDTypography
                                variant="button"
                                fontWeight="medium"
                                color="text"
                                textTransform="capitalize"
                            >
                                {title}
                            </MDTypography>
                        </MDBox>
                        <MDBox lineHeight={1}>
                            <MDTypography variant="h5" fontWeight="bold" sx={{ color: "#87732E" }} >
                                {currentData.count}
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="bold" color={currentData.percentage.color}>
                                {currentData.percentage.value}&nbsp;
                                <MDTypography
                                    variant="button"
                                    fontWeight="regular"
                                    color={darkMode ? "text" : "secondary"}
                                >
                                    {currentData.percentage.label}
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </Grid>
                    <Grid item xs={4}>
                        <MDBox width="100%" textAlign="right" lineHeight={1} sx={{ display: "flex", backgroundColor: "smoke.main", padding: "8px", borderRadius: "12px" }}>
                            <MDButton
                                variant={`text ${activePeriod === "daily" ? "contained" : "outlined"}`}
                                color="info"
                                size="small"
                                onClick={onDailyClick}
                                sx={{
                                    mr: 1,
                                    minWidth: "80px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    boxShadow: activePeriod === "daily" ? 4 : 0,
                                }}
                            >
                                Günlük
                            </MDButton>
                            <MDButton
                                variant={`text ${activePeriod === "weekly" ? "contained" : "outlined"}`}
                                color="info"
                                size="small"
                                onClick={onWeeklyClick}
                                sx={{
                                    minWidth: "80px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    boxShadow: activePeriod === "weekly" ? 4 : 0,
                                }}
                            >
                                Həftəlik
                            </MDButton>
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </Card>
    );
}

// Typechecking props for the MainPaymentsCard
MainPaymentsCard.propTypes = {
    title: PropTypes.string.isRequired,
    dailyData: PropTypes.shape({
        count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        percentage: PropTypes.shape({
            color: PropTypes.oneOf([
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "error",
                "dark",
                "white",
            ]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            label: PropTypes.string,
        }),
    }),
    weeklyData: PropTypes.shape({
        count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        percentage: PropTypes.shape({
            color: PropTypes.oneOf([
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "error",
                "dark",
                "white",
            ]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            label: PropTypes.string,
        }),
    }),
    onDailyClick: PropTypes.func.isRequired,
    onWeeklyClick: PropTypes.func.isRequired,
    activePeriod: PropTypes.oneOf(["daily", "weekly"]),
};

export default MainPaymentsCard;
