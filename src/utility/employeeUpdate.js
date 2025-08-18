export const getTabPayload = ({
  activeTab,
  basicInfo,
  addressInfo,
  documents,
  personalInfo,
  salaryInfo,
}) => {
  let payload = {};

  switch (activeTab) {
    case "basic":
      payload = { ...basicInfo };
      break;
    case "address":
      payload = { ...addressInfo };
      break;
    case "documents":
      payload = { ...documents };
      break;
    case "personal":
      payload = { ...personalInfo };
      break;
    case "salary":
      payload = { ...salaryInfo };
      break;
    default:
      payload = {};
  }

  return payload;
};

export const validateTabForm = async (activeTab, refs) => {
  let isValid = false;

  switch (activeTab) {
    case "basic":
      isValid = await refs.basicInfoRef.current?.validateForm?.();
      break;
    case "address":
      isValid = await refs.addressInfoRef.current?.validateForm?.();
      break;
    case "documents":
      isValid = await refs.documentsRef.current?.validateForm?.();
      break;
    case "personal":
      isValid = await refs.personalRef.current?.validateForm?.();
      break;
    case "salary":
      isValid = await refs.salaryRef.current?.validateForm?.();
      break;
    default:
      isValid = false;
  }

  return isValid;
};
