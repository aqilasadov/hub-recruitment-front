// Material Dashboard 3 PRO React layouts
import Dashboard from "pages/dashboard/Dashboard";

import ProfileOverview from "layouts/pages/profile/profile-overview";
import AllProjects from "layouts/pages/profile/all-projects";
import NewUser from "layouts/pages/users/new-user";
import Settings from "layouts/pages/account/settings";
import Billing from "layouts/pages/account/billing";
import Invoice from "layouts/pages/account/invoice";
import Widgets from "layouts/pages/widgets";
// import RTL from "layouts/pages/rtl";
import Kanban from "layouts/applications/kanban";
import Wizard from "layouts/applications/wizard";
import DataTables from "layouts/applications/data-tables";
import Calendar from "layouts/applications/calendar";
import SignInBasic from "layouts/authentication/sign-in/basic";
import SignInCover from "layouts/authentication/sign-in/cover";
import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpCover from "layouts/authentication/sign-up/cover";
import ResetCover from "layouts/authentication/reset-password/cover";

// Material Dashboard 3 PRO React components
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "assets/images/team-2.jpg";

// Pages
import Documents from "pages/documents/Documents";
import NewDocument from "pages/documents/NewDocument";
import {useContext} from "react";
import {AuthContext} from "context/AuthContext";
import {useNavigate} from "react-router-dom";
import Employee from "./pages/employee/Employee";
import AddNewEmployee from "./pages/employee/AddNewEmployee";
import EditEmployee from "./pages/employee/EditEmployee";
import EditTabItems from "./pages/employee/EditTabItems";
import Profile from "pages/profile/Profile";
import Roles from "./pages/roles/Roles";
import AddRoles from "./pages/roles/AddRoles";
import Privileges from "./pages/privileges/Privileges";
import AddPrivileges from "./pages/privileges/AddPrivileges";
import PrivilegeGuard from "./components/protectedRoute/PrivilegeGuard";
import Notification from "./pages/notifications/Notification";

const LogoutWrapper = () => {
    const {logoutHandler} = useContext(AuthContext);
    const navigate = useNavigate();

    logoutHandler();
    navigate("/authentication/sign-in/basic");
    return null;
};

function filterRoutesByPrivilege(routes, privileges) {
    return routes
        .map((route) => {
            if (route.collapse) {
                const filteredCollapse = filterRoutesByPrivilege(route.collapse, privileges);
                return filteredCollapse.length > 0
                    ? {...route, collapse: filteredCollapse}
                    : null;
            }
            if (!route.requiredPrivilege || privileges.includes(route.requiredPrivilege)) {
                return route;
            }
            return null;
        })
        .filter(Boolean);
}

const getCustomRoutes = (user) => {
    const privileges = JSON.parse(localStorage.getItem("priviligies") || "[]");

    const routes = [
        {
            type: "collapse",
            name: user || "İstifadəçi",
            key: "user-profile",
            icon: <MDAvatar src={profilePicture} alt="Aqil Əsədov" size="sm"/>,
            collapse: [
                {
                    name: "Profil",
                    key: "profile",
                    route: "/dashboards/profile",
                    component: <Profile/>,
                },
                {
                    name: "Çıxış",
                    key: "logout",
                    route: "logout",
                    component: <LogoutWrapper/>,
                },
            ],
        },

        {type: "divider", key: "divider-0"},
        {
            type: "collapse",
            name: "Ana Səhifə",
            key: "dashboards",
            route: "/dashboards",
            component: <Dashboard/>,
            icon: <Icon fontSize="small">apps</Icon>,
            noCollapse: true,
        },

        {
            type: "collapse",
            name: "İnsan Resursları (HR)",
            key: "hr",
            icon: <Icon fontSize="small">group</Icon>,
            collapse: [
                {
                    name: "İşçi Məlumatları",
                    key: "employees",
                    route: "/modules/employees",
                    requiredPrivilege: "EMPLOYEE_VIEW",
                    component: <PrivilegeGuard requiredPrivilege="EMPLOYEE_VIEW">
                        <Employee/>
                    </PrivilegeGuard>,
                },
                {
                    name: "İmtiyazlar",
                    key: "roles",
                    route: "/modules/roles",
                    requiredPrivilege: "ROLES_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="ROLES_VIEW">
                            <Roles/>,
                        </PrivilegeGuard>
                },
                {
                    name: "İcazələr",
                    key: "privileges",
                    route: "/modules/privileges",
                    requiredPrivilege: "PRIVILEGES_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="PRIVILEGES_VIEW">
                            <Privileges/>,
                        </PrivilegeGuard>
                },
            ],
        },
        {
            type: "title",
            name: "Account",
            key: "account",
            icon: <Icon fontSize="small">person</Icon>,
            collapse: [
                {
                    name: "Settings",
                    key: "settings",
                    route: "/pages/account/settings",
                    component: <Settings/>,
                },
                {
                    name: "Billing",
                    key: "billing",
                    route: "/pages/account/billing",
                    component: <Billing/>,
                },
                {
                    name: "Invoice",
                    key: "invoice",
                    route: "/pages/account/invoice",
                    component: <Invoice/>,
                },
            ],
        },
        {
            type: "title",
            name: "Team",
            key: "team",
            icon: <Icon fontSize="small">people</Icon>,
            collapse: [
                {
                    name: "All Projects",
                    key: "all-projects",
                    route: "/pages/profile/all-projects",
                    component: <AllProjects/>,
                },
                {
                    name: "New User",
                    key: "new-user",
                    route: "/pages/users/new-user",
                    component: <NewUser/>,
                },
                {
                    name: "Profile Overview",
                    key: "profile-overview",
                    route: "/pages/profile/profile-overview",
                    component: <ProfileOverview/>,
                },
            ],
        },
        {
            type: "title",
            name: "Applications",
            key: "applications",
            icon: <Icon fontSize="small">apps</Icon>,
            collapse: [
                {
                    name: "Kanban",
                    key: "kanban",
                    route: "/applications/kanban",
                    component: <Kanban/>,
                },
                {
                    name: "Wizard",
                    key: "wizard",
                    route: "/applications/wizard",
                    component: <Wizard/>,
                },
                {
                    name: "Data Tables",
                    key: "data-tables",
                    route: "/applications/data-tables",
                    component: <DataTables/>,
                },
                {
                    name: "Calendar",
                    key: "calendar",
                    route: "/applications/calendar",
                    component: <Calendar/>,
                },
            ],
        },

        {
            type: "title",
            name: "Team",
            key: "team",
            icon: <Icon fontSize="small">people</Icon>,
            collapse: [
                {
                    name: "All Projects",
                    key: "all-projects",
                    route: "/pages/profile/all-projects",
                    component: <AllProjects/>,
                },
                {
                    name: "New User",
                    key: "new-user",
                    route: "/pages/users/new-user",
                    component: <NewUser/>,
                },
                {
                    name: "Profile Overview",
                    key: "profile-overview",
                    route: "/pages/profile/profile-overview",
                    component: <ProfileOverview/>,
                },
            ],
        },
        {
            type: "title",
            name: "Authentication",
            key: "authentication",
            icon: <Icon fontSize="small">content_paste</Icon>,
            collapse: [
                {
                    name: "Sign In",
                    key: "sign-in",
                    collapse: [
                        {
                            name: "Basic",
                            key: "basic",
                            route: "/authentication/sign-in/basic",
                            component: <SignInBasic/>,
                        },
                        {
                            name: "Cover",
                            key: "cover",
                            route: "/authentication/sign-in/cover",
                            component: <SignInCover/>,
                        },
                        {
                            name: "Illustration",
                            key: "illustration",
                            route: "/authentication/sign-in/illustration",
                            component: <SignInIllustration/>,
                        },
                    ],
                },
                {
                    name: "Sign Up",
                    key: "sign-up",
                    collapse: [
                        {
                            name: "Cover",
                            key: "cover",
                            route: "/authentication/sign-up/cover",
                            component: <SignUpCover/>,
                        },
                    ],
                },
                {
                    name: "Reset Password",
                    key: "reset-password",
                    collapse: [
                        {
                            name: "Cover",
                            key: "cover",
                            route: "/authentication/reset-password/cover",
                            component: <ResetCover/>,
                        },
                    ],
                },
            ],
        },
        {
            type: "title",
            name: "Change Log",
            key: "changelog",
            href: "https://github.com/creativetimofficial/ct-material-dashboard-pro-react/blob/main/CHANGELOG.md",
            icon: <Icon fontSize="small">receipt_long</Icon>,
            noCollapse: true,
        },

        // Routes for new pages
        {
            type: "route",
            name: "Notifications",
            key: "notifications",
            route: "/modules/notifications",
            component: <Notification/>,
        },
        {
            type: "route",
            name: "New Employee",
            key: "new-employee",
            route: "/modules/employees/new",
            component: <AddNewEmployee/>,
        },
        {
            type: "route",
            name: "New Role",
            key: "new-role",
            route: "/modules/roles/new",
            component: <AddRoles/>,
        },
        {
            type: "route",
            name: "Edit Role",
            key: "edit-role",
            route: "/modules/roles/edit/:id",
            component: <AddRoles/>,
        },
        {
            type: "route",
            name: "Add Privilege",
            key: "new-privilege",
            route: "/modules/privileges/new",
            component: <AddPrivileges/>,
        },
        {
            type: "route",
            name: "Edit Privilege",
            key: "edit-privilege",
            route: "/modules/privileges/edit/:id",
            component: <AddPrivileges/>,
        },
        {
            type: "route",
            name: "Edit Employee",
            key: "edit-employee",
            route: "/modules/employees/edit/:id",
            component: <EditEmployee/>,
        },
        {
            type: "route",
            name: "Edit Employee Tab Items",
            key: "edit-employee-tab-items",
            route: "/modules/employees/tabItems",
            component: <EditTabItems/>,
        },
        {
            type: "route",
            name: "New Document",
            key: "new-document",
            route: "/modules/documents/new",
            component: <NewDocument/>,
        },
    ];

    return filterRoutesByPrivilege(routes, privileges);
};


// const getCustomRoutes = (user) => [
//
// ];

export default getCustomRoutes;
