import React, { useEffect, useState } from "react";
// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import PropTypes from "prop-types";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Card from "components/Card/Card";
import downloadIcon from "assets/images/icons/download.svg";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "apiClient";
import { baseURL } from "utils/Url";
import Loader from "components/loader/Loader";
import {
  fetchFileWithAuth,
  downloadFileWithAuth,
} from "utils/fetchFileWithAuth";
import { Icon, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AnnouncementInner() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const navigate = useNavigate();

  const fetchAnnouncement = async (id) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`${baseURL}/announcements/${id}`);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data.data || response.data;
        setAnnouncement(data);
       
      }
    } catch (error) {
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncement(id);
  }, [id]);

  useEffect(() => {
    async function fetchImage() {
      setLoading(true);
      try {
        const blob = await fetchFileWithAuth(
          announcement.announcementImageFileId
        );
       
        const url = URL.createObjectURL(blob);
      
        setImageSrc(url);
        setLoading(false);
      } catch (error) {
       
      }
    }

    if (announcement?.announcementImageFileId) {
      fetchImage();
    }
  }, [announcement]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={6} px={3}>
          <Loader />
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox
          className="announcement-inner"
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          pt={2}
          px={7}
        >
          <MDBox flex={3}>
            <MDBox display="flex" alignItems="center" gap="16px" mb={2}>
              <IconButton
                color="dark"
                sx={{ padding: 0 }}
                onClick={() => navigate("/modules/announcements")}
              >
                <ArrowBackIcon fontSize="medium" />
              </IconButton>
              <MDTypography variant="h3" fontWeight="bold">
                {announcement?.announcementName || "Elanın Başlığı"}
              </MDTypography>
            </MDBox>
            <MDBox sx={{ height: "343px" }}>
              <MDBox
                component="img"
                src={imageSrc}
                alt="announcement"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  mb: 3,
                  objectFit: "cover",
                  boxShadow: 3,
                }}
              />
            </MDBox>

            <MDBox pt={3}>
              <MDTypography
                pb={2}
                variant="h4"
                color="black.main"
                sx={{ fontWeight: "500" }}
              >
                Daha Səmərəli və Şəffaf İdarəetmə
              </MDTypography>

              <MDTypography
                component="div"
                dangerouslySetInnerHTML={{
                  __html: announcement?.announcementContent || "",
                }}
                sx={{
                  fontWeight: "400",
                  fontSize: "14px",
                  color: "black.main",
                }}
              />
            </MDBox>
          </MDBox>

          <MDBox flex={1}>
            <MDBox
              sx={{ border: "1px solid #EEEEEE", padding: 2, borderRadius: 2 }}
            >
              <MDTypography variant="h6" fontWeight="regular" mb={2}>
                Elanın Faylları:
              </MDTypography>

              <MDBox display="flex" flexDirection="column" gap={2} mt={2}>
                {(announcement?.announcementFiles || []).map((file, index) => (
                  <MDButton
                    key={file.fileId || index}
                    variant="outlined"
                    color="info"
                    startIcon={
                      <img src={downloadIcon} alt="download" width={16} />
                    }
                    onClick={() =>
                      downloadFileWithAuth(
                        file.fileId,
                        file.originalFileName || file.fileName
                      )
                    }
                  >
                    {file.originalFileName || `Fayl ${index + 1}`}
                  </MDButton>
                ))}
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

AnnouncementInner.propTypes = {
  id: PropTypes.string,
};

export default AnnouncementInner;
