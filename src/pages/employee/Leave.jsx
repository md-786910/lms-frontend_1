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
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const itemsPerPage = 5;
  
  const totalRemaining = leaveDash?.cycle_remaining ?? leaveDash?.total_remaining ?? 0;
  const totalRemainingLabel = formatLeaveDays(totalRemaining);
  const extraWorkBalanceLabel = formatLeaveDays(
    leaveDash?.extra_work_leave_balance?.balance ?? 0
  );
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

  // Sort and filter leave requests
  const filteredLeaveRequests = useMemo(() => {
    let result = [...(leaveRequest || [])];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(req => req.status === statusFilter);
    }
    
    // Apply month filter
    if (monthFilter !== "all") {
      result = result.filter(req => {
        const startMonth = dayjs(req.start_date).format("YYYY-MM");
        const endMonth = dayjs(req.end_date).format("YYYY-MM");
        return startMonth === monthFilter || endMonth === monthFilter || 
               (dayjs(req.start_date).isBefore(monthFilter) && dayjs(req.end_date).isAfter(monthFilter));
      });
    }
    
    // Sort by most recent first
    return result.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [leaveRequest, statusFilter, monthFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeaveRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLeaveRequests.slice(startIndex, endIndex);
  }, [filteredLeaveRequests, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchLeave();
    getLeaveRequest();
  }, [updateDashboard]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, monthFilter]);
  return (
    <div className="min-h-[calc(100vh-110px)] flex flex-col space-y-6 overflow-y-auto scroll-smooth mb-5">
      {/* Header */}
      <Card className="border border-[#E1D4C7]/30 shadow-xl rounded-2xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Left Content */}
            <div className="col-span-12 md:col-span-8 space-y-2">
              <span className="inline-block text-[11px] font-heading font-bold tracking-widest text-[#E1D4C7] uppercase bg-white/10 px-3 py-1 rounded-full">
                Leave Management
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold uppercase tracking-tight text-white">
                Leave &amp; Time Off
              </h1>
              <p className="text-white/80 font-sans text-sm">
                Track balances, submit requests, and view leave history with ease
              </p>
            </div>

            {/* Right Button */}
            <div className="col-span-12 md:col-span-4 flex md:justify-end">
              <Button
                className="w-full sm:w-auto rounded-xl shadow-md border border-[#E1D4C7] flex items-center justify-center gap-2 py-2.5 px-5 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] bg-[#FAF6F2] hover:bg-white cursor-pointer transition ease-in-out duration-300"
                onClick={() => {
                  setReadOnly(false);
                  setLeaveRequestViewMode({});
                  setShowRequestModal(true);
                }}
              >
                <Plus className="h-4 w-4 text-[#C26819]" />
                Request Leave
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Balance - Top Section */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
        <CardContent className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-1">
              <p className="text-xs font-heading font-bold tracking-wider text-[#734425] uppercase">
                Current Cycle
              </p>
              <h2 className="text-xl font-heading font-extrabold text-[#24130A] mt-0.5">
                {leaveDash?.cycle_name || "Current Cycle"}:{" "}
                {leaveDash?.cycle_label || "-"}
              </h2>
            </div>
            <div className="rounded-xl bg-[#FAF6F2] border border-[#E1D4C7] p-3.5 shadow-sm">
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">
                Cycle Entitlement
              </p>
              <p className="text-2xl font-heading font-extrabold text-[#24130A] mt-1">
                {formatLeaveDays(leaveDash?.cycle_total ?? 0)}
              </p>
            </div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-300/40 p-3.5 shadow-sm">
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#C26819]">
                Availed In Cycle
              </p>
              <p className="text-2xl font-heading font-extrabold text-[#C26819] mt-1">
                {formatLeaveDays(leaveDash?.cycle_availed ?? leaveDash?.cycle_used ?? 0)}
              </p>
            </div>
            <div className="rounded-xl bg-rose-500/10 border border-rose-300/40 p-3.5 shadow-sm">
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-rose-700">
                Deduction In Cycle
              </p>
              <p className="text-2xl font-heading font-extrabold text-rose-700 mt-1">
                {formatLeaveDays(leaveDash?.cycle_deduction ?? 0)}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-300/40 p-3.5 shadow-sm">
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-emerald-800">
                Remaining In Cycle
              </p>
              <p className="text-2xl font-heading font-extrabold text-emerald-800 mt-1">
                {formatLeaveDays(leaveDash?.cycle_remaining ?? 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaveDash?.leaves?.map((leave, index) => {
          const cycleAvailed =
            leave.cycle_leave_availed ?? leave.cycle_leave_used ?? leave.leave_used ?? 0;
          const formattedAvailed = formatLeaveDays(cycleAvailed);
          return (
            <Card key={index} className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-base font-heading font-bold text-[#734425] uppercase tracking-wide">
                      {leave.leave_type}
                    </p>
                    <h4 className="text-xl font-heading font-extrabold text-[#24130A] mt-1">
                      {formattedAvailed} availed
                    </h4>
                  </div>
                  <span className="rounded-full bg-[#734425]/10 px-2.5 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider text-[#734425] border border-[#E1D4C7]">
                    {leaveDash?.cycle_name || leave.cycle_name || "Cycle"}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-[#2E2E2E]/70 font-sans">
                  <div className="flex justify-between">
                    <span>Availed in cycle</span>
                    <span className="font-heading font-bold text-[#C26819]">
                      {formattedAvailed}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,360px] lg:grid-cols-[1fr,555px] gap-6 flex-1 min-h-0">
        {/* Main Content Area */}
        <div className="flex flex-col min-h-0 space-y-4">
          {/* Leave Requests Card */}
          <Card className="flex-1 flex flex-col min-h-0  bg-transparent bg-none border-0 shadow-none">
            <CardContent className="px-0 py-0 flex-1 overflow-hidden flex flex-col">
              {/* Requests List - Scrollable Area */}
              <div className="flex-1 overflow-y-auto scroll-slim">
                <div className="space-y-4">
                  {paginatedRequests?.length > 0 ? (
                    paginatedRequests.map((request) => (
                      <Card
                        key={request.id}
                        className="group border border-[#E1D4C7] bg-[#FAF6F2] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                      <div className="p-1">
                        <div className="bg-[#F5ECE4]/70 border border-[#E1D4C7]/60 rounded-xl p-4 space-y-3">
                          {/* Header with Leave Type and Status */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <h3 className="font-heading font-bold text-[#2E2E2E] text-lg group-hover:text-[#734425] transition-colors">
                                {request.leave_type?.leave_type || request.type} Leave Request
                              </h3>
                              <p className="text-xs text-slate-500 font-graphik">
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-[#FAF6F2] border border-[#E1D4C7] rounded-xl py-2 px-3 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-graphik text-slate-400">
                                <Calendar className="h-3 w-3" />
                                Applied On
                              </div>
                              <div className="font-semibold text-slate-900 font-graphik text-sm">
                                {dayjs(request?.createdAt).format("D MMM YYYY")}
                              </div>
                            </div>

                            <div className="bg-[#FAF6F2] border border-[#E1D4C7] rounded-xl py-2 px-3 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-graphik text-slate-400">
                                <Clock className="h-3 w-3" />
                                Duration
                              </div>
                              <div className="font-semibold text-slate-900 font-graphik text-sm">
                                {request?.total_days} {request?.total_days === 1 ? "Day" : "Days"}
                              </div>
                            </div>

                            <div className="bg-[#FAF6F2] border border-[#E1D4C7] rounded-xl py-2 px-3 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-graphik text-slate-400">
                                <CalendarDays className="h-3 w-3" />
                                Leave Dates
                              </div>
                              <div className="font-semibold text-slate-900 truncate font-graphik text-sm">
                                {dayjs(request?.start_date).format("D MMM")} – {dayjs(request?.end_date).format("D MMM")}
                              </div>
                            </div>

                            <div className="bg-[#FAF6F2] border border-[#E1D4C7] rounded-xl py-2 px-3 space-y-1">
                              <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-graphik text-slate-400">
                                <FileText className="h-3 w-3" />
                                Type
                              </div>
                              <div className="font-semibold text-slate-900 font-graphik text-sm">
                                {request.leave_type?.leave_type || request.type}
                              </div>
                            </div>
                          </div>

                          {/* Reason Section */}
                          <div className="bg-[#FAF6F2] border border-[#E1D4C7] rounded-xl py-2 px-3">
                            <div className="text-[10px] capitalize font-graphik tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                              <MoreVertical className="h-3 w-3 rotate-90" />
                              Reason for Leave
                            </div>
                            <p className="text-slate-700 text-sm font-medium leading-relaxed font-graphik">
                              "{request?.reason}"
                            </p>
                          </div>

                          {/* Footer Row: Meta & Actions */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E1D4C7]">
                            <div className="text-sm w-full sm:w-auto">
                              {request?.status === "approved" && (
                                <div className="flex items-center gap-2 text-emerald-600 font-semibold font-graphik bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                  <CheckCircle className="h-4 w-4" />
                                  Approved on {dayjs(request?.updatedAt).format("D MMM YYYY")}
                                </div>
                              )}
                              {request?.status === "pending" && (
                                <div className="flex items-center gap-2 text-amber-600 font-semibold font-graphik bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-full">
                                  <Clock className="h-4 w-4" />
                                  <span className="flex-1">Awaiting Review</span>
                                </div>
                              )}
                              {request?.status === "rejected" && (
                                <div className="flex items-center gap-2 text-rose-600 font-semibold font-graphik bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
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
                                  className="flex-1 sm:flex-none text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 font-semibold font-graphik px-4"
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
                                className="flex-1 sm:flex-none rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold font-graphik px-4"
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
                  <div className="bg-[#FAF6F2] border border-[#E1D4C7] rounded-2xl py-20">
                    <NoDataFound />
                  </div>
                )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF6F2] px-4 py-3 border border-[#E1D4C7] rounded-2xl shrink-0">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <p className="text-sm font-medium text-slate-500 font-graphik">
                  Showing <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredLeaveRequests.length)}</span> of{' '}
                  <span className="text-slate-900">{filteredLeaveRequests.length}</span> results
                </p>
              </div>

              <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-2">
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
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`min-w-[36px] h-9 px-2 rounded-xl font-heading text-xs font-bold transition-all duration-200 ${
                        currentPage === i + 1
                          ? "bg-[#734425] text-white shadow-md scale-105"
                          : "border-[#E1D4C7] bg-[#F5ECE4] text-[#2E2E2E] hover:bg-[#FAF6F2]"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
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
            </div>
          )}
        </div>

        {/* Sidebar - Filter & Stats */}
        <div className="space-y-4 flex flex-col">
          {/* Filter Card */}
          <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2] h-fit md:sticky md:top-20">
            <CardHeader className="pb-4 border-b border-[#E1D4C7] bg-[#FAF6F2]">
              <CardTitle className="text-base font-heading font-bold text-[#2E2E2E] flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#734425]/10 border border-[#734425]/20 text-[#734425]">
                  <Filter className="h-4 w-4" />
                </div>
                Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wide text-slate-500 font-graphik">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full rounded-xl border-[#E1D4C7] bg-[#F5ECE4]/60 text-[#2E2E2E] font-graphik">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Month Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wide text-slate-500 font-graphik">
                  Month
                </label>
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-full rounded-xl border-[#E1D4C7] bg-[#F5ECE4]/60 text-[#2E2E2E] font-graphik">
                    <SelectValue placeholder="Filter by month" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
                    <SelectItem value="all">All Months</SelectItem>
                    {[...Array(12)].map((_, i) => {
                      const date = dayjs().month(i);
                      const monthValue = date.format("YYYY-MM");
                      const monthLabel = date.format("MMMM YYYY");
                      return (
                        <SelectItem key={i} value={monthValue}>
                          {monthLabel}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border border-emerald-200/80 shadow-sm rounded-2xl bg-[#FAF6F2]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs capitalize tracking-wide text-slate-500 font-graphik">
                    Total Approved
                  </p>
                  <p className="text-2xl font-bold text-slate-900 font-graphik">
                    {leaveDash?.cycle_availed ?? leaveDash?.total_approved ?? leaveDash?.cycle_used ?? 0}
                    <span className="text-xs font-medium text-slate-400"> days</span>
                  </p>
                  <p className="text-xs text-slate-500 font-graphik">
                    {leaveDash?.cycle_name || "Current cycle"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-200/80 shadow-sm rounded-2xl bg-[#FAF6F2]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs capitalize tracking-wide text-slate-500 font-graphik">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-slate-900 font-graphik">
                    {leaveDash?.total_pending || 0}
                    <span className="text-xs font-medium text-slate-400"> days</span>
                  </p>
                  <p className="text-xs text-slate-500 font-graphik">Awaiting approval</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs capitalize tracking-wide text-slate-500 font-graphik">
                    Remaining
                  </p>
                  <p className={`text-2xl font-bold ${totalRemainingValueClass} font-graphik`}>
                    {totalRemainingLabel}
                  </p>
                  <p className="text-xs text-slate-500 font-graphik">Available balance</p>
                  <p className="text-xs text-slate-400 font-graphik">
                    {leaveDash?.cycle_label || ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 shrink-0">
                  <Hash className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs capitalize tracking-wide text-slate-500 font-graphik">
                    Extra Work Leave
                  </p>
                  <p className="text-2xl font-bold text-slate-900 font-graphik">
                    {extraWorkBalanceLabel}
                  </p>
                  <p className="text-xs text-slate-500 font-graphik">
                    Separate earned balance
                  </p>
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
            extraWorkLeaveBalance={leaveDash?.extra_work_leave_balance}
            readOnly={readOnly || false}
            leaveRequestViewMode={leaveRequestViewMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeLeave;
