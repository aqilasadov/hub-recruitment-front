// utils/fetchFileWithAuth.js
import apiClient from "apiClient"; // Burada interceptor-lar işləyəcək

export const fetchFileWithAuth = async (fileId) => {
  const response = await apiClient.get(`/file/view/${fileId}`, {
    responseType: "blob",
  });

  return response.data;
};

export const downloadFileWithAuth = async (fileId, fileName = "file") => {
  const blob = await fetchFileWithAuth(fileId);
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
