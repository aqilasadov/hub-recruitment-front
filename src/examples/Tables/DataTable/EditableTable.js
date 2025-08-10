import React, { useMemo, useEffect, useState, useCallback } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-table components
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
} from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";

// Material Dashboard 3 PRO React examples
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import ExpandableEditRow from "./ExpandableEditRow";

function DataTable({
  entriesPerPage = { defaultValue: 20, entries: [20, 50, 100, 200] },
  canSearch = false,
  showTotalEntries = true,
  table,
  pagination = { variant: "gradient", color: "gold" },
  isSorted = true,
  noEndBorder = false,
  editRowIndex,
  onRowClick,
}) {
  const defaultValue = entriesPerPage.defaultValue
    ? entriesPerPage.defaultValue
    : 20;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["20", "50", "100", "200"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  // Default sütun filter komponenti
  const DefaultColumnFilter = useCallback(
    ({ column: { filterValue, setFilter } }) => {
      return (
        <MDInput
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined);
          }}
          placeholder={`Axtar...`}
          size="small"
          fullWidth
          sx={{
            marginTop: 1,
            "& .MuiInputBase-input": {
              padding: "4px 8px",
              fontSize: "0.875rem",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
                borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
              },
              "&:hover fieldset": {
                border: "none",
                borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
              },
              "&.Mui-focused fieldset": {
                border: "none",
                borderBottom: "2px solid #1976d2",
              },
            },
          }}
        />
      );
    },
    []
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [DefaultColumnFilter]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value) => setPageSize(value);

  // Render the paginations
  const renderPagination = () => {
    const items = [];

    // İlk səhifə
    items.push(
      <MDPagination
        item
        key="first"
        onClick={() => gotoPage(0)}
        active={pageIndex === 0}
      >
        1
      </MDPagination>
    );

    // Əgər cari səhifə 3-dən böyükdürsə, "..." əlavə et
    if (pageIndex > 2) {
      items.push(
        <MDPagination item key="dots1" disabled>
          ...
        </MDPagination>
      );
    }

    // Cari səhifənin ətrafındakı səhifələr
    for (
      let i = Math.max(1, pageIndex - 1);
      i <= Math.min(pageOptions.length - 2, pageIndex + 1);
      i++
    ) {
      items.push(
        <MDPagination
          item
          key={i}
          onClick={() => gotoPage(i)}
          active={pageIndex === i}
        >
          {i + 1}
        </MDPagination>
      );
    }

    // Əgər son səhifədən 3 əvvəl deyiliksə, "..." əlavə et
    if (pageIndex < pageOptions.length - 3) {
      items.push(
        <MDPagination item key="dots2" disabled>
          ...
        </MDPagination>
      );
    }

    // Son səhifə (əgər birdən çox səhifə varsa)
    if (pageOptions.length > 1) {
      items.push(
        <MDPagination
          item
          key="last"
          onClick={() => gotoPage(pageOptions.length - 1)}
          active={pageIndex === pageOptions.length - 1}
        >
          {pageOptions.length}
        </MDPagination>
      );
    }

    return items;
  };

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0
      ? gotoPage(0)
      : gotoPage(Number(value));

  // Customized page options starting from 1
  const customizedPageOptions = pageOptions.map((option) => option + 1);

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }) =>
    gotoPage(Number(value.value - 1));

  // Search input value state
  const [search, setSearch] = useState(globalFilter);

  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  // Setting the entries starting point
  const entriesStart =
    pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
    
      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableHeadCell
                  key={idx}
                  {...column.getHeaderProps(
                    isSorted && column.getSortByToggleProps()
                  )}
                  width={column.width ? column.width : "auto"}
                  align={column.align ? column.align : "left"}
                  sorted={setSortedValue(column)}
                >
                  {column.render("Header")}
                  {idx !== headerGroup.headers.length - 1 && (
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  )}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);

            return (
              <React.Fragment key={key}>
                <TableRow
                  {...row.getRowProps()}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}
                  // onClick={() => onRowClick && onRowClick(row)}
                >
                  {row.cells.map((cell, idx) => (
                    <DataTableBodyCell
                      key={idx}
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "left"}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

      <MDBox
        display="flex"
        justifyContent="center"
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
   
      </MDBox>
    </TableContainer>
  );
}

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  enableInlineEdit: PropTypes.bool,
  editIndex: PropTypes.number,
  editForm: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEditChange: PropTypes.func,
  handleEditSave: PropTypes.func,
  handleEditCancel: PropTypes.func,
};

export default DataTable;
