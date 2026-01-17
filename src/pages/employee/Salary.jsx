import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Calendar,
  TrendingUp,
  Minus,
  Plus,
  IndianRupee,
  FileText,
  CreditCard,
  Briefcase
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
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "processing":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
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
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Salary & Payroll
          </h1>
          <p className="text-sm text-muted-foreground">
            View your salary details and download payslips
          </p>
        </div>
        <Button
          className="shadow-lg shadow-primary/20"
          onClick={async () => {
            const currentMonth = salaryHistory?.find(
              (item) => item?.month_in_digit === month_in_digit
            );
            if (!currentMonth || !currentMonth["salary_slip"]) {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-0 shadow-lg bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black/10 blur-3xl"></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col justify-between h-full gap-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-primary-foreground/80 font-medium mb-1">Total Net Payable</p>
                  <h2 className="text-4xl font-bold tracking-tight">
                    ₹{salaryInfo?.payable_salary?.toLocaleString() ?? 0}
                  </h2>
                  <p className="text-xs text-primary-foreground/60 mt-2 font-medium bg-black/20 inline-block px-2 py-1 rounded">
                    After all deductions
                  </p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
                <div>
                  <p className="text-sm text-primary-foreground/70">Gross Salary</p>
                  <p className="text-xl font-semibold mt-1">
                    ₹{salaryInfo?.salary_with_allowance?.toLocaleString() ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/70">Basic Pay</p>
                  <p className="text-xl font-semibold mt-1">
                    ₹{salaryInfo?.base_salary?.toLocaleString() ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm flex flex-col justify-center">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Designation</p>
                <p className="text-lg font-bold text-foreground">Software Engineer</p>
              </div>
            </div>
            <div className="h-px bg-border/50 w-full" />
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pay Period</p>
                <p className="text-lg font-bold text-foreground">{dayjs().format("MMMM YYYY")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-border/50 shadow-sm h-full">
          <CardHeader className="border-b border-border/50 px-6 py-4 bg-muted/20">
            <CardTitle className="flex items-center space-x-2 text-base font-semibold text-foreground">
              <Plus className="h-5 w-5 text-emerald-600" />
              <span>Earnings Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              <div className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors">
                <span className="text-sm font-medium text-foreground">Basic Salary</span>
                <span className="text-sm font-bold text-emerald-600">
                  ₹{salaryInfo?.base_salary?.toLocaleString() ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors">
                <span className="text-sm font-medium text-foreground">HRA & Allowances</span>
                <span className="text-sm font-bold text-emerald-600">
                  ₹
                  {(
                    (salaryInfo?.hra || 0) + (salaryInfo?.cca || 0)
                  )?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors">
                <span className="text-sm font-medium text-foreground">Performance Bonus</span>
                <span className="text-sm font-bold text-emerald-600">
                  ₹{salaryInfo?.bonus?.toLocaleString() ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50/30">
                <span className="text-sm font-bold text-foreground">Total Earnings</span>
                <span className="text-base font-black text-emerald-700">
                  ₹{salaryInfo?.salary_with_allowance?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm h-full">
          <CardHeader className="border-b border-border/50 px-6 py-4 bg-muted/20">
            <CardTitle className="flex items-center space-x-2 text-base font-semibold text-foreground">
              <Minus className="h-5 w-5 text-rose-600" />
              <span>Deductions Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              <div className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors">
                <span className="text-sm font-medium text-foreground">Provident Fund (PF)</span>
                <span className="text-sm font-bold text-rose-600">
                  ₹
                  {(
                    (salaryInfo?.epf_admin || 0) + (salaryInfo?.epf_pension || 0)
                  )?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors">
                <span className="text-sm font-medium text-foreground">Professional Tax</span>
                <span className="text-sm font-bold text-rose-600">₹0</span>
              </div>
              <div className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors">
                <span className="text-sm font-medium text-foreground">Income Tax (TDS)</span>
                <span className="text-sm font-bold text-rose-600">₹0</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rose-50/30">
                <span className="text-sm font-bold text-foreground">Total Deductions</span>
                <span className="text-base font-black text-rose-700">
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

      {/* YTD Summary */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 px-6 py-4 bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Year-to-Date Summary ({dayjs().year()})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Gross Pay</p>
              <p className="text-xl font-bold text-foreground">
                ₹{ytdSummary?.grossPay?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Total Deductions</p>
              <p className="text-xl font-bold text-foreground">
                ₹{ytdSummary?.totalDeductions?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Net Pay</p>
              <p className="text-xl font-bold text-foreground">
                ₹{ytdSummary?.netPay?.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Tax Paid</p>
              <p className="text-xl font-bold text-foreground">
                ₹{ytdSummary?.taxPaid?.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary History */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 px-6 py-4 bg-muted/20">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Payroll History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                <tr>
                  <th className="px-6 py-3 text-left">Month</th>
                  <th className="px-6 py-3 text-right">Basic</th>
                  <th className="px-6 py-3 text-right">Allowances</th>
                  <th className="px-6 py-3 text-right">Bonus</th>
                  <th className="px-6 py-3 text-right">Deductions</th>
                  <th className="px-6 py-3 text-right">Net Salary</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {salaryHistory?.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {new Date(
                        `${record?.year}-${record?.month}` + "-01"
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      ₹{record?.base_salary?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      ₹{" "}
                      {(
                        salaryInfo?.hra +
                        salaryInfo?.bonus +
                        salaryInfo?.cca
                      )?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      ₹{record?.bonus?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-rose-600 font-medium">
                      - ₹{" "}
                      {(
                        (salaryInfo?.epf_admin || 0) +
                        (salaryInfo?.epf_pension || 0)
                      )?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">
                      ₹{record?.net_salary?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={getStatusColor(record?.status)}>
                        {record?.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={async () => {
                          if (!record["salary_slip"]) {
                            toast.error(
                              "Salary slip is pending generation."
                            );
                            return;
                          }
                          handleDownloadSalary(record?.month_in_digit);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {salaryHistory?.length === 0 && (
              <div className="p-8 flex justify-center">
                <NoDataFound />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Salary;