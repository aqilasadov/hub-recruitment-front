// @mui material components
import Card from "@mui/material/Card";
import filter from "assets/images/icons/filter.svg";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Data
import MDButton from "components/MDButton";
import {Grid, Icon, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import DocumentCard from "myComponents/Cards/documentCard";
import apiClient from "apiClient";
import {baseURL} from "utils/Url";
import Loader from "components/loader/Loader";
import DeleteConfirmation from "components/Modals/DeleteConfirmation";
import {toast} from "react-toastify";
import {fetchFileWithAuth} from "utils/fetchFileWithAuth";
import {StoreContext} from "context/StoreContext";
import MDInput from "components/MDInput";

const DocumentFilter = ({isOpen, onClose, onApplyFilter}) => {
    const [documentName, setDocumentName] = useState("");

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleApply = () => {
        onApplyFilter({documentName});
        onClose();
    };

    return (
        <>
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
            <MDBox
                sx={{
                    display: isOpen ? "block" : "none",
                    position: "absolute",
                    top: "80px",
                    right: "230px",
                    width: "300px",
                    padding: "12px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #e0e0e0",
                    borderRadius: "16px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    zIndex: 1100,
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
                <MDBox mt={2}>
                    <MDInput
                        placeholder="Sənəd adı"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        fullWidth
                    />

                    <MDBox display="flex" justifyContent="center" mt={2}>
                        <MDButton
                            sx={{fontSize: "14px", opacity: 0.5}}
                            variant="text"
                            color="gold"
                            onClick={handleApply}
                        >
                            Tətbiq et
                            <Icon sx={{ml: 1}} fontSize="small">
                                arrow_forward
                            </Icon>
                        </MDButton>
                    </MDBox>
                </MDBox>
            </MDBox>
        </>
    );
};

function Documents() {
    const navigate = useNavigate();
    const [documentList, setDocumentList] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({documentName: ""});
    const [loading, setLoading] = useState(false);
    const [imageSrcMap, setImageSrcMap] = useState({});
    const [selectedClientIdToDelete, setSelectedClientIdToDelete] =
        useState(null);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const {documentCatOptions} = useContext(StoreContext);
    const [allowActionButton, setAllowActionButton] = useState(false);
    const [allowAdding, setAllowAdding] = useState(false);
    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowActionButton(privilege.includes('DOCUMENTS_ACTION_BUTTON'));
        setAllowAdding(privilege.includes('DOCUMENT_ADD'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);

    const fetchDocumentList = async (payload = {}) => {
        setLoading(true);
        try {
            const response = await apiClient.post(
                `${baseURL}/document/filter-documents`,
                {
                    documentName: payload.documentName || "",
                }
            );

            if (response.status >= 200 && response.status < 300) {
                const data = response.data.data || response.data;
                setDocumentList(data);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function fetchImages() {
            const newImageMap = {};

            await Promise.all(
                documentList.map(async (doc) => {
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

            setImageSrcMap((prev) => ({...prev, ...newImageMap}));
        }

        if (documentList.length > 0) {
            fetchImages();
        }
    }, [documentList]);

    useEffect(() => {
        fetchDocumentList();
    }, []);

    const handlePreviewFile = async (fileId) => {
        try {
            const blob = await fetchFileWithAuth(fileId);
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank"); // yeni tabda açılır
        } catch (error) {

        }
    };

    const applyFilter = (filterValues) => {
        setFilters(filterValues);
        fetchDocumentList({
            documentName: filterValues.documentName || "",
        });
    };

    const handleDelete = (id) => {
        setSelectedClientIdToDelete(id);

        setOpenConfirmationModal(true); // Open confirmation modal
    };

    const handleEdit = (row) => {

        navigate(`/modules/documents/edit/${row.documentId}`);
    };

    const handleConfirmDelete = async () => {
        if (selectedClientIdToDelete) {
            try {
                const response = await apiClient.delete(
                    `${baseURL}/document/${selectedClientIdToDelete}`
                );
                if (response.status >= 200 && response.status < 300) {
                    toast.success("Məlumat müvəffəqiyyətlə silindi" + "!");
                    fetchDocumentList(filters);
                }
            } catch (error) {

            } finally {
                setOpenConfirmationModal(false);
            }
        }
    };


    if (loading) {
        return (
            <DashboardLayout>
                <DashboardNavbar/>
                <MDBox py={6} px={3}>
                    <Loader/>
                </MDBox>
            </DashboardLayout>
        );
    }


    return (
        <>
            <DashboardLayout>
                <DashboardNavbar/>
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
                                        Sənədlər
                                    </MDTypography>
                                </MDBox>
                                <MDBox display="flex" gap={2} alignItems="center" pr={3}>
                                    <MDButton
                                        variant="outlined"
                                        color="darkBlue"
                                        onClick={() => setIsFilterModalOpen(true)}
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
                                    {
                                        allowAdding && (
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                sx={{
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        boxShadow: "none",
                                                    },
                                                }}
                                                onClick={() => navigate("/modules/documents/new")}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">
                                                    add
                                                </Icon>
                                                Yeni Sənəd
                                            </MDButton>
                                        )
                                    }
                                </MDBox>
                            </MDBox>
                            <MDBox p={3}>
                                <Grid container spacing={2} mt={2}>
                                    {documentList?.map((doc, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <DocumentCard
                                                isActive={doc.isActive}
                                                handleDelete={() => handleDelete(doc.documentId)}
                                                onEdit={handleEdit}
                                                documentId={doc.documentId}
                                                fileId={doc.fileId}
                                                documentImageFileId={doc.documentImageFileId}
                                                image={
                                                    doc.documentImageFileId &&
                                                    imageSrcMap[doc.documentImageFileId]
                                                        ? imageSrcMap[doc.documentImageFileId]
                                                        : undefined
                                                }
                                                detail={
                                                    doc.documentCategoryId
                                                        ? documentCatOptions.find(
                                                            (option) => option.id === doc.documentCategoryId
                                                        )?.label
                                                        : "Bilinmir"
                                                }
                                                title={doc.documentName || "Başlıq yoxdur"}
                                                description={doc.documentNote || "Açıqlama yoxdur"}
                                                action={{
                                                    type: "button",
                                                    onClick: () => handlePreviewFile(doc.fileId),
                                                    color: "info",
                                                    label: "OXU",
                                                }}

                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </MDBox>
                        </Card>
                    </MDBox>
                </MDBox>
            </DashboardLayout>
            <DeleteConfirmation
                open={openConfirmationModal}
                onClose={() => setOpenConfirmationModal(false)}
                onConfirm={handleConfirmDelete}
            />
            <DocumentFilter
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilter={applyFilter}
            />
        </>
    );
}

export default Documents;
