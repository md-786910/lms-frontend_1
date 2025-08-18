import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from '../../../common/NoDataFound'

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

  if (loading) {
    return <LoadingSpinner/>
  }

  if (!salaryInfo) {
    return <NoDataFound/>
  }

  return (
     <div className="space-y-4 mt-6 p-4 border rounded-md shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Basic Salary</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            ₹{salaryInfo.basicSalary || "N/A"}
          </p>
        </div>
        <div>
          <Label>Allowances</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            ₹{salaryInfo.allowances || "N/A"}
          </p>
        </div>
        <div>
          <Label>Annual Bonus</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            ₹{salaryInfo.bonus || "N/A"}
          </p>
        </div>
        <div>
          <Label>Deductions</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            ₹{salaryInfo.deductions || "N/A"}
          </p>
        </div>
        <div>
          <Label>Net Salary</Label>
          <p className="mt-1 p-2 bg-green-50 rounded-md font-semibold text-green-800">
            ₹{salaryInfo.netSalary || "N/A"}
          </p>
        </div>
        <div>
          <Label>Pay Frequency</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {salaryInfo.payFrequency || "N/A"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Bank Account</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {salaryInfo.bankAccount || "N/A"}
          </p>
        </div>
        <div>
          <Label>Bank Name</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {salaryInfo.bankName || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SalaryInfo;
