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
    <div className="space-y-8">
      {/* Header Banner */}
      <Card className="border border-[#E1D4C7]/30 shadow-xl rounded-2xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
        <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-heading font-bold tracking-widest text-[#E1D4C7] uppercase bg-white/10 px-3 py-1 rounded-full">
              Compensation & Payroll
            </span>
            <h1 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-white">
              Salary &amp; Payroll
            </h1>
            <p className="text-white/80 text-sm font-sans">
              Your monthly payout overview, deductions, and downloadable payslips in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#24130A] font-heading font-semibold text-xs uppercase tracking-wider"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            >
              View History
            </Button>
            <Button
              className="rounded-xl bg-[#FAF6F2] text-[#734425] hover:bg-white hover:text-[#5D361D] font-heading font-bold text-xs uppercase tracking-wider shadow-lg"
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
              <Download className="h-4 w-4 mr-2 text-[#C26819]" />
              Download Payslip
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Salary Overview */}
      <Card className="relative overflow-hidden rounded-2xl border border-[#734425]/40 bg-[#24130A] text-white shadow-2xl">
        <CardContent className="relative p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-4xl font-heading font-extrabold tracking-tight text-white">
                  ₹{salaryInfo?.payable_salary?.toLocaleString() ?? 0}
                </h2>
                <Badge className="bg-[#734425]/50 text-[#FAF6F2] border border-[#E1D4C7]/30 font-heading font-bold uppercase tracking-wider text-xs">
                  Net after deductions
                </Badge>
              </div>
              <p className="text-[#E1D4C7] text-xs font-sans tracking-wide">
                Updated for {dayjs().format("MMMM YYYY")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs text-[#E1D4C7] font-heading font-bold uppercase tracking-wider">Gross Salary</p>
                <p className="text-lg font-heading font-bold text-white mt-1">
                  ₹{salaryInfo?.salary_with_allowance?.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs text-[#E1D4C7] font-heading font-bold uppercase tracking-wider">Deductions</p>
                <p className="text-lg font-heading font-bold text-rose-300 mt-1">₹{mandatoryDeductions?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#E1D4C7] font-sans">
              <span>Net retention rate</span>
              <span className="font-heading font-bold text-white">{netRetention.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C26819]"
                style={{ width: `${netRetention}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YTD Summary */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-4">
          <CardTitle className="flex items-center gap-3 font-heading font-bold uppercase tracking-tight text-lg text-[#24130A]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#734425]/10 text-[#734425] shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            Year-to-Date Summary ({dayjs().year()})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">
                <span>Gross Pay</span>
                <IndianRupee className="h-4 w-4 text-[#734425]" />
              </div>
              <p className="mt-2 text-2xl font-heading font-extrabold text-[#24130A]">
                ₹{ytdSummary?.grossPay?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-rose-300/40 bg-rose-500/10 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-rose-700">
                <span>Total Deductions</span>
                <Minus className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-heading font-extrabold text-rose-700">
                ₹{ytdSummary?.totalDeductions?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-emerald-800">
                <span>Net Pay</span>
                <Plus className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-heading font-extrabold text-emerald-800">
                ₹{ytdSummary?.netPay?.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-[#C26819]">
                <span>Tax Paid</span>
                <Calendar className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-heading font-extrabold text-[#C26819]">
                ₹{ytdSummary?.taxPaid?.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardHeader className="border-b border-[#E1D4C7]/60 pb-4">
            <CardTitle className="flex items-center gap-3 font-heading font-bold uppercase tracking-tight text-lg text-[#24130A]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#734425]/10 text-[#734425] shrink-0">
                <Plus className="h-6 w-6" />
              </div>
              Earnings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center justify-between rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 px-4 py-3">
              <span className="text-sm font-sans text-[#2E2E2E]">Basic Salary</span>
              <span className="font-heading font-bold text-sm text-[#24130A]">
                ₹{salaryInfo?.base_salary?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 px-4 py-3">
              <span className="text-sm font-sans text-[#2E2E2E]">Allowances</span>
              <span className="font-heading font-bold text-sm text-[#24130A]">
                ₹{allowancesTotal?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 px-4 py-3">
              <span className="text-sm font-sans text-[#2E2E2E]">Bonus</span>
              <span className="font-heading font-bold text-sm text-[#24130A]">
                ₹{salaryInfo?.bonus?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="border-t border-[#E1D4C7] pt-4 flex items-center justify-between text-base font-heading font-extrabold">
              <span className="text-[#24130A] uppercase tracking-wide">Total Earnings</span>
              <span className="text-[#734425] text-lg">
                ₹{salaryInfo?.salary_with_allowance?.toLocaleString() ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardHeader className="border-b border-[#E1D4C7]/60 pb-4">
            <CardTitle className="flex items-center gap-3 font-heading font-bold uppercase tracking-tight text-lg text-[#24130A]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-700 shrink-0">
                <Minus className="h-6 w-6" />
              </div>
              Deductions Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center justify-between rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 px-4 py-3">
              <span className="text-sm font-sans text-[#2E2E2E]">Income Tax</span>
              <span className="font-heading font-bold text-sm text-[#2E2E2E]">₹0</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 px-4 py-3">
              <span className="text-sm font-sans text-[#2E2E2E]">PF Deduction</span>
              <span className="font-heading font-bold text-sm text-rose-700">
                ₹{mandatoryDeductions?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 px-4 py-3">
              <span className="text-sm font-sans text-[#2E2E2E]">Other Deductions</span>
              <span className="font-heading font-bold text-sm text-[#2E2E2E]">₹0</span>
            </div>
            <div className="border-t border-[#E1D4C7] pt-4 flex items-center justify-between text-base font-heading font-extrabold">
              <span className="text-[#24130A] uppercase tracking-wide">Total Deductions</span>
              <span className="text-rose-700 text-lg">₹{mandatoryDeductions?.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary History */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2] overflow-hidden" id="salary-history">
  
  {/* Header */}
  <CardHeader className="border-b border-[#E1D4C7]/60 pb-4">
    <CardTitle className="font-heading font-bold uppercase tracking-tight text-lg text-[#24130A]">
      Salary History
    </CardTitle>
    <p className="text-xs text-[#2E2E2E]/70 font-sans">
      Download past payslips and review payout status.
    </p>
  </CardHeader>

  <CardContent className="p-0">

    {/* ================= DESKTOP TABLE ================= */}
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#FAF6F2]/80 text-[#734425]">
          <tr className="border-b border-[#E1D4C7]">
            <th className="text-left py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs">Month</th>
            <th className="text-right py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs">Basic</th>
            <th className="text-right py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs">Allowances</th>
            <th className="text-right py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs">Bonus</th>
            <th className="text-right py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs">Deductions</th>
            <th className="text-right py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs">Net</th>
            <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs">Status</th>
            <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs">Action</th>
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
            className="border border-[#E1D4C7] rounded-2xl p-4 shadow-sm bg-[#FAF6F2] space-y-3"
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
