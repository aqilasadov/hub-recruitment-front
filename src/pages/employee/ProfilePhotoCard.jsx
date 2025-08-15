import {useEffect, useState} from "react";
import {baseURL} from "../../utils/Url";
import {fetchFileWithAuth} from "../../utils/fetchFileWithAuth";
import apiClient from "../../apiClient";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import {CardContent} from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {toast} from "react-toastify";
import MDBox from "../../components/MDBox";

export default function ProfilePhotoCard({employee, onFileChange}) {
    const [imageUrl, setImageUrl] = useState(null);

    const uploadFileWithAuth = async (file) => {
        const formData = new FormData();
        formData.append("files[]", file);

        const token = localStorage.getItem("authToken");

        const response = await fetch(`${baseURL}/file`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            toast.error("Yükləmə zamanı xəta baş verdi");
            throw new Error("Upload failed");
        }

        const data = await response.json();

        if (data?.data?.length > 0) {
            toast.success("Əməliyyat uğurludur");
            return data.data[0].fileId;
        } else {
            throw new Error("Backenddən fileId gəlmədi");
        }
    };


    useEffect(() => {
        if (employee?.fileId) {
            fetchFileWithAuth(employee.fileId)
                .then((file) => {
                    const url = URL.createObjectURL(file);
                    setImageUrl(url);
                })
                .catch(() => setImageUrl(null));
        }
    }, [employee]);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const uploadedFileId = await uploadFileWithAuth(file);
            onFileChange(uploadedFileId);
            const newFile = await fetchFileWithAuth(uploadedFileId);
            setImageUrl(URL.createObjectURL(newFile));
        } catch (error) {
            console.error("Fayl yükləmə xətası:", error);
        }
    };

    const handleDeletePhoto = async () => {
        try {
            onFileChange(null);
            setImageUrl(null);
            employee.fileId = null;
            toast.success("Uğurla silindi");
        } catch (error) {
            console.error("Şəkil silinmədi:", error);
        }
    };

    return (
        <MDBox sx={{p: 2, display: "flex", alignItems: "center", gap: 5}}>
            <Avatar
                variant="square"
                src={imageUrl || "/default-avatar.png"}
                alt="Profil Şəkli"
                sx={{width: 200, height: 200, borderRadius: '15px'}}
            />

            <CardContent sx={{p: 0, display: "flex", alignItems: "center"}}>
                <Stack spacing={3}>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon/>}
                        component="label"
                    >
                        Profil Şəklini Yenilə
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handlePhotoChange}
                        />
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon/>}
                        onClick={handleDeletePhoto}
                        disabled={!employee?.fileId}
                    >
                        Profil şəklini sil
                    </Button>
                </Stack>
            </CardContent>
        </MDBox>

    );
}
