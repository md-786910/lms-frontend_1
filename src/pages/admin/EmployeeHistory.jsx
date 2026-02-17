import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoDataFound from "../../common/NoDataFound";
import { employeeAPI } from "../../api/employeeApi";
import { leaveApi } from "../../api/leave/leave";
import { formatLeaveDays } from "../../utility/utility";

const statusStyles = {
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  rejected: "bg-rose-50 text-rose-700 border border-rose-100",
  other: "bg-slate-50 text-slate-700 border border-slate-100",
};

const parseLeaveDays = (leave) => {
  if (!leave?.leave_on) return [];
  try {
    return JSON.parse(leave.leave_on);
  } catch (error) {
    console.warn("Failed to parse leave_on payload", error);
    return [];
  }
};

const getInitials = (employee) => {
  if (!employee) return "EE";
  const firstInitial = employee.first_name?.[0] ?? "";
  const lastInitial = employee.last_name?.[0] ?? "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase().trim();
  return initials || "EE";
};

const EmployeeHistory = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");

  useEffect(() => {
    if (!employeeId) {
      setError("Employee ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const [employeeResp, leaveResp] = await Promise.all([
          employeeAPI.getById(employeeId),
          leaveApi.getLeaveRequest("", { employee_id: employeeId }),
        ]);

        let employeeData = employeeResp?.data ?? null;

        // Fallback: some employee-by-id responses don't include leave balances.
        // Pull the same enriched object the list view uses (includes employee_leaves)
        // so totals stay consistent across pages.
        if (employeeData && !(employeeData.employee_leaves?.length > 0)) {
          try {
            const listResp = await employeeAPI.getAll();
            const fromList = listResp?.data?.find(
              (emp) => String(emp.id) === String(employeeId)
            );
            if (fromList?.employee_leaves?.length) {
              employeeData = { ...fromList, ...employeeData };
            }
          } catch (listErr) {
            console.warn("Fallback fetch for leave balances failed", listErr);
          }
        }

        setEmployee(employeeData);
        setLeaveRecords(leaveResp?.data?.data ?? []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "We couldn't load the employee leave history. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [employeeId]);

  const leaveTypeOptions = useMemo(() => {
    const types = new Set();
    leaveRecords.forEach((leave) => {
      const typeLabel = leave?.leave_type?.leave_type;
      if (typeLabel) {
        types.add(typeLabel);
      }
    });
    return Array.from(types);
  }, [leaveRecords]);

  const leaveSummary = useMemo(() => {
    // Base calculation mirrors the employee card
    const aggregated = (employee?.employee_leaves ?? []).reduce(
      (acc, leave) => {
        acc.total += Number(leave?.leave_count) || 0;
        acc.used += Number(leave?.leave_used) || 0;
        acc.remaining += Number(leave?.leave_remaing) || 0;
        return acc;
      },
      { total: 0, used: 0, remaining: 0 }
    );

    // Live adjustment from the current leave records so the summary reacts
    // immediately to approve/reject/edit/delete flows.
    const approvedUsed = leaveRecords.reduce((acc, leave) => {
      const isApproved = (leave?.status ?? "").toLowerCase() === "approved";
      return isApproved ? acc + (Number(leave?.total_days) || 0) : acc;
    }, 0);

    const dynamicUsed = approvedUsed || aggregated.used;
    const baselineRemaining =
      aggregated.remaining ?? aggregated.total - aggregated.used;
    const dynamicRemaining =
      baselineRemaining - (dynamicUsed - aggregated.used);

    return {
      total: aggregated.total,
      used: dynamicUsed,
      remaining: dynamicRemaining,
    };
  }, [employee, leaveRecords]);

  const filteredLeaves = useMemo(() => {
    let results = leaveRecords;

    const normalizedStatus = statusFilter?.toLowerCase() ?? "all";
    if (normalizedStatus !== "all") {
      results = results.filter(
        (leave) => (leave?.status ?? "").toLowerCase() === normalizedStatus
      );
    }

    const normalizedTypeFilter = leaveTypeFilter?.toLowerCase() ?? "all";
    if (normalizedTypeFilter !== "all") {
      results = results.filter(
        (leave) =>
          (leave?.leave_type?.leave_type ?? "").toLowerCase() ===
          normalizedTypeFilter
      );
    }

    const normalizedSearch = searchTerm?.trim().toLowerCase();
    if (normalizedSearch) {
      results = results.filter((leave) => {
        const employeeName = `${leave.employee?.first_name ?? ""} ${
          leave.employee?.last_name ?? ""
        }`.toLowerCase();
        const leaveType = leave.leave_type?.leave_type?.toLowerCase() ?? "";
        const employeeNo = leave.employee?.employee_no?.toLowerCase() ?? "";
        const reason = leave.reason?.toLowerCase() ?? "";
        const dateValues = [
          leave.start_date,
          leave.end_date,
          leave.createdAt,
        ]
          .map((value) =>
            value ? dayjs(value).format("D MMM YYYY").toLowerCase() : ""
          )
          .join(" ");

        return (
          employeeName.includes(normalizedSearch) ||
          leaveType.includes(normalizedSearch) ||
          employeeNo.includes(normalizedSearch) ||
          reason.includes(normalizedSearch) ||
          dateValues.includes(normalizedSearch)
        );
      });
    }

    return results;
  }, [leaveRecords, leaveTypeFilter, searchTerm, statusFilter]);

  const sortedLeaves = useMemo(() => {
    return [...filteredLeaves].sort((a, b) => {
      const dateA = new Date(a.start_date || a.createdAt || Date.now());
      const dateB = new Date(b.start_date || b.createdAt || Date.now());
      return dateB - dateA;
    });
  }, [filteredLeaves]);

  const summary = useMemo(() => {
    const counts = {
      approved: 0,
      pending: 0,
      rejected: 0,
    };
    let otherCount = 0;
    let totalDays = 0;

    leaveRecords.forEach((leave) => {
      const status = (leave?.status || "other").toLowerCase();
      if (counts.hasOwnProperty(status)) {
        counts[status] += 1;
      } else {
        otherCount += 1;
      }
      totalDays += Number(leave?.total_days || 0);
    });

    return { counts, other: otherCount, totalDays };
  }, [leaveRecords]);

  const employeeName = employee
    ? `${employee.first_name || ""} ${employee.last_name || ""}`.trim()
    : "Employee";
  const employeeStatusLabel = employee?.is_active ? "Active" : "Inactive";
  const formattedRemainingBalance = formatLeaveDays(
    leaveSummary.remaining ?? 0
  );
  const remainingBadgeClass =
    (leaveSummary.remaining ?? 0) < 0
      ? "border border-rose-100 bg-rose-50 text-rose-700"
      : "border border-emerald-100 bg-emerald-50 text-emerald-700";

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-white font-semibold text-2xl">
                {getInitials(employee)}
              </div>
              <div className="space-y-1">
                <p className="text-[15px] uppercase tracking-[0.15em] text-slate-500">
                  Employee history
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {employeeName}
                  </h1>
                  {employee && (
                    <Badge
                      className={
                        employee.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }
                    >
                      {employeeStatusLabel}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  {employee?.designation?.title || "Role not set"} -{" "}
                  {employee?.department?.name || "Department"}
                </p>
                <p className="text-xs text-slate-400">
                  {employee?.employee_no || "-"}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-wrap items-end justify-end gap-2 text-sm text-slate-500">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate("/admin/employees")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Employees
                </Button>
              </div>
              {employee && (
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-semibold">
                    Leave balance
                  </span>
                  <div className="flex flex-wrap gap-3 text-xs font-semibold">
                    <Badge className={remainingBadgeClass}>
                      Remaining: {formattedRemainingBalance}
                    </Badge>
                    <Badge className="bg-amber-50 text-amber-700 border border-amber-100">
                      Used: {leaveSummary.used}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                      Total: {leaveSummary.total}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* {employee && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Leave summary
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Total Leave
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    {leaveSummary?.total ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-amber-700">
                    Used Leave
                  </p>
                  <p className="mt-1 text-xl font-semibold text-amber-800">
                    {leaveSummary?.used ?? 0}
                  </p>
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${remainingBadgeClass}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.18em]">
                    Remaining Leave
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {formattedRemainingBalance}
                  </p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )} */}
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 px-6 py-5">
          {[
            { label: "Total entries", value: leaveRecords.length },
            { label: "Approved", value: summary.counts.approved },
            { label: "Pending", value: summary.counts.pending },
            { label: "Rejected", value: summary.counts.rejected },
            { label: "Other", value: summary.other },
            { label: "Total days", value: summary.totalDays },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <p className="text-lg uppercase tracking-[0.15em] text-slate-400">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {item.value ?? 0}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800">Filters</p>
            <p className="text-xs text-slate-500">
              Showing {filteredLeaves.length} of {leaveRecords.length} entries
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by type, reason, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={leaveTypeFilter}
              onValueChange={(value) => setLeaveTypeFilter(value)}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {leaveTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
        </div>
      ) : leaveRecords?.length === 0 ? (
        <NoDataFound
          title="No leave history yet"
          description="This employee has not taken any leaves that are recorded in the system."
        />
      ) : filteredLeaves.length === 0 ? (
        <NoDataFound
          title="No matching leaves"
          description="Try relaxing the search or filters to see more results."
        />
      ) : (
        <div className="space-y-4">
          {sortedLeaves.map((leave) => {
            const leaveTypeLabel =
              leave.leave_type?.leave_type || "Leave request";
            const startDate = leave.start_date
              ? dayjs(leave.start_date).format("D MMM YYYY")
            : "-";
            const endDate = leave.end_date
              ? dayjs(leave.end_date).format("D MMM YYYY")
            : "-";
            const appliedOn = leave.createdAt
              ? dayjs(leave.createdAt).format("D MMM YYYY")
            : "-";
            const leaveDays = parseLeaveDays(leave);

            const dayCount =
              Number(leave.total_days) || Number(leave?.total_days) || 0;

            return (
              <Card
                key={leave.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="space-y-5 p-5">
                  {/* ===== Header ===== */}
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {getInitials(employee)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              statusStyles[leave.status?.toLowerCase()] ||
                              statusStyles.other
                            }
                          >
                            {leave?.status?.charAt(0).toUpperCase() + leave?.status?.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          {leave.employee?.employee_code}
                        </p>
                      </div>
                    </div>
                  </div>
                    
                  {/* ===== Info Row (ONE ROW) ===== */}
                  <div
                    className={`grid gap-3 text-sm ${
                      leave.status === "approved"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    }`}
                  >
                    {/* Leave Type */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Leave type
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {leave.leave_type?.leave_type}
                      </p>
                    </div>
                  
                    {/* Duration */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Duration
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {dayjs(leave.start_date).format("D MMM YYYY")} –{" "}
                        {dayjs(leave.end_date).format("D MMM YYYY")}
                      </p>
                    </div>
                  
                    {/* Days */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Days
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {leave.total_days} day
                        {leave.total_days > 1 ? "s" : ""}
                      </p>
                    </div>
                  
                    {/* Applied */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                        Applied
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {dayjs(leave.createdAt).format("D MMM YYYY")}
                      </p>
                    </div>
                  
                    {/* Approved */}
                    {leave.status === "approved" && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">
                          Approved
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {dayjs(leave.updatedAt).format("D MMM YYYY")}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* ===== Reason ===== */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Reason
                    </p>
                    <p className="mt-2 text-sm text-slate-900">
                      {leave.reason || "No reason provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeHistory;
