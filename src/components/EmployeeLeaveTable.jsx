import { Fragment, useEffect, useState } from "react";
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
      (sum, emp) => sum + (emp[month] ?? 0),
      0
    );
  });
  const grandTotal = summaryData.reduce(
    (sum, emp) => sum + (emp.total ?? 0),
    0
  );
  const grandTotalDeduction = summaryData.reduce(
    (sum, emp) => sum + (emp.total_deduction ?? 0),
    0
  );

  const getValueClass = (value, positiveClass = "text-orange-600") =>
    value > 0 ? `${positiveClass} font-medium` : "text-slate-400";

  return (
    <Card className="border border-slate-200 shadow-sm rounded-md">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center space-x-2 pb-4 md:pb-4 font-montserrat text-slate-900 text-lg font-bold">
            <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center font-montserrat rounded-md">
              <Calendar className="h-5 w-5" />
            </span>
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
            <Filter className="h-4 w-4 text-slate-900" />
            <span className="text-sm text-slate-900 font-montserrat font-semibold">Filters:</span>
          </div>

          {/* Year Select */}
          <Select
            value={year.toString()}
            onValueChange={(v) => setYear(parseInt(v))}
          >
            <SelectTrigger className="w-[120px] text-gray-500 bg-gray-50 rounded-md font-montserrat hover:bg-gray-100 hover:text-gray-500">
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
            <SelectTrigger className="w-[150px] text-gray-500 bg-gray-50 font-montserrat rounded-md hover:bg-gray-100 hover:text-gray-500">
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
            <SelectTrigger className="w-[180px] text-gray-500 bg-gray-50 rounded-md font-montserrat hover:bg-gray-100 hover:text-gray-500">
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
            className="px-4 py-2 border border-slate-300 text-gray-500 bg-gray-50 rounded-md hover:bg-gray-100 font-montserrat hover:text-gray-500"
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
                  <TableHead className="font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10 font-montserrat">
                    Employee Name
                  </TableHead>
                  {columnsToShow.map((month) => (
                    <Fragment key={month}>
                      <TableHead
                        className="font-semibold text-slate-700 text-center capitalize min-w-[90px] font-montserrat"
                      >
                        {month.slice(0, 3).toUpperCase()} Availed
                      </TableHead>
                      <TableHead
                        className="font-semibold text-slate-700 text-center capitalize min-w-[105px] font-montserrat"
                      >
                        {month.slice(0, 3).toUpperCase()} Deduction
                      </TableHead>
                    </Fragment>
                  ))}
                  <TableHead className="font-semibold text-slate-700 text-center bg-blue-50 font-montserrat">
                    Total Availed
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center bg-rose-50 font-montserrat">
                    Total Deduction
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryData.length > 0 ? (
                  <>
                    {summaryData.map((employee, index) => {
                      const totalValue = employee.total ?? 0;
                      const totalClass =
                        totalValue > 0
                          ? "text-blue-700"
                          : totalValue < 0
                          ? "text-rose-600"
                          : "text-slate-400";
                      return (
                        <TableRow
                          key={employee.employee_id || index}
                          className="hover:bg-slate-50"
                        >
                          <TableCell className="font-medium text-slate-800 sticky left-0 bg-white z-10 font-montserrat">
                            {employee.name}
                          </TableCell>
                          {columnsToShow.map((month) => {
                            const monthValue = employee[month] ?? 0;
                            const deductionValue =
                              employee[`${month}_deduction`] ?? 0;
                            return (
                              <Fragment key={month}>
                                <TableCell
                                  className={`text-center ${getValueClass(monthValue)}`}
                                >
                                  {monthValue}
                                </TableCell>
                                <TableCell
                                  className={`text-center ${getValueClass(
                                    deductionValue,
                                    "text-rose-600"
                                  )}`}
                                >
                                  {deductionValue}
                                </TableCell>
                              </Fragment>
                            );
                          })}
                          <TableCell
                            className={`text-center font-semibold bg-blue-50 ${totalClass}`}
                          >
                            {totalValue}
                          </TableCell>
                          <TableCell
                            className={`text-center font-semibold bg-rose-50 ${getValueClass(
                              employee.total_deduction ?? 0,
                              "text-rose-600"
                            )}`}
                          >
                            {employee.total_deduction ?? 0}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                      colSpan={columnsToShow.length * 2 + 3}
                      className="text-center py-8 text-slate-500 font-montserrat"
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
            <div className="flex justify-between items-center px-6 py-4 border-b bg-primary text-white rounded-t-lg">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Employee Leave Summary - {year}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white text-2xl font-bold transition duration-200"
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
                        <Fragment key={month}>
                          <TableHead
                            className="font-semibold text-slate-700 text-center capitalize min-w-[90px]"
                          >
                            {month.slice(0, 3).toUpperCase()} Availed
                          </TableHead>
                          <TableHead
                            className="font-semibold text-slate-700 text-center capitalize min-w-[105px]"
                          >
                            {month.slice(0, 3).toUpperCase()} Deduction
                          </TableHead>
                        </Fragment>
                      ))}
                      <TableHead className="font-semibold text-slate-700 text-center bg-blue-50">
                        Total Availed
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center bg-rose-50">
                        Total Deduction
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
                              <Fragment key={month}>
                                <TableCell
                                  className={`text-center ${getValueClass(employee[month] ?? 0)}`}
                                >
                                  {employee[month] || 0}
                                </TableCell>
                                <TableCell
                                  className={`text-center ${getValueClass(
                                    employee[`${month}_deduction`] ?? 0,
                                    "text-rose-600"
                                  )}`}
                                >
                                  {employee[`${month}_deduction`] || 0}
                                </TableCell>
                              </Fragment>
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
                            <TableCell
                              className={`text-center font-semibold bg-rose-50 ${getValueClass(
                                employee.total_deduction ?? 0,
                                "text-rose-600"
                              )}`}
                            >
                              {employee.total_deduction || 0}
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
                              (sum, emp) => sum + (emp[month] ?? 0),
                              0
                            );
                            const deductionTotal = summaryData.reduce(
                              (sum, emp) =>
                                sum + (emp[`${month}_deduction`] ?? 0),
                              0
                            );
                            const totalClass =
                              total > 0
                                ? "text-slate-900"
                                : total < 0
                                ? "text-rose-600"
                                : "text-slate-500";
                            return (
                              <Fragment key={month}>
                                <TableCell
                                  className={`text-center ${totalClass}`}
                                >
                                  {total}
                                </TableCell>
                                <TableCell
                                  className={`text-center ${getValueClass(
                                    deductionTotal,
                                    "text-rose-600"
                                  )}`}
                                >
                                  {deductionTotal}
                                </TableCell>
                              </Fragment>
                            );
                          })}
                          <TableCell
                            className={`text-center bg-blue-100 ${
                              grandTotal > 0
                                ? "text-blue-700"
                                : grandTotal < 0
                                ? "text-rose-600"
                                : "text-slate-500"
                            }`}
                          >
                            {grandTotal}
                          </TableCell>
                          <TableCell
                            className={`text-center bg-rose-100 ${getValueClass(
                              grandTotalDeduction,
                              "text-rose-600"
                            )}`}
                          >
                            {grandTotalDeduction}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={26}
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
