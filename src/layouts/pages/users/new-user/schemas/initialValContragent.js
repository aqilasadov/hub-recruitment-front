

import checkout from "layouts/pages/users/new-user/schemas/formContragent";

const {
  formField: {
    kontragentLegalName,
    phoneNumber,
    kontragentShortName,
    email,
    voen,
    legalAdress,
    note,
    bankId,
    bankVoen,
    bankCode,
    swiftNumber,
    legalAccount,
    physicalAccount, 
    
  },
} = checkout;

const initialValContragent = {
  [kontragentLegalName.name]: "",
  [phoneNumber.name]: "",
  [kontragentShortName.name]: "",
  [email.name]: "",
  [voen.name]: "",
  [legalAdress.name]: "",
  [note.name]: "",
  [bankId.name]: "",
  [bankVoen.name]: "",
  [bankCode.name]: "",
  [swiftNumber.name]: "",
  [legalAccount.name]: "",
  [physicalAccount.name]: "",
 
  
};

export default initialValContragent;
