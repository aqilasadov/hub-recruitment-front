import { createContext, useMemo } from "react";
import { useQuery } from "react-query";
import PropTypes from "prop-types";
import apiClient from "../apiClient";
import { baseURL } from "utils/Url";

export const StoreContext = createContext(null);

const StoreProvider = ({ children }) => {
  const fetcher = (url) => apiClient.get(url).then((res) => res.data);

  const itemTypeOptions = [
    { id: 1, label: "Təchizat " },
    { id: 2, label: "Xidmət" },
  ];

  const documentCatOptions = [
    { id: 1, label: "İT " },
    { id: 2, label: "HR" },
  ];

  // Queries
  const { data: banks = [] } = useQuery({
    queryKey: ["banks"],
    queryFn: () => fetcher(`${baseURL}/bank`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

  const { data: itemCategories = [] } = useQuery({
    queryKey: ["itemCategories"],
    queryFn: () => fetcher(`${baseURL}/item-category`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => fetcher(`${baseURL}/room/room-type`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

  const { data: contragentTypes = [] } = useQuery({
    queryKey: ["contragentTypes"],
    queryFn: () => fetcher(`${baseURL}/kontragent/kontragent-type`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

  const { data: bloodType = [] } = useQuery({
    queryKey: ["bloodType"],
    queryFn: () => fetcher(`${baseURL}/blood-types`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

  const { data: gender = [] } = useQuery({
    queryKey: ["gender"],
    queryFn: () => fetcher(`${baseURL}/genders`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

  const { data: regionTypes = [] } = useQuery({
    queryKey: ["regionTypes"],
    queryFn: () => fetcher(`${baseURL}/region-types`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: identityDocs = [] } = useQuery({
    queryKey: ["identityDocs"],
    queryFn: () => fetcher(`${baseURL}/identity-docs`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: maritalStatuses = [] } = useQuery({
    queryKey: ["maritalStatuses"],
    queryFn: () => fetcher(`${baseURL}/marital-statuses`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: trialPeriods = [] } = useQuery({
    queryKey: ["trialPeriods"],
    queryFn: () => fetcher(`${baseURL}/trial-periods`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: contractTerms = [] } = useQuery({
    queryKey: ["contractTerms"],
    queryFn: () => fetcher(`${baseURL}/contract-terms`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: regions = [] } = useQuery({
    queryKey: ["regions"],
    queryFn: () => fetcher(`${baseURL}/regions`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: kinshipTypes = [] } = useQuery({
    queryKey: ["kinshipTypes"],
    queryFn: () => fetcher(`${baseURL}/kinship-types`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: educationTypes = [] } = useQuery({
    queryKey: ["educationTypes"],
    queryFn: () => fetcher(`${baseURL}/education-types`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: languageType = [] } = useQuery({
    queryKey: ["languageType"],
    queryFn: () => fetcher(`${baseURL}/skills/language`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: computerSkill = [] } = useQuery({
    queryKey: ["computerSkill"],
    queryFn: () => fetcher(`${baseURL}/skills/comp`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: militaryObligation = [] } = useQuery({
    queryKey: ["militaryObligation"],
    queryFn: () => fetcher(`${baseURL}/militaries/obligation`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: militaryRank = [] } = useQuery({
    queryKey: ["militaryRank"],
    queryFn: () => fetcher(`${baseURL}/militaries/rank`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: contactTypes = [] } = useQuery({
    queryKey: ["contactTypes"],
    queryFn: () => fetcher(`${baseURL}/contact-types`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

  const { data: authorities = [] } = useQuery({
    queryKey: ["authorities"],
    queryFn: () => fetcher(`${baseURL}/authorities`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });
  const { data: procedureTypes = [] } = useQuery({
    queryKey: ["procedureTypes"],
    queryFn: () => fetcher(`${baseURL}/procedure-types`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

    const { data: hours = [] } = useQuery({
    queryKey: ["hours"],
    queryFn: () => fetcher(`${baseURL}/hours`),
    staleTime: 1000 * 60 * 5, // 5 dəqiqə ərzində məlumat təzə sayılacaq
    cacheTime: 1000 * 60 * 10, // 10 dəqiqə ərzində keşdə saxlanılacaq
  });

  const contextValue = useMemo(
    () => ({
      banks,
      itemTypeOptions,
      itemCategories,
      documentCatOptions,
      rooms,
      contragentTypes,
      bloodType,
      gender,
      regionTypes,
      identityDocs,
      maritalStatuses,
      trialPeriods,
      contractTerms,
      regions,
      kinshipTypes,
      educationTypes,
      languageType,
      computerSkill,
      militaryObligation,
      militaryRank,
      contactTypes,
      authorities,
      procedureTypes,
      hours,
      fetcher,
    }),
    [
      banks,
      itemTypeOptions,
      itemCategories,
      documentCatOptions,
      rooms,
      contragentTypes,
      bloodType,
      gender,
      regionTypes,
      trialPeriods,
      identityDocs,
      contractTerms,
      regions,
      kinshipTypes,
      educationTypes,
      languageType,
      computerSkill,
      militaryObligation,
      militaryRank,
      contactTypes,
      authorities,
      procedureTypes,
      maritalStatuses,
      hours,
      fetcher,
    ]
  );
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreProvider;
