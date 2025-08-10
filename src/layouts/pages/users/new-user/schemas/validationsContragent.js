import * as Yup from "yup";
import checkout from "layouts/pages/users/new-user/schemas/formContragent";

const {
  formField: {
    kontragentLegalName,
    bankName,
    bankId,
    bankVoen,
    voen,
    bankCode,
    swiftNumber,
    legalAccount,
    physicalAccount,
    phoneNumber,
    email,
    kontragentShortName,
    legalAdress,
    note,
    kontragentTypeId,
  },
} = checkout;

const validations = [
  Yup.object().shape({
    [kontragentLegalName.name]: Yup.string().required(
      kontragentLegalName.errorMsg
    ),
    [legalAdress.name]: Yup.string().required(legalAdress.errorMsg),
    [voen.name]: Yup.string().required(voen.errorMsg),
    [phoneNumber.name]: Yup.string().matches(/^(\+994|994)(50|51|55|70|77|99)[0-9]{7}$/, phoneNumber.invalidMsg || "Yanlış telefon formatı (məs: +994501234567)"),
    [email.name]: Yup.string().email(email.invalidMsg),
    [kontragentTypeId.name]: Yup.string().required(kontragentTypeId.errorMsg),

  }),
  Yup.object().shape({
    [bankId.name]: Yup.string().required(bankId.errorMsg),
    [bankVoen.name]: Yup.string().required(bankVoen.errorMsg),
    [bankCode.name]: Yup.string().required(bankCode.errorMsg),
    [swiftNumber.name]: Yup.string().required(swiftNumber.errorMsg),
    [legalAccount.name]: Yup.string().required(legalAccount.errorMsg),
    [physicalAccount.name]: Yup.string().required(physicalAccount.errorMsg),
  }),
];

export default validations;
