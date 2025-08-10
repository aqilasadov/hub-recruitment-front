// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React contexts
import { useMaterialUIController } from "context";

function DayCard({ day, month, year }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

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
                {day}
              </MDTypography>
            </MDBox>
            <MDBox lineHeight={1}>
              <MDTypography variant="h5" fontWeight="bold" sx={{ color: "#87732E" }} >
                {month}
              </MDTypography>
              <MDTypography
                variant="text"
                fontWeight="regular"
                color="text"
                fontSize={"size.sm"}
                component="span"
              >
                {year}
              </MDTypography>
            </MDBox>
           
          </Grid>
         
        </Grid>
      </MDBox>
    </Card>
  );
}

// Typechecking props for the VacationCard
DayCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
  dropdown: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      action: PropTypes.func,
      menu: PropTypes.node,
      value: PropTypes.string,
    }),
  ]),
};

export default DayCard;
