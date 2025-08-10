import {useEffect, useState} from "react";
import InProgress from "./InProgress";
import CompeletedTasks from "./CompletedTasks";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDButton from "../../components/MDButton";
import Icon from "@mui/material/Icon";
import MDBox from "../../components/MDBox";
import {useNavigate} from "react-router-dom";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{p: 2}}>{children}</Box>}
        </div>
    );
}

function Assignments() {
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate();
    const [allowAdding, setAllowAdding] = useState(false);


    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };


    const checkPrivileges = () => {
        const privilege = JSON.parse(localStorage.getItem('priviligies') || '[]');
        setAllowAdding(privilege.includes('TASKS_ADD'));
    }

    useEffect(() => {
        checkPrivileges();
    }, []);


    return (
        <>
            <DashboardLayout>
                <DashboardNavbar/>
                <MDBox
                    display="flex"
                    justifyContent="end"
                    gap={2}
                    alignItems="center"
                    pr={3}
                    m={3}
                >
                    {
                        allowAdding && (
                            <MDButton
                                variant="gradient"
                                color="primary"
                                onClick={() => navigate("/modules/task/new")}
                                sx={{
                                    boxShadow: "none",
                                    "&:hover": {
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                <Icon sx={{mr: 1}} fontSize="small">
                                    add
                                </Icon>
                                Yeni Tapşırıq yarat
                            </MDButton>
                        )
                    }
                </MDBox>
                <Tabs value={tabIndex} onChange={handleChange} centered>
                    <Tab label="İcrada olanlar"/>
                    <Tab label="İcrası bitmişlər"/>
                </Tabs>

                <TabPanel value={tabIndex} index={0}>
                    <InProgress/>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <CompeletedTasks/>
                </TabPanel>
            </DashboardLayout>
        </>
    );
}

export default Assignments;
