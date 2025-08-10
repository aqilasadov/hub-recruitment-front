import { Card, CardContent, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";



function AnnuncementCard() {
    return (
        <Card>
            <CardContent>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography variant="h6" component="h6" sx={{ color: "text.main", fontSize: "14px", fontWeight: "500", lineHeight: "24px" }}  >
                        Elan və yeniliklər
                    </MDTypography>
                    <MDButton variant="text" color="darkBlue" sx={{ padding: "0px", textTransform: "UpperCase" }}>
                        Bütün Bildirişlər
                        <Icon sx={{ marginLeft: "5px" }}>chevron_right</Icon>
                    </MDButton>
                </MDBox>
                <MDBox>
                    <MDBox display="flex" flexDirection="column" gap="16px">
                        <MDBox display="flex" alignItems="center" border="1px solid #EEEEEE" borderRadius="8px" padding="8px">
                            <MDBox display="flex" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#E8F5E9", borderRadius: "8px", width: "32px", height: "32px" }}>
                                <Icon fontSize="medium" sx={{ color: "#388E3C" }}>check</Icon>
                            </MDBox>

                            <MDTypography variant="h6" component="h6" sx={{ color: "#171717", fontSize: "16px", fontWeight: "400", lineHeight: "24px", marginLeft: "8px" }}  >
                                Kofe Sifarişiniz təsdiqləndi
                            </MDTypography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center" border="1px solid #EEEEEE" borderRadius="8px" padding="8px">
                            <MDBox display="flex" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#E8F5E9", borderRadius: "8px", width: "32px", height: "32px" }}>
                                <Icon fontSize="medium" sx={{ color: "#388E3C" }}>check</Icon>
                            </MDBox>

                            <MDTypography variant="h6" component="h6" sx={{ color: "#171717", fontSize: "16px", fontWeight: "400", lineHeight: "24px", marginLeft: "8px" }}  >
                                Kofe Sifarişiniz təsdiqləndi
                            </MDTypography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center" border="1px solid #EEEEEE" borderRadius="8px" padding="8px">
                            <MDBox display="flex" alignItems="center" justifyContent="center" sx={{ backgroundColor: "#E8F5E9", borderRadius: "8px", width: "32px", height: "32px" }}>
                                <img src={require("assets/images/team-4.jpg")} alt="announcement" style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "8px"
                                }} />
                            </MDBox>

                            <MDTypography variant="h6" component="h6" sx={{ color: "#171717", fontSize: "16px", fontWeight: "400", lineHeight: "24px", marginLeft: "8px" }}  >
                                Elvin M.yeni layihəyə rəhbərlik edəcək.
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </CardContent>
        </Card>
    )
}

export default AnnuncementCard;