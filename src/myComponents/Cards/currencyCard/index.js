// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// Material Dashboard 3 PRO React contexts
import { useMaterialUIController } from "context";

function CurrencyCard({ title, date, currencies }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox p={2}>
        <Grid container alignItems="center">
          <Grid item xs={5}>
            <MDBox display="flex" flexDirection="column" justifyContent="space-between" maxWidth={108}>
              <MDTypography
                variant="h5"
                fontWeight="bold"
                color="text"
                fontSize={"size.sm"}
                mb={"33px"}


              >
                {title}
              </MDTypography>
              <MDTypography
                variant="body2"
                color="text"
                sx={{ fontSize: 14, color: "#9CA3AF", fontWeight: 500 }}
              >
                {date}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={7}>
            <MDBox
              display="flex"
              flexDirection="column"
              maxWidth={125}

              p={0}

            >
              {currencies.map((cur, idx) => (
                <MDBox
                  key={cur.label}
                  display="flex"
                  alignItems="start"
                  gap={0.5}


                >
                  <MDTypography
                    fontWeight="regular"
                    fontSize={"size.sm"}
                    letterSpacing={-1}

                  >
                    {cur.label} {cur.value}
                  </MDTypography>
                  {cur.status === "neutral" && (
                    <MDBox sx={{ width: "10px", height: "15px" }}>
                      <FiberManualRecordIcon sx={{ color: "#222", width: "100%" }} />
                    </MDBox>
                  )}
                  {cur.status === "up" && (

                    <MDBox ml={"2px"} sx={{ width: "10px", height: "15px" }}>
                      <ArrowDropUpIcon sx={{ color: "#43A047" }} />
                    </MDBox>

                  )}
                  {cur.status === "down" && (
                    <MDBox sx={{ width: "10px", height: "15px" }}>
                      <ArrowDropDownIcon fontSize="small" sx={{ color: "#E53935" }} />
                    </MDBox>
                  )}

                </MDBox>
              ))}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

// Typechecking props for the VacationCard
CurrencyCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // e.g. "USD/AZN"
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // e.g. "1.7000"
      status: PropTypes.oneOf(["up", "down", "neutral"]), // up: green arrow, down: red arrow, neutral: dot
    })
  ).isRequired,
};

export default CurrencyCard;
