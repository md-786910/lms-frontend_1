import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Edit3,
  Eye,
  CircleAlert,
  FilePlus,
  DownloadIcon,
  AlarmClockMinus,
  X,
  IndianRupee,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { salaryAPI } from "../../api/salaryApi";
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import NoDataFound from "../../common/NoDataFound";
import axiosInstance from "../../api/axiosInstance";

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
const tooltip = {
  children:
    "You can import all employees into the salary module manually by using this button if they are not imported automatically.",
};
const year = new Date().getFullYear();
const Salary = () => {
  const currentMonth = dayjs().month() + 1;
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("current");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryDatas, setSalaryDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState({});
  const [editSalary, setEditSalary] = useState({
    base_salary: 0,
    bonus: 0,
    deductions: 0,
    effective_date: new Date(),
  });

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Salary report has been exported successfully.",
    });
  };

  const handleProcessPayroll = () => {
    toast({
      title: "Payroll Processed",
      description: "Monthly payroll has been processed successfully.",
    });
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  async function callSalaryHistory(query = "", statusFilter, month) {
    setLoading(true);
    try {
      const response = await salaryAPI.getSalaryHistory(query, {
        status: statusFilter,
        month: month == "current" ? currentMonth : month,
      });
      if (response.status === 200) {
        setSalaryDatas(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const getDashboard = async () => {
    try {
      const response = await salaryAPI.getDashboard();
      if (response.status === 200) {
        setDashboard(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadSalary = async (
    employee_id,
    month_in_digit,
    year = new Date().getFullYear()
  ) => {
    const resp = await axiosInstance.get(
      `/adminFile/download/employee/${employee_id}/month/${month_in_digit}/year/${year}`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "salary_slip.pdf"); // or use dynamic filename
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Debounced version
  const debouncedSearch = useCallback(
    debounce(
      (query, sort, month) => callSalaryHistory(query, sort, month),
      500
    ),
    []
  );
  useEffect(() => {
    callSalaryHistory();
    getDashboard();
  }, []);

  // Watch search input changes and trigger debounced fetch
  useEffect(() => {
    debouncedSearch(searchTerm, statusFilter, monthFilter);
  }, [searchTerm, statusFilter, monthFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
        <Card className="border border-[#E1D4C7] shadow-xl rounded-3xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight uppercase text-white">
                    Salary Management
                  </h1>
                </div>
                <p className="text-[#F5ECE4]/80 font-medium text-sm font-sans max-w-2xl">
                  Manage employee salaries, payouts, and monthly payroll flows with a clear snapshot of totals.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  className="rounded-xl shadow-sm border border-white/20 flex items-center py-2.5 px-4 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] bg-[#FAF6F2] hover:bg-[#E1D4C7] cursor-pointer transition ease-in-out duration-300"
                  onClick={handleExportReport}
                >
                  <Download className="h-4 w-4 mr-1 text-[#734425]" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-3xl">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2E2E2E]/60 text-xs font-heading font-bold uppercase tracking-wider">
                    Total Payroll
                  </p>
                  <p className="text-2xl md:text-3xl font-heading font-black text-[#2E2E2E] mt-1">
                    ₹{dashboard?.total_netpay?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#734425]/15 text-[#734425]">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-3xl">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2E2E2E]/60 text-xs font-heading font-bold uppercase tracking-wider">
                    Paid Amount
                  </p>
                  <p className="text-2xl md:text-3xl font-heading font-black text-[#2E2E2E] mt-1">
                    ₹{dashboard?.paid_amount?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#734425]/10 text-[#734425]">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-3xl">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2E2E2E]/60 text-xs font-heading font-bold uppercase tracking-wider">
                    Pending Amount
                  </p>
                  <p className="text-2xl md:text-3xl font-heading font-black text-[#2E2E2E] mt-1">
                    ₹{dashboard?.pending_amount?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#C26819]/15 text-[#C26819]">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-3xl">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2E2E2E]/60 text-xs font-heading font-bold uppercase tracking-wider">Employees</p>
                  <p className="text-2xl md:text-3xl font-heading font-black text-[#2E2E2E] mt-1">
                    {dashboard?.employee_count}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#8A522D]/15 text-[#8A522D]">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Search and Filters */}
      <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-3xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-11 border-slate-200 rounded-xl font-medium">
                <SelectValue placeholder="Filter by Status" className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik" />
              </SelectTrigger>
              <SelectContent className="border border-slate-200 focus:border-slate-900 transition-all font-graphik">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-40 h-11 border-slate-200 rounded-xl font-medium">
                <SelectValue placeholder="Filter by Month" className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik" />
              </SelectTrigger>
              <SelectContent className="border border-slate-200 focus:border-slate-900 transition-all font-graphik">
                <SelectItem value={"current"}>Current Month</SelectItem>
                <SelectItem value={1}>January</SelectItem>
                <SelectItem value={2}>February</SelectItem>
                <SelectItem value={3}>March</SelectItem>
                <SelectItem value={4}>April</SelectItem>
                <SelectItem value={5}>May</SelectItem>
                <SelectItem value={6}>June</SelectItem>
                <SelectItem value={7}>July</SelectItem>
                <SelectItem value={8}>August</SelectItem>
                <SelectItem value={9}>September</SelectItem>
                <SelectItem value={10}>October</SelectItem>
                <SelectItem value={11}>November</SelectItem>
                <SelectItem value={12}>December</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative ">
              <Button
                className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white font-graphik mb-1 h-11 rounded-xl"
                onClick={async () => {
                  const resp = await salaryAPI.importCurrentSalaryManually();
                  if (resp.status == 200) {
                    callSalaryHistory();
                  }
                }}
              >
                Import employee
              </Button>

              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <CircleAlert className="cursor-pointer absolute right-0 top h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  {...tooltip}
                  className="text-xs w-64 "
                />
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Table */}
      <div className="p-6 bg-[#FAF6F2] border border-[#E1D4C7] rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3 text-lg font-bold text-[#2E2E2E] font-heading uppercase tracking-tight mb-5 border-b border-[#E1D4C7]/60 pb-3">
          <span className="bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
            <AlarmClockMinus className="h-5 w-5" />
          </span>
          <span>
            Salary Details
          </span>
        </div>
        <div className="rounded-lg border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-graphik">
                    Employee
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-graphik">
                    Position
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-graphik">
                    Base Salary
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-graphik">
                    Bonus
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-graphik">
                    Deductions
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-graphik">
                    Net Salary
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-graphik">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-graphik">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaryDatas?.map((salary) => {
                  const {
                    employee: {
                      first_name = "",
                      last_name = "",
                      employee_no = "",
                    },
                  } = salary;
                  return (
                    <tr
                      key={salary.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4 text-start text-slate-600 font-graphik">
                        <div>
                          <p className="font-medium text-slate-800 font-graphik">
                            {first_name + " " + last_name}
                          </p>
                          <p className="text-xs text-slate-500 font-graphik">
                            {employee_no || `EMP-${salary?.employee?.id}`}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-start text-slate-600 font-graphik">
                        {salary.employee?.designation?.title || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-start text-slate-800 font-graphik">
                        ₹{salary.base_salary.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-start text-green-600 font-graphik">
                        ₹{salary.bonus.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-start text-red-600 font-graphik">
                        ₹{salary.deduction.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-start font-semibold text-slate-800 font-graphik">
                        ₹{salary.net_salary.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-start font-graphik">
                        <Badge className={getStatusColor(salary.status)}>
                          {salary.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-start font-graphik">
                        <div className="">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEmployee(salary)}
                          >
                            <FilePlus className="h-4 w-4" />
                          </Button>
                          {salary?.salary_slip && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleDownloadSalary(
                                  salary?.employee_id,
                                  salary?.month_in_digit
                                );
                              }}
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                const response = await axiosInstance.get(
                                  "/company/salary/view",
                                  {
                                    params: {
                                      employee_id: salary?.employee_id,
                                      month_in_digit: salary?.month_in_digit,
                                    },
                                    responseType: "blob", // important for binary data
                                    headers: {
                                      Accept: "application/pdf",
                                    },
                                  }
                                );

                                // Create a blob URL
                                const fileURL = URL.createObjectURL(
                                  new Blob([response.data], {
                                    type: "application/pdf",
                                  })
                                );

                                // Open in a new tab
                                window.open(fileURL, "_blank");
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: error?.response?.data?.message,
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(salary)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {salaryDatas?.length === 0 && <NoDataFound />}
          </div>
        </div>
      </div>

      {/* View Employee Salary Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm font-graphik">
          {/* Modal */}
          <div className="relative w-full max-w-lg rounded-2xl bg-[#FAF6F2] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-[#E1D4C7]">
            <div className="bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white p-5 md:p-6 border-b border-[#734425]/40">
              <div className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-12 md:col-span-8 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-[#F5ECE4] flex items-center justify-center shadow-inner">
                      <AlarmClockMinus className="h-5 w-5 text-[#F5ECE4]" />
                    </span>
                    <div className="space-y-0.5">
                      <h2 className="text-xl font-heading font-extrabold uppercase tracking-tight text-white">
                        {selectedEmployee?.employee?.first_name} {selectedEmployee?.employee?.last_name}
                      </h2>
                      <p className="text-white/80 font-sans text-xs font-medium">
                        {selectedEmployee?.employee?.designation?.title || "Employee Details"}
                      </p>
                    </div>
                  </div>
                </div>
                  <div className="col-span-12 md:col-span-4 flex md:justify-end pb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowViewModal(false)}
                      className="rounded-xl hover:bg-white/20 bg-white/10 text-white transition-colors border border-white/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

            {selectedEmployee && (
              <div className="p-5 space-y-5 bg-[#FAF6F2]">
                {/* Employee Quick Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="px-3 py-2.5 rounded-xl bg-[#F5ECE4]/70 border border-[#E1D4C7] shadow-sm">
                    <p className="text-[10px] font-bold text-[#734425] uppercase tracking-wider">Employee ID</p>
                    <p className="text-sm font-semibold text-[#2E2E2E]">
                      {selectedEmployee.employee?.employee_no || `EMP-${selectedEmployee?.employee?.id}`}
                    </p>
                  </div>
                  <div className="px-3 py-2.5 rounded-xl bg-[#F5ECE4]/70 border border-[#E1D4C7] shadow-sm">
                    <p className="text-[10px] font-bold text-[#734425] uppercase tracking-wider">Status</p>
                    <Badge variant="outline" className={`mt-0.5 text-[10px] h-5 ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>

                {/* Salary Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-heading font-bold text-[#734425] uppercase tracking-widest border-b border-[#E1D4C7] pb-1">Earnings & Deductions</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#F5ECE4]/70 border border-[#E1D4C7] shadow-sm">
                      <p className="text-[10px] font-bold text-[#5C5C5C] uppercase">Base</p>
                      <p className="text-sm font-bold text-[#2E2E2E] mt-0.5">₹{selectedEmployee.base_salary.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5ECE4]/70 border border-[#E1D4C7] shadow-sm text-emerald-600">
                      <p className="text-[10px] font-bold text-[#5C5C5C] uppercase">Bonus</p>
                      <p className="text-sm font-bold mt-0.5">₹{selectedEmployee.bonus.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5ECE4]/70 border border-[#E1D4C7] shadow-sm text-rose-600">
                      <p className="text-[10px] font-bold text-[#5C5C5C] uppercase">Deduction</p>
                      <p className="text-sm font-bold mt-0.5">₹{selectedEmployee.deduction.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Net Salary Highlight */}
                <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white shadow-lg group border border-[#734425]/30">
                  <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-heading font-bold text-[#F5ECE4]/80 uppercase tracking-wider">Net Monthly Salary</p>
                      <p className="text-3xl font-heading font-black mt-1 tracking-tight text-white">
                        ₹{selectedEmployee.net_salary.toLocaleString()}
                      </p>
                    </div>
                    <IndianRupee className="h-12 w-12 text-white/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1 font-bold text-xs py-5 rounded-xl border-[#E1D4C7] text-[#2E2E2E] hover:bg-[#F5ECE4] transition-all uppercase tracking-wider"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-[2] bg-[#734425] hover:bg-[#5D361D] text-white font-bold text-xs py-5 rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider"
                    disabled={loading}
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const resp = await salaryAPI.generateSalary({
                          employee_id: selectedEmployee?.employee?.id,
                        });
                        if (resp.status === 200) {
                          toast({ title: "Success", description: "Payslip generated successfully." });
                          callSalaryHistory();
                          getDashboard();
                        }
                      } catch (error) {
                        console.error(error);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? "Generating..." : "Generate Payslip"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Employee Salary Modal */}
      {/* <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Salary - {selectedEmployee?.employee?.first_name}
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Salary</label>
                  <Input defaultValue={selectedEmployee.base_salary} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bonus</label>
                  <Input defaultValue={selectedEmployee.bonus} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deductions</label>
                  <Input defaultValue={selectedEmployee.deduction} />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-medium">Effective Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !effectiveDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {effectiveDate ? format(effectiveDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={effectiveDate}
                        onSelect={setEffectiveDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Salary Updated",
                      description:
                        "Employee salary has been updated successfully.",
                    });
                    // setShowEditModal(false);
                  }}
                >
                  Update Salary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default Salary;
