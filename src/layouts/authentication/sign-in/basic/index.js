import { useContext, useState } from "react";
// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { toast } from "react-toastify";
import { AuthContext } from "context/AuthContext";

// Images
import bgImage from "assets/images/bg-signin.png";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const { loginMutation } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission to avoid page reload
    loginMutation.mutate(credentials, {
      onSuccess: (data) => {
        // After successful login, navigate the user

        navigate("/dashboards"); // Or any other page you want to redirect after login
      },
      onError: (error) => {
       
        // Handle error and show toast message
        const errorMessage =
          "Giriş mümkün olmadı! Məlumatlarınızı düzgün daxil etdiyinizə əmin olun.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="gold"
          borderRadius="lg"
          mx={2}
          mt={2}
          p={2}
          mb={1}
          textAlign="center"
          sx={{
            background: "linear-gradient(180deg, #C2AA57 0%, #87732E 100%)",
          }}
        >
          
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 2 }}
          >
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="https://www.facebook.com/SOFAZ.ARDNF/"
                variant="body1"
                color="white"
              >
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="https://x.com/SOFAZOfficial"
                variant="body1"
                color="white"
              >
                <XIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="https://www.linkedin.com/company/sofaz/"
                variant="body1"
                color="white"
              >
                <LinkedInIcon color="inherit" />
              </MDTypography>
            </Grid>
             <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="https://www.instagram.com/sofaz_official/?igshid=1nsb9r7li9o2h"
                variant="body1"
                color="white"
              >
                <InstagramIcon color="inherit" />
              </MDTypography>
            </Grid>
          
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="username"
                onChange={handleInputChange}
                value={credentials.username}
                label="İstifadəçi adı"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                name="password"
                onChange={handleInputChange}
                value={credentials.password}
                label="Şifrə"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                sx={{
                  background:
                    "linear-gradient(180deg, #C2AA57 0%, #87732E 100%)",
                }}
                fullWidth
              >
                Daxil ol
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up/cover"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
