import { useEffect, useState } from "react";
import { Calendar, Filter, Users, Eye, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { leaveApi } from "../api/leave/leave";
import LoadingSpinner from "./LoadingSpinner";

const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const MONTH_KEYS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const EmployeeLeaveTable = () => {
  const currentYear = new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [year, setYear] = useState(currentYear);
  const [showModal, setShowModal] = useState(false);

  const fetchLeaveSummary = async () => {
    setLoading(true);
    try {
      const params = { year };
      if (selectedMonth !== "all") {
        params.month = selectedMonth;
      }
      if (selectedEmployee !== "all") {
        params.employee_id = selectedEmployee;
      }

      const response = await leaveApi.getYearlySummary(params);
      if (response.data?.status) {
        setSummaryData(response.data?.data?.summary || []);
        if (response.data?.data?.employees) {
          setEmployees(response.data.data.employees);
        }
      }
    } catch (error) {
      console.error("Error fetching leave summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveSummary();
  }, [year, selectedMonth, selectedEmployee]);

  const handleViewAllLeaves = () => {
    setShowModal(true);
  };

  const handleResetFilters = () => {
    setSelectedMonth("all");
    setSelectedEmployee("all");
    setYear(currentYear);
  };

  // Get columns to show based on filter
  const getColumnsToShow = () => {
    if (selectedMonth !== "all") {
      const monthIndex = parseInt(selectedMonth) - 1;
      return [MONTH_KEYS[monthIndex]];
    }
    return MONTH_KEYS;
  };

  const columnsToShow = getColumnsToShow();

  // Calculate column totals
  const columnTotals = {};
  columnsToShow.forEach((month) => {
    columnTotals[month] = summaryData.reduce(
      (sum, emp) => sum + (emp[month] || 0),
      0
    );
  });
  const grandTotal = summaryData.reduce(
    (sum, emp) => sum + (emp.total || 0),
    0
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Employee Leave Summary - {year}</span>
          </CardTitle>
          {/* <button
            onClick={handleViewAllLeaves}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            <Eye className="h-4 w-4" />
            View All Leaves
          </button> */}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600">Filters:</span>
          </div>

          {/* Year Select */}
          <Select
            value={year.toString()}
            onValueChange={(v) => setYear(parseInt(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: currentYear - 2025 + 1 },
                (_, i) => 2025 + i
              ).map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Select */}
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Employee Select */}
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[180px]">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id.toString()}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10">
                    Employee Name
                  </TableHead>
                  {columnsToShow.map((month) => (
                    <TableHead
                      key={month}
                      className="font-semibold text-slate-700 text-center capitalize min-w-[80px]"
                    >
                      {month.slice(0, 3).toUpperCase()}
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold text-slate-700 text-center bg-blue-50">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryData.length > 0 ? (
                  <>
                    {summaryData.map((employee, index) => (
                      <TableRow
                        key={employee.employee_id || index}
                        className="hover:bg-slate-50"
                      >
                        <TableCell className="font-medium text-slate-800 sticky left-0 bg-white z-10">
                          {employee.name}
                        </TableCell>
                        {columnsToShow.map((month) => (
                          <TableCell
                            key={month}
                            className={`text-center ${
                              employee[month] > 0
                                ? "text-orange-600 font-medium"
                                : "text-slate-400"
                            }`}
                          >
                            {employee[month] || 0}
                          </TableCell>
                        ))}
                        <TableCell
                          className={`text-center font-semibold bg-blue-50 ${
                            employee.total > 0
                              ? "text-blue-700"
                              : "text-slate-400"
                          }`}
                        >
                          {employee.total || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totals Row */}
                    {/* <TableRow className="bg-slate-100 font-semibold border-t-2">
                      <TableCell className="sticky left-0 bg-slate-100 z-10 text-slate-800">
                        Total
                      </TableCell>
                      {columnsToShow.map((month) => (
                        <TableCell
                          key={month}
                          className="text-center text-slate-700"
                        >
                          {columnTotals[month] || 0}
                        </TableCell>
                      ))}
                      <TableCell className="text-center text-blue-700 bg-blue-100">
                        {grandTotal}
                      </TableCell>
                    </TableRow> */}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columnsToShow.length + 2}
                      className="text-center py-8 text-slate-500"
                    >
                      No leave data found for the selected filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Modal for View All Leaves */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          />
          {/* Modal Content */}
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-2xl mx-4 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Employee Leave Summary - {year}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-red-200 text-2xl font-bold transition duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Filters in Modal */}
            <div className="flex flex-wrap gap-4 p-4 border-b bg-slate-50">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Filters:</span>
              </div>

              <Select
                value={year.toString()}
                onValueChange={(v) => setYear(parseInt(v))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger className="w-[180px]">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto p-4">
              {loading ? (
                <div className="py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10">
                        Employee Name
                      </TableHead>
                      {MONTH_KEYS.map((month) => (
                        <TableHead
                          key={month}
                          className="font-semibold text-slate-700 text-center capitalize min-w-[80px]"
                        >
                          {month.slice(0, 3).toUpperCase()}
                        </TableHead>
                      ))}
                      <TableHead className="font-semibold text-slate-700 text-center bg-blue-50">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.length > 0 ? (
                      <>
                        {summaryData.map((employee, index) => (
                          <TableRow
                            key={employee.employee_id || index}
                            className="hover:bg-slate-50"
                          >
                            <TableCell className="font-medium text-slate-800 sticky left-0 bg-white z-10">
                              {employee.name}
                            </TableCell>
                            {MONTH_KEYS.map((month) => (
                              <TableCell
                                key={month}
                                className={`text-center ${
                                  employee[month] > 0
                                    ? "text-orange-600 font-medium"
                                    : "text-slate-400"
                                }`}
                              >
                                {employee[month] || 0}
                              </TableCell>
                            ))}
                            <TableCell
                              className={`text-center font-semibold bg-blue-50 ${
                                employee.total > 0
                                  ? "text-blue-700"
                                  : "text-slate-400"
                              }`}
                            >
                              {employee.total || 0}
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* Totals Row */}
                        <TableRow className="bg-slate-100 font-semibold border-t-2">
                          <TableCell className="sticky left-0 bg-slate-100 z-10 text-slate-800">
                            Total
                          </TableCell>
                          {MONTH_KEYS.map((month) => {
                            const total = summaryData.reduce(
                              (sum, emp) => sum + (emp[month] || 0),
                              0
                            );
                            return (
                              <TableCell
                                key={month}
                                className="text-center text-slate-700"
                              >
                                {total}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center text-blue-700 bg-blue-100">
                            {grandTotal}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={14}
                          className="text-center py-8 text-slate-500"
                        >
                          No leave data found for the selected filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EmployeeLeaveTable;
