export const formatBasicInfo = (data) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    gender,
    martial_status,
    date_of_joining,
    date_of_birth,
    department_id,
    designation_id,
    nationality
  } = data;

  return {
    first_name: first_name || '',
    last_name: last_name || '',
    email: email || '',
    phone_number: phone_number || '',
    gender: gender || '',
    martial_status: martial_status || '',
    date_of_joining: date_of_joining || '',
    date_of_birth: date_of_birth || '',
    department_id: department_id ? String(department_id) : '',
    designation_id: designation_id ? String(designation_id) : '',
    nationality: nationality || 'India'
  };
};