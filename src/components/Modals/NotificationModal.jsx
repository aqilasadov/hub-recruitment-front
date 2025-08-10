import React from "react";
import Modal from "@mui/material/Modal";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import Box from "@mui/material/Box";
import { Icon } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: { xs: 2, sm: 3 },
};

function NotificationModal({ open, onClose, notification, onMarkRead }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <MDTypography
          variant="h6"
          fontWeight="bold"
          mb={1}
          sx={{ fontSize: { xs: "0.825rem", sm: "1.25rem" } }}
        >
          {notification?.title}
        </MDTypography>
        <MDTypography
          variant="body2"
          color="text"
          mb={3}
          sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}
        >
          {notification?.content}
        </MDTypography>

        <MDBox display="flex" justifyContent="space-between" mt={3} gap={2}>
          <MDButton
            color="secondary"
            variant="outlined"
            onClick={onClose}
            sx={{
              width: "100%",
              fontSize: { xs: "0.65rem", sm: "0.875rem" },
              py: { xs: 0.65, sm: 1 },
              px: { xs: 0.65, sm: 1 },
            }}
          >
            Bağla
          </MDButton>
          <MDButton
            variant="gradient"
            color="primary"
            sx={{
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
              width: "100%",
              fontSize: { xs: "0.65rem", sm: "0.875rem" },
              py: { xs: 0.65, sm: 1 },
              px: { xs: 0.75, sm: 1 },
            }}
            onClick={() => {
              onMarkRead && onMarkRead(notification);
              onClose();
            }}
          >
            <Icon sx={{ mr: 1 }} fontSize="small">
              check
            </Icon>
            Oxunmuş kimi işarələ
          </MDButton>
        </MDBox>
      </Box>
    </Modal>
  );
}

export default NotificationModal;
