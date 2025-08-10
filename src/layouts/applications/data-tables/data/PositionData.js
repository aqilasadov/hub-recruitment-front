import IconButton from '@mui/material/IconButton';
import Edit from 'assets/images/icons/pencil-alt.svg';
import Delete from 'assets/images/icons/trash.svg';
import MDBox from 'components/MDBox';

const rawRows = [
  {
    id: 1,
    plateNumber: "Mühasib",
    status: "Aktiv",
   
  },
  {
    id: 2,
    plateNumber: "Proqramçı",
    status: "Aktiv",
   
  },
  {
    id: 3,
    plateNumber: "İT Mütəxəssis",
    status: "Deaktiv",
   
  },
  {
    id: 4,
    plateNumber: "Hüquqşünas",
    status: "Aktiv",
   
  },
  

 
 
  
 
  
  
  
 
  
 
  
  
  
];

const dataTableData = {
  columns: [
    { Header: "Tabel nömrəsi", accessor: "plateNumber", width: "20%" },
    { Header: "Status", accessor: "status", width: "25%" },
   
   
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
  