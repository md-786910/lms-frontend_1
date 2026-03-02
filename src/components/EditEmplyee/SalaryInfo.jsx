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
    <div className="space-y-8 font-montserrat">
      {/* === Salary Summary === */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="h-6 w-6 text-emerald-400" />
          <h3 className="text-xl font-bold uppercase tracking-wider">Salary Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gross Earnings</p>
            <p className="text-2xl font-extrabold text-white">₹{values.salary_with_allowance || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Deductions</p>
            <p className="text-2xl font-extrabold text-rose-400">₹{values.total_deduction_allowance || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Payable</p>
            <p className={`text-3xl font-black ${values.payable_salary < 0 ? "text-rose-500" : "text-emerald-400"}`}>
              ₹{values.payable_salary || 0}
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-800">
          <p className="text-sm text-slate-400 italic">
            <span className="font-bold text-slate-300 not-italic uppercase text-xs mr-2 tracking-wider">Amount in words:</span>
            {numberToWords(values?.payable_salary || 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* === Earnings Section === */}
        <div className="p-6 border border-gray-100 rounded-xl shadow-sm bg-white space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Earnings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["base_salary", "Base Salary *"],
              ["bonus", "Bonus"],
              ["cca", "CCA"],
              ["hra", "HRA"],
            ].map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-sm font-bold text-slate-700 uppercase tracking-wider">{label}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <Input
                    id={field}
                    name={field}
                    type="number"
                    value={values[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-11 pl-7 border-slate-200 focus:border-slate-900 transition-all font-montserrat"
                  />
                </div>
                {renderError(field)}
              </div>
            ))}
          </div>
        </div>

        {/* === Deductions Section === */}
        <div className="p-6 border border-gray-100 rounded-xl shadow-sm bg-white space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <TrendingDown className="h-5 w-5 text-rose-500" />
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Deductions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="is_epf_applicable" className="text-sm font-bold text-slate-700 uppercase tracking-wider">EPF Applicable?</Label>
              <Select
                value={values.is_epf_applicable ? "true" : "false"}
                onValueChange={(value) =>
                  setFieldValue("is_epf_applicable", value === "true")
                }
              >
                <SelectTrigger className="h-11 border-slate-200 focus:border-slate-900 transition-all font-montserrat">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="font-montserrat">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
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
                    <Label htmlFor={field} className="text-sm font-bold text-slate-700 uppercase tracking-wider">{label}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                      <Input
                        id={field}
                        name={field}
                        type={field === "epf" ? "text" : "number"}
                        value={values[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-11 pl-7 border-slate-200 focus:border-slate-900 transition-all font-montserrat"
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
      <div className="p-6 border border-gray-100 rounded-xl shadow-sm bg-white space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <CreditCard className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Payment Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["bank_account_number", "Bank Account #"],
            ["ifsc_code", "IFSC Code"],
            ["bank_name", "Bank Name"],
            ["upi_number", "UPI Number"],
          ].map(([field, label]) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="text-sm font-bold text-slate-700 uppercase tracking-wider">{label}</Label>
              <Input
                id={field}
                name={field}
                type="text"
                value={values[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-11 border-slate-200 focus:border-slate-900 transition-all font-montserrat"
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
