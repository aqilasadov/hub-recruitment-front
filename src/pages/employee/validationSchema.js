import * as Yup from "yup";

const jobExperienceSchema = Yup.object().shape({
    companyName: Yup.string().required("İşlədiyi qurum mütləqdir"),
    departmentUnit: Yup.string().required("İdarə və ya şöbə mütləqdir"),
    position: Yup.string().required("Vəzifə mütləqdir"),
    startDate: Yup.date()
        .nullable()
        .required("Başladığı tarix mütləqdir"),
    endDate: Yup.date()
        .nullable()
        .min(Yup.ref("startDate"), "Bitiş tarixi başladığı tarixdən böyük olmalıdır")
        .required("Bitiş tarixi mütləqdir"),
});

const familyMemberSchema = Yup.object().shape({
    name: Yup.string().required('Adı məcburidir'),
    surname: Yup.string().required("Soyad mütləqdir"),
    birthdate: Yup.date()
        .nullable()
        .required("Doğum tarixi mütləqdir"),
    kinshipTypeId: Yup.number()
        .typeError("Növü seçilməlidir")
        .required("Növü seçilməlidir"),
});

const educationSchema = Yup.object().shape({
    educationTypeId: Yup.number()
        .typeError("Təhsil növü seçilməlidir")
        .required("Təhsil növü seçilməlidir"),
    profession: Yup.string().required("İxtisas mütləqdir"),
    countryId: Yup.number()
        .typeError("Ölkə seçilməlidir")
        .required("Ölkə seçilməlidir"),
    schoolName: Yup.string().required("Təhsil müəssisəsinin adı mütləqdir"),
    startDate: Yup.date()
        .nullable()
        .required("Başlama tarixi mütləqdir"),
    endDate: Yup.date()
        .nullable().min(Yup.ref("startDate"), "Bitiş tarixi başladığı tarixdən böyük olmalıdır")
});

const langSkillSchema = Yup.object().shape({
    languageTypeId: Yup.number()
        .typeError("Dil seçilməlidir")
        .required("Dil seçilməlidir"),
    levelId: Yup.number()
        .typeError("Səviyyə seçilməlidir")
        .required("Səviyyə seçilməlidir"),
});

const courseCertificateSchema = Yup.object().shape({
    courseName: Yup.string().required("Kursun adı mütləqdir"),
    startDate: Yup.date()
        .nullable()
        .required("Başlama tarixi mütləqdir"),
    endDate: Yup.date()
        .nullable().min(Yup.ref("startDate"), "Bitiş tarixi başladığı tarixdən böyük olmalıdır")
});

const computerSkillSchema = Yup.object().shape({
    computerSkillId: Yup.number()
        .typeError("Komputer bacarığı seçilməlidir")
        .required("Komputer bacarığı seçilməlidir"),
    levelId: Yup.number()
        .typeError("Səviyyə seçilməlidir")
        .required("Səviyyə seçilməlidir"),
});

const militaryObligationSchema = Yup.object().shape({
    militaryObligationId: Yup.number()
        .typeError("Hərbi mükəlləfiyyət seçilməlidir")
        .required("Hərbi mükəlləfiyyət seçilməlidir"),
    note: Yup.string()
        .trim()
        .required("Qeyd daxil edilməlidir"),
});

const contactSchema = Yup.object().shape({
    contactTypeId: Yup.number()
        .typeError("Əlaqə növü seçilməlidir")
        .required("Əlaqə növü seçilməlidir"),
    contact: Yup.string()
        .trim()
        .required("Əlaqə daxil edilməlidir"),
});

const validationSchema = Yup.object().shape({
    employee: Yup.object().shape({
        tableNumber: Yup.string().required("Table nömrəsi mütləqdir"),
        firstName: Yup.string().required("Ad mütləqdir"),
        regAddr: Yup.string().required('Qeydiyyat ünvanı mütləqdir'),
        lastName: Yup.string().required("Soyad mütləqdir"),
        identityDocId: Yup.number()
            .typeError("Sənəd seçimi mütləqdir")
            .required("Sənəd seçimi mütləqdir"),
        birthDate: Yup.date().nullable("Doğum tarixi mütləqdir").required('Doğum tarixi mütləqdir'),
        dateOfIssue: Yup.date().nullable("Sənədin verilmə tarixi mütləqdir").required('Sənədin verilmə tarixi mütləqdir'),
        dateOfExpire: Yup.date().min(Yup.ref('dateOfIssue'), "Bitiş tarixi başladığı tarixdən böyük olmalıdır")
            .nullable("Sənədin bitmə tarixi mütləqdir").required('Sənədin bitmə tarixi mütləqdir'),
        ownerEmpId: Yup.number().typeError("Birbaşa direktor mütləqdir").required('Birbaşa direktor mütləqdir'),
    }),

    empPosition: Yup.object().shape({
        procedureTypeId: Yup.number()
            .typeError("Əməliyyat növü seçilməlidir")
            .required("Əməliyyat növü seçilməlidir"),
        depId: Yup.number()
            .typeError("Struktur qurum seçilməlidir")
            .required("Struktur qurum seçilməlidir"),
        posId: Yup.number()
            .typeError("Vəzifə seçilməlidir")
            .required("Vəzifə seçilməlidir"),
        trialPeriodId: Yup.number()
            .typeError("Sınaq müddəti seçilməlidir")
            .required("Sınaq müddəti seçilməlidir"),
        contractTermId: Yup.number()
            .typeError("Müqavilə müddəti seçilməlidir")
            .required("Müqavilə müddəti seçilməlidir"),
        startDate: Yup.date()
            .nullable()
            .required("Başladığı tarix mütləqdir"),
        endDate: Yup.date()
            .nullable()
            .min(Yup.ref("startDate"), "Bitiş tarixi başladığı tarixdən böyük olmalıdır")
            .required("Bitiş tarixi mütləqdir"),
    }),

    empJobExperiences: Yup.array()
        .of(jobExperienceSchema)
        .min(1, "Ən azı bir iş təcrübəsi daxil edilməlidir"),

    empFamilyMembers: Yup.array()
        .of(familyMemberSchema)
        .min(1, "Ən azı bir ailə üzvü daxil edilməlidir"),

    empEducationAndSkills: Yup.object().shape({
        educationRequestDto: Yup.array()
            .of(educationSchema)
            .min(1, "Ən azı bir təhsil məlumatı daxil edilməlidir"),
        langSkillRequestDto: Yup.array()
            .of(langSkillSchema)
            .min(1, "Ən azı bir dil bacarığı daxil edilməlidir"),
        courseCertificateRequestDto: Yup.array()
            .of(courseCertificateSchema)
            .min(1, "Ən azı bir kurs sertifikatı daxil edilməlidir"),
        compSkillRequestDto: Yup.array()
            .of(computerSkillSchema)
            .min(1, "Ən azı bir komputer bacarığı daxil edilməlidir"),
    }),

    empMilitaryObligations: Yup.array()
        .of(militaryObligationSchema)
        .min(1, "Ən azı bir hərbi mükəlləfiyyət daxil edilməlidir"),

    empContacts: Yup.array()
        .of(contactSchema)
        .min(1, "Ən azı bir əlaqə növü daxil edilməlidir"),
});

export default validationSchema;
