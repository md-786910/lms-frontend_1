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
  Eye,
  CircleAlert,
  FilePlus,
  DownloadIcon,
  Upload,
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
      return "bg-green-100 text-green-700 hover:bg-green-200";
    case "pending":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200";
    case "processing":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-200";
  }
};

const tooltip = {
  children:
    "You can import all employees into the salary module manually by using this button if they are not imported automatically.",
};

const Salary = () => {
  const currentMonth = dayjs().month() + 1;
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("current");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryDatas, setSalaryDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState({});

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Salary report has been exported successfully.",
    });
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
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

  const StatCard = ({ title, value, icon: Icon, colorClass, iconBgClass }) => (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <p className={`text-2xl font-bold ${colorClass}`}>
              {title === "Employees" ? value : `₹${value?.toLocaleString()}`}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${iconBgClass}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <DollarSign className="h-6 w-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-bold">Salary Management</h1>
                <p className="text-blue-100 text-sm">Manage employee salaries and payroll</p>
             </div>
          </div>
          <Button 
            onClick={handleExportReport} 
            className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-md"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Payroll" 
          value={dashboard?.total_netpay} 
          icon={DollarSign} 
          colorClass="text-slate-800" 
          iconBgClass="bg-gradient-to-r from-blue-500 to-blue-600" 
        />
        <StatCard 
          title="Paid Amount" 
          value={dashboard?.paid_amount} 
          icon={TrendingUp} 
          colorClass="text-green-600" 
          iconBgClass="bg-gradient-to-r from-green-500 to-green-600" 
        />
        <StatCard 
          title="Pending Amount" 
          value={dashboard?.pending_amount} 
          icon={Calendar} 
          colorClass="text-amber-600" 
          iconBgClass="bg-gradient-to-r from-amber-500 to-amber-600" 
        />
        <StatCard 
          title="Employees" 
          value={dashboard?.employee_count} 
          icon={Users} 
          colorClass="text-purple-600" 
          iconBgClass="bg-gradient-to-r from-purple-500 to-purple-600" 
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"current"}>Current Month</SelectItem>
                {[...Array(12)].map((_, i) => (
                   <SelectItem key={i + 1} value={i + 1}>{dayjs().month(i).format("MMMM")}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
               <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-50 text-slate-600"
                    onClick={async () => {
                      const resp = await salaryAPI.importCurrentSalaryManually();
                      if (resp.status == 200) {
                        callSalaryHistory();
                      }
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs max-w-[200px]">
                  {tooltip.children}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
      </div>

      {/* Salary Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Salary Records
            {loading && <span className="text-sm font-normal text-slate-500 ml-2 animate-pulse">Updating...</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-medium">
                <tr>
                  <th className="text-left py-3 px-6">Employee</th>
                  <th className="text-left py-3 px-6">Position</th>
                  <th className="text-right py-3 px-6">Base Salary</th>
                  <th className="text-right py-3 px-6">Bonus</th>
                  <th className="text-right py-3 px-6">Deductions</th>
                  <th className="text-right py-3 px-6">Net Salary</th>
                  <th className="text-center py-3 px-6">Status</th>
                  <th className="text-center py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
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
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {first_name + " " + last_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {employee_no || `EMP-${salary?.employee?.id}`}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        {salary.employee?.designation?.title || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-right text-sm text-slate-600">
                        ₹{salary.base_salary.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right text-sm text-green-600">
                        ₹{salary.bonus.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right text-sm text-red-500">
                        -₹{salary.deduction.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-slate-800 text-sm">
                        ₹{salary.net_salary.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Badge variant="secondary" className={getStatusColor(salary.status)}>
                          {salary.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => handleViewEmployee(salary)}
                                >
                                  <FilePlus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Generate/View Details</TooltipContent>
                          </Tooltip>
                          
                          {salary?.salary_slip && (
                             <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                                  onClick={() => {
                                    handleDownloadSalary(
                                      salary?.employee_id,
                                      salary?.month_in_digit
                                    );
                                  }}
                                >
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download Slip</TooltipContent>
                            </Tooltip>
                          )}
                          
                          <Tooltip>
                             <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                                  onClick={async () => {
                                    try {
                                      const response = await axiosInstance.get(
                                        "/company/salary/view",
                                        {
                                          params: {
                                            employee_id: salary?.employee_id,
                                            month_in_digit: salary?.month_in_digit,
                                          },
                                          responseType: "blob",
                                          headers: {
                                            Accept: "application/pdf",
                                          },
                                        }
                                      );
                                      const fileURL = URL.createObjectURL(
                                        new Blob([response.data], { type: "application/pdf" })
                                      );
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
                             </TooltipTrigger>
                             <TooltipContent>Preview PDF</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {salaryDatas?.length === 0 && (
                <div className="py-12">
                   <NoDataFound />
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Employee Salary Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="flex items-center gap-2">
               <DollarSign className="h-5 w-5 text-blue-600" />
               <span>Salary Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="font-bold text-lg text-slate-800">{selectedEmployee.employee?.first_name} {selectedEmployee.employee?.last_name}</h3>
                    <p className="text-sm text-slate-500">{selectedEmployee.employee?.designation?.title || "N/A"}</p>
                 </div>
                 <Badge variant="outline" className="text-slate-500">
                    {selectedEmployee.employee?.employee_no || `EMP-${selectedEmployee?.employee?.id}`}
                 </Badge>
              </div>

              <div className="space-y-3 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Base Salary</span>
                    <span className="font-semibold text-slate-800">₹{selectedEmployee.base_salary.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Bonus</span>
                    <span className="font-semibold text-green-600">+ ₹{selectedEmployee.bonus.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Deductions</span>
                    <span className="font-semibold text-red-500">- ₹{selectedEmployee.deduction.toLocaleString()}</span>
                 </div>
                 <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Net Salary</span>
                    <span className="font-bold text-lg text-blue-600">₹{selectedEmployee.net_salary.toLocaleString()}</span>
                 </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const resp = await salaryAPI.generateSalary({
                      employee_id: selectedEmployee?.employee?.id,
                    });
                    if (resp.status == 200) {
                      toast({
                        title: "Payslip Generated",
                        description: "Payslip has been generated successfully.",
                      });
                      callSalaryHistory();
                      getDashboard();
                      setShowViewModal(false);
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                    <>
                     <span className="animate-spin mr-2">⟳</span> Processing...
                    </>
                ) : (
                    <>
                     <FilePlus className="h-4 w-4 mr-2" /> Generate Payslip
                    </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Salary;
