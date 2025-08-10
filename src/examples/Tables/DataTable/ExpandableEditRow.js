import React from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const fieldLabels = {
  userId: "Sifariş nömrəsi",
  id: "Müqavilə nömrəsi",
  title: "Kontragent",
  completed: "Sifariş tarixi",
  salary: "Yekun məbləğ",
  status: "Status"
};

function ExpandableEditRow({ rowData, onChange, onSave, onCancel }) {
  return (
    <MDBox sx={{ pt: 1, pb: 1, bgcolor: '#f8f9fa', borderTop: '1px solid #eee' }}>
      <MDBox display="flex" alignItems="center">

        <MDInput
          variant="standard"
          name="userId"
          value={rowData.userId || ''}
          onChange={(e) => onChange('userId', e.target.value)}
         sx={{width:"100%"}}
        />
        <MDInput
          variant="standard"
          name="id"
          value={rowData.id || ''}
          onChange={(e) => onChange('id', e.target.value)}
          sx={{width:"100%"}}
         
        />
        <MDInput
          variant="standard"
          name="title"
          value={rowData.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          sx={{width:"100%"}}
        />
        <MDInput
          variant="standard"
          name="completed"
          value={rowData.completed || ''}
          onChange={(e) => onChange('completed', e.target.value)}
          sx={{width:"100%"}}
        />
        <MDInput
          variant="standard"
          name="salary"
          value={rowData.salary || ''}
          onChange={(e) => onChange('salary', e.target.value)}
          sx={{width:"100%"}}
        />
        <MDInput
          variant="standard"
          name="status"
          value={rowData.status || ''}
          onChange={(e) => onChange('status', e.target.value)}
          sx={{width:"100%"}}
        />
        <MDBox flex="" display="flex" gap={1} justifyContent="flex-end">
          <IconButton sx={{ bgcolor: "#e6f4ea", color: "#388e3c", border: "1px solid #A5D6A7", borderRadius: "8px", "&:hover": { bgcolor: "#c8e6c9" } }} onClick={onSave}>
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton sx={{ bgcolor: "#ffebee", color: "#d32f2f", borderRadius: "8px", border: "1px solid #EF9A9A", "&:hover": { bgcolor: "#ffcdd2" } }} onClick={onCancel}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

ExpandableEditRow.propTypes = {
  rowData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ExpandableEditRow;
