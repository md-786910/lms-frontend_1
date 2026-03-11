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
  X
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
        <Card className="border border-slate-200 shadow-lg rounded-md bg-slate-900 text-white">
          <CardContent className="p-5 md:p-7">
            <div className="grid grid-cols-12 items-center gap-4 relative">
              <div className="col-span-12 md:col-span-8 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold font-montserrat text-[#FFFFFF]">
                    Salary Management
                  </h1>
                </div>
                <p className="text-[#FFFFFF] font-medium text-sm font-montserrat">
                  Manage employee salaries, payouts, and monthly payroll flows with a clear snapshot of totals.
                </p>
              </div>
              <div className="flex items-center gap-3 absolute right-5 top-1/2 -translate-y-1/2">
                <Button
                  className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
                  onClick={handleExportReport}
                >
                  <Download className="h-4 w-4 text-slate-500" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border border-slate-200 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold font-montserrat">
                    Total Payroll
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 font-montserrat">
                    ₹{dashboard?.total_netpay?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold font-montserrat">
                    Paid Amount
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 font-montserrat">
                    ₹{dashboard?.paid_amount?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold font-montserrat">
                    Pending Amount
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 font-montserrat">
                    ₹{dashboard?.pending_amount?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold font-montserrat">Employees</p>
                  <p className="text-2xl font-semibold text-slate-900 font-montserrat">
                    {dashboard?.employee_count}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-700">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Search and Filters */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-11 border-slate-200 rounded-xl font-medium">
                <SelectValue placeholder="Filter by Status" className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat" />
              </SelectTrigger>
              <SelectContent className="border border-slate-200 focus:border-slate-900 transition-all font-montserrat">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-40 h-11 border-slate-200 rounded-xl font-medium">
                <SelectValue placeholder="Filter by Month" className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat" />
              </SelectTrigger>
              <SelectContent className="border border-slate-200 focus:border-slate-900 transition-all font-montserrat">
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
                className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white font-montserrat mb-1 h-11 rounded-xl"
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
      <div className="p-6 bg-[#FFFFFF] border border-slate-200 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 text-2xl font-bold text-slate-700 font-montserrat capitalize tracking-wider mb-5 border-b border-gray-100 pb-3">
          <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-full">
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
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-montserrat">
                    Employee
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-montserrat">
                    Position
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-montserrat">
                    Base Salary
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-montserrat">
                    Bonus
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-montserrat">
                    Deductions
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-montserrat">
                    Net Salary
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-montserrat">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-start text-slate-700 font-montserrat">
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
                      <td className="py-4 px-4 text-start text-slate-600 font-montserrat">
                        <div>
                          <p className="font-medium text-slate-800 font-montserrat">
                            {first_name + " " + last_name}
                          </p>
                          <p className="text-xs text-slate-500 font-montserrat">
                            {employee_no || `EMP-${salary?.employee?.id}`}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-start text-slate-600 font-montserrat">
                        {salary.employee?.designation?.title || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-start text-slate-800 font-montserrat">
                        ₹{salary.base_salary.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-start text-green-600 font-montserrat">
                        ₹{salary.bonus.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-start text-red-600 font-montserrat">
                        ₹{salary.deduction.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-start font-semibold text-slate-800 font-montserrat">
                        ₹{salary.net_salary.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-start font-montserrat">
                        <Badge className={getStatusColor(salary.status)}>
                          {salary.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-start font-montserrat">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md font-[Montserrat]">
          {/* Modal */}
          <div className="relative w-full max-w-2xl rounded-md bg-white/90 backdrop-blur-md shadow-md">
            <div className="bg-slate-900 text-white">
              <div className="p-3 md:p-4">
                <div className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-12 md:col-span-8 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-8 w-8 items-center justify-center rounded-md mr-2">
                          <AlarmClockMinus className="h-4 w-4" />
                        </span>
                        <div className="space-y-0.5">
                          <h2 className="text-lg font-semibold font-montserrat text-[#FFFFFF] tracking-tight">
                            {selectedEmployee?.employee?.first_name}
                          </h2>
                          <p className="text-[#FFFFFF] font-montserrat text-sm">
                            {selectedEmployee?.employee?.designation?.title || "Employee"}
                          </p>
                        </div>
                      </div>
                    </div>
                  <div className="col-span-12 md:col-span-4 flex md:justify-end pb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowViewModal(false)}
                      className="rounded-md hover:bg-slate-100 bg-[#e2e8f0] text-slate-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {selectedEmployee && (
              <div className="space-y-6 p-7">
              
                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-6">
            
                  <div className="p-4 rounded-xl bg-slate-50 border">
                    <p className="text-xs text-slate-500">Employee ID</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {selectedEmployee.employee?.employee_no ||
                        `EMP-${selectedEmployee?.employee?.id}`}
                    </p>
                  </div>
                      
                  <div className="p-4 rounded-xl bg-slate-50 border">
                    <p className="text-xs text-slate-500">Position</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {selectedEmployee.employee?.designation?.title || "N/A"}
                    </p>
                  </div>
                      
                </div>
                      
                {/* Salary Cards */}
                <div className="grid grid-cols-2 gap-4">
                      
                  <div className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                    <p className="text-xs text-slate-500">Base Salary</p>
                    <p className="text-lg font-semibold text-emerald-600 mt-1">
                      ₹{selectedEmployee.base_salary.toLocaleString()}
                    </p>
                  </div>
                      
                  <div className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                    <p className="text-xs text-slate-500">Bonus</p>
                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      ₹{selectedEmployee.bonus.toLocaleString()}
                    </p>
                  </div>
                      
                  <div className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                    <p className="text-xs text-slate-500">Deductions</p>
                    <p className="text-lg font-semibold text-red-500 mt-1">
                      ₹{selectedEmployee.deduction.toLocaleString()}
                    </p>
                  </div>
                      
                  {/* Net Salary Highlight */}
                  <div className="p-5 rounded-2xl text-white bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                    <p className="text-xs opacity-80">Net Salary</p>
                    <p className="text-2xl font-bold mt-1">
                      ₹{selectedEmployee.net_salary.toLocaleString()}
                    </p>
                  </div>
                      
                </div>
                      
                {/* Generate Button */}
                <div className="pt-2">
                  <button
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const resp = await salaryAPI.generateSalary({
                          employee_id: selectedEmployee?.employee?.id,
                        });
                      
                        if (resp.status === 200) {
                          toast({
                            title: "Payslip Generated",
                            description: "Payslip generated successfully.",
                          });
                        
                          callSalaryHistory();
                          getDashboard();
                        }
                      } catch (error) {
                        console.log(error);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? "Generating..." : "Generate Payslip"}
                  </button>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Effective Date</label>
                  <Input type="date" />
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
