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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Salary Management
          </h1>
          <p className="text-slate-600">Manage employee salaries and payroll</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          {/* <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleProcessPayroll}
          >
            Process Payroll
          </Button> */}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Payroll
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  ₹{dashboard?.total_netpay?.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Paid Amount
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{dashboard?.paid_amount?.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Pending Amount
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{dashboard?.pending_amount?.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Employees</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboard?.employee_count}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"current"}>Current Month</SelectItem>
                <SelectItem value={1}>January</SelectItem>
                <SelectItem value={2}>February</SelectItem>
                <SelectItem value={3}>March</SelectItem>
                <SelectItem value={4}>April</SelectItem>
                <SelectItem value={5}>May</SelectItem>
                <SelectItem value={6}>June</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative ">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>
            Salary Details
            {loading ? "Loading..." : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Employee
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Position
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">
                    Base Salary
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
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-slate-800">
                            {first_name + " " + last_name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {employee_no || `EMP-${salary?.employee?.id}`}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {salary.employee?.designation?.title || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-right text-slate-800">
                        ₹{salary.base_salary.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-green-600">
                        ₹{salary.bonus.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-red-600">
                        ₹{salary.deduction.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-800">
                        ₹{salary.net_salary.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className={getStatusColor(salary.status)}>
                          {salary.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-space-between space-x-2">
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
        </CardContent>
      </Card>

      {/* View Employee Salary Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Salary Details - {selectedEmployee?.employee?.first_name}
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Employee ID</p>
                  <p className="font-medium">
                    {selectedEmployee.employee?.employee_no ||
                      `EMP-${selectedEmployee?.employee?.id}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Position</p>
                  <p className="font-medium">
                    {selectedEmployee.employee?.designation?.title || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Base Salary</p>
                  <p className="font-medium text-green-600">
                    ₹{selectedEmployee.base_salary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bonus</p>
                  <p className="font-medium text-blue-600">
                    ₹{selectedEmployee.bonus.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Deductions</p>
                  <p className="font-medium text-red-600">
                    ₹{selectedEmployee.deduction.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Net Salary</p>
                  <p className="font-medium text-slate-800">
                    ₹{selectedEmployee.net_salary.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  className="flex-1"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const resp = await salaryAPI.generateSalary({
                        employee_id: selectedEmployee?.employee?.id,
                      });
                      if (resp.status == 200) {
                        toast({
                          title: "Payslip Generated",
                          description:
                            "Payslip has been generated successfully.",
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
                  {loading ? "Loading..." : "Generate Payslip"}
                </Button>
                {/* <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    toast({
                      title: "Email Sent",
                      description: "Payslip has been sent via email.",
                    })
                  }
                >
                  Send via Email
                </Button> */}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
