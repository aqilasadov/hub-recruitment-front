

import { useEffect, useState } from "react";

// formik components
import { Formik, Form } from "formik";


// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Material Dashboard 3 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// NewUser page components
import ContragentParameter from "layouts/pages/users/new-user/components/ContragentParameter";
import ContragentRekvzit from "layouts/pages/users/new-user/components/ContragentRekvzit";


// NewUser layout schemas for form and form feilds
import validationsContragent from "layouts/pages/users/new-user/schemas/validationsContragent";
import formContragent from "layouts/pages/users/new-user/schemas/formContragent";
import initialValContragent from "layouts/pages/users/new-user/schemas/initialValContragent";
import { baseURL } from "utils/Url";
import apiClient from "apiClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "components/loader/Loader";
import { toast } from "react-toastify";


function getSteps() {
  return ["Əsas məlumatlar", "Bank Rekvizit məlumatları"];
}

function getStepContent(stepIndex, props) {
  switch (stepIndex) {
    case 0:
      return <ContragentParameter {...props} />;
    case 1:
      return <ContragentRekvzit {...props} />;

    default:
      return null;
  }
}

function NewContragent() {
  const { id } = useParams(); // <-- edit rejimi üçün id alırıq
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [activeStep, setActiveStep] = useState(0);
  const [initialValues, setInitialValues] = useState(initialValContragent);
  const [loading, setLoading] = useState(isEditMode);
  const steps = getSteps();
  const { formId, formField } = formContragent;
  const currentValidation = validationsContragent[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          const res = await apiClient.get(`${baseURL}/kontragent/${id}`);
          const data = res.data.data || res.data;
       
          setInitialValues({
            ...initialValContragent,
            ...data,
          });
        } catch (error) {
          
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  }, [id]);

 
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (values, actions) => {
    try {
      const payload = {
        ...values,
        isActive: 1,
        isArchive: 0,
      };

      if (isEditMode) {
        await apiClient.put(`${baseURL}/kontragent`, payload);
     
        toast.success("Məlumat uğurla redaktə olundu");
      } else {
        await apiClient.post(`${baseURL}/kontragent`, payload);
        toast.success("Yeni kontragent yaradıldı");
      
      }

      navigate("/modules/contragents");
    } catch (error) {
     
    } finally {
      actions.setSubmitting(false);
      actions.resetForm();
      setActiveStep(0);
    }
  };

  
  const handleStepSubmit = (values, actions) => {
    if (isLastStep) {
      handleSubmit(values, actions);
    } else {
      setActiveStep((prev) => prev + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };



  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={6} px={3}>
          <Loader />
        </MDBox>
      </DashboardLayout>
    );
  }



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} mb={20} height="65vh">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%", mt: 8 }}
        >
          <Grid item xs={12} lg={8}>
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={currentValidation}
              onSubmit={handleStepSubmit}
            >
              {({ values, errors, touched, isSubmitting, setValues, setFieldValue }) => (
                <Form id={formId} autoComplete="off">
                  <Card sx={{ height: "100%" }}>
                    <MDBox mx={2} mt={2}>
                      <Stepper activeStep={activeStep} alternativeLabel >
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </MDBox>
                    <MDBox p={3}>
                      <MDBox>
                        {getStepContent(activeStep, {
                          values,
                          touched,
                          formField,
                          errors,
                          setValues,
                          setFieldValue,  // <-- buraya əlavə et
                        })}
                        <MDBox
                          mt={2}
                          width="100%"
                          display="flex"
                          justifyContent="space-between"
                        >
                          {activeStep === 0 ? (
                            <MDBox />
                          ) : (
                            <MDButton
                              variant="gradient"
                              color="dark"
                              onClick={handleBack}
                            >
                              Geri
                            </MDButton>
                          )}
                          <MDButton
                            disabled={isSubmitting}
                            type="submit"
                            variant="gradient"
                            color="dark"
                          >
                             {isLastStep ? (isEditMode ? "Yadda saxla" : "Yadda saxla") : "İrəli"}
                          </MDButton>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </Card>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </MDBox>

    </DashboardLayout>
  );
}

export default NewContragent;
