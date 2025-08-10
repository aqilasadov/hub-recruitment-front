// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import FormField from "layouts/pages/users/new-user/components/FormField";
import { Autocomplete } from "@mui/material";
import { useContext, useState } from "react";
import { ErrorMessage, Field } from "formik";
import MDInput from "components/MDInput";
import { StoreContext } from "context/StoreContext";

function ContragentRekvzit({
  formField,
  values,
  errors,
  touched,
  setFieldValue,
}) {
  const { banks } = useContext(StoreContext);

 

  const bankOptions = banks.map((bank) => ({
    label: bank.bankName,
    value: bank.bankId,
  }));

  const {
    bankId,
    bankVoen,
    bankCode,
    swiftNumber,
    legalAccount,
    physicalAccount,
  } = formField;

  return (
    <MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          {/* Bank adı Autocomplete */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={bankOptions}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              value={
                bankOptions.find((opt) => opt.value === values[bankId.name]) ||
                null
              }
              onChange={(_, newValue) => {
                setFieldValue(bankId.name, newValue ? newValue.value : "");
              }}
              renderInput={(params) => (
                <FormField
                  {...params}
                  type={bankId.type}
                  label={bankId.label}
                  name={bankId.name}
                  error={touched[bankId.name] && Boolean(errors[bankId.name])}
                  success={
                    values[bankId.name]?.length > 0 && !errors[bankId.name]
                  }
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Bank VÖEN */}
          <Grid item xs={12} sm={6}>
            <FormField
              type={bankVoen.type}
              label={bankVoen.label}
              name={bankVoen.name}
              value={values[bankVoen.name]}
              onChange={(e) => setFieldValue(bankVoen.name, e.target.value)}
              error={touched[bankVoen.name] && Boolean(errors[bankVoen.name])}
              success={
                values[bankVoen.name]?.length > 0 && !errors[bankVoen.name]
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Bank kodu */}
          <Grid item xs={12} sm={6}>
            <FormField
              type={bankCode.type}
              label={bankCode.label}
              name={bankCode.name}
              value={values[bankCode.name]}
              onChange={(e) => setFieldValue(bankCode.name, e.target.value)}
              error={touched[bankCode.name] && Boolean(errors[bankCode.name])}
              success={
                values[bankCode.name]?.length > 0 && !errors[bankCode.name]
              }
              fullWidth
            />
          </Grid>

          {/* Swift */}
          <Grid item xs={12} sm={6}>
            <FormField
              type={swiftNumber.type}
              label={swiftNumber.label}
              name={swiftNumber.name}
              value={values[swiftNumber.name]}
              onChange={(e) => setFieldValue(swiftNumber.name, e.target.value)}
              error={
                touched[swiftNumber.name] && Boolean(errors[swiftNumber.name])
              }
              success={
                values[swiftNumber.name]?.length > 0 &&
                !errors[swiftNumber.name]
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Settlement Account */}
          <Grid item xs={12} sm={6}>
            <FormField
              type={legalAccount.type}
              label={legalAccount.label}
              name={legalAccount.name}
              value={values[legalAccount.name]}
              onChange={(e) => setFieldValue(legalAccount.name, e.target.value)}
              error={
                touched[legalAccount.name] && Boolean(errors[legalAccount.name])
              }
              success={
                values[legalAccount.name]?.length > 0 &&
                !errors[legalAccount.name]
              }
              fullWidth
            />
          </Grid>

          {/* Correspondent Account */}
          <Grid item xs={12} sm={6}>
            <FormField
              type={physicalAccount.type}
              label={physicalAccount.label}
              name={physicalAccount.name}
              value={values[physicalAccount.name]}
              onChange={(e) =>
                setFieldValue(physicalAccount.name, e.target.value)
              }
              error={
                touched[physicalAccount.name] &&
                Boolean(errors[physicalAccount.name])
              }
              success={
                values[physicalAccount.name]?.length > 0 &&
                !errors[physicalAccount.name]
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

ContragentRekvzit.propTypes = {
  formData: PropTypes.shape({
    formField: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};

export default ContragentRekvzit;
