// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import MuiLink from "@mui/material/Link";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Icon, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function ActionsMenu({ row, onDeactivate }) {
  // const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (event) => {
    // event.stopPropagation();
    if (typeof row.handleDelete === "function") {
      row.handleDelete({ isArchive: 1 }); // Əsas silmə funksiyası
    }
    handleClose(); // Menyunu bağla
  };

  const handleDeactivateClick = (event) => {
    event.stopPropagation();
    if (typeof onDeactivate === "function") {
      const newStatus = row.isActive === 1 ? 0 : 1; // əksi
      onDeactivate(row.inPressTodayId, newStatus);
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          backgroundColor: "white.main",
          padding: "5px",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "white.main",
          },
        }}
      >
        <MoreVertIcon fontSize="small" sx={{ color: "#212121" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            width: "235px",
          },
        }}
      >
        <MenuItem onClick={handleDeactivateClick} sx={{ color: "#212121" }}>
          <Icon sx={{ mr: 1 }} fontSize="small">
            remove
          </Icon>{" "}
          {row.isActive === 1 ? "Deaktiv et" : "Aktiv et"}
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: "#212121" }}>
          <Icon sx={{ mr: 1 }} fontSize="small">
            delete
          </Icon>{" "}
          Sil
        </MenuItem>
      </Menu>
    </>
  );
}

function SimpleBlogCard({
  image,
  title,
  description,
  action,
  date,
  detail,
  handleDelete,
  onDeactivate,
  inPressTodayId,
  isActive,
}) {
  return (
    <Card sx={{ border: "none" }}>
      <MDBox
        position="relative"
        borderRadius="lg"
        mt={2}
        mx={2}
        sx={{
          margin: "0",
        }}
      >
        <MDBox position="absolute" top={8} right={8} zIndex={2}>
          <ActionsMenu
            row={{
              handleDelete,
              onDeactivate,
              inPressTodayId,
              isActive,
            }}
            onDeactivate={onDeactivate}
          />
        </MDBox>
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
        {isActive === 0 && (
          <MDButton
            variant="gradient"
            padding="4px 12px"
            sx={{
              position: "absolute",
              left: "16px",
              bottom: "16px",
              width: "96px",
              height: "28px",
              borderRadius: "9999px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "regular",
              fontSize: "14px",
              pointerEvents: "none",
              userSelect: "none",
              textTransform: "Capitalize",
              zIndex: 2,
              opacity: 1,
              backgroundColor: "#E91F63",
              color: "white.main",
            }}
          >
            <FiberManualRecordIcon sx={{ mr: 1 }} /> Deaktiv
          </MDButton>
        )}
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
      <MDBox p={3}>
        <MDBox display="flex" alignItems="center" gap={1}>
          <MDTypography
            variant="body2"
            component="p"
            color="blueLight"
            fontSize={12}
            fontWeight={500}
          >
            {detail}
          </MDTypography>
          <MDTypography
            variant="body2"
            component="p"
            color="text"
            fontSize={12}
            fontWeight={500}
          >
            {date}
          </MDTypography>
        </MDBox>
        <MDTypography
          display="inline"
          variant="h3"
          textTransform="capitalize"
          fontWeight="bold"
          fontSize={"size.xl"}
        >
          {title}
        </MDTypography>
        <MDBox mt={2} mb={3}>
          <MDTypography
            variant="body2"
            component="p"
            color="text"
            fontSize={"size.md"}
          >
            {description}
          </MDTypography>
        </MDBox>
        {action.type === "external" ? (
          <MuiLink href={action.route} target="_blank" rel="noreferrer">
            <MDButton
              color={action.color ? action.color : "dark"}
              variant="text"
            >
              {action.label}{" "}
              <Icon sx={{ mr: 1 }} fontSize="small">
                chevron_right
              </Icon>
            </MDButton>
          </MuiLink>
        ) : (
          <Link to={action.route}>
            <MDButton
              color={action.color ? action.color : "dark"}
              variant="text"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {action.label}{" "}
              <Icon sx={{ mr: 1 }} fontSize="small">
                chevron_right
              </Icon>
            </MDButton>
          </Link>
        )}
      </MDBox>
    </Card>
  );
}

// Typechecking props for the SimpleBlogCard
SimpleBlogCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]).isRequired,
    route: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
      "default",
    ]),
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default SimpleBlogCard;
