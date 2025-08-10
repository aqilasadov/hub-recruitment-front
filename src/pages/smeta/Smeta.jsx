// @mui material components
import Card from "@mui/material/Card";
import {
    Autocomplete,
    Icon,
    IconButton,
    MenuItem,
    Menu,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";
import TextField from '@mui/material/TextField';

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Assets
import downloadIcon from "assets/images/icons/download.svg";
import Edit from 'assets/images/icons/pencil-alt.svg';
import Delete from 'assets/images/icons/trash.svg';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Packages
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import dayjs from 'dayjs';

function ActionsMenu({row, handleExportAsXlsx, handlePreviewExcel}) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddSubsection = () => {
        navigate("/modules/smeta/newsubsmeta", {
            state: {
                parentYear: row.original.year,
                parentDescription: row.original.description,
                parentId: row.original.id
            }
        });
        handleClose();
    };

    return (
        <>
            <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon fontSize="small" color="darkBlue"/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuItem onClick={handleAddSubsection}>
                    <Icon sx={{mr: 1}} fontSize="small">add</Icon> Alt bölmə əlavə et
                </MenuItem>
                <MenuItem onClick={() => {
                    handleExportAsXlsx([row.original], `smeta-${row.original.id}.xlsx`);
                    handleClose();
                }}>
                    <img src={downloadIcon} alt="Download" style={{width: "18px", height: "18px", marginRight: "8px"}}/>
                    Excel formatını endir
                </MenuItem>
                <MenuItem onClick={() => {
                    handlePreviewExcel(row);
                    handleClose();
                }}>
                    <Icon sx={{mr: 1}} fontSize="small">visibility</Icon> Excel formatına bax
                </MenuItem>
            </Menu>
        </>
    );
}

function DataTables() {
    const navigate = useNavigate();
    const [smetaList, setSmetaList] = useState([]);
    const [openPreview, setOpenPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [allowAdding, setAllowAdding] = useState(false);
    const [allowUpdating, setAllowUpdating] = useState(false);
    const [allowDeleting, setAllowDeleting] = useState(false);


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('SMETA_ADD'));
        setAllowUpdating(privilege.includes('SMETA_EDIT'));
        setAllowDeleting(privilege.includes('SMETA_DELETE'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);


    const columns = [
        {Header: "İl", accessor: "year", width: "20%"},
        {Header: "Açıqlama", accessor: "description", width: "25%"},
        {
            Header: "Əməliyyatlar",
            accessor: "actions",
            Cell: ({row}) => renderActions(row),
            width: "10%",
        },
    ];

    const exportableColumns = columns.filter((col) => col.accessor !== "actions");

    const prepareExportData = (rows) => {
        return rows.map((row) => {
            const filteredRow = {};
            exportableColumns.forEach((col) => {
                filteredRow[col.Header] = row[col.accessor];
            });
            return filteredRow;
        });
    };

    const handleExportAsXlsx = (rowsToExport = smetaList, filename = 'smetalar.xlsx') => {
        const exportData = prepareExportData(rowsToExport);
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Smetalar");
        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(data, filename);
    };

    const fetchSmetaList = async () => {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
        const transformed = response.data.map(item => ({
            id: item.id,
            year: item.userId, // Süni olaraq 'year' kimi istifadə olunur
            description: item.title,
        }));
        setSmetaList(transformed);
    };

    useEffect(() => {
        fetchSmetaList();
    }, []);

    const handleEdit = (row) => {
        navigate(`/modules/smeta/edit/${row.original.id}`);
    };

    const handleDelete = (id) => {

        // Modal və ya API call burada
    };

    const previewableColumns = columns.filter((col) => col.accessor !== "actions");

    const handlePreviewExcel = (row) => {

        setPreviewData(row.original); // row.original real data-nı saxlayır
        setOpenPreview(true);
    };

    const renderActions = (row) => (
        <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end">
            <ActionsMenu row={row} handleExportAsXlsx={handleExportAsXlsx} handlePreviewExcel={handlePreviewExcel}/>
            <>
                {
                    allowUpdating && (
                        <IconButton size="small" onClick={() => handleEdit(row)}>
                            <img src={Edit} alt="Edit"/>
                        </IconButton>
                    )
                }
                {
                    allowDeleting && (
                        <IconButton size="small" onClick={() => handleDelete(row.original.id)}>
                            <img src={Delete} alt="Delete"/>
                        </IconButton>
                    )
                }
            </>
        </MDBox>
    );

    return (
        <>

            <DashboardLayout>
                <DashboardNavbar/>
                <MDBox pt={6} pb={3}>
                    <MDBox mb={3}>
                        <Card>
                            <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                                <MDBox>
                                    <MDTypography variant="h5" fontWeight="medium">Smeta</MDTypography>
                                    <MDTypography variant="button" color="text">Smeta siyahısı və
                                        əməliyyatlar</MDTypography>
                                </MDBox>
                                <MDBox display="flex" gap={2}>
                                    <MDButton variant="text" color="darkBlue" onClick={() => handleExportAsXlsx()}>
                                        <img src={downloadIcon} alt="Download"
                                             style={{width: 18, height: 18, marginRight: 8}}/>
                                        Excel faylı endir
                                    </MDButton>
                                    {
                                        allowAdding && (
                                            <MDButton
                                                variant="gradient"
                                                color="primary"
                                                onClick={() => navigate("/modules/smeta/new")}
                                                sx={{boxShadow: "none"}}
                                            >
                                                <Icon sx={{mr: 1}} fontSize="small">add</Icon>
                                                Yeni Smeta yarat
                                            </MDButton>
                                        )
                                    }
                                </MDBox>
                            </MDBox>
                            <DataTable table={{columns, rows: smetaList}} canSearch/>
                        </Card>
                    </MDBox>
                </MDBox>
            </DashboardLayout>

            <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
                <DialogTitle>Excel formatına bax</DialogTitle>
                <DialogContent>
                    {previewData && (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {previewableColumns.map((col) => (
                                        <TableCell key={col.accessor} sx={{fontWeight: "bold"}}>
                                            {col.Header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    {previewableColumns.map((col) => (
                                        <TableCell key={col.accessor}>
                                            {previewData[col.accessor]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default DataTables;
