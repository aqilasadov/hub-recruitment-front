import { Card, CardContent } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";



function PathModuleCard({ 
    title, 
    description, 
    icon,
    iconBgColor = "",
    titleColor = "#BF360C",
    descriptionColor = "#7B809A",
    link = ""
}) {
    const navigate = useNavigate();
    return (
        <Card onClick={() => navigate(link)} sx={{ cursor: "pointer" }}>
            <CardContent>
                <MDBox display="flex" gap={1} alignItems="center" marginBottom="10px">
                    <MDBox 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        sx={{ 
                            backgroundColor: iconBgColor, 
                           
                            width: "24px", 
                            height: "24px" 
                        }}
                    >
                        {icon}
                    </MDBox>
                    <MDTypography 
                        variant="h6" 
                        component="h6" 
                        sx={{ 
                            color: titleColor, 
                            fontSize: "size.xl2", 
                            fontWeight: "700", 
                            lineHeight: "150%",
                           
                        }}
                    >
                        {title}
                    </MDTypography>
                </MDBox>
                <MDBox>
                    <MDTypography 
                        variant="p" 
                        component="p" 
                        sx={{ 
                            color: descriptionColor, 
                            fontSize: "14px", 
                            fontWeight: "400", 
                            lineHeight: "150%",
                            maxWidth: "254px"
                        }}
                    >
                        {description}
                    </MDTypography>
                </MDBox>
            </CardContent>
        </Card>
    );
}

// Typechecking props for the PathModuleCard
PathModuleCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    iconBgColor: PropTypes.string,
    titleColor: PropTypes.string,
    descriptionColor: PropTypes.string,
};

export default PathModuleCard;
