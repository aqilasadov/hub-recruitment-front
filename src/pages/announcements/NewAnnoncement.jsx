import Card from "components/Card/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Formik } from "formik";
import { Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import upload from "assets/images/icons/cloud-upload.svg";
import MDEditor from "components/MDEditor";
import apiClient from "apiClient";
import { baseURL } from "utils/Url";
import { toast } from "react-toastify";
import Loader from "components/loader/Loader";
import * as Yup from "yup";

function NewAnnoncement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const [initialValues, setInitialValues] = useState({
    announcementName: "",
    announcementImageFileId: "",
    announcementContent: "",
    announcementFiles: [],
    isActive: 1,
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchAnnouncement = async () => {
        try {
          const response = await apiClient.get(
            `${baseURL}/announcements/${id}`
          );
          const item = response.data;
          setInitialValues({
            announcementName: item.announcementName || "",
            announcementImageFileId: item.announcementImageFileId || "",
            announcementContent: item.announcementContent || "",
            announcementFiles:
              item.announcementFiles?.map((fileId) => ({ fileId })) || [],

            isActive: item.isActive ? 1 : 0,
          });

          
        } catch (error) {
          
        } finally {
          setLoading(false);
        }
      };
      fetchAnnouncement();
    }
  }, [id]);

 
  const validationSchema = Yup.object().shape({
    announcementName: Yup.string().required("Elan adı mütləqdir"),
    announcementFiles: Yup.array().min(1, "Ən azı 1 fayl əlavə edilməlidir"),
  });

  // 🔹 Submit funksiyası
  const handleSubmit = async (values) => {
    try {
      const payload = {
        announcementId: id,
        announcementImageFileId: values.announcementImageFileId,
        announcementName: values.announcementName,
        announcementContent: values.announcementContent,
        isActive: values.isActive ? 1 : 0,
      };

      if (!isEditMode) {
        payload.announcementFiles = values.announcementFiles;
      }

      if (isEditMode) {
        await apiClient.put(`${baseURL}/announcements`, payload);
        toast.success("Elan uğurla redaktə olundu");
      } else {
        await apiClient.post(`${baseURL}/announcements`, payload);
        toast.success("Elan uğurla əlavə olundu");
      }

      navigate("/modules/announcements");
    } catch (error) {
      toast.error("Əməliyyat zamanı xəta baş verdi");
      
    }
  };

  const uploadFile = async (file, onSuccess, type = "file") => {
    const formData = new FormData();
    formData.append("files[]", file);

    try {
      const res = await apiClient.post(`${baseURL}/file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileId = res.data?.data?.[0]?.fileId;
      if (fileId) {
        onSuccess(fileId, file.name); // 🔹 fayl adı da ötürülür

        toast.success(
          type === "image" ? `Şəkil uğurla yükləndi` : `Fayl uğurla yükləndi`
        );
      } else {
        toast.error("Fayl ID tapılmadı");
      }
    } catch (err) {
      toast.error("Fayl yüklənərkən xəta baş verdi");
     
    }
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1}>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                enableReinitialize
              >
                {({ values, handleChange, setFieldValue, errors, touched }) => (
                  <Form>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                      mb={4}
                    >
                      <MDBox>
                        <MDTypography variant="h5" fontWeight="medium" mb={1}>
                          {isEditMode
                            ? "Elanı redaktə et"
                            : "Yeni Elan"}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="dark"
                          onClick={() => navigate("/modules/announcements")}
                          sx={{
                            color: "darkBlue.main",
                            background:
                              "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                            boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                              boxShadow:
                                "0px 4px 10px rgba(151, 172, 198, 0.25)",
                            },
                          }}
                        >
                          İmtina et
                        </MDButton>
                        <MDButton
                          type="submit"
                          variant="gradient"
                          color="info"
                          sx={{
                            background:
                              "linear-gradient(45deg, #3E3D45, #202020)",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #3E3D45, #202020)",
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                            },
                          }}
                        >
                          Yadda saxla
                        </MDButton>
                      </MDBox>
                    </MDBox>
                    <MDBox>
                      <MDBox display="flex" gap={5} alignItems="baseline">
                        <MDInput
                          variant="standard"
                          type="text"
                          label="Elan adı *"
                          name="announcementName"
                          value={values.announcementName}
                          onChange={handleChange}
                          error={Boolean(
                            touched.announcementName && errors.announcementName
                          )}
                          helperText={
                            touched.announcementName &&
                            errors.announcementName ? (
                              <span style={{ color: "#f44336" }}>
                                {errors.announcementName}
                              </span>
                            ) : null
                          }
                          sx={{ width: "100%" }}
                        />
                        <MDBox
                          display="flex"
                          gap={2}
                          alignItems="center"
                          justifyContent="end"
                          sx={{ width: "max-content" }}
                        >
                          <MDTypography
                            variant="body2"
                            color="text"
                            fontSize={14}
                            sx={{ width: "max-content" }}
                          >
                            Elan aktivdir?
                          </MDTypography>
                          <Switch
                            checked={values.isActive}
                            onChange={(e) =>
                              setFieldValue("isActive", e.target.checked)
                            }
                          />
                        </MDBox>
                      </MDBox>
                      <MDBox mt={3} display="flex" gap={2}>
                        <MDBox sx={{ width: "100%" }}>
                          <MDTypography
                            variant="body2"
                            color="text"
                            fontSize={14}
                            mb={2}
                          >
                            Elanın Fotosu:
                          </MDTypography>
                          <MDBox
                            sx={{
                              width: "100%",
                              border: "2px dashed #E5E9EF",
                              borderRadius: "12px",
                              minHeight: "80px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "border-color 0.2s",
                              "&:hover": {
                                borderColor: "#B0B8C1",
                              },
                              color: "#8B95A1",
                              textAlign: "center",
                              py: 2,
                              px: 1,
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              style={{
                                display: "none",
                              }}
                              id="announcement-image-upload"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  uploadFile(
                                    file,
                                    (fileId, originalFileName) => {
                                      setFieldValue(
                                        "announcementImageFileId",
                                        fileId
                                      );
                                      setUploadedPhotoName(originalFileName);
                                      // setInitialValues(uploadedPhotoName)
                                    },
                                    "image"
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="announcement-image-upload"
                              style={{ width: "100%", cursor: "pointer" }}
                            >
                              <MDBox
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <img
                                  src={upload}
                                  alt="upload"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    marginBottom: "8px",
                                  }}
                                />
                                <MDTypography
                                  variant="button"
                                  color="text"
                                  fontWeight="regular"
                                >
                                  Elanın fotosu
                                </MDTypography>
                              </MDBox>
                            </label>
                          </MDBox>
                          {values.announcementImageFileId && (
                            <MDTypography
                              mt={2}
                              fontWeight="regular"
                              color="success"
                              sx={{ fontSize: "14px", lineHeight: "0.625" }}
                            >
                              {uploadedPhotoName}
                            </MDTypography>
                          )}
                        </MDBox>
                        <MDBox sx={{ width: "100%" }}>
                          <MDTypography
                            variant="body2"
                            color="text"
                            fontSize={14}
                            mb={2}
                          >
                            Elanın Faylları:
                          </MDTypography>
                          <MDBox
                            sx={{
                              width: "100%",
                              border: "2px dashed #E5E9EF",
                              borderRadius: "12px",
                              minHeight: "80px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "border-color 0.2s",
                              "&:hover": {
                                borderColor: "#B0B8C1",
                              },
                              color: "#8B95A1",
                              textAlign: "center",
                              py: 2,
                              px: 1,
                            }}
                          >
                            <input
                              type="file"
                              multiple
                              style={{
                                display: "none",
                              }}
                              id="announcement-files-upload"
                              onChange={(e) => {
                                const files = Array.from(e.target.files);
                                files.forEach((file) =>
                                  uploadFile(
                                    file,
                                    (id, name) => {
                                      setFieldValue("announcementFiles", [
                                        ...values.announcementFiles,
                                        { fileId: id, fileName: name }, // 🔹 fayl adı da saxlanır
                                      ]);
                                    },
                                    "file"
                                  )
                                );
                              }}
                            />
                            <label
                              htmlFor="announcement-files-upload"
                              style={{ width: "100%", cursor: "pointer" }}
                            >
                              <MDBox
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <img
                                  src={upload}
                                  alt="upload"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    marginBottom: "8px",
                                  }}
                                />
                                <MDTypography
                                  variant="button"
                                  color="text"
                                  fontWeight="regular"
                                >
                                  Faylları əlavə et
                                </MDTypography>
                              </MDBox>
                            </label>
                          </MDBox>
                          {touched.announcementFiles &&
                            errors.announcementFiles && (
                              <MDTypography
                                mt={1}
                                color="error"
                                sx={{ fontSize: "13px", lineHeight: "1" }}
                              >
                                {errors.announcementFiles}
                              </MDTypography>
                            )}
                          {values.announcementFiles?.length > 0 && (
                            <MDBox mt={2}>
                              <ol style={{ paddingLeft: "20px" }}>
                                {values.announcementFiles.map((file, index) => (
                                  <li key={index} style={{ color: "#4CAF50" }}>
                                    <a
                                      href={`${baseURL}/file/${file.fileId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "#4CAF50" }}
                                    >
                                      {file.fileName || `Fayl #${index + 1}`}
                                    </a>
                                  </li>
                                ))}
                              </ol>
                            </MDBox>
                          )}
                        </MDBox>
                      </MDBox>
                      <MDBox mt={2}>
                        <MDEditor
                          value={values.announcementContent}
                          onChange={(val) =>
                            setFieldValue("announcementContent", val)
                          }
                          name="announcementContent"
                        />
                      </MDBox>
                    </MDBox>
                  </Form>
                )}
              </Formik>
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default NewAnnoncement;
