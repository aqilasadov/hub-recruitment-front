import IconButton from '@mui/material/IconButton';
import Edit from 'assets/images/icons/pencil-alt.svg';
import Delete from 'assets/images/icons/trash.svg';
import MDBox from 'components/MDBox';

const rawRows = [
    {
        id: 1,
        ContragentCode: "KTG-0124",
        ContragentName: "Hüquq Servis MMC",
        OrderCode: "M8167",
        ProductServiceCode: "KV-124",
        UnitOfMeasure: "Ədəd",
        Ordering: "SOFAZ",
        OrderingDate: "2024-01-01",
        OrderingAmount: "120",
        OrderingPrice: "2560 AZN",

    },
    {
        id: 2,
        ContragentCode: "KTG-0124",
        ContragentName: "Hüquq Servis MMC",
        OrderCode: "M8167",
        ProductServiceCode: "KV-124",
        UnitOfMeasure: "Ədəd",
        Ordering: "Mərtəbə 1",
        OrderingDate: "2024-03-01",
        OrderingAmount: "100",
        OrderingPrice: "2160 AZN",
    },
    {
        id: 3,
        ContragentCode: "KTG-0124",
        ContragentName: "Hüquq Servis MMC",
        OrderCode: "M8167",
        ProductServiceCode: "KV-124",
        UnitOfMeasure: "Ədəd",
        Ordering: "Mərtəbə 2",
        OrderingDate: "2024-02-01",
        OrderingAmount: "90",
        OrderingPrice: "2060 AZN",
    },

];

const dataTableData = {
    columns: [
        { Header: "Kontagent Kodu", accessor: "ContragentCode", width: "20%" },
        { Header: "Hüquqi adı", accessor: "ContragentName", width: "25%" },
        { Header: "Sifariş kodu", accessor: "OrderCode" },
        { Header: "Mal/Xidmət kodu", accessor: "ProductServiceCode" },
        { Header: "Ölçü vahidi", accessor: "UnitOfMeasure" },
        { Header: "Sifariş verən", accessor: "Ordering" },
        { Header: "Sifariş tarixi", accessor: "OrderingDate" },
        { Header: "Sifariş sayı", accessor: "OrderingAmount" },
        { Header: "Qiymət", accessor: "OrderingPrice" },
        
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
