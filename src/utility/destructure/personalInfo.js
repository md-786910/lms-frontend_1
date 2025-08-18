export const formatPersonalInfo = (data) => {
  const {
    emergency_contact_person,
    emergency_contact_number,
    emergency_contact_relationship,
    blood_group,
    medical_conditions,
    hobbies,
    epf_no,
    esic_no,
    pan_no,
    aadhaar_no,
    passport_no,
    uan_no
  } = data;

  return {
    emergency_contact_person: emergency_contact_person || '',
    emergency_contact_number: emergency_contact_number || '',
    emergency_contact_relationship: emergency_contact_relationship || '',
    blood_group: blood_group || '',
    medical_conditions: medical_conditions || '',
    hobbies: hobbies || '',
    epf_no: epf_no || '',
    esic_no: esic_no || '',
    pan_no: pan_no || '',
    aadhaar_no: aadhaar_no || '',
    passport_no: passport_no || '',
    uan_no: uan_no || ''
  };
};