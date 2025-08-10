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
import Contract from "pages/contracts/Contract";
import NewContract from "pages/contracts/NewContract";
import Orders from "pages/orders/Orders";
import NewOrder from "pages/orders/NewOrder";
import Payments from "pages/payments/Payments";
import NewPayment from "pages/payments/NewPayment";
import Budget from "pages/budget/Budget";
import NewBudget from "pages/budget/NewBudget";
import Smeta from "pages/smeta/Smeta";
import NewSmeta from "pages/smeta/NewSmeta";
import Contragent from "pages/contragents/Contragent";
import Products from "pages/products/Products";
import NewProduct from "pages/products/NewProduct";
import WareHouseControl from "pages/wareHouseControl/WareHouseControl";
import NewSubSmeta from "pages/smeta/NewSubSmeta";
import SingleSmeta from "pages/smeta/SingleSmeta";
import SingleContragent from "pages/contragents/SingleContragent";
import NewContragent from "pages/contragents/NewContragent";
import Press from "pages/press/Press";
import Positions from "pages/positions/Positions";
import NewPosition from "pages/positions/NewPosition";
import Announcements from "pages/announcements/Announcements";
import NewAnnoncement from "pages/announcements/NewAnnoncement";
import Reservation from "pages/roomReservation/Reservation";
import Notification from "pages/notifications/Notification";
import LeaderShip from "pages/leadership/LeaderShip";
import LeaderShipDetail from "pages/leadership/LeaderShipDetail";
import AnnouncementInner from "pages/announcements/AnnouncementInner";
import Documents from "pages/documents/Documents";
import NewDocument from "pages/documents/NewDocument";
import {useContext} from "react";
import {AuthContext} from "context/AuthContext";
import {useNavigate} from "react-router-dom";
import Employee from "./pages/employee/Employee";
import AddNewEmployee from "./pages/employee/AddNewEmployee";
import EditEmployee from "./pages/employee/EditEmployee";
import EditTabItems from "./pages/employee/EditTabItems";
import Guests from "pages/guests/Guests";
import NewGuest from "pages/guests/NewGuest";
import PaymentTypes from "pages/paymentTypes/PaymentTypes";
import NewPaymentType from "pages/paymentTypes/NewPaymentType";
import VatTypes from "pages/vatTypes/VatTypes";
import NewVatType from "pages/vatTypes/NewVatType";
import PurchaseType from "pages/purchaseTypes/PurchaseType";
import NewPurchaseType from "pages/purchaseTypes/NewPurchaseType";
import ItemCategory from "pages/itemCategory/ItemCategory";
import NewItemCategory from "pages/itemCategory/NewItemCategory";
import RequestedItemSupplies from "pages/requestedItemSupplies/RequestedItemSupplies";
import NewRequestedItemSupplies from "pages/requestedItemSupplies/NewRequestedItemSupplies";
import NewItemDevices from "pages/requestedItemSupplies/NewItemDevices";
import ItemDevices from "pages/requestedItemSupplies/ItemDevices";
import Banks from "pages/banks/Banks";
import NewBank from "pages/banks/NewBank";
import Rooms from "pages/rooms/Rooms";
import NewRoom from "pages/rooms/NewRoom";
import Profile from "pages/profile/Profile";
import Roles from "./pages/roles/Roles";
import AddRoles from "./pages/roles/AddRoles";
import Privileges from "./pages/privileges/Privileges";
import AddPrivileges from "./pages/privileges/AddPrivileges";
import RecievingProducts from "pages/recievingProducts/RecievingProducts";
import NewRecievingProduct from "pages/recievingProducts/NewRecievingProduct";
import AddNewTasks from "./pages/tasks/AddNewTasks";
import ViewTaskStatus from "./pages/tasks/ViewTaskStatus";
import Tasks from "./pages/tasks/Tasks";
import PrivilegeGuard from "./components/protectedRoute/PrivilegeGuard";

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
                // {
                //   name: "Settings",
                //   key: "profile-settings",
                //   route: "/pages/account/settings",
                //   component: <Settings />,
                // },
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
            // collapse: [
            //   {
            //     name: "Ana Səhifə",
            //     key: "home",
            //     route: "/dashboards/home",
            //     component: <Dashboard />,
            //   },
            // ],
        },

        {type: "title", title: "Modullar", key: "title-pages"},

        {
            type: "collapse",
            name: "Müqavilə və maliyyə",
            key: "modules",
            icon: <Icon fontSize="small">text_snippet</Icon>,
            collapse: [
                {
                    name: "Müqavilələr",
                    key: "contracts",
                    route: "/modules/contracts",
                    requiredPrivilege: "CONTRACT_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="CONTRACT_VIEW">
                            <Contract/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Sifarişlər",
                    key: "orders",
                    route: "/modules/orders",
                    requiredPrivilege: "ORDERS_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="ORDERS_VIEW">
                            <Orders/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Ödənişlər",
                    key: "payments",
                    route: "/modules/payments",
                    component: <Payments/>,
                },
                {
                    name: "Büdcə",
                    key: "budget",
                    route: "/modules/budget",
                    requiredPrivilege: "BUDGET_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="BUDGET_VIEW">
                            <Budget/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Smetalar",
                    key: "smetas",
                    route: "/modules/smetas",
                    requiredPrivilege: "SMETA_VIEW",

                    component:
                        <PrivilegeGuard requiredPrivilege="SMETA_VIEW">
                            <Smeta/>,
                        </PrivilegeGuard>
                },
                // {
                //   name: "İnzibati Modul",
                //   key: "infrastructure",
                //   route: "/modules/infrastructure",
                //   component: <Charts />,
                // },
                // {
                //   name: "Əmək haqqı Hesablanması",
                //   key: "salary",
                //   route: "/modules/salary",
                //   component: <Charts />,
                // },
                // {
                //   name: "KPİ Hesablanması Modulu",
                //   key: "kpi",
                //   route: "/modules/kpi",
                //   component: <Charts />,
                // },
            ],
        },
        {
            type: "collapse",
            name: "Əməliyyatlar və Resurslar",
            key: "operations",
            icon: <Icon fontSize="small">file_copy</Icon>,
            collapse: [
                {
                    name: "Kontragentlər",
                    key: "contragents",
                    route: "/modules/contragents",
                    requiredPrivilege: "CONTRACTOR_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="CONTRACTOR_VIEW">
                            <Contragent/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Mallar",
                    key: "products",
                    route: "/modules/products",
                    requiredPrivilege: "PRODUCTS_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="PRODUCTS_VIEW">
                            <Products/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Malların Anbara Qəbulu",
                    key: "recievingproducts",
                    route: "/modules/recievingproducts",
                    requiredPrivilege: "STOCK_RECEIPT_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="STOCK_RECEIPT_VIEW">
                            <RecievingProducts/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Anbara Nəzarət",
                    key: "warehousecontrol",
                    route: "/modules/warehousecontrol",
                    requiredPrivilege: "DEPOT_CONTROL_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="DEPOT_CONTROL_VIEW">
                            <WareHouseControl/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Tapşırıqlar",
                    key: "tasks",
                    route: "/modules/tasks",
                    requiredPrivilege: "TASKS_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="TASKS_VIEW">
                            <Tasks/>
                        </PrivilegeGuard>
                }
            ],
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
            type: "collapse",
            name: "Sənədlər və Portallar",
            key: "docs",
            icon: <Icon fontSize="small">description</Icon>,
            // collapse: [
            //   {
            //     name: "Müqavilələr",
            //     key: "contracts",
            //     route: "/pages/contracts",
            //     component: <Widgets />,
            //   },
            //   {
            //     name: "Sifarişlər",
            //     key: "orders",
            //     route: "/pages/orders",
            //     component: <Widgets />,
            //   },
            //   {
            //     name: "Ödənişlər",
            //     key: "payments",
            //     route: "/pages/payments",
            //     component: <Charts />,
            //   },
            //   {
            //     name: "Büdcə",
            //     key: "budget",
            //     route: "/pages/budget",
            //     component: <Charts />,
            //   },
            //   {
            //     name: "Smetalar",
            //     key: "expenses",
            //     route: "/pages/expenses",
            //     component: <Charts />,
            //   },
            //   {
            //     name: "İnzibati Modul",
            //     key: "infrastructure",
            //     route: "/pages/infrastructure",
            //     component: <Charts />,
            //   },
            //   {
            //     name: "Əmək haqqı Hesablanması",
            //     key: "salary",
            //     route: "/pages/salary",
            //     component: <Charts />,
            //   },
            //   {
            //     name: "KPİ Hesablanması Modulu",
            //     key: "kpi",
            //     route: "/pages/kpi",
            //     component: <Charts />,
            //   },
            // ],
        },

        {
            type: "collapse",
            name: "Təhsil və İnformasiya",
            key: "education",
            icon: <Icon fontSize="small">school</Icon>,
            collapse: [
                {
                    name: "Mətbuatda bugün",
                    key: "presstoday",
                    route: "/modules/presstoday",
                    requiredPrivilege: "PRESS_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="PRESS_VIEW">
                            <Press/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Struktur qurumlar",
                    key: "structures",
                    route: "/modules/structures",
                    component: <Widgets/>,
                },
                {
                    name: "Vəzifələr",
                    key: "positions",
                    route: "/modules/positions",
                    component: <Positions/>,
                },
                {
                    name: "İmtiyazlar",
                    key: "permissions",
                    route: "/modules/permissions",
                    component: <Widgets/>,
                },
                {
                    name: "Fondun strukturu",
                    key: "fundstructure",
                    route: "/modules/fundstructure",
                    component: <Widgets/>,
                },
                {
                    name: "Elanlar",
                    key: "announcements",
                    route: "/modules/announcements",
                    requiredPrivilege: "ANNOUNCEMENTS_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="ANNOUNCEMENTS_VIEW">
                            <Announcements/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Rəhbərlik",
                    key: "leadership",
                    route: "/modules/leadership",
                    component: <LeaderShip/>,
                },
                {
                    name: "Sənədlər",
                    key: "documents",
                    route: "/modules/documents",
                    requiredPrivilege: "DOCUMENTS_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="DOCUMENTS_VIEW">
                            <Documents/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Qonaqlar",
                    key: "guests",
                    route: "/modules/guests",
                    requiredPrivilege: "GUESTS_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="GUESTS_VIEW">
                            <Guests/>,
                        </PrivilegeGuard>
                },
            ],
        },
        {
            type: "collapse",
            name: "Tənzimləmələr",
            key: "settings",
            icon: <Icon fontSize="small">settings</Icon>,
            collapse: [
                {
                    name: "Ödəniş Növləri",
                    key: "payment-types",
                    route: "/modules/settings/payment-types",
                    requiredPrivilege: "PAYMENT_TYPE_VIEW",

                    component:
                        <PrivilegeGuard requiredPrivilege="PAYMENT_TYPE_VIEW">
                            <PaymentTypes/>,
                        </PrivilegeGuard>
                },
                {
                    name: "ƏDV Növləri",
                    key: "vat-types",
                    route: "/modules/settings/vat-types",
                    component:
                        <PrivilegeGuard requiredPrivilege="VAT_TYPE_VIEW">
                            <VatTypes/>
                        </PrivilegeGuard>,
                    requiredPrivilege: "VAT_TYPE_VIEW",
                },
                {
                    name: "Satınalma Növü",
                    key: "purchase-type",
                    route: "/modules/settings/purchase-type",
                    component:
                        <PrivilegeGuard requiredPrivilege="PURCHASE_TYPE_VIEW">
                            <PurchaseType/>,
                        </PrivilegeGuard>,
                    requiredPrivilege: "PURCHASE_TYPE_VIEW"
                },
                {
                    name: "Mal Kateqoriyaları",
                    key: "item-category",
                    route: "/modules/settings/item-category",
                    requiredPrivilege: "PRODUCT_CATEGORY_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="PRODUCT_CATEGORY_VIEW">
                            <ItemCategory/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Ehtiyac Duyulan Qurğular",
                    key: "requested-item-devices",
                    route: "/modules/settings/requested-item-devices",
                    requiredPrivilege: "REQUESTED_ITEM_DEVICES_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="REQUESTED_ITEM_DEVICES_VIEW">
                            <ItemDevices/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Tələb Olunan İaşə Məhsulları",
                    key: "requested-item-supplies",
                    route: "/modules/settings/requested-item-supplies",
                    requiredPrivilege: "REQUESTED_ITEM_SUPPLIES_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="REQUESTED_ITEM_SUPPLIES_VIEW">
                            <RequestedItemSupplies/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Banklar",
                    key: "banks",
                    route: "/modules/settings/banks",
                    requiredPrivilege: "BANK_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="BANK_VIEW">
                            <Banks/>,
                        </PrivilegeGuard>
                },
                {
                    name: "Otaqlar",
                    key: "rooms",
                    route: "/modules/settings/rooms",
                    requiredPrivilege: "ROOM_VIEW",
                    component:
                        <PrivilegeGuard requiredPrivilege="ROOM_VIEW">
                            <Rooms/>,
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
        {type: "divider", key: "divider-1"},
        // { type: "title", title: "Docs", key: "title-docs" },
        {
            type: "title",
            name: "Basic",
            key: "basic",
            icon: <Icon fontSize="small">upcoming</Icon>,
            collapse: [
                {
                    name: "Getting Started",
                    key: "getting-started",
                    collapse: [
                        {
                            name: "Overview",
                            key: "overview",
                            href: "https://www.creative-tim.com/learning-lab/react/overview/material-dashboard/",
                        },
                        {
                            name: "License",
                            key: "license",
                            href: "https://www.creative-tim.com/learning-lab/react/license/material-dashboard/",
                        },
                        {
                            name: "Quick Start",
                            key: "quick-start",
                            href: "https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/",
                        },
                        {
                            name: "Build Tools",
                            key: "build-tools",
                            href: "https://www.creative-tim.com/learning-lab/react/build-tools/material-dashboard/",
                        },
                    ],
                },
                {
                    name: "Foundation",
                    key: "foundation",
                    collapse: [
                        {
                            name: "Colors",
                            key: "colors",
                            href: "https://www.creative-tim.com/learning-lab/react/colors/material-dashboard/",
                        },
                        {
                            name: "Grid",
                            key: "grid",
                            href: "https://www.creative-tim.com/learning-lab/react/grid/material-dashboard/",
                        },
                        {
                            name: "Typography",
                            key: "base-typography",
                            href: "https://www.creative-tim.com/learning-lab/react/base-typography/material-dashboard/",
                        },
                        {
                            name: "Borders",
                            key: "borders",
                            href: "https://www.creative-tim.com/learning-lab/react/borders/material-dashboard/",
                        },
                        {
                            name: "Box Shadows",
                            key: "box-shadows",
                            href: "https://www.creative-tim.com/learning-lab/react/box-shadows/material-dashboard/",
                        },
                        {
                            name: "Functions",
                            key: "functions",
                            href: "https://www.creative-tim.com/learning-lab/react/functions/material-dashboard/",
                        },
                        {
                            name: "Routing System",
                            key: "routing-system",
                            href: "https://www.creative-tim.com/learning-lab/react/routing-system/material-dashboard/",
                        },
                    ],
                },
            ],
        },
        {
            type: "title",
            name: "Components",
            key: "components",
            icon: <Icon fontSize="small">view_in_ar</Icon>,
            collapse: [
                {
                    name: "Alerts",
                    key: "alerts",
                    href: "https://www.creative-tim.com/learning-lab/react/alerts/material-dashboard/",
                },
                {
                    name: "Avatar",
                    key: "avatar",
                    href: "https://www.creative-tim.com/learning-lab/react/avatar/material-dashboard/",
                },
                {
                    name: "Badge",
                    key: "badge",
                    href: "https://www.creative-tim.com/learning-lab/react/badge/material-dashboard/",
                },
                {
                    name: "Badge Dot",
                    key: "badge-dot",
                    href: "https://www.creative-tim.com/learning-lab/react/badge-dot/material-dashboard/",
                },
                {
                    name: "Box",
                    key: "box",
                    href: "https://www.creative-tim.com/learning-lab/react/box/material-dashboard/",
                },
                {
                    name: "Buttons",
                    key: "buttons",
                    href: "https://www.creative-tim.com/learning-lab/react/buttons/material-dashboard/",
                },
                {
                    name: "Date Picker",
                    key: "date-picker",
                    href: "https://www.creative-tim.com/learning-lab/react/datepicker/material-dashboard/",
                },
                {
                    name: "Dropzone",
                    key: "dropzone",
                    href: "https://www.creative-tim.com/learning-lab/react/dropzone/material-dashboard/",
                },
                {
                    name: "Editor",
                    key: "editor",
                    href: "https://www.creative-tim.com/learning-lab/react/quill/material-dashboard/",
                },
                {
                    name: "Input",
                    key: "input",
                    href: "https://www.creative-tim.com/learning-lab/react/input/material-dashboard/",
                },
                {
                    name: "Pagination",
                    key: "pagination",
                    href: "https://www.creative-tim.com/learning-lab/react/pagination/material-dashboard/",
                },
                {
                    name: "Progress",
                    key: "progress",
                    href: "https://www.creative-tim.com/learning-lab/react/progress/material-dashboard/",
                },
                {
                    name: "Snackbar",
                    key: "snackbar",
                    href: "https://www.creative-tim.com/learning-lab/react/snackbar/material-dashboard/",
                },
                {
                    name: "Social Button",
                    key: "social-button",
                    href: "https://www.creative-tim.com/learning-lab/react/social-buttons/material-dashboard/",
                },
                {
                    name: "Typography",
                    key: "typography",
                    href: "https://www.creative-tim.com/learning-lab/react/typography/material-dashboard/",
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
            name: "New Contract",
            key: "new-contract",
            route: "/modules/contracts/new",
            component:
                <PrivilegeGuard requiredPrivilege="CONTRACT_ADD">
                    <NewContract/>,
                </PrivilegeGuard>,
            requiredPrivilege: "CONTRACT_ADD"
        },
        {
            type: "route",
            name: "Edit Contract",
            key: "edit-contract",
            route: "/modules/contracts/edit/:id",
            requiredPrivilege: "CONTRACT_EDIT",
            component:
                <PrivilegeGuard requiredPrivilege="CONTRACT_EDIT">
                    <NewContract/>,
                </PrivilegeGuard>
        },
        {
            type: "route",
            name: "New Order",
            key: "new-order",
            route: "/modules/orders/new",
            requiredPrivilege: "ORDERS_ADD",
            component:
                <PrivilegeGuard requiredPrivilege="ORDERS_ADD">
                    <NewOrder/>,
                </PrivilegeGuard>
        },
        {
            type: "route",
            name: "Edit Order",
            key: "edit-order",
            route: "/modules/orders/edit/:userId",
            requiredPrivilege: "ORDERS_EDIT",
            component:
                <PrivilegeGuard requiredPrivilege="ORDERS_EDIT">
                    <NewOrder/>,
                </PrivilegeGuard>
        },
        {
            type: "route",
            name: "New Payment",
            key: "new-payment",
            route: "/modules/payments/new",
            component: <NewPayment/>,
        },
        {
            type: "route",
            name: "Edit Payment",
            key: "edit-payment",
            route: "/modules/payments/edit/:userId",
            component: <NewPayment/>,
        },

        {
            type: "route",
            name: "New Budget",
            key: "new-budget",
            route: "/modules/budget/new",
            requiredPrivilege: "BUDGET_ADD",
            component:
                <PrivilegeGuard requiredPrivilege="BUDGET_ADD">
                    <NewBudget/>,
                </PrivilegeGuard>
        },
        {
            type: "route",
            name: "Edit Budget",
            key: "edit-budget",
            route: "/modules/budget/edit/:userId",
            requiredPrivilege: "BUDGET_EDIT",
            component:
                <PrivilegeGuard requiredPrivilege="BUDGET_EDIT">
                    <NewBudget/>,
                </PrivilegeGuard>
        },
        {
            type: "route",
            name: "New Smeta",
            key: "new-smeta",
            route: "/modules/smeta/new",
            requiredPrivilege: "SMETA_ADD",
            component:
                <PrivilegeGuard requiredPrivilege="SMETA_ADD">
                    <NewSmeta/>,
                </PrivilegeGuard>
        },
        {
            type: "route",
            name: "Edit Smeta",
            key: "edit-smeta",
            route: "/modules/smeta/edit/:userId",
            requiredPrivilege: "SMETA_EDIT",
            component:
                <PrivilegeGuard requiredPrivilege="SMETA_EDIT">
                    <NewSmeta/>,
                </PrivilegeGuard>
        },
        {
            type: "route",
            name: "New Sub Smeta",
            key: "newsubsmeta",
            route: "/modules/smeta/newsubsmeta",
            component: <NewSubSmeta/>,
        },
        {
            type: "route",
            name: "Single Smeta",
            key: "singlesmeta",
            route: "/modules/smeta/singlesmeta",
            component: <SingleSmeta/>,
        },
        {
            type: "route",
            name: "Single Contragent",
            key: "singlecontragent",
            route: "/modules/contragents/singlecontragent",
            component: <SingleContragent/>,
        },
        {
            type: "route",
            name: "New Contragent",
            key: "new-contragent",
            route: "/modules/contragents/new",
            component: <NewContragent/>,
        },
        {
            type: "route",
            name: "New Task",
            key: "new-task",
            route: "/modules/task/new",
            component: <AddNewTasks/>,
        },
        {
            type: "route",
            name: "View Task",
            key: "view-task",
            route: "/modules/task/view/:id",
            component: <ViewTaskStatus/>,
        },
        {
            type: "route",
            name: "Edit Task",
            key: "edit-task",
            route: "/modules/task/edit/:id",
            component: <AddNewTasks/>,
        },
        {
            type: "route",
            name: "New Contragent",
            key: "new-contragent",
            route: "/modules/contragents/edit/:id",
            component: <NewContragent/>,
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
            name: "New Product",
            key: "new-product",
            route: "/modules/products/new",
            component: <NewProduct/>,
        },
        {
            type: "route",
            name: "Edit Product",
            key: "edit-product",
            route: "/modules/products/edit/:id",
            component: <NewProduct/>,
        },
        {
            type: "route",
            name: "New Position",
            key: "new-position",
            route: "/modules/positions/new",
            component: <NewPosition/>,
        },
        {
            type: "route",
            name: "New Announcement",
            key: "new-announcement",
            route: "/modules/announcements/new",
            component: <NewAnnoncement/>,
        },
        {
            type: "route",
            name: "Edit Announcement",
            key: "edit-announcement",
            route: "/modules/announcements/edit/:id",
            component: <NewAnnoncement/>,
        },

        {
            type: "route",
            name: "Inner Announcement",
            key: "inner-announcement",
            route: "/modules/announcements/inner/:id",
            component: <AnnouncementInner/>,
        },
        {
            type: "route",
            name: "New Document",
            key: "new-document",
            route: "/modules/documents/new",
            component: <NewDocument/>,
        },
        {
            type: "route",
            name: "Room Rezervation",
            key: "reservation",
            route: "/modules/reservation",
            component: <Reservation/>,
        },
        {
            type: "route",
            name: "",
            key: "leadership-detail",
            route: "/modules/leadership/:title",
            component: <LeaderShipDetail/>,
        },

        {
            type: "route",
            name: "New Payment",
            key: "new-payment",
            route: "/modules/payments/new",
            component: <NewPayment/>,
        },
        {
            type: "route",
            name: "Edit Payment",
            key: "edit-payment",
            route: "/modules/payments/edit/:userId",
            component: <NewPayment/>,
        },
        {
            type: "route",
            name: "New Budget",
            key: "new-budget",
            route: "/modules/budget/new",
            component: <NewBudget/>,
        },
        {
            type: "route",
            name: "Edit Budget",
            key: "edit-budget",
            route: "/modules/budget/edit/:userId",
            component: <NewBudget/>,
        },
        {
            type: "route",
            name: "New Smeta",
            key: "new-smeta",
            route: "/modules/smeta/new",
            component: <NewSmeta/>,
        },
        {
            type: "route",
            name: "Edit Smeta",
            key: "edit-smeta",
            route: "/modules/smeta/edit/:userId",
            component: <NewSmeta/>,
        },
        {
            type: "route",
            name: "New Sub Smeta",
            key: "newsubsmeta",
            route: "/modules/smeta/newsubsmeta",
            component: <NewSubSmeta/>,
        },
        {
            type: "route",
            name: "Single Smeta",
            key: "singlesmeta",
            route: "/modules/smeta/singlesmeta",
            component: <SingleSmeta/>,
        },
        {
            type: "route",
            name: "Single Contragent",
            key: "singlecontragent",
            route: "/modules/contragents/singlecontragent",
            component: <SingleContragent/>,
        },
        {
            type: "route",
            name: "New Contragent",
            key: "new-contragent",
            route: "/modules/contragents/new",
            component: <NewContragent/>,
        },
        {
            type: "route",
            name: "New Contragent",
            key: "new-contragent",
            route: "/modules/contragents/edit/:id",
            component: <NewContragent/>,
        },
        {
            type: "route",
            name: "New Product",
            key: "new-product",
            route: "/modules/products/new",
            component: <NewProduct/>,
        },
        {
            type: "route",
            name: "Edit Product",
            key: "edit-product",
            route: "/modules/products/edit/:id",
            component: <NewProduct/>,
        },
        {
            type: "route",
            name: "New Recieving",
            key: "new-recieving",
            route: "/modules/recievingProducts/new",
            component: <NewRecievingProduct/>,
        },
        {
            type: "route",
            name: "New Payment Type",
            key: "new-payment-type",
            route: "/modules/settings/payment-types/new",
            component: <NewPaymentType/>,
        },
        {
            type: "route",
            name: "Edit Payment Type",
            key: "edit-payment-type",
            route: "/modules/settings/payment-types/edit/:id",
            component: <NewPaymentType/>,
        },
        {
            type: "route",
            name: "New Vat Type",
            key: "new-vat-type",
            route: "/modules/settings/vat-types/new",
            component: <NewVatType/>,
        },
        {
            type: "route",
            name: "Edit Vat Type",
            key: "edit-vat-type",
            route: "/modules/settings/vat-types/edit/:id",
            component: <NewVatType/>,
        },
        {
            type: "route",
            name: "New Bank",
            key: "new-bank",
            route: "/modules/settings/banks/new",
            component: <NewBank/>,
        },
        {
            type: "route",
            name: "Edit Bank",
            key: "edit-bank",
            route: "/modules/settings/banks/edit/:id",
            component: <NewBank/>,
        },
        {
            type: "route",
            name: "New Room",
            key: "new-room",
            route: "/modules/settings/rooms/new",
            component: <NewRoom/>,
        },
        {
            type: "route",
            name: "Edit Room",
            key: "edit-room",
            route: "/modules/settings/rooms/edit/:id",
            component: <NewRoom/>,
        },
        {
            type: "route",
            name: "New Purchase Type",
            key: "new-purchase-type",
            route: "/modules/settings/purchase-type/new",
            component: <NewPurchaseType/>,
        },
        {
            type: "route",
            name: "Edit Purchase Type",
            key: "edit-purchase-type",
            route: "/modules/settings/purchase-type/edit/:id",
            component: <NewPurchaseType/>,
        },
        {
            type: "route",
            name: "New Item Category",
            key: "new-item-category",
            route: "/modules/settings/item-category/new",
            component: <NewItemCategory/>,
        },
        {
            type: "route",
            name: "Edit Item Category",
            key: "edit-item-category",
            route: "/modules/settings/item-category/edit/:id",
            component: <NewItemCategory/>,
        },
        {
            type: "route",
            name: "New Requested Item Supplies",
            key: "new-requested-item-supplies",
            route: "/modules/settings/requested-item-supplies/new",
            component: <NewRequestedItemSupplies/>,
        },
        {
            type: "route",
            name: "Edit Requested Item Supplies",
            key: "edit-requested-item-supplies",
            route: "/modules/settings/requested-item-supplies/edit/:id",
            component: <NewRequestedItemSupplies/>,
        },
        {
            type: "route",
            name: "New Requested Devices",
            key: "new-requested-item-devices",
            route: "/modules/settings/requested-item-devices/new",
            component: <NewItemDevices/>,
        },
        {
            type: "route",
            name: "Edit Requested Devices",
            key: "edit-requested-item-devices",
            route: "/modules/settings/requested-item-devices/edit/:id",
            component: <NewItemDevices/>,
        },

        {
            type: "route",
            name: "New Guest",
            key: "new-guest",
            route: "/modules/guests/new",
            component: <NewGuest/>,
        },
        {
            type: "route",
            name: "Edit Guest",
            key: "edit-guest",
            route: "/modules/guests/edit/:id",
            component: <NewGuest/>,
        },
        {
            type: "route",
            name: "New Position",
            key: "new-position",
            route: "/modules/positions/new",
            component: <NewPosition/>,
        },
        {
            type: "route",
            name: "New Announcement",
            key: "new-announcement",
            route: "/modules/announcements/new",
            component: <NewAnnoncement/>,
        },
        {
            type: "route",
            name: "Edit Announcement",
            key: "edit-announcement",
            route: "/modules/announcements/edit/:id",
            component: <NewAnnoncement/>,
        },

        {
            type: "route",
            name: "Inner Announcement",
            key: "inner-announcement",
            route: "/modules/announcements/:id",
            component: <AnnouncementInner/>,
        },
        {
            type: "route",
            name: "New Document",
            key: "new-document",
            route: "/modules/documents/new",
            component: <NewDocument/>,
        },
        {
            type: "route",
            name: "Edit Document",
            key: "edit-document",
            route: "/modules/documents/edit/:id",
            component: <NewDocument/>,
        },
        {
            type: "route",
            name: "Room Rezervation",
            key: "reservation",
            route: "/modules/reservation",
            component: <Reservation/>,
        },
        {
            type: "route",
            name: "",
            key: "leadership-detail",
            route: "/modules/leadership/:title",
            component: <LeaderShipDetail/>,
        },
    ];

    return filterRoutesByPrivilege(routes, privileges);
};


// const getCustomRoutes = (user) => [
//
// ];

export default getCustomRoutes;
