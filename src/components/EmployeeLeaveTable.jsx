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
import { Button } from "@/components/ui/button";

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
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center space-x-2 text-base font-medium">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Employee Leave Summary - {year}</span>
          </CardTitle>
          <Button
            onClick={handleViewAllLeaves}
            variant="outline"
            className="hidden md:flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View All Leaves
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>

          {/* Year Select */}
          <Select
            value={year.toString()}
            onValueChange={(v) => setYear(parseInt(v))}
          >
            <SelectTrigger className="w-[120px] bg-background">
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
            <SelectTrigger className="w-[150px] bg-background">
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
            <SelectTrigger className="w-[180px] bg-background">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
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
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="text-muted-foreground hover:text-primary"
          >
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-muted-foreground sticky left-0 bg-muted/50 z-10 w-[200px]">
                    Employee Name
                  </TableHead>
                  {columnsToShow.map((month) => (
                    <TableHead
                      key={month}
                      className="font-semibold text-muted-foreground text-center capitalize min-w-[60px] text-xs"
                    >
                      {month.slice(0, 3).toUpperCase()}
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold text-primary text-center bg-primary/5 min-w-[80px]">
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
                        className="hover:bg-muted/30 transition-colors border-b border-border"
                      >
                        <TableCell className="font-medium text-foreground sticky left-0 bg-background z-10">
                          {employee.name}
                        </TableCell>
                        {columnsToShow.map((month) => (
                          <TableCell
                            key={month}
                            className={`text-center ${
                              employee[month] > 0
                                ? "text-destructive font-semibold"
                                : "text-muted-foreground/30"
                            }`}
                          >
                            {employee[month] > 0 ? employee[month] : "-"}
                          </TableCell>
                        ))}
                        <TableCell
                          className={`text-center font-bold bg-primary/5 ${
                            employee.total > 0
                              ? "text-primary"
                              : "text-muted-foreground/50"
                          }`}
                        >
                          {employee.total || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columnsToShow.length + 2}
                      className="text-center py-8 text-muted-foreground"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-card rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden animate-enter">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Employee Leave Summary - {year}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Filters in Modal */}
            <div className="flex flex-wrap gap-4 p-4 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
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

              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="text-muted-foreground"
              >
                Reset
              </Button>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto p-0">
              {loading ? (
                <div className="py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold text-muted-foreground sticky left-0 bg-muted/50 z-10 w-[200px]">
                        Employee Name
                      </TableHead>
                      {MONTH_KEYS.map((month) => (
                        <TableHead
                          key={month}
                          className="font-semibold text-muted-foreground text-center capitalize min-w-[60px] text-xs"
                        >
                          {month.slice(0, 3).toUpperCase()}
                        </TableHead>
                      ))}
                      <TableHead className="font-semibold text-primary text-center bg-primary/5 min-w-[80px]">
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
                            className="hover:bg-muted/30 transition-colors border-b border-border"
                          >
                            <TableCell className="font-medium text-foreground sticky left-0 bg-background z-10">
                              {employee.name}
                            </TableCell>
                            {MONTH_KEYS.map((month) => (
                              <TableCell
                                key={month}
                                className={`text-center ${
                                  employee[month] > 0
                                    ? "text-destructive font-semibold"
                                    : "text-muted-foreground/30"
                                }`}
                              >
                                {employee[month] > 0 ? employee[month] : "-"}
                              </TableCell>
                            ))}
                            <TableCell
                              className={`text-center font-bold bg-primary/5 ${
                                employee.total > 0
                                  ? "text-primary"
                                  : "text-muted-foreground/50"
                              }`}
                            >
                              {employee.total || 0}
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* Totals Row */}
                        <TableRow className="bg-muted/30 font-semibold border-t-2 border-border">
                          <TableCell className="sticky left-0 bg-muted/30 z-10 text-foreground">
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
                                className="text-center text-muted-foreground"
                              >
                                {total}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center text-primary bg-primary/10">
                            {grandTotal}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={14}
                          className="text-center py-8 text-muted-foreground"
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