import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { forwardRef, useImperativeHandle, useEffect } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";

const validationSchema = {
  base_salary: [
    { type: "required", message: "Base salary is required" },
    { type: "number", message: "Base salary must be a valid number" },
  ],
  bonus: [{ type: "number", message: "Bonus must be a valid number" }],
  cca: [{ type: "number", message: "CCA must be a valid number" }],
  hra: [{ type: "number", message: "HRA must be a valid number" }],
  is_epf_applicable: [
    { type: "boolean", message: "EPF applicability must be true or false" },
  ],
  epf: [
    { type: "number", message: "EPF must be a valid number" },
    { type: "optional", message: "EPF is optional" },
  ],
  epf_pension: [
    { type: "number", message: "EPF Pension must be a valid number" },
    { type: "optional", message: "EPF Pension is optional" },
  ],
  epf_admin: [
    { type: "number", message: "EPF Admin must be a valid number" },
    { type: "optional", message: "EPF Admin is optional" },
  ],
  total_allowance: [
    { type: "number", message: "Total allowance must be a valid number" },
  ],
  salary_with_allowance: [
    { type: "number", message: "Salary with allowance must be a valid number" },
  ],
  total_deduction_allowance: [
    {
      type: "number",
      message: "Total deduction allowance must be a valid number",
    },
  ],
  payable_salary: [
    { type: "number", message: "Payable salary must be a valid number" },
  ],
  bank_account_number: [
    { type: "string", message: "Bank account number must be a valid string" },
  ],
  ifsc_code: [{ type: "string", message: "IFSC code must be a valid string" }],
  bank_name: [{ type: "string", message: "Bank name is required" }],
  upi_number: [
    { type: "string", message: "UPI number must be a valid string" },
  ],
};

const SalaryForm = forwardRef(({ salaryInfo, setSalaryInfo }, ref) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm,
  } = useFormValidation(salaryInfo, validationSchema, {
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  // Auto-calculate total earnings, salary with allowance, and payable
  useEffect(() => {
    const totalAllowance =
      (Number(values.base_salary) || 0) +
      (Number(values.bonus) || 0) +
      (Number(values.cca) || 0) +
      (Number(values.hra) || 0);

    const totalDeduction = values.is_epf_applicable
      ? (Number(values.epf) || 0) +
        (Number(values.epf_pension) || 0) +
        (Number(values.epf_admin) || 0)
      : 0;

    const salaryWithAllowance = totalAllowance;
    const payableSalary = salaryWithAllowance - totalDeduction;

    setFieldValue("total_allowance", totalAllowance);
    setFieldValue("salary_with_allowance", salaryWithAllowance);
    setFieldValue("total_deduction_allowance", totalDeduction);
    setFieldValue("payable_salary", payableSalary);

    setSalaryInfo({
      ...values,
      total_allowance: totalAllowance,
      salary_with_allowance: salaryWithAllowance,
      total_deduction_allowance: totalDeduction,
      payable_salary: payableSalary,
    });
  }, [
    values.base_salary,
    values.bonus,
    values.cca,
    values.hra,
    values.epf,
    values.epf_pension,
    values.epf_admin,
    values.is_epf_applicable,
    values.upi_number,
  ]);

  useImperativeHandle(ref, () => ({
    validateForm: () => validateForm(),
  }));

  return (
    <div className="space-y-6">
      {/* === Earnings Section === */}
      <div className="rounded-lg border p-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Earnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["base_salary", "Base Salary *"],
            ["bonus", "Bonus"],
            ["cca", "CCA"],
            ["hra", "HRA"],
          ].map(([field, label]) => (
            <div key={field}>
              <Label htmlFor={field}>{label}</Label>
              <Input
                id={field}
                name={field}
                type="number"
                value={values[field]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched[field] && errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === Deductions Section === */}
      <div className="rounded-lg border p-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Deductions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="is_epf_applicable">Is EPF Applicable?</Label>
            <Select
              value={values.is_epf_applicable ? "true" : "false"}
              onValueChange={(value) =>
                setFieldValue("is_epf_applicable", value === "true")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select EPF applicability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            {touched.is_epf_applicable && errors.is_epf_applicable && (
              <p className="text-red-500 text-sm">{errors.is_epf_applicable}</p>
            )}
          </div>

          {values.is_epf_applicable && (
            <>
              {[
                ["epf", "EPF"],
                ["epf_pension", "EPF Pension"],
                ["epf_admin", "EPF Admin"],
              ].map(([field, label]) => (
                <div key={field}>
                  <Label htmlFor={field}>{label}</Label>
                  <Input
                    id={field}
                    name={field}
                    type="number"
                    value={values[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched[field] && errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* === Summary Section === */}
      <div className="rounded-lg border p-5 bg-gray-50 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["total_allowance", "Total Allowance"],
            ["salary_with_allowance", "Salary with Allowance"],
            ["total_deduction_allowance", "Total Deductions"],
            ["payable_salary", "Payable Salary"],
          ].map(([field, label]) => (
            <div key={field}>
              <Label>{label}</Label>
              <Input value={values[field]} readOnly />
            </div>
          ))}
        </div>
      </div>

      {/* === Salary Summary === */}
      <div className="bg-gray-50 rounded-lg border p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Salary Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base font-medium">
          <div>
            Gross Earnings:{" "}
            <span className="text-gray-800">
              ₹{values.salary_with_allowance || 0}
            </span>
          </div>
          <div>
            Total Deductions:{" "}
            <span className="text-gray-800">
              ₹{values.total_deduction_allowance || 0}
            </span>
          </div>
          <div
            className={
              values.payable_salary < 0 ? "text-red-600" : "text-green-600"
            }
          >
            Net Payable: ₹{values.payable_salary || 0}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Amount in words: ({values.payable_salary < 0 ? "Minus " : ""}) Indian
          Rupee {Math.abs(values.payable_salary || 0)} Only
        </p>
      </div>

      {/* === Payment Details === */}
      <div className="rounded-lg border p-5 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["bank_account_number", "Bank Account Number"],
            ["ifsc_code", "IFSC Code"],
            ["bank_name", "Bank Name"],
            ["upi_number", "UPI Number"],
          ].map(([field, label]) => (
            <div key={field}>
              <Label htmlFor={field}>{label}</Label>
              <Input
                id={field}
                name={field}
                type="text"
                value={values[field]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched[field] && errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default SalaryForm;
