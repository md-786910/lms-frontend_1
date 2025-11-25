export const employeePayload = (formValues) => {
  return {
    employee_no: parseInt(formValues.employee_no) || 0,
    first_name: formValues.firstName,
    last_name: formValues.lastName || "",
    email: formValues.email,
    phone_number: parseInt(formValues.phone),
    gender: formValues.gender,
    martial_status: formValues.maritalStatus,
    department_id: parseInt(formValues.department),
    designation_id: parseInt(formValues.designation),
    date_of_birth: formValues.dateOfJoining,
    date_of_joining: formValues.dateOfJoining,
    employee_id: formValues.employeeId || "",
  };
};
