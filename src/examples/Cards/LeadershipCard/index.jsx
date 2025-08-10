// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function LeadershipCard({ image, title, position, action }) {
  // Əgər action varsa, Card Link kimi davranacaq, yoxdursa, div kimi
  const WrapperComponent = action ? Link : "div";

  return (
    <Card
      component={WrapperComponent}
      to={action?.route}
      sx={{ cursor: action ? "pointer" : "default" }}
      elevation={3}
      role={action ? "button" : undefined}
      tabIndex={action ? 0 : undefined}
    >
      <MDBox position="relative" borderRadius="lg" height="242px">
        <MDBox
          component="img"
          src={image}
          alt={title}
          borderRadius="lg"
          shadow="md"
          width="100%"
          height="100%"
          position="relative"
          zIndex={1}
        />
        <MDBox
          borderRadius="lg"
          shadow="md"
          width="100%"
          height="100%"
          position="absolute"
          left={0}
          top="3%"
          sx={{
            backgroundImage: `url(${image})`,
            transform: "scale(0.94)",
            filter: "blur(12px)",
            backgroundSize: "cover",
          }}
        />
      </MDBox>
      <MDBox p={2}>
        <MDTypography
          display="inline"
          variant="h5"
          textTransform="capitalize"
          fontWeight="medium"
          fontSize="24px"
          color="dark"
        >
          {title}
        </MDTypography>
        <MDBox mt={2}>
          <MDTypography variant="body2" component="p" color="text">
            {position}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

LeadershipCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    label: PropTypes.string,
  }),
};

LeadershipCard.defaultProps = {
  action: null,
};

export default LeadershipCard;
