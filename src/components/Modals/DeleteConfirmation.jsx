import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Exclamation from "assets/images/icons/exclamation.svg";
import MDBox from "components/MDBox";

function DeleteConfirmation({ open, onClose, onConfirm, message }) {
  const defaultMessage = "Silmək istədiyinizə əminsiniz?";
  const displayMessage = message || defaultMessage;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="delete-modal"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MDBox sx={{padding: "16px", backgroundColor:"#FFEBEE", borderRadius: "50%"}}>
          <img src={Exclamation} alt="" width={40} height={40} />
        </MDBox>
      </DialogTitle>
      <DialogContent style={{ textAlign: "center" }}>
        <MDTypography color="dark" style={{ fontSize: "20px" }}>
          {displayMessage}
        </MDTypography>
      </DialogContent>
      <DialogActions>
        <MDButton
          onClick={onClose}
          color="darkBlue"
          variant="outlined"
          fullWidth
          sx={{
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          İmtina et
        </MDButton>
        <MDButton
          onClick={onConfirm}
          color="primary"
          variant="gradient"
          fullWidth
          sx={{
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Sil
        </MDButton>
      </DialogActions>
      <IconButton
        aria-label="delete"
        onClick={onClose}
        style={{ position: "absolute", right: "0", top: "5px" }}
      >
        {/* <CloseIcon /> */}
      </IconButton>
    </Dialog>
  );
}

DeleteConfirmation.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default DeleteConfirmation;
