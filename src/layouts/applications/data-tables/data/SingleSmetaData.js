import IconButton from '@mui/material/IconButton';
import Edit from 'assets/images/icons/pencil-alt.svg';
import Delete from 'assets/images/icons/trash.svg';
import MDBox from 'components/MDBox';

const rawRows = [
    {
        id: 1,
        SubstanceName: ["Ştatdankənar işçilərin ə/h", "Ştatdankənar işçilərin ə/h"],
        BalanceSheet: "73108/84001",
        Department: ["İnsan resursları departamenti", "İT departamenti"],
        Etiket: "Əmək haqqı",
        SubstanceCode: [211900, 212910],
        section: ["Köməkçi bölmə", "Köməkçi bölmə"],
        ApprovedAmount: 100000,

    },
    {
        id: 2,
        SubstanceName: ["Ştatdankənar işçilərin ə/h", "Ştatdankənar işçilərin ə/h"],
        BalanceSheet: "73108/84001",
        Department: ["İnsan resursları departamenti", "Satış departamenti"],
        Etiket: "Əmək haqqı",
        SubstanceCode: [211900, 212910],
        section: ["Köməkçi bölmə", "Köməkçi bölmə"],
        ApprovedAmount: 20000,

    },
    {
        id: 3,
        SubstanceName: ["Ştatdankənar işçilərin ə/h", "Ştatdankənar işçilərin ə/h"],
        BalanceSheet: "73108/84001",
        Department: ["İnsan resursları departamenti", "Maliyyə departamenti"],
        Etiket: "Əmək haqqı",
        SubstanceCode: [211900, 212910],
        section: ["Köməkçi bölmə", "Köməkçi bölmə"],
        ApprovedAmount: 30000,

    },

];

const dataTableData = {
    columns: [
        { Header: "Maddənin adı", accessor: "SubstanceName", width: "20%" },
        { Header: "Balans hesabı", accessor: "BalanceSheet", width: "25%" },
        { Header: "Departament", accessor: "Department" },
        { Header: "Etiket", accessor: "Etiket", width: "" },
        { Header: "Maddənin kodu", accessor: "SubstanceCode" },
        { Header: "Bölmə", accessor: "section" },
        { Header: "Təsdiqlənmiş məbləğ", accessor: "ApprovedAmount" },
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
