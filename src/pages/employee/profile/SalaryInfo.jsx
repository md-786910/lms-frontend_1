import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from "../../../common/NoDataFound";
import { LockKeyhole } from "lucide-react";

function SalaryInfo() {
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaryInfo = async () => {
      try {
        const resp = await empProfileApi.getSalary();
        if (resp?.status === 200) {
          setSalaryInfo(resp.data?.data || {});
        }
      } catch (error) {
        console.error("Error fetching salary info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryInfo();
  }, []);

  if (!salaryInfo) {
    return <NoDataFound />;
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Basic Salary</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          ₹{salaryInfo.base_salary || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Allowances</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          ₹{salaryInfo.hra + salaryInfo.cca || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Annual Bonus</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          ₹{salaryInfo.bonus || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Deductions</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          ₹
            {(salaryInfo?.epf_pension ?? 0) + (salaryInfo?.epf_admin ?? 0) ||
              "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      {salaryInfo.upi_number ? (
        // Show UPI details
        <>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Net Salary</label>
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
              ₹{salaryInfo.payable_salary || "N/A"}
              <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">UPI Number</label>
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
              {salaryInfo.upi_number}
              <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </>
      ) : (
        // Show Bank details
        <>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Net Salary</label>
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
              ₹{salaryInfo.payable_salary || "N/A"}
              <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">IFSC Code</label>
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
              {salaryInfo.ifsc_code || "N/A"}
              <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Bank Account</label>
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
              {salaryInfo.bank_account_number || "N/A"}
              <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Bank Name</label>
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
              {salaryInfo.bank_name || "N/A"}
              <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
}

export default SalaryInfo;
