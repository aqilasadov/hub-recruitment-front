// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import {
  Autocomplete,
  FormControl,
  Grid,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import filter from "assets/images/icons/filter.svg";
import PressCard from "myComponents/Cards/pressCard";
import apiClient from "apiClient";
import { baseURL } from "utils/Url";
import Loader from "components/loader/Loader";
import { fetchFileWithAuth } from "utils/fetchFileWithAuth";
import DeleteConfirmation from "components/Modals/DeleteConfirmation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/az";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const PressFilter = ({ isOpen, onClose, onApplyFilter }) => {
  const [newsTitle, setNewsTitle] = useState("");
  const [newsLink, setNewsLink] = useState(null);
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const today = dayjs();
      const oneMonthAgo = today.subtract(1, "month");
      setBeginDate(oneMonthAgo);
      setEndDate(today);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleApply = () => {
    onApplyFilter({ newsTitle, newsLink, beginDate, endDate });
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
          right: "150px",
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
              placeholder="Başlıq"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
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
                options={["Mənbə 1", "Mənbə 2"]}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    placeholder="Daxil olduğu mənbə"
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

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
              <DatePicker
                label="Başlanğıc tarix"
                value={beginDate}
                onChange={(newValue) => setBeginDate(newValue)}
                format="DD/MM/YYYY"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    name="beginDate"
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="az">
              <DatePicker
                label="Son tarix"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    name="endDate"
                  />
                )}
              />
            </LocalizationProvider>
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

function Press() {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [inPressList, setInPressList] = useState([]);
  const [imageSrcMap, setImageSrcMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
    useState(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [filters, setFilters] = useState({
    newsTitle: "",
    newsLink: null,
    beginDate: "",
    endDate: "",
  });

  const fetchInPressList = async (payload = {}) => {
    setLoading(true);
    try {
      const requestPayload = {
        newsTitle: payload.newsTitle || "",
        newsLink: payload.newsLink || "",
        beginDate: payload.beginDate || "",
        endDate: payload.endDate || "",
      };
      const response = await apiClient.post(
        `${baseURL}/in-press-today/filter-in-press-today`,
        requestPayload
      );
      if (response.status >= 200 && response.status < 300) {
        const data = response.data.data || response.data;
        setInPressList(data);
      }
    } catch (error) {
     
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filterValues) => {
    setFilters(filterValues);
    fetchInPressList({
      newsTitle: filterValues.newsTitle,
      newsLink: filterValues.newsLink,
      beginDate: filterValues.beginDate,
      endDate: filterValues.endDate,
    });
  };

  const handleFilterModalOpen = () => {
    setIsFilterModalOpen(true);
    
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
   
  };

  const handleDelete = (id) => {
    setSelectedClientIdToDelete(id);
    
    setOpenConfirmationModal(true); // Open confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (selectedClientIdToDelete) {
      try {
        const response = await apiClient.delete(
          `${baseURL}/in-press-today/${selectedClientIdToDelete}`
        );
        if (response.status >= 200 && response.status < 300) {
          toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
          fetchInPressList();
        }
      } catch (error) {
       
      } finally {
        setOpenConfirmationModal(false);
      }
    }
  };

  const handleDeactivate = async (inPressTodayId, isActive) => {
    try {
      const response = await apiClient.put(`${baseURL}/in-press-today`, {
        inPressTodayId,
        isActive,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          `Məlumat ${isActive === 1 ? "aktivləşdirildi" : "deaktivləşdirildi"}`
        );
        // Local state yenilənir ki, UI dərhal yenilənsin
        setInPressList((prev) =>
          prev.map((doc) =>
            doc.inPressTodayId === inPressTodayId ? { ...doc, isActive } : doc
          )
        );
      } else {
        toast.error("Status dəyişdirilə bilmədi");
      }
    } catch (error) {
      toast.error("Xəta baş verdi, yenidən cəhd edin");
      
    }
  };

  useEffect(() => {
    async function fetchImages() {
      const newImageMap = {};

      await Promise.all(
        inPressList.map(async (doc) => {
          const fileId = doc.documentImageFileId;
          if (fileId && !imageSrcMap[fileId]) {
            setLoading(true);
            try {
              const blob = await fetchFileWithAuth(fileId);
              const url = URL.createObjectURL(blob);
              newImageMap[fileId] = url;
              setLoading(false);
            } catch (error) {
             
            }
          }
        })
      );

      setImageSrcMap((prev) => ({ ...prev, ...newImageMap }));
    }

    if (inPressList.length > 0) {
      fetchImages();
    }
  }, [inPressList]);

  useEffect(() => {
    fetchInPressList();
  }, []);



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox mb={3} position="relative">
          <Card>
            <MDBox
              display="flex"
              justifyContent="space-between"
              gap={2}
              alignItems="center"
            >
              <MDBox p={3} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  Mətbuatda bugün
                </MDTypography>
              </MDBox>
              <MDBox display="flex" gap={2} alignItems="center" pr={3}>
                <MDButton
                  variant="outlined"
                  color="darkBlue"
                  onClick={handleFilterModalOpen}
                  position="relative"
                >
                  <img
                    src={filter}
                    alt="filter"
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "8px",
                    }}
                  />
                  Filterlər
                </MDButton>
              </MDBox>
            </MDBox>
            <MDBox p={3}>
              <Grid container spacing={2} mt={2}>
                {inPressList.length > 0 ? (
                  inPressList.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={item.id || index}>
                      <PressCard
                        inPressTodayId={item.inPressTodayId}
                        isActive={item.isActive}
                        image={
                          item.documentImageFileId &&
                          imageSrcMap[item.documentImageFileId]
                            ? imageSrcMap[item.documentImageFileId]
                            : undefined
                        }
                        detail={item.sourceName || "Mənbə yoxdur"}
                        date={
                          item.newsDate
                            ? new Date(item.newsDate).toLocaleDateString(
                                "az-AZ"
                              )
                            : "Tarix yoxdur"
                        }
                        title={item.newsTitle || "Başlıq yoxdur"}
                        description={
                          item.description || "Açıqlama mövcud deyil"
                        }
                        action={{
                          type: "external",
                          route: item.newsLink || "#",
                          color: "info",
                          label: "OXU",
                        }}
                        handleDelete={() => handleDelete(item.inPressTodayId)}
                        onDeactivate={handleDeactivate}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <MDTypography variant="body1">
                      Məlumat tapılmadı.
                    </MDTypography>
                  </Grid>
                )}
              </Grid>
            </MDBox>
          </Card>
          <PressFilter
            isOpen={isFilterModalOpen}
            onClose={handleFilterModalClose}
            onApplyFilter={applyFilter}
          />
          <DeleteConfirmation
            open={openConfirmationModal}
            onClose={() => setOpenConfirmationModal(false)}
            onConfirm={handleConfirmDelete}
          />
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Press;
