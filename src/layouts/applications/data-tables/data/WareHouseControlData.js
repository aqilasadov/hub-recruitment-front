import { Icon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Edit from 'assets/images/icons/pencil-alt.svg';
import Delete from 'assets/images/icons/trash.svg';
import MDBox from 'components/MDBox';

const rawRows = [
    {
        id: 1,
        ProductCode: "M555",
        ProductName: "Dell Monitor",
        GeneralCount: "100",
        RemainingCount: "50",
        
       
    
    },
    {
        id: 2,
        ProductCode: "M556",
        ProductName: "Dell Keyboard",
        GeneralCount: "70",
        RemainingCount: "50",
        
        
    },
    {
        id: 3,
        ProductCode: "M557",
        ProductName: "Dell Mouse",
        GeneralCount: "300",
        RemainingCount: "10",
        
        
    },

];

const dataTableData = {
    columns: [
        { Header: "Malın Kodu", accessor: "ProductCode", width: "20%" },
        { Header: "Malın Adı", accessor: "ProductName", width: "25%" },
        { Header: "Ümumi say", accessor: "GeneralCount" },
        { Header: "Qalıq say", accessor: "RemainingCount" },
       
        { Header: "", accessor: "actions", width: "5%" },
    ],
    rows: rawRows.map(row => ({
        ...row,
        actions: (
            <>
                <MDBox display="flex" gap={1} alignItems="center" justifyContent="flex-end" textAlign="right">
                    <IconButton><Icon>visibility</Icon></IconButton>
                    <IconButton size="small"><img src={Edit} alt="Edit" /></IconButton>
                    <IconButton size="small"><img src={Delete} alt="Delete" /></IconButton>
                </MDBox>
            </>
        ),
    })),
};

export default dataTableData;
