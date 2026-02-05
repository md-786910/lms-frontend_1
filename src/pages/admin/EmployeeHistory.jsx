import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import NoDataFound from "../../common/NoDataFound";
import { employeeAPI } from "../../api/employeeApi";
import { leaveApi } from "../../api/leave/leave";

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

        setEmployee(employeeResp?.data ?? null);
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

  const sortedLeaves = useMemo(() => {
    return [...leaveRecords].sort((a, b) => {
      const dateA = new Date(a.start_date || a.createdAt || Date.now());
      const dateB = new Date(b.start_date || b.createdAt || Date.now());
      return dateB - dateA;
    });
  }, [leaveRecords]);

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

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-semibold text-2xl">
                {getInitials(employee)}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
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
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              {employee?.email ? (
                <span className="text-slate-500">{employee.email}</span>
              ) : (
                <span className="text-slate-400">No email on file</span>
              )}
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
          </div>
          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {item.value ?? 0}
              </p>
            </div>
          ))}
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
                className="border border-slate-200 shadow-sm rounded-2xl"
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        {leaveTypeLabel}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-base font-semibold text-slate-900">
                        <span>
                          {startDate} - {endDate}
                        </span>
                        <Badge
                          className={
                            statusStyles[leave.status?.toLowerCase()] ||
                            statusStyles.other
                          }
                        >
                          {leave.status || "unknown"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      Applied on {appliedOn}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Total days
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {dayCount} day{dayCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Duration
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {startDate} - {endDate}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm text-slate-700">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Reason
                    </p>
                    <p className="mt-2 text-slate-900">
                      {leave.reason || "No reason provided."}
                    </p>
                  </div>

                  {leaveDays?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Dates covered ({leaveDays.length})
                      </p>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {leaveDays.map((chunk, index) => {
                          const chunkDays =
                            Number(chunk?.count) ||
                            (chunk?.day === "half" ? 0.5 : 1);
                          return (
                            <div
                              key={`${leave.id}-${chunk?.date}-${index}`}
                              className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                            >
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                {chunk?.date
                                  ? dayjs(chunk.date).format("D MMM YYYY")
                                  : "Unknown"}
                              </p>
                              <p className="text-sm font-semibold text-slate-900">
                                {chunkDays} day{chunkDays === 1 ? "" : "s"}
                              </p>
                              <p className="text-[11px] text-slate-500 capitalize">
                                {chunk?.day || "full"} day
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
