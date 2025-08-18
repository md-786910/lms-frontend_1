export const createEmployeePayload = (basicInfo, addressInfo, documents, personalInfo, salaryInfo) => {
  return {
    first_name: basicInfo.firstName,
    last_name: basicInfo.lastName,
    email: basicInfo.email,
    phone_number: basicInfo.phone,
    gender: basicInfo.gender,
    marital_status: basicInfo.maritalStatus,
    date_of_joining: basicInfo.dateOfJoining,
    nationality: basicInfo.nationality,


    address: {
      street: addressInfo.street,
      city: addressInfo.city,
      state: addressInfo.state,
      zip_code: addressInfo.zipCode,
      country: addressInfo.country,
      permanent_address: addressInfo.permanentAddress,
    },

    documents: {
      passport_number: documents.passportNumber,
      driving_license: documents.drivingLicense,
      social_security: documents.socialSecurity,
      tax_id: documents.taxId,
    },

    personal_info: {
      emergency_contact_name: personalInfo.emergencyContactName,
      emergency_contact_phone: personalInfo.emergencyContactPhone,
      emergency_contact_relation: personalInfo.emergencyContactRelation,
      blood_group: personalInfo.bloodGroup,
      medical_conditions: personalInfo.medicalConditions,
      hobbies: personalInfo.hobbies,
    },

    salary_info: {
      basic_salary: salaryInfo.basicSalary,
      allowances: salaryInfo.allowances,
      bonus: salaryInfo.bonus,
      deductions: salaryInfo.deductions,
      pay_frequency: salaryInfo.payFrequency,
      bank_account: salaryInfo.bankAccount,
      bank_name: salaryInfo.bankName,
    },
  };
};