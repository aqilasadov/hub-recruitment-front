import Card from "components/Card/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Formik } from "formik";
import { Autocomplete, Switch } from "@mui/material";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import upload from "assets/images/icons/cloud-upload.svg";
import uploadIcon from "assets/images/icons/upload-icon.svg";
import apiClient from "apiClient";
import { baseURL } from "utils/Url";
import { toast } from "react-toastify";
import Loader from "components/loader/Loader";
import * as Yup from "yup";
import FormField from "layouts/applications/wizard/components/FormField";
import { StoreContext } from "context/StoreContext";

function NewDocument() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const photoInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const [initialValues, setInitialValues] = useState({
    documentName: "",
    documentImageFileId: null,
    documentCategoryId: null,
    documentNote: "",
    fileId: null,
    isActive: 1,
    isArchive: 0,
    createDate: new Date().toISOString(),
  });

  const { documentCatOptions } = useContext(StoreContext);

  useEffect(() => {
    if (isEditMode) {
      const fetchAnnouncement = async () => {
        try {
          const response = await apiClient.get(`${baseURL}/document/${id}`);
          const item = response.data;
          setInitialValues({
            documentId: item.documentId,
            documentName: item.documentName || "",
            documentImageFileId: item.documentImageFileId || "",
            documentCategoryId: item.documentCategoryId || null,
            documentNote: item.documentNote || "",
            fileId: item.fileId || null,
            isActive: item.isActive ?? 1,
            isArchive: item.isArchive ?? 0,
            createDate: item.createDate || new Date().toISOString(),
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
    documentName: Yup.string().required("Sənəd adı mütləqdir"),
    fileId: Yup.string().min(1, "Ən azı 1 fayl əlavə edilməlidir"),
  });

  // 🔹 Submit funksiyası
  const handleSubmit = async (values) => {
    try {
      const payload = {
        documentName: values.documentName,
        documentImageFileId: values.documentImageFileId,
        documentCategoryId: values.documentCategoryId,
        documentNote: values.documentNote,
        fileId: values.fileId,
        createDate: values.createDate,
        isActive: values.isActive,
        isArchive: values.isArchive ? 1 : 0,
      };

      if (isEditMode) {
        await apiClient.put(`${baseURL}/document`, {
          documentId: values.documentId,
          ...payload,
        });
        toast.success("Sənəd uğurla redaktə olundu");
      } else {
        await apiClient.post(`${baseURL}/document`, payload);
        toast.success("Sənəd uğurla əlavə olundu");
      }

      navigate("/modules/documents");
    } catch (error) {
      toast.error("Əməliyyat zamanı xəta baş verdi");
     
    }
  };

  const uploadFile = async (file, onSuccess, type = "file") => {
    const formData = new FormData();
    formData.append("files[]", file);

    try {
      const res = await apiClient.post(`${baseURL}/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileData = res.data?.data?.[0];
      if (fileData?.fileId) {
        onSuccess(fileData.fileId, fileData.originalFileName);
        if (type === "image") {
          toast.success("Şəkil uğurla yükləndi");
        } else {
          toast.success("Fayl uğurla yükləndi");
        }
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
                          {isEditMode ? "Sənədi redaktə et" : "Yeni sənəd"}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="dark"
                          onClick={() => navigate("/modules/documents")}
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
                      <MDBox display="flex" gap={5}>
                        <Autocomplete
                          options={documentCatOptions}
                          getOptionLabel={(option) => option.label}
                          value={
                            documentCatOptions.find(
                              (opt) => opt.id === values.documentCategoryId
                            ) || null
                          }
                          onChange={(e, newValue) =>
                            setFieldValue(
                              "documentCategoryId",
                              newValue ? newValue.id : null
                            )
                          }
                          renderInput={(params) => (
                            <FormField
                              {...params}
                              label="Sənədin Kataloqu"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                          sx={{ width: "100%" }}
                        />
                        <MDInput
                          variant="standard"
                          type="text"
                          label="Sənədin adı *"
                          name="documentName"
                          value={values.documentName}
                          onChange={handleChange}
                          error={Boolean(
                            touched.documentName && errors.documentName
                          )}
                          helperText={
                            touched.documentName && errors.documentName ? (
                              <span style={{ color: "#f44336" }}>
                                {errors.documentName}
                              </span>
                            ) : null
                          }
                          sx={{ width: "100%" }}
                        />
                        <MDBox sx={{ width: "100%", position: "relative" }}>
                          <MDInput
                            variant="standard"
                            type="text"
                            label="Sənədin fotosu"
                            name="documentImageFileId"
                            value={uploadedPhotoName}
                            onChange={handleChange}
                            error={Boolean(
                              touched.documentImageFileId &&
                                errors.documentImageFileId
                            )}
                            helperText={
                              touched.documentImageFileId &&
                              errors.documentImageFileId ? (
                                <span style={{ color: "#f44336" }}>
                                  {errors.documentImageFileId}
                                </span>
                              ) : null
                            }
                            InputProps={{
                              readOnly: true,
                            }}
                            sx={{ width: "100%" }}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={photoInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                uploadFile(
                                  file,
                                  (fileId, originalFileName) => {
                                    setFieldValue(
                                      "documentImageFileId",
                                      fileId
                                    );
                                    setUploadedPhotoName(originalFileName);
                                  },
                                  "image"
                                );
                              }
                            }}
                          />
                          <MDButton
                            variant="text"
                            onClick={() => photoInputRef.current?.click()}
                            sx={{
                              position: "absolute",
                              right: 0,
                              top: "50%",
                              transform: "translateY(-50%)",
                              padding: 0,
                              minWidth: "0",
                            }}
                            width="16px"
                            height="16px"
                          >
                            <img
                              src={uploadIcon}
                              alt="upload"
                              style={{ width: "24px", height: "24px" }}
                            />
                          </MDButton>
                        </MDBox>
                      </MDBox>
                      <MDBox display="flex" gap={5} mt={3}>
                        <MDInput
                          variant="standard"
                          type="text"
                          label="Açıqlama"
                          name="documentNote"
                          value={values.documentNote}
                          onChange={handleChange}
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
                            Sənəd aktivdir?
                          </MDTypography>
                          <Switch
                            checked={values.isActive === 1}
                            onChange={(e) =>
                              setFieldValue(
                                "isActive",
                                e.target.checked ? 1 : 0
                              )
                            }
                          />
                        </MDBox>
                      </MDBox>
                      <MDBox mt={3} display="flex" gap={2}>
                        <MDBox sx={{ width: "100%" }}>
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
                              style={{
                                display: "none",
                              }}
                              id="document-file-upload"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  uploadFile(
                                    file,
                                    (fileId, originalFileName) => {
                                      setFieldValue("fileId", fileId);
                                      setUploadedFileName(originalFileName);
                                    }
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor="document-file-upload"
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
                                  Sənədi əlavə et
                                </MDTypography>
                              </MDBox>
                            </label>
                          </MDBox>

                          {values.fileId && (
                            <MDTypography
                              variant="caption"
                              color="success"
                              mt={1}
                            >
                              Yüklənmiş sənəd: {uploadedFileName}
                            </MDTypography>
                          )}
                        </MDBox>
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

export default NewDocument;
