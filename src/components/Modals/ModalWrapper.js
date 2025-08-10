import { Modal, Box, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

function ModalWrapper({ children, isOpen, onClose, sx = {} }) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#ffffff",
          padding: 2,
          boxShadow: 24,
          maxWidth: "800px",
          width: "100%",
          borderRadius: "16px",
          overflowY: "auto",
          maxHeight: "100vh",
          ...sx,
        }}
      >
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", right: "10px", top: "5px" }}
        >
          <CloseIcon />
        </IconButton>
        {children}
      </Box>
    </Modal>
  );
}

ModalWrapper.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  sx: PropTypes.object,
};

export default ModalWrapper;