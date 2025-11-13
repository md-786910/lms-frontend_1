import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from "../../../common/NoDataFound";

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
    <div className="space-y-4 mt-6 p-4 border rounded-md shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Basic Salary</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            ₹{salaryInfo.base_salary || "N/A"}
          </p>
        </div>
        <div>
          <Label>Allowances</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            ₹{salaryInfo.hra + salaryInfo.cca || "N/A"}
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
            ₹
            {(salaryInfo?.epf_pension ?? 0) + (salaryInfo?.epf_admin ?? 0) ||
              "N/A"}
          </p>
        </div>
        {salaryInfo.upi_number ? (
          // Show UPI details
          <>
            <div>
              <Label>Net Salary</Label>
              <p className="mt-1 p-2 bg-green-50 rounded-md font-semibold text-green-800">
                ₹{salaryInfo.payable_salary || "N/A"}
              </p>
            </div>
            <div>
              <Label>UPI Number</Label>
              <p className="mt-1 p-2 bg-slate-50 rounded-md">
                {salaryInfo.upi_number}
              </p>
            </div>
          </>
        ) : (
          // Show Bank details
          <>
            <div>
              <Label>Net Salary</Label>
              <p className="mt-1 p-2 bg-green-50 rounded-md font-semibold text-green-800">
                ₹{salaryInfo.payable_salary || "N/A"}
              </p>
            </div>
            <div>
              <Label>IFSC Code</Label>
              <p className="mt-1 p-2 bg-slate-50 rounded-md">
                {salaryInfo.ifsc_code || "N/A"}
              </p>
            </div>
            <div>
              <Label>Bank Account</Label>
              <p className="mt-1 p-2 bg-slate-50 rounded-md">
                {salaryInfo.bank_account_number || "N/A"}
              </p>
            </div>
            <div>
              <Label>Bank Name</Label>
              <p className="mt-1 p-2 bg-slate-50 rounded-md">
                {salaryInfo.bank_name || "N/A"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SalaryInfo;
