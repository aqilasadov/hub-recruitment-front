import IconButton from '@mui/material/IconButton';
import Edit from 'assets/images/icons/pencil-alt.svg';
import Delete from 'assets/images/icons/trash.svg';
import MDBox from 'components/MDBox';

const rawRows = [
  {
    id: 1,
    name: "Yeni Mühasibat sistemi tətbiq olundu",
    createdDate: "11/06/2025",
   
   
  },
  {
    id: 2,
    name: "Yeni Mühasibat sistemi tətbiq olundu",
    createdDate: "11/06/2025",
   
   
  },  
  {
    id: 3,
    name: "Yeni Mühasibat sistemi tətbiq olundu",
    createdDate: "11/06/2025",
   
   
  }, 
  {
    id: 4,
    name: "Yeni Mühasibat sistemi tətbiq olundu",
    createdDate: "11/06/2025",
   
   
  },  




 
  

 
 
  
 
  
  
  
 
  
 
  
  
  
];

const dataTableData = {
  columns: [
    { Header: "Elanın adı", accessor: "name", width: "20%" },
    { Header: "Yaradılma tarixi", accessor: "createdDate", width: "25%" },
   
   
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
  