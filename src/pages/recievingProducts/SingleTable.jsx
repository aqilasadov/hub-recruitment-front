// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import EditableTable from "examples/Tables/DataTable/EditableTable";

// Data

import MDButton from "components/MDButton";
import { Autocomplete, Icon, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import download from "assets/images/icons/download.svg";
import Edit from "assets/images/icons/pencil-alt.svg";
import Delete from "assets/images/icons/trash.svg";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import apiClient from "apiClient";
import { baseURL } from "utils/Url";
import Loader from "components/loader/Loader";
import DeleteConfirmation from "components/Modals/DeleteConfirmation";
import { toast } from "react-toastify";
import { StoreContext } from "context/StoreContext";

const ProductFilter = ({ isOpen, onClose, onApplyFilter }) => {
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemTypeId, setItemTypeId] = useState(null);

  const { itemTypeOptions } = useContext(StoreContext);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleApply = () => {
    onApplyFilter({ itemName, itemCode, itemTypeId });
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <MDBox
        onClick={handleOverlayClick}
        sx={{
          display: isOpen ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent",
          zIndex: 999,
        }}
      />
      {/* Modal */}
      <MDBox
        sx={{
          display: isOpen ? "block" : "none",
          position: "absolute",
          top: "80px",
          right: "230px",
          width: "300px",
          padding: "12px",
          background: "white",
          backgroundColor: "white",
          bgColor: "white",
          border: "1px solid #e0e0e0",
          borderRadius: "16px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDTypography variant="body3" fontWeight="regular" color="grey.900">
            Filterlər
          </MDTypography>
          <IconButton onClick={onClose}>
            <Icon>close</Icon>
          </IconButton>
        </MDBox>
        <MDBox>
          <MDBox display="flex" flexDirection="column" gap={1}>
            <MDInput
              placeholder="Qəbul kodu"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <MDInput
              placeholder="Malın kodu"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
            />
            <MDInput
              placeholder="Müqavilə kodu"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
            />
            <MDInput
              placeholder="Sifariş kodu"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
            />
            <MDBox
              sx={{
                border: "1px solid #C7CCD0",
                borderRadius: "6px",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "8px",
              }}
            >
              <Autocomplete
                variant=""
                options={itemTypeOptions}
                getOptionLabel={(option) => option.label}
                value={
                  itemTypeOptions.find((opt) => opt.id === itemTypeId) || null
                }
                onChange={(e, newValue) =>
                  setItemTypeId(newValue ? newValue.id : null)
                }
                renderInput={(params) => (
                  <FormField
                    {...params}
                    placeholder="Anbar"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-input": {
                        border: "none",
                        width: "100%",
                        padding: "0",
                      },
                      "& .MuiAutocomplete-input": {
                        border: "none",
                        height: "100%",
                      },

                      "& .MuiInput-root": {
                        "&::before": {
                          border: "none",
                        },
                        "&::after": {
                          border: "none",
                        },

                        "&::hover": {
                          border: "none",
                        },

                        "&:hover:not(.Mui-disabled):before": {
                          borderBottom: "none",
                        },
                        "&:focus": {
                          borderBottom: "none",
                        },
                      },

                      "& .MuiAutocomplete-inputRoot": {
                        padding: "0",
                      },
                    }}
                  />
                )}
                sx={{ width: "100%" }}
              />
            </MDBox>
          </MDBox>
          <MDBox display="flex" justifyContent="center" mt={2}>
            <MDButton
              sx={{ fontSize: "14px", opacity: 0.5 }}
              variant="text"
              color="gold"
              onClick={handleApply}
            >
              Tətbiq et{" "}
              <Icon sx={{ ml: 1 }} fontSize="small">
                arrow_forward
              </Icon>
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
};

function DataTables() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);

  const [datatableData, setDatatableData] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(false);
  const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
    useState(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const { itemTypeOptions } = useContext(StoreContext);

  const columns = [
    { Header: "Qəbul Kodu", accessor: "itemCode", width: "20%" },
    { Header: "Anbar", accessor: "itemName", width: "25%" },
    { Header: "Tarix", accessor: "itemTypeId", width: "" },

    {
      Header: "tənzimləmə",
      accessor: "actions",
      Cell: ({ row }) => renderActions(row),
      width: "5%",
    },
  ];

  const fetchProductList = async (payload = {}) => {
    setLoading(true);
    try {
      const requestPayload = {
        itemName: payload.itemName || "",
        itemCode: payload.itemCode || "",
        itemTypeId:
          payload.itemTypeId !== null && payload.itemTypeId !== undefined
            ? payload.itemTypeId
            : -1,
      };

      const response = await apiClient.post(
        `${baseURL}/item/filter-item`,
        requestPayload
      );
      if (response.status >= 200 && response.status < 300) {
        const data = response.data.data || response.data;
        setProductList(data);

        const rows = data?.map((item) => {
          const itemTypeType = itemTypeOptions.find(
            (type) => type.id === item.itemTypeId
          );

          return {
            itemId: item.itemId,
            itemCode: item.itemCode,
            itemName: item.itemName,
            itemTypeId: itemTypeType ? itemTypeType.label : "",
            isActive: item.isActive === 1 ? "Active" : "Passive",
          };
        });
        setDatatableData({ columns, rows });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    navigate(`/modules/products/edit/${row.original.itemId}`);
  };

  const handleDelete = (id) => {
    setSelectedClientIdToDelete(id);
    setOpenConfirmationModal(true); // Open confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (selectedClientIdToDelete) {
      try {
        const response = await apiClient.delete(
          `${baseURL}/item/${selectedClientIdToDelete}`
        );
        if (response.status >= 200 && response.status < 300) {
          toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
          setDatatableData((prevData) => {
            const updatedRows = prevData.rows.filter(
              (i) => i.itemId !== selectedClientIdToDelete
            );
            return {
              ...prevData,
              rows: updatedRows,
            };
          });
          setOpenConfirmationModal(false);
        }
      } catch (error) {}
    }
  };

  const renderActions = (row) => {
    const id = row.original?.itemId;
    return (
      <MDBox
        display="flex"
        gap={1}
        alignItems="center"
        justifyContent="flex-end"
        textAlign="right"
      >
        <IconButton size="small" onClick={() => handleEdit(row)}>
          <img src={Edit} alt="Edit" />
        </IconButton>
        <IconButton size="small" onClick={() => handleDelete(id)}>
          <img src={Delete} alt="Delete" />
        </IconButton>
      </MDBox>
    );
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  //   useEffect(() => {
  //   fetchProductList(filters);
  // }, [filters]);

  if (loading) {
    return (
      <MDBox py={6} px={3}>
        <Loader />
      </MDBox>
    );
  }

  return (
    <>
      <MDBox pb={3}>
        <EditableTable table={datatableData} />

        <DeleteConfirmation
          open={openConfirmationModal}
          onClose={() => setOpenConfirmationModal(false)}
          onConfirm={handleConfirmDelete}
        />
      </MDBox>
    </>
  );
}

export default DataTables;
