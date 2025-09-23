import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Minus,
  Plus,
  IndianRupee,
} from "lucide-react";
import { salaryAPI } from "../../api/employee/salary";
import dayjs from "dayjs";
import { useSocketContext } from "../../contexts/SocketContext";
import { toast } from "sonner";
import axiosInstance from "../../api/axiosInstance";
import NoDataFound from "../../common/NoDataFound";
const getStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
const Salary = () => {
  const { updateDashboard } = useSocketContext();
  const month_in_digit = dayjs().month() + 1;
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);

  const ytdSummary = useMemo(() => {
    const total_deducation =
      (parseFloat(salaryInfo?.epf_admin) || 0) +
      (parseFloat(salaryInfo?.epf_pension) || 0);

    const ytdBasic = {
      grossPay: month_in_digit * (salaryInfo?.salary_with_allowance ?? 0),
      totalDeductions: month_in_digit * total_deducation ?? 0,
      netPay: month_in_digit * (salaryInfo?.payable_salary ?? 0),
      taxPaid: 0,
    };
    return ytdBasic;
  }, [salaryInfo]);

  const getSalary = async () => {
    const resp = await salaryAPI.getSalary();
    if (resp.status === 200) {
      setSalaryInfo(resp.data?.data || {});
    }
  };

  const getSalaryHistory = async () => {
    const resp = await salaryAPI.getSalaryHistory();
    if (resp.status === 200) {
      setSalaryHistory(resp.data?.data || {});
    }
  };

  // handle download salary
  const handleDownloadSalary = async (month_in_digit) => {
    try {
      const resp = await axiosInstance.get(
        `/employee/employeFile/download/${month_in_digit}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "salary_slip.pdf"); // or use dynamic filename
      document.body.appendChild(link);
      link.click();
      link.remove(); // cleanup
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // api
  useEffect(() => {
    getSalary();

    getSalaryHistory();
  }, [updateDashboard]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Salary & Payroll
          </h1>
          <p className="text-slate-600">
            View your salary details and download payslips
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={async () => {
            const currentMonth = salaryHistory?.find(
              (item) => item?.month_in_digit === month_in_digit
            );
            if (!currentMonth["salary_slip"]) {
              toast.error("No payslip found for the current month.");
              return;
            }
            handleDownloadSalary(month_in_digit);
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Payslip
        </Button>
      </div>

      {/* Current Salary Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Current Monthly Salary
              </h2>
              <p className="text-3xl font-bold">
                ₹{salaryInfo?.payable_salary?.toLocaleString() ?? 0}
              </p>
              <p className="text-blue-100 mt-1">Net Pay (After Deductions)</p>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <p className="text-blue-100">Gross Salary</p>
              <p className="text-xl font-semibold">
                ₹{salaryInfo?.salary_with_allowance?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YTD Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Year-to-Date Summary (2024)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <IndianRupee className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-slate-600">Gross Pay</p>
              <p className="text-xl font-bold text-blue-600">
                ₹{ytdSummary?.grossPay?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Minus className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <p className="text-sm text-slate-600">Total Deductions</p>
              <p className="text-xl font-bold text-red-600">
                ₹{ytdSummary?.totalDeductions?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Plus className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-slate-600">Net Pay</p>
              <p className="text-xl font-bold text-green-600">
                ₹{ytdSummary?.netPay?.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-slate-600">Tax Paid</p>
              <p className="text-xl font-bold text-orange-600">
                ₹{ytdSummary?.taxPaid?.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-green-600" />
              <span>Earnings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-slate-700">Basic Salary</span>
              <span className="font-semibold text-green-700">
                ₹{salaryInfo?.base_salary?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-slate-700">Allowances</span>
              <span className="font-semibold text-green-700">
                ₹
                {(
                  salaryInfo?.hra ||
                  0 + salaryInfo?.bonus ||
                  0 + salaryInfo?.cca ||
                  0
                )?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-slate-700">Bonus</span>
              <span className="font-semibold text-green-700">
                ₹{salaryInfo?.bonus?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Earnings</span>
                <span className="text-green-600">
                  ₹{salaryInfo?.salary_with_allowance?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Minus className="h-5 w-5 text-red-600" />
              <span>Deductions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-slate-700">Income Tax</span>
              <span className="font-semibold text-red-700">₹{0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-slate-700">Pf Deducation</span>
              <span className="font-semibold text-red-700">
                ₹
                {(
                  (salaryInfo?.epf_admin || 0) + (salaryInfo?.epf_pension || 0)
                )?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-slate-700">Other Deductions</span>
              <span className="font-semibold text-red-700">₹ 0</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Deductions</span>
                <span className="text-red-600">
                  ₹
                  {(
                    (salaryInfo?.epf_admin || 0) +
                    (salaryInfo?.epf_pension || 0)
                  )?.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Month
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">
                    Basic Salary
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">
                    Allowances
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">
                    Bonus
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">
                    Deductions
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">
                    Net Salary
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaryHistory?.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-4 px-4 font-medium text-slate-800">
                      {new Date(
                        `${record?.year}-${record?.month}` + "-01"
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-700">
                      ₹{record?.base_salary?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-700">
                      ₹{" "}
                      {(
                        salaryInfo?.hra +
                        salaryInfo?.bonus +
                        salaryInfo?.cca
                      )?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-700">
                      ₹{record?.bonus?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-red-600">
                      ₹{" "}
                      {(
                        (salaryInfo?.epf_admin || 0) +
                        (salaryInfo?.epf_pension || 0)
                      )?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-800">
                      ₹{record?.net_salary?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={getStatusColor(record?.status)}>
                        {record?.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!record["salary_slip"]) {
                              toast.error(
                                "Salary slip is still generated. Please try"
                              );
                              return;
                            }
                            handleDownloadSalary(record?.month_in_digit);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {salaryHistory?.length === 0 && <NoDataFound />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Salary;
