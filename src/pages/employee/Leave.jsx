import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Plus,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Hash,
  Eye,
  MoreVertical,
} from "lucide-react";
import dayjs from "dayjs";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
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
      setCurrentPage(1);
    }
  };

  // Sort leave requests by most recent first
  const sortedLeaveRequests = useMemo(() => {
    return [...(leaveRequest || [])].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [leaveRequest]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedLeaveRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedLeaveRequests.slice(startIndex, endIndex);
  }, [sortedLeaveRequests, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchLeave();
    getLeaveRequest();
  }, [updateDashboard]);
  return (
    <div className="h-[calc(100vh-110px)] overflow-hidden flex flex-col space-y-6 pb-4">
      {/* Header */}
      <Card className="border border-slate-200 shadow-lg rounded-md bg-slate-900 text-white shrink-0">
        <CardContent className="p-5 md:p-7">
          <div className="grid grid-cols-12 items-center gap-4 relative">
            <div className="col-span-12 md:col-span-8 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-montserrat text-[#FFFFFF]">
                  Leave Management
                </h1>
              </div>
              <p className="text-[#FFFFFF] font-medium text-sm font-montserrat">
                Track balances, submit requests, and view leave history with ease
              </p>
            </div>
            <div className="flex items-center gap-3 absolute right-5 top-1/2 -translate-y-1/2">
              <Button
                className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
                onClick={() => {
                  setReadOnly(false);
                  setLeaveRequestViewMode({});
                  setShowRequestModal(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Request Leave
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-[1fr,420px] gap-6 flex-1 min-h-0">
        {/* Main Content Area */}
        <div className="flex flex-col min-h-0 space-y-4">
          {/* Leave Requests Card */}
          <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white flex-1 flex flex-col min-h-0">
            <CardHeader className="border-b border-slate-100 shrink-0">
              <CardTitle className="text-lg font-bold text-slate-700 font-montserrat capitalize tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">My Leave Requests</p>
                    <p className="text-xs text-slate-500 font-normal">Stay on top of what's pending, approved, or rejected.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-full ring-1 ring-slate-200">
                  Most recent first
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0 flex-1 overflow-hidden flex flex-col">
              {/* Requests List - Scrollable Area */}
              <div className="flex-1 overflow-y-auto scroll-slim">
                <div className="space-y-4 p-4">
                  {paginatedRequests?.length > 0 ? (
                    paginatedRequests.map((request) => (
                      <Card
                        key={request.id}
                        className="group border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                      <div className="p-1">
                        <div className="bg-white rounded-[14px] p-4 space-y-3">
                          {/* Header with Leave Type and Status */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <h3 className="font-semibold font-montserrat text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                                {request.leave_type?.leave_type || request.type} Leave Request
                              </h3>
                              <p className="text-xs text-slate-500 font-montserrat">
                                Request ID: #{request.id}
                              </p>
                            </div>
                            <Badge
                              className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(
                                LEAVE_STATUS[request?.status]
                              )}`}
                            >
                              {request?.status?.charAt(0).toUpperCase() + request?.status?.slice(1)}
                            </Badge>
                          </div>

                          {/* Leave Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-slate-50/80 border border-slate-100 rounded-md py-2 px-3 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-montserrat text-slate-400">
                                <Calendar className="h-3 w-3" />
                                Applied On
                              </div>
                              <div className="font-semibold text-slate-900 font-montserrat text-sm">
                                {dayjs(request?.createdAt).format("D MMM YYYY")}
                              </div>
                            </div>

                            <div className="bg-slate-50/80 border border-slate-100 rounded-md py-2 px-3 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-montserrat text-slate-400">
                                <Clock className="h-3 w-3" />
                                Duration
                              </div>
                              <div className="font-semibold text-slate-900 font-montserrat text-sm">
                                {request?.total_days} {request?.total_days === 1 ? "Day" : "Days"}
                              </div>
                            </div>

                            <div className="bg-slate-50/80 border border-slate-100 rounded-md py-2 px-3 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-montserrat text-slate-400">
                                <CalendarDays className="h-3 w-3" />
                                Leave Dates
                              </div>
                              <div className="font-semibold text-slate-900 truncate font-montserrat text-sm">
                                {dayjs(request?.start_date).format("D MMM")} – {dayjs(request?.end_date).format("D MMM")}
                              </div>
                            </div>

                            <div className="bg-slate-50/80 border border-slate-100 rounded-md py-2 px-3 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-montserrat text-slate-400">
                                <FileText className="h-3 w-3" />
                                Type
                              </div>
                              <div className="font-semibold text-slate-900 font-montserrat text-sm">
                                {request.leave_type?.leave_type || request.type}
                              </div>
                            </div>
                          </div>

                          {/* Reason Section */}
                          <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-md py-2 px-3">
                            <div className="text-[10px] capitalize font-montserrat tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                              <MoreVertical className="h-3 w-3 rotate-90" />
                              Reason for Leave
                            </div>
                            <p className="text-slate-700 text-sm font-medium leading-relaxed font-montserrat">
                              "{request?.reason}"
                            </p>
                          </div>

                          {/* Footer Row: Meta & Actions */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                            <div className="text-sm w-full sm:w-auto">
                              {request?.status === "approved" && (
                                <div className="flex items-center gap-2 text-emerald-600 font-semibold font-montserrat bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                  <CheckCircle className="h-4 w-4" />
                                  Approved on {dayjs(request?.updatedAt).format("D MMM YYYY")}
                                </div>
                              )}
                              {request?.status === "pending" && (
                                <div className="flex items-center gap-2 text-amber-600 font-semibold font-montserrat bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-full">
                                  <Clock className="h-4 w-4" />
                                  <span className="flex-1">Awaiting Review</span>
                                </div>
                              )}
                              {request?.status === "rejected" && (
                                <div className="flex items-center gap-2 text-rose-600 font-semibold font-montserrat bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                                  <XCircle className="h-4 w-4" />
                                  Rejected on {dayjs(request?.updatedAt).format("D MMM YYYY")}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {request.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 sm:flex-none text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 font-semibold font-montserrat px-4"
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
                                  <XCircle className="h-4 w-4" />
                                  Cancel
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 sm:flex-none rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold font-montserrat px-4"
                                onClick={() => {
                                  setReadOnly(true);
                                  setLeaveRequestViewMode(request || {});
                                  setShowRequestModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl py-20">
                    <NoDataFound />
                  </div>
                )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 rounded-xl shrink-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-500 font-montserrat">
                  Showing <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, sortedLeaveRequests.length)}</span> of{" "}
                  <span className="text-slate-900">{sortedLeaveRequests.length}</span> results
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-9 w-9 p-0 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-9 w-9 p-0 rounded-lg font-montserrat text-sm font-semibold transition-all duration-200 ${
                        currentPage === i + 1
                          ? "bg-slate-900 text-white shadow-md scale-105"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 p-0 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Leave Balance & Stats */}
        <div className="space-y-4 flex flex-col">
          {/* Leave Balance Card */}
          <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white h-fit sticky top-20">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 font-montserrat flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <CalendarDays className="h-4 w-4" />
                </div>
                Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-y-auto scroll-slim">
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
                      className="px-4 py-4 border-b border-slate-100 last:border-b-0"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <p className="text-xs capitalize font-bold tracking-wide text-slate-500 font-montserrat">
                            {leave.leave_type}
                          </p>
                          <h4 className="text-sm font-semibold text-slate-900 font-montserrat">
                            {formattedTotal} days
                          </h4>
                        </div>
                        <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                          Annual
                        </span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-600 font-montserrat">
                        <div className="flex justify-between">
                          <span>Used</span>
                          <span className="font-semibold text-amber-600">
                            {leave.leave_used || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining</span>
                          <span className={`font-semibold ${remainingBalanceColor}`}>
                            {formattedRemainingBalance}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-emerald-500 transition-all"
                          style={{
                            width: `${progressPercent}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border border-emerald-100 shadow-[0_8px_24px_rgba(16,185,129,0.12)] rounded-2xl bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs capitalize tracking-wide text-slate-500 font-montserrat">
                    Total Approved
                  </p>
                  <p className="text-2xl font-bold text-slate-900 font-montserrat">
                    {leaveDash?.total_approved || 0}
                    <span className="text-xs font-medium text-slate-400"> days</span>
                  </p>
                  <p className="text-xs text-slate-500 font-montserrat">Year to date</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-100 shadow-[0_8px_24px_rgba(245,158,11,0.12)] rounded-2xl bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs capitalize tracking-wide text-slate-500 font-montserrat">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-slate-900 font-montserrat">
                    {leaveDash?.total_pending || 0}
                    <span className="text-xs font-medium text-slate-400"> days</span>
                  </p>
                  <p className="text-xs text-slate-500 font-montserrat">Awaiting approval</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-indigo-100 shadow-[0_8px_24px_rgba(99,102,241,0.12)] rounded-2xl bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs capitalize tracking-wide text-slate-500 font-montserrat">
                    Remaining
                  </p>
                  <p className={`text-2xl font-bold ${totalRemainingValueClass} font-montserrat`}>
                    {totalRemainingLabel}
                  </p>
                  <p className="text-xs text-slate-500 font-montserrat">Available balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
