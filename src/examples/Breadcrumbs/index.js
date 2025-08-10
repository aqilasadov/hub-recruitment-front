// react-router-dom components
import {Link} from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import {Breadcrumbs as MuiBreadcrumbs} from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// ... digər importlar eyni qalır

function Breadcrumbs({
                         icon = "home",
                         title = "",
                         route = ["", ""],
                         light = false,
                     }) {
    const routes = route.slice(0, -1);

    const formatRouteName = (name) => {
        const routeMap = {
            contracts: "Müqavilələr",
            orders: "Sifarişlər",
            payments: "Ödənişlər",
            budget: "Büdcə",
            smetas: "Smetalar",
            infrastructure: "İnfrastruktura",
            salary: "Əmək haqqı",
            kpi: "KPİ",
            contragents: "Kontragentlər",
            products: "Mallar",
            warehousecontrol: "Anbara Nəzarət",
            presstoday: "Mətbuatda bugün",
            documents: "Sənədlər",
            structures: "Struktur qurumlar",
            positions: "Vəzifələr",
            permissions: "İmtiyazlar",
            new: "Yeni",
            newsubsmeta: "Yeni alt bölmə",
            modules: "Modullar",
            announcements: "Elanlar",
            fundstructure: "Fondun strukturu",
            edit: "Redaktə",
            reservation: "Otaqların Rezervasiyası",
            notifications: "Xəbərdarlıqlar",
            leadership: "Rəhbərlik",
            dashboards: "İdarəetmə paneli",
            home: "Əsas səhifə",
            guests: "Qonaqlar",
            settings: "Tənzimləmələr",
            "payment-types": "Ödəniş Növləri",
            paymentTypes: "Ödəniş Növləri",
            "vat-types": "ƏDV Növləri",
            vatTypes: "ƏDV Növləri",
            "purchase-type": "Satınalma Növü",
            "item-category": "Mal Kateqoriyaları",
            "requested-item-supplies": "Tələb olunan iaşə məhsulları",
            "requested-item-supplies-type": "Tələb olunan Mal Təchizatı Növləri",
            "requested-item-devices": "Ehtiyac duyulan qurğular",
            banks: "Banklar",
            rooms: "Otaqlar",
            employees: "İşçi Məlumatları",
            "edit-employee-tab-items": "Dəyişiklik et",
            profile: "Profil",
            logout: "Çıxış",
            privileges: "İcazələr",
            recievingProducts: "Mallarına Anbara Qəbulu",
            tasks: "Tapşırıqlar"
        };

        return routeMap[name] || name;
    };

    const formatSlugTitle = (slug) => {
        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const decodeURIComponentSafe = (encodedStr) => {
        try {
            return decodeURIComponent(encodedStr);
        } catch {
            return encodedStr;
        }
    };

    const decodedTitle = decodeURIComponentSafe(title);

    const formattedTitle =
        formatRouteName(decodedTitle) !== decodedTitle
            ? formatRouteName(decodedTitle)
            : formatSlugTitle(decodedTitle);

    return (
        <MDBox ml={{xs: 0, xl: 1}}>
            <MuiBreadcrumbs
                sx={{
                    "& .MuiBreadcrumbs-separator": {
                        color: ({palette: {white, grey}}) =>
                            light ? white.main : grey[600],
                    },
                }}
            >
                {(() => {
                    let accumulatedPath = "";
                    return routes.map((el) => {
                        accumulatedPath += `/${el}`;
                        return (
                            <Link to={accumulatedPath} key={el}>
                                <MDTypography
                                    component="span"
                                    variant="button"
                                    fontWeight="regular"
                                    textTransform="capitalize"
                                    color={light ? "white" : "dark"}
                                    opacity={light ? 0.8 : 0.5}
                                    sx={{lineHeight: 0}}
                                >
                                    {formatRouteName(el)}
                                </MDTypography>
                            </Link>
                        );
                    });
                })()}
                <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                    color={light ? "white" : "dark"}
                    sx={{lineHeight: 0}}
                >
                    {formattedTitle}
                </MDTypography>
            </MuiBreadcrumbs>
        </MDBox>
    );
}

Breadcrumbs.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    light: PropTypes.bool,
};

export default Breadcrumbs;
