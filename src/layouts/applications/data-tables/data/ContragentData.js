import IconButton from '@mui/material/IconButton';
import Edit from 'assets/images/icons/pencil-alt.svg';
import Delete from 'assets/images/icons/trash.svg';
import MDBox from 'components/MDBox';

const rawRows = [
    {
        id: 1,
        ContragentCode: "KTG-0124",
        LegalName: "Hüquq Servis MMC",
        ShortName: "HSM",
        Vöen: 1700768555,
        Email: "hsmmc@gmail.com",
    
    },
    {
        id: 2,
        ContragentCode: "KTG-0125",
        LegalName: "Azerbaijan Tech LLC",
        ShortName: "AT",
        Vöen: 1700768556,
        Email: "azerbaijantech@gmail.com",
        
    },
    {
        id: 3,
        ContragentCode: "KTG-0126",
        LegalName: "Creative Solutions Inc",
        ShortName: "CS",
        Vöen: 1700768557,
        Email: "creativesolutions@gmail.com",
        
    },

];

const dataTableData = {
    columns: [
        { Header: "Kontagent Kodu", accessor: "ContragentCode", width: "20%" },
        { Header: "Hüquqi adı", accessor: "LegalName", width: "25%" },
        { Header: "Qısa adı", accessor: "ShortName" },
        { Header: "Vöen", accessor: "Vöen", width: "" },
        { Header: "Email", accessor: "Email" },
        { Header: "", accessor: "actions", width: "5%" },
    ],
    rows: rawRows.map(row => ({
        ...row,
        actions: (
            <>
                <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end" textAlign="right">
                    <IconButton size="small"><img src={Edit} alt="Edit" /></IconButton>
                    <IconButton size="small"><img src={Delete} alt="Delete" /></IconButton>
                </MDBox>
            </>
        ),
    })),
};

export default dataTableData;
