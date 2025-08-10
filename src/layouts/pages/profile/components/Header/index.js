import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 3 PRO React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import MDButton from "components/MDButton";

function Header({ children = "" }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <MDBox mb={5}>
      <Card
        p={3}
        sx={{
          borderRadius: 4,
          py: 4,
          px: 4,
        }}
      >
        <MDBox  display="flex" justifyContent="space-between" alignItems="start">
          <MDBox display="flex" gap={2}>
            <MDBox
              component="img"
              src={burceMars}
              alt="profile-image"
              size="xl"
              shadow="sm"
              sx={{
                borderRadius: "12px",
                width: "144px",
                height: "144px",
              }}
            />
            <MDBox
              height="100%"
              lineHeight={1}
              display="flex"
              flexDirection="column"
              gap={2}
              maxWidth={192}
            >
              <MDTypography variant="h5" fontWeight="medium">
                <MDTypography fontWeight="bold">Fazil Məmmədov</MDTypography>
                <MDTypography> İslam oğlu</MDTypography>
              </MDTypography>
              <MDTypography
                variant="button"
                color="text"
                fontWeight="regular"
                font
              >
                <MDTypography
                  variant="span"
                  fontSize="14px"
                  mr={2}
                  color="secondary"
                >
                  Tabel Nömrəsi:
                </MDTypography>
                <MDTypography variant="span" fontSize="14px">
                  123482917
                </MDTypography>
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                <MDTypography
                  variant="span"
                  fontSize="14px"
                  mr={2}
                  color="secondary"
                >
                  {" "}
                  Şirkətlə əməkdaşdır?:
                </MDTypography>
                <MDTypography variant="span" fontSize="14px">
                  {" "}
                  Bəli
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox>
            <MDButton
              variant="gradient"
              color="primary"
              sx={{
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              <Icon sx={{ mr: 1 }} fontSize="small">
                edit
              </Icon>
              Məlumatlara düzəliş
            </MDButton>
          </MDBox>
        </MDBox>
        {children}
      </Card>
    </MDBox>
  );
}

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
