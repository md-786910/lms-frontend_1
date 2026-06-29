import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Download,
  IndianRupee,
  Minus,
  Plus,
  TrendingUp,
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
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
};

const Salary = () => {
  const { updateDashboard } = useSocketContext();
  const month_in_digit = dayjs().month() + 1;
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);

  const allowancesTotal = useMemo(() => {
    return (
      (salaryInfo?.hra || 0) +
      (salaryInfo?.bonus || 0) +
      (salaryInfo?.cca || 0)
    );
  }, [salaryInfo]);

  const mandatoryDeductions = useMemo(() => {
    return (salaryInfo?.epf_admin || 0) + (salaryInfo?.epf_pension || 0);
  }, [salaryInfo]);

  const netRetention = useMemo(() => {
    const gross = salaryInfo?.salary_with_allowance || 0;
    if (!gross) return 0;
    const net = gross - mandatoryDeductions;
    return Math.max(0, Math.min(100, (net / gross) * 100));
  }, [salaryInfo, mandatoryDeductions]);

    const ytdSummary = useMemo(() => {
      const total_deducation =
        (parseFloat(salaryInfo?.epf_admin) || 0) +
        (parseFloat(salaryInfo?.epf_pension) || 0);

      const ytdBasic = {
        grossPay: month_in_digit * (salaryInfo?.salary_with_allowance ?? 0),
        totalDeductions: month_in_digit * (total_deducation ?? 0),
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
      link.setAttribute("download", "salary_slip.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
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
    <div className=" space-y-8">
      {/* Header */}
      <div className="rounded-md border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-900">
            Salary &amp; Payroll
          </h1>
          <p className="text-slate-600 text-sm">
            Your monthly payout overview, deductions, and downloadable payslips in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="border-slate-200 text-slate-800 hover:text-slate-900"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          >
            View History
          </Button>
          <Button
            className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-md shadow-slate-900/20 font-graphik"
            onClick={async () => {
              const currentMonth = salaryHistory?.find(
                (item) => item?.month_in_digit === month_in_digit
              );
              if (!currentMonth?.["salary_slip"]) {
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
      </div>

      {/* Current Salary Overview */}
      <Card className="relative overflow-hidden rounded-md border border-slate-800/10 bg-[#111827] text-white shadow-2xl">
        <CardContent className="relative p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-4xl font-semibold tracking-tight">
                  ₹{salaryInfo?.payable_salary?.toLocaleString() ?? 0}
                </h2>
                <Badge className="bg-emerald-100 text-emerald-800 border-0 font-graphik">
                  Net after deductions
                </Badge>
              </div>
              <p className="text-slate-300 text-sm font-graphik">
                Updated for {dayjs().format("MMMM YYYY")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs text-slate-200 font-graphik">Gross Salary</p>
                <p className="text-lg font-semibold">
                  ₹{salaryInfo?.salary_with_allowance?.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs text-slate-200">Deductions</p>
                <p className="text-lg font-semibold">₹{mandatoryDeductions?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span>Net retention</span>
              <span className="font-medium">{netRetention.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${netRetention}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YTD Summary */}
      <Card className="border border-slate-200 shadow-lg rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Year-to-Date Summary ({dayjs().year()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Gross Pay</span>
                <IndianRupee className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                ₹{ytdSummary?.grossPay?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-center justify-between text-sm text-red-700">
                <span>Total Deductions</span>
                <Minus className="h-5 w-5" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-red-700">
                ₹{ytdSummary?.totalDeductions?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center justify-between text-sm text-emerald-700">
                <span>Net Pay</span>
                <Plus className="h-5 w-5" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">
                ₹{ytdSummary?.netPay?.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center justify-between text-sm text-amber-700">
                <span>Tax Paid</span>
                <Calendar className="h-5 w-5" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-amber-700">
                ₹{ytdSummary?.taxPaid?.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200 shadow-lg rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Plus className="h-5 w-5 text-emerald-600" />
              Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <span className="text-slate-700">Basic Salary</span>
              <span className="font-semibold text-emerald-700">
                ₹{salaryInfo?.base_salary?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <span className="text-slate-700">Allowances</span>
              <span className="font-semibold text-emerald-700">
                ₹{allowancesTotal?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <span className="text-slate-700">Bonus</span>
              <span className="font-semibold text-emerald-700">
                ₹{salaryInfo?.bonus?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-lg font-semibold">
              <span className="text-slate-800">Total Earnings</span>
              <span className="text-emerald-700">
                ₹{salaryInfo?.salary_with_allowance?.toLocaleString() ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-lg rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Minus className="h-5 w-5 text-rose-600" />
              Deductions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
              <span className="text-slate-700">Income Tax</span>
              <span className="font-semibold text-rose-700">₹0</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
              <span className="text-slate-700">PF Deduction</span>
              <span className="font-semibold text-rose-700">
                ₹{mandatoryDeductions?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
              <span className="text-slate-700">Other Deductions</span>
              <span className="font-semibold text-rose-700">₹0</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-lg font-semibold">
              <span className="text-slate-800">Total Deductions</span>
              <span className="text-rose-700">₹{mandatoryDeductions?.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary History */}
      <Card className="border border-slate-200 shadow-xl rounded-md" id="salary-history">
  
  {/* Header */}
  <CardHeader className="flex flex-col gap-2">
    <CardTitle className="text-slate-900 text-lg sm:text-xl">
      Salary History
    </CardTitle>
    <p className="text-sm text-slate-600">
      Download past payslips and review payout status.
    </p>
  </CardHeader>

  <CardContent>

    {/* ================= DESKTOP TABLE ================= */}
    <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4">Month</th>
            <th className="text-right py-3 px-4">Basic</th>
            <th className="text-right py-3 px-4">Allowances</th>
            <th className="text-right py-3 px-4">Bonus</th>
            <th className="text-right py-3 px-4">Deductions</th>
            <th className="text-right py-3 px-4">Net</th>
            <th className="text-center py-3 px-4">Status</th>
            <th className="text-center py-3 px-4">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {salaryHistory?.map((record, index) => (
            <tr key={index} className="hover:bg-slate-50">
              <td className="py-4 px-4 font-medium">
                {new Date(`${record?.year}-${record?.month}-01`).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </td>

              <td className="text-right px-4">₹{record?.base_salary?.toLocaleString()}</td>
              <td className="text-right px-4">₹{allowancesTotal?.toLocaleString()}</td>
              <td className="text-right px-4">₹{record?.bonus?.toLocaleString()}</td>
              <td className="text-right px-4 text-rose-600">₹{mandatoryDeductions?.toLocaleString()}</td>
              <td className="text-right px-4 font-semibold">₹{record?.net_salary?.toLocaleString()}</td>

              <td className="text-center px-4">
                <Badge className={getStatusColor(record?.status)}>
                  {record?.status}
                </Badge>
              </td>

              <td className="text-center px-4">
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {salaryHistory?.length === 0 && <NoDataFound />}
    </div>

    {/* ================= MOBILE / TABLET CARDS ================= */}
    <div className="lg:hidden space-y-4">

      {salaryHistory?.length > 0 ? (
        salaryHistory.map((record, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-xl p-4 shadow-sm bg-white space-y-3"
          >

            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-900">
                  {new Date(`${record?.year}-${record?.month}-01`).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
                <p className="text-xs text-slate-500">Salary Month</p>
              </div>

              <Badge className={getStatusColor(record?.status)}>
                {record?.status}
              </Badge>
            </div>

            {/* Salary Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">

              <div>
                <p className="text-slate-500 text-xs">Basic</p>
                <p className="font-medium">₹{record?.base_salary?.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-slate-500 text-xs">Allowances</p>
                <p className="font-medium">₹{allowancesTotal?.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-slate-500 text-xs">Bonus</p>
                <p className="font-medium">₹{record?.bonus?.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-slate-500 text-xs">Deductions</p>
                <p className="font-medium text-rose-600">
                  ₹{mandatoryDeductions?.toLocaleString()}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-slate-500 text-xs">Net Salary</p>
                <p className="font-semibold text-lg text-slate-900">
                  ₹{record?.net_salary?.toLocaleString()}
                </p>
              </div>

            </div>

            {/* Action */}
            <div className="flex justify-end">
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={async () => {
                  if (!record["salary_slip"]) {
                    toast.error("Salary slip is still generated. Please try");
                    return;
                  }
                  handleDownloadSalary(record?.month_in_digit);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Slip
              </Button>
            </div>

          </div>
        ))
      ) : (
        <NoDataFound />
      )}

    </div>

  </CardContent>
</Card>
    </div>
  );
};

export default Salary;
