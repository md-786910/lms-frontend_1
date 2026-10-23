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

  const getMonthBgClass = (index) =>
    index % 2 === 0 ? "bg-[#FAF6F2]" : "bg-white";

  return (
    <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
      <CardHeader className="pb-4 border-b border-[#E1D4C7] bg-[#FAF6F2] rounded-t-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center space-x-3 pb-2 md:pb-0 font-heading text-[#2E2E2E] text-lg font-bold uppercase tracking-tight">
            <span className="bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
              <Calendar className="h-5 w-5" />
            </span>
            <span>Employee Leave Summary - {year}</span>
          </CardTitle>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#734425]" />
            <span className="text-xs uppercase tracking-wider text-[#734425] font-heading font-bold">Filters:</span>
          </div>

          {/* Year Select */}
          <Select
            value={year.toString()}
            onValueChange={(v) => setYear(parseInt(v))}
          >
            <SelectTrigger className="w-[120px] text-[#2E2E2E] bg-white border border-[#E1D4C7] rounded-xl font-heading font-bold text-xs hover:bg-[#F5ECE4]/60">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
              {Array.from(
                { length: currentYear - 2025 + 1 },
                (_, i) => 2025 + i
              ).map((y) => (
                <SelectItem key={y} value={y.toString()} className="focus:bg-[#F5ECE4] focus:text-[#734425]">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Select */}
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[150px] text-[#2E2E2E] bg-white border border-[#E1D4C7] font-heading font-bold text-xs rounded-xl hover:bg-[#F5ECE4]/60">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value} className="focus:bg-[#F5ECE4] focus:text-[#734425]">
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Employee Select */}
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[190px] text-[#2E2E2E] bg-white border border-[#E1D4C7] rounded-xl font-heading font-bold text-xs hover:bg-[#F5ECE4]/60">
              <Users className="h-4 w-4 mr-2 text-[#734425]" />
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
              <SelectItem value="all" className="focus:bg-[#F5ECE4] focus:text-[#734425]">All Employees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id.toString()} className="focus:bg-[#F5ECE4] focus:text-[#734425]">
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-[#E1D4C7] text-[#2E2E2E] bg-white rounded-xl hover:bg-[#F5ECE4] font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Reset
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        {loading ? (
          <div className="py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E1D4C7]">
            <Table>
              <TableHeader>
                {/* First Header Row */}
                <TableRow className="bg-[#F5ECE4]/80 border-b border-[#E1D4C7]">
                  <TableHead
                    rowSpan={2}
                    className="min-w-[150px] w-[150px] font-heading font-bold text-[#734425] uppercase tracking-wider sticky left-0 bg-[#F5ECE4] z-30 align-middle text-xs"
                  >
                    Employee Name
                  </TableHead>
                  {columnsToShow.map((month, index) => (
                    <TableHead
                      key={month}
                      colSpan={2}
                      className={`font-heading font-bold text-[#2E2E2E] text-center uppercase tracking-wider text-xs ${getMonthBgClass(index)}`}
                    >
                      {month.slice(0, 3).toUpperCase()}
                    </TableHead>
                  ))}

                  <TableHead
                    rowSpan={2}
                    className="font-heading font-bold text-[#734425] uppercase tracking-wider align-middle sticky right-[120px] bg-[#734425]/10 z-30 min-w-[120px] text-center text-xs"
                  >
                    Total Leave
                  </TableHead>

                  <TableHead
                    rowSpan={2}
                    className="font-heading font-bold text-rose-700 uppercase tracking-wider align-middle sticky right-0 bg-rose-50 z-30 min-w-[120px] text-center text-xs"
                  >
                    Total Deduction
                  </TableHead>
                </TableRow>

                {/* Second Header Row */}
                <TableRow>
                  {columnsToShow.map((month, index) => (
                    <Fragment key={`${month}-sub`}>
                      <TableHead
                        className={`text-center min-w-[90px] font-medium font-graphik ${getMonthBgClass(index)}`}
                      >
                        Leave
                      </TableHead>

                      <TableHead
                        className={`text-center min-w-[105px] font-medium font-graphik ${getMonthBgClass(index)}`}
                      >
                        Deduction
                      </TableHead>
                    </Fragment>
                  ))}
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
                          <TableCell className="min-w-[150px] w-[150px] font-medium text-slate-800 sticky left-0 bg-white z-20 font-graphik">
                            {employee.name}
                          </TableCell>
                          {columnsToShow.map((month, monthIndex) => {
                            const monthValue = employee[month] ?? 0;
                            const deductionValue = employee[`${month}_deduction`] ?? 0;

                            return (
                              <Fragment key={month}>
                                <TableCell
                                  className={`text-center ${getMonthBgClass(monthIndex)} ${getValueClass(monthValue)}`}
                                >
                                  {monthValue}
                                </TableCell>

                                <TableCell
                                  className={`text-center ${getMonthBgClass(monthIndex)} ${getValueClass(
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
                            className={`text-center font-semibold bg-blue-50 sticky right-[120px] z-20 ${totalClass}`}
                          >
                            {totalValue}
                          </TableCell>
                          <TableCell
                            className={`text-center font-semibold bg-rose-50 sticky right-0 z-20 ${getValueClass(
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
                      className="text-center py-8 text-slate-500 font-graphik"
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
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#FAF6F2] rounded-2xl shadow-2xl mx-4 flex flex-col overflow-hidden border border-[#E1D4C7]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white">
              <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight flex items-center gap-2.5">
                <Calendar className="h-5 w-5 text-[#F5ECE4]" />
                Employee Leave Summary - {year}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filters in Modal */}
            <div className="flex flex-wrap gap-4 p-4 border-b border-[#E1D4C7] bg-[#F5ECE4]/60">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#734425]" />
                <span className="text-xs font-heading font-bold uppercase text-[#734425]">Filters:</span>
              </div>

              <Select
                value={year.toString()}
                onValueChange={(v) => setYear(parseInt(v))}
              >
                <SelectTrigger className="w-[120px] bg-white border-[#E1D4C7] text-xs font-heading font-bold rounded-xl">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
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
                              className={`text-center font-semibold bg-blue-50 ${employee.total > 0
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
                            className={`text-center bg-blue-100 ${grandTotal > 0
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
