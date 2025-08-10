const formContragent = {
    formId: "new-contragent-form",
    formField: {
      kontragentLegalName: {
        name: "kontragentLegalName",
        label: "Hüquqi adı *",
        type: "text",
        errorMsg: "Hüquqi adı məcburidir.",
      },
      phoneNumber: {
        name: "phoneNumber",
        label: "Əlaqə nömrəsi",
        type: "text",
        errorMsg: "Əlaqə nömrəsi məcburidir.",
        invalidMsg: "Yanlış telefon formatı (məs: +994501234567)",
      },
      kontragentShortName: {
        name: "kontragentShortName",
        label: "Qısa adı",
        type: "text",
      },
      email: {
        name: "email",
        label: "Email",
        type: "email",
        errorMsg: "Email məcburidir.",
        invalidMsg: "Yanlış email formatı",
      },
      voen: {
        name: "voen",
        label: "VÖEN",
        type: "text",
        errorMsg: "VÖEN məcburidir.",
        invalidMsg: "VÖEN səhvdir",
      },
      legalAdress: {
        name: "legalAdress",
        label: "Hüquqi ünvanı",
        type: "text",
        errorMsg: "Hüquqi ünvanı məcburidir.",
      
      },
      note: {
        name: "note",
        label: "Qeyd",
        type: "text",
        errorMsg: "Qeyd məcburidir.",
      },
      bankId: {
        name: "bankId",
        label: "Bank adı *",
        type: "select",
        errorMsg: "Bank adı məcburidir.",
       
      },
      kontragentTypeId: {
        name: "kontragentTypeId",
        label: "Kontragent növü *",
        type: "select",
        errorMsg: "Kontragent növü məcburidir.",
       
      },
      bankVoen: {
        name: "bankVoen",
        label: "Bank VÖEN *",
        type: "text",
        errorMsg: "Bank VÖEN məcburidir.",
      },
      bankCode: {
        name: "bankCode",
        label: "Bank kodu *",
        type: "text",
        errorMsg: "Bank kodu məcburidir.",
      },

      swiftNumber: {
        name: "swiftNumber",
        label: "Swift *",
        type: "text",
        errorMsg: "Swift kodu məcburidir.",
      },

      legalAccount: {
        name: "legalAccount",
        label: "H/h *",
        type: "text",
        errorMsg: "H/h hesabı məcburidir.",
      },
      physicalAccount: {
        name: "physicalAccount",
        label: "M/h *",
        type: "text",
        errorMsg: "M/h hesabı məcburidir.",
      },    
    
     
    },
  };
  
  export default formContragent;
  