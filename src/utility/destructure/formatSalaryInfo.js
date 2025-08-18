export const formatSalaryInfo = (data) => {
  const {
    bank_account_number,
    bank_name,
    base_salary,
    bonus,
    cca,
    epf,
    epf_admin,
    epf_pension,
    hra,
    ifsc_code,
    is_epf_applicable,
    payable_salary,
    salary_with_allowance,
    total_allowance,
    total_deduction_allowance
  } = data;

  return {
    bank_account_number: bank_account_number || '',
    bank_name: bank_name || '',
    base_salary: base_salary || '',
    bonus: bonus || '',
    cca: cca || '',
    epf: epf || '',
    epf_admin: epf_admin || '',
    epf_pension: epf_pension || '',
    hra: hra || '',
    ifsc_code: ifsc_code || '',
    is_epf_applicable: is_epf_applicable !== undefined ? is_epf_applicable : false,
    payable_salary: payable_salary || '',
    salary_with_allowance: salary_with_allowance || '',
    total_allowance: total_allowance || '',
    total_deduction_allowance: total_deduction_allowance || ''
  };
};