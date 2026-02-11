import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Calendar,
  Plus,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import LeaveRequestModal from "@/components/LeaveRequestModal";
import { employeeLeaveApi } from "../../api/employee/leaveApi";
import ConfirmFn from "../../utility/confirmFn";
import NoDataFound from "../../common/NoDataFound";
import { formatLeaveDays } from "../../utility/utility";
import { useSocketContext } from "../../contexts/SocketContext";

const LEAVE_STATUS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const EmployeeLeave = () => {
  const { updateDashboard } = useSocketContext();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveDash, setLeaveDash] = useState(null);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [readOnly, setReadOnly] = useState(false);
  const [leaveRequestViewMode, setLeaveRequestViewMode] = useState({});
  const totalRemaining = leaveDash?.total_remaining ?? 0;
  const totalRemainingLabel = formatLeaveDays(totalRemaining);
  const totalRemainingBadgeClass =
    totalRemaining < 0
      ? "bg-rose-50 text-rose-600 border border-rose-100"
      : "bg-emerald-50 text-emerald-700 border border-emerald-100";
  const totalRemainingValueClass =
    totalRemaining < 0 ? "text-rose-500" : "text-slate-900";

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
      default:
        return "bg-slate-100 text-slate-800 ring-1 ring-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-rose-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  const handleRequestSuccess = () => {
    console.log("Leave request submitted successfully");
  };

  // handle api
  const fetchLeave = async () => {
    const resp = await employeeLeaveApi.getLeave();
    if (resp.status === 200) {
      setLeaveDash(resp.data?.data);
    }
  };
  const getLeaveRequest = async () => {
    const resp = await employeeLeaveApi.getLeaveRequest();
    if (resp.status === 200) {
      setLeaveRequest(resp.data?.data);
    }
  };

  useEffect(() => {
    fetchLeave();
    getLeaveRequest();
  }, [updateDashboard]);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#111827] px-6 py-7 shadow-xl text-white">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100 ring-1 ring-white/15">
              <Calendar className="h-4 w-4" />
              Leave workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-3xl">
              Leave Management
            </h1>
            <p className="max-w-2xl text-sm text-slate-200">
              Track balances, submit requests, and keep approvals flowing with a clear, human-friendly layout.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                {leaveRequest?.length || 0} active request{leaveRequest?.length !== 1 ? "s" : ""}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${totalRemainingBadgeClass}`}
              >
                {totalRemainingLabel} remaining
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setReadOnly(false);
              setLeaveRequestViewMode({});
              setShowRequestModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Request Leave
          </button>
        </div>
      </div>

      {/* Leave Balance */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Leave Balance</h3>
              <p className="text-xs text-slate-500">Snapshot of each leave type with usage highlights.</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 sm:inline-flex">
            Updated automatically
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {leaveDash?.leaves?.map((leave, index) => {
            const remainingBalance = leave.leave_remaing ?? 0;
            const remainingBalanceColor =
              remainingBalance < 0 ? "text-rose-600" : "text-emerald-600";
            const totalLeaves = leave.leave_count ?? 0;
            const progressPercent =
              totalLeaves > 0
                ? Math.min(
                    Math.max((remainingBalance / totalLeaves) * 100, 0),
                    100
                  )
                : 0;
            const formattedRemainingBalance = formatLeaveDays(remainingBalance);
            const formattedTotal = leave.leave_count ?? 0;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-slate-100 bg-slate-50/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Leave Type
                    </p>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {leave.leave_type}
                    </h4>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                    Annual
                  </span>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold text-slate-900">
                      {formattedTotal} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used</span>
                    <span className="font-semibold text-amber-600">
                      {leave.leave_used || 0} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining</span>
                    <span className={`font-semibold ${remainingBalanceColor}`}>
                      {formattedRemainingBalance}
                    </span>
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${progressPercent}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-3 sticky top-20 self-start z-40">
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_8px_24px_rgba(16,185,129,0.12)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Total Approved</p>
                  <p className="text-3xl font-semibold text-slate-900">
                    {leaveDash?.total_approved || 0}
                    <span className="text-sm font-medium text-slate-400"> days</span>
                  </p>
                  <p className="text-xs text-slate-500">Year to date</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-[0_8px_24px_rgba(245,158,11,0.12)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Pending</p>
                  <p className="text-3xl font-semibold text-slate-900">
                    {leaveDash?.total_pending || 0}
                    <span className="text-sm font-medium text-slate-400"> days</span>
                  </p>
                  <p className="text-xs text-slate-500">Awaiting approval</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-[0_8px_24px_rgba(99,102,241,0.12)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Remaining</p>
                  <p className={`text-3xl font-semibold ${totalRemainingValueClass}`}>
                    {totalRemainingLabel}
                  </p>
                  <p className="text-xs text-slate-500">Available balance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Leave Requests */}
        <div className="col-span-12 lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">My Leave Requests</h3>
                <p className="text-xs text-slate-500">Stay on top of what's pending, approved, or rejected.</p>
              </div>
            </div>
            <div className="hidden rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 md:block">
              Most recent first
            </div>
          </div>
          {leaveRequest?.map((request) => (
            <div
              key={request.id}
              className="my-3 flex flex-col gap-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 ring-1 ring-slate-200">
                  <span>{request.type}</span>
                  <Badge
                    className={`${getStatusColor(
                      LEAVE_STATUS[request?.status]
                    )} ring-inset`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(LEAVE_STATUS[request?.status])}
                      <span>{request?.status}</span>
                    </div>
                  </Badge>
                </div>
                <div className="mt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Duration
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {new Date(request.start_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(request.end_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {request.total_days} day
                    {request.total_days > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-white p-4 ring-1 ring-slate-100 lg:px-6">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Reason</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{request.reason}</p>
              </div>
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Applied Date
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(request.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {request.status === "pending" && (
                  <button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                    onClick={async () => {
                      ConfirmFn({
                        onDelete: async () => {
                          try {
                            const resp =
                              await employeeLeaveApi.cancelLeaveRequest(
                                request.id
                              );
                            if (resp?.status === 200) {
                              fetchLeave();
                              getLeaveRequest();
                            }
                          } catch (error) {
                            console.log(error);
                          }
                        },
                        text_no: "No",
                        text_yes: "Yes cancel",
                        title: "Cancel leave request",
                        message:
                          "Are you sure you want to cancel this leave request?",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300"
                  onClick={() => {
                    setReadOnly(true);
                    setLeaveRequestViewMode(request || {});
                    setShowRequestModal(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
          {leaveRequest?.length === 0 && <NoDataFound />}
        </div>
      </div>
      {/* Leave Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto scroll-slim p-0 gap-0">
          <LeaveRequestModal
            onClose={() => {
              setShowRequestModal(false);
              getLeaveRequest();
              fetchLeave();
            }}
            onSuccess={() => handleRequestSuccess()}
            leaves={leaveDash?.leaves}
            readOnly={readOnly || false}
            leaveRequestViewMode={leaveRequestViewMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeLeave;
