import { Card, CardContent } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Link, useNavigate } from "react-router-dom";





function BlogCard({ enterpriseName, title, description, link }) {

    const navigate = useNavigate();


    return (
        <Card>
            <CardContent sx={{ padding: "24px" }}>
                <MDBox mb={1}>
                    <MDTypography variant="body2" color="grey.900" sx={{ fontSize: "size.sm", fontWeight: "500", lineHeight: "24px" }}>{enterpriseName}</MDTypography>
                </MDBox>
                <MDBox mb={1}>
                    <MDTypography variant="h6" color="gold" sx={{ fontSize: "size.xl", fontWeight: "600", lineHeight: "24px" }}>{title}</MDTypography>
                </MDBox>
                <MDBox mb={1}>
                    <MDTypography variant="body2" color="blue" sx={{ fontSize: "size.md", fontWeight: "400", lineHeight: "170%" }}>{description}</MDTypography>
                </MDBox>
                <Link to={link}>
                    <MDButton variant="contained" color="darkBlue" sx={{ padding: "10px 16px", textTransform: "UpperCase", "&:hover": { backgroundColor: "darkBlue.hover" } }}>
                        Read More
                    </MDButton>
                </Link>
            </CardContent>
        </Card>
    )
}
export default BlogCard;