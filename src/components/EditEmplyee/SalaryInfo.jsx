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
import { numberToWords } from "../../config/appConfig";
import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

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
    { type: "string", message: "EPF must be a valid string" },
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
    values.bank_account_number,
    values.ifsc_code,
    values.bank_name,
  ]);

  useImperativeHandle(ref, () => ({
    validateForm: () => validateForm(),
  }));

  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="space-y-8 font-sans">
      {/* === Salary Summary === */}
      <div className="bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white rounded-2xl p-6 shadow-xl border border-[#734425]/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-[#F5ECE4] flex items-center justify-center">
            <Wallet className="h-5 w-5 text-[#C26819]" />
          </div>
          <h3 className="text-xl font-heading font-extrabold uppercase tracking-tight text-white">Salary Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <p className="text-[11px] font-heading font-bold text-[#F5ECE4]/70 uppercase tracking-widest">Gross Earnings</p>
            <p className="text-2xl font-heading font-extrabold text-white">₹{values.salary_with_allowance || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-heading font-bold text-[#F5ECE4]/70 uppercase tracking-widest">Total Deductions</p>
            <p className="text-2xl font-heading font-extrabold text-rose-300">₹{values.total_deduction_allowance || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-heading font-bold text-[#F5ECE4]/70 uppercase tracking-widest">Net Payable</p>
            <p className={`text-3xl font-heading font-extrabold ${values.payable_salary < 0 ? "text-rose-400" : "text-[#F5ECE4]"}`}>
              ₹{values.payable_salary || 0}
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/15">
          <p className="text-sm text-[#F5ECE4]/70 italic">
            <span className="font-heading font-bold text-white not-italic uppercase text-xs mr-2 tracking-wider">Amount in words:</span>
            {numberToWords(values?.payable_salary || 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* === Earnings Section === */}
        <div className="p-6 border border-[#E1D4C7] rounded-2xl shadow-sm bg-[#FAF6F2] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E1D4C7]/60 pb-4">
            <TrendingUp className="h-5 w-5 text-[#C26819]" />
            <h3 className="text-base font-heading font-bold text-[#2E2E2E] uppercase tracking-wider">Earnings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["base_salary", "Base Salary *"],
              ["bonus", "Bonus"],
              ["cca", "CCA"],
              ["hra", "HRA"],
            ].map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">{label}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <Input
                    id={field}
                    name={field}
                    type="number"
                    value={values[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-11 pl-7 border-[#E1D4C7] bg-[#F5ECE4]/50 focus:ring-[#734425]/20 focus:border-[#734425] transition-all font-sans text-sm text-[#2E2E2E] rounded-xl"
                  />
                </div>
                {renderError(field)}
              </div>
            ))}
          </div>
        </div>

        {/* === Deductions Section === */}
        <div className="p-6 border border-[#E1D4C7] rounded-2xl shadow-sm bg-[#FAF6F2] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E1D4C7]/60 pb-4">
            <TrendingDown className="h-5 w-5 text-rose-500" />
            <h3 className="text-base font-heading font-bold text-[#2E2E2E] uppercase tracking-wider">Deductions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="is_epf_applicable" className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">EPF Applicable?</Label>
              <Select
                value={values.is_epf_applicable ? "true" : "false"}
                onValueChange={(value) =>
                  setFieldValue("is_epf_applicable", value === "true")
                }
              >
                <SelectTrigger className="h-11 border-[#E1D4C7] bg-[#F5ECE4]/50 focus:ring-[#734425]/20 focus:border-[#734425] transition-all font-sans text-sm text-[#2E2E2E] rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
                  <SelectItem value="true" className="focus:bg-[#F5ECE4] focus:text-[#734425]">Yes</SelectItem>
                  <SelectItem value="false" className="focus:bg-[#F5ECE4] focus:text-[#734425]">No</SelectItem>
                </SelectContent>
              </Select>
              {renderError("is_epf_applicable")}
            </div>

            {values.is_epf_applicable && (
              <>
                {[
                  ["epf", "EPF"],
                  ["epf_pension", "EPF Pension"],
                  ["epf_admin", "EPF Admin"],
                ].map(([field, label]) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">{label}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                      <Input
                        id={field}
                        name={field}
                        type={field === "epf" ? "text" : "number"}
                        value={values[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-11 pl-7 border-[#E1D4C7] bg-[#F5ECE4]/50 focus:ring-[#734425]/20 focus:border-[#734425] transition-all font-sans text-sm text-[#2E2E2E] rounded-xl"
                      />
                    </div>
                    {renderError(field)}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* === Payment Details === */}
      <div className="p-6 border border-[#E1D4C7] rounded-2xl shadow-sm bg-[#FAF6F2] space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E1D4C7]/60 pb-4">
          <CreditCard className="h-5 w-5 text-[#734425]" />
          <h3 className="text-base font-heading font-bold text-[#2E2E2E] uppercase tracking-wider">Payment Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["bank_account_number", "Bank Account #"],
            ["ifsc_code", "IFSC Code"],
            ["bank_name", "Bank Name"],
            ["upi_number", "UPI Number"],
          ].map(([field, label]) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">{label}</Label>
              <Input
                id={field}
                name={field}
                type="text"
                value={values[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-11 border-[#E1D4C7] bg-[#F5ECE4]/50 focus:ring-[#734425]/20 focus:border-[#734425] transition-all font-sans text-sm text-[#2E2E2E] rounded-xl"
              />
              {renderError(field)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default SalaryForm;
