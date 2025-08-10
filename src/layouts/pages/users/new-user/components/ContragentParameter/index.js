// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import FormField from "layouts/pages/users/new-user/components/FormField";
import { useContext } from "react";
import { StoreContext } from "context/StoreContext";
import { Autocomplete } from "@mui/material";

function ContragentParameter({
  formField,
  values,
  touched,
  errors,
  setFieldValue,
}) {
  const {
    kontragentLegalName,
    phoneNumber,
    kontragentShortName,
    email,
    voen,
    legalAdress,
    note,
    kontragentTypeId,
  } = formField;

  const { contragentTypes } = useContext(StoreContext);

  const contragentOptions = contragentTypes.map((type) => ({
    label: type.title,
    value: type.kontragentTypeId,
  }));

 

  return (
    <MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={kontragentLegalName.type}
              label={kontragentLegalName.label}
              name={kontragentLegalName.name}
              value={values[kontragentLegalName.name]}
              placeholder={kontragentLegalName.placeholder}
              error={errors.kontragentLegalName && touched.kontragentLegalName}
              success={
                kontragentLegalName.length > 0 && !errors.kontragentLegalName
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={phoneNumber.type}
              label={phoneNumber.label}
              name={phoneNumber.name}
              value={values[phoneNumber.name]}
              validateOnChange={false} // yazarkən göstərməsin
              // validateOnBlur={true} // sahədən çıxanda göstərsin
              placeholder={phoneNumber.placeholder}
              error={errors.phoneNumber && touched.phoneNumber}
              success={
                values[phoneNumber.name]?.length > 0 &&
                !errors[phoneNumber.name]
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={kontragentShortName.type}
              label={kontragentShortName.label}
              name={kontragentShortName.name}
              value={values[kontragentShortName.name]}
              placeholder={kontragentShortName.placeholder}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={email.type}
              label={email.label}
              name={email.name}
              value={values[email.name]}
              placeholder={email.placeholder}
              validateOnChange={false} // yazarkən göstərməsin
              // validateOnBlur={true} // sahədən çıxanda göstərsin
              error={errors.email && touched.email}
              success={values[email.name]?.length > 0 && !errors[email.name]}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type={voen.type}
              label={voen.label}
              name={voen.name}
              value={values[voen.name]}
              placeholder={voen.placeholder}
              error={errors.voen && touched.voen}
              success={values[voen.name]?.length > 0 && !errors[voen.name]}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={legalAdress.type}
              label={legalAdress.label}
              name={legalAdress.name}
              value={values[legalAdress.name]}
              placeholder={legalAdress.placeholder}
              error={errors.legalAddress && touched.legalAdress}
              success={
                values[legalAdress.name]?.length > 0 &&
                !errors[legalAdress.name]
              }
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={contragentOptions}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              value={
                contragentOptions.find(
                  (opt) => opt.value === values[kontragentTypeId.name]
                ) || null
              }
              onChange={(_, newValue) => {
                setFieldValue(
                  kontragentTypeId.name,
                  newValue ? newValue.value : ""
                );
              }}
              renderInput={(params) => (
                <FormField
                  {...params}
                  type={kontragentTypeId.type}
                  label={kontragentTypeId.label}
                  name={kontragentTypeId.name}
                  error={
                    touched[kontragentTypeId.name] &&
                    Boolean(errors[kontragentTypeId.name])
                  }
                  success={
                    values[kontragentTypeId.name]?.length > 0 &&
                    !errors[kontragentTypeId.name]
                  }
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type={note.type}
              label={note.label}
              name={note.name}
              value={values[note.name]}
              placeholder={note.placeholder}
              error={errors.note && touched.note}
              success={values[note.name]?.length > 0 && !errors[note.name]}
              inputProps={{ autoComplete: "" }}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for ContragentParameter
ContragentParameter.propTypes = {
  formField: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  touched: PropTypes.object,
  errors: PropTypes.object,
};

export default ContragentParameter;
