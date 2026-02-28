import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  Plus,
  ArrowRight,
  Hash,
  FileText,
  CalendarDays,
  MoreVertical,
} from "lucide-react";
import { leaveApi } from "../../api/leave/leave";
import { leaveAPI } from "../../api/settingsApi/leaveApi";
import NoDataFound from "../../common/NoDataFound";
import ConfirmFn from "../../utility/confirmFn";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import AdminLeaveModal from "../../components/AdminLeaveModal";
import { useSocketContext } from "../../contexts/SocketContext";
import { useToast } from "@/hooks/use-toast";

const LEAVE_STATUS = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

const tone = {
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const getStatusStyles = (status) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Rejected":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};

const getAvatarColor = (name) => {
  const colors = [
    "bg-slate-800",
    "bg-emerald-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const Leave = () => {
  const { toast } = useToast();
  const { updateDashboard } = useSocketContext();
  const [statusFilter, setStatusFilter] = useState({
    status: "all",
    leave_type_id: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showLeavePolicyModal, setShowLeavePolicyModal] = useState(false);
  const [showCreateLeaveModal, setShowCreateLeaveModal] = useState(false);
  const [leaveDash, setLeaveDash] = useState(null);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [leavePolicy, setLeavePolicy] = useState([]);

  const fetchLeaveData = async (query = "", overrides) => {
    const activeFilter = overrides ?? statusFilter;
    try {
      const [dashboardResult, requestsResult, policyResult] =
        await Promise.allSettled([
          leaveApi.getDashboard(),
          leaveApi.getLeaveRequest(query, { ...activeFilter }),
          leaveAPI.getleave(),
        ]);

      if (
        dashboardResult.status === "fulfilled" &&
        dashboardResult.value.status
      ) {
        setLeaveDash(dashboardResult.value.data?.data);
      }
      if (requestsResult.status === "fulfilled" && requestsResult.value.status) {
        setLeaveRequest(requestsResult.value.data?.data);
      }

      if (policyResult.status === "fulfilled" && policyResult.value.status) {
        setLeavePolicy(policyResult.value?.data);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchLeaveData("", statusFilter);
  }, [statusFilter, updateDashboard]);

  const filteredLeaveRequest = useMemo(() => {
    if (!searchTerm) return leaveRequest;
    const normalized = searchTerm.toLowerCase();
    return leaveRequest.filter((request) => {
      const employeeName = `${request.employee?.first_name || ""} ${
        request.employee?.last_name || ""
      }`.toLowerCase();
      const leaveType = request.leave_type?.leave_type?.toLowerCase() || "";
      const employeeNo = request.employee?.employee_no?.toLowerCase() || "";
      return (
        employeeName.includes(normalized) ||
        leaveType.includes(normalized) ||
        employeeNo.includes(normalized)
      );
    });
  }, [leaveRequest, searchTerm]);

  const filteredRequestCount = filteredLeaveRequest?.length ?? 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <Card className="border border-slate-200 shadow-lg rounded-md bg-slate-900 text-white">
        <CardContent className="p-5 md:p-7">
          <div className="grid grid-cols-12 items-center gap-4 relative">
            <div className="col-span-12 md:col-span-8 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-montserrat text-[#FFFFFF]">
                  Leave Management
                </h1>
              </div>
              <p className="text-[#FFFFFF] font-medium text-sm font-montserrat">
                Monitor and manage employee leave requests and policies
              </p>
            </div>
            <div className="flex items-center gap-3 absolute right-5 top-1/2 -translate-y-1/2">
              <Button
                className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
                onClick={() => setShowLeavePolicyModal(true)}
              >
                <FileText className="h-4 w-4 text-slate-500" />
                Leave Policy
              </Button>
              <Button
                className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
                onClick={() => setShowCreateLeaveModal(true)}
              >
                <Plus className="h-4 w-4" />
                Create Leave
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-[1fr,520px] gap-6">
        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Requests List */}
          <div className="space-y-4">
            {filteredLeaveRequest?.map((request) => (
              <Card
                key={request.id}
                className="group border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-1">
                  <div className="bg-white rounded-[14px] p-4 space-y-3">
                    {/* Top Row: Employee & Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl ${getAvatarColor(request.employee?.first_name || "A")} flex items-center justify-center font-montserrat text-white font-semibold text-md shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                          {request.employee?.first_name?.[0]}
                          {request.employee?.last_name?.[0]}
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="font-semibold font-montserrat text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                            {request.employee?.first_name} {request.employee?.last_name}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-700 text-xs font-montserrat font-medium">
                            <span className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {request.employee?.employee_no}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusStyles(LEAVE_STATUS[request?.status])}`}>
                        {request?.status?.charAt(0).toUpperCase() + request?.status?.slice(1)}
                      </Badge>
                    </div>

                    {/* Middle Row: Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-50/80 border border-slate-100 rounded-md py-2 px-3 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-montserrat text-slate-400">
                          <Calendar className="h-3 w-3" />
                          Applied On
                        </div>
                        <div className="font-semibold text-slate-900 font-montserrat">
                          {dayjs(request?.createdAt).format("D MMM YYYY")}
                        </div>
                      </div>

                      <div className="bg-slate-50/80 border border-slate-100 rounded-md py-2 px-3 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-montserrat text-slate-400">
                          <Clock className="h-3 w-3" />
                          Duration
                        </div>
                        <div className="font-semibold text-slate-900 font-montserrat">
                          {request?.total_days} {request?.total_days === 1 ? "Day" : "Days"}
                        </div>
                      </div>

                      <div className="bg-slate-50/80 border border-slate-100 rounded-md py-2 px-3 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-montserrat text-slate-400">
                          <CalendarDays className="h-3 w-3" />
                          Leave Dates
                        </div>
                        <div className="font-semibold text-slate-900 truncate font-montserrat">
                          {dayjs(request?.start_date).format("D MMM")} – {dayjs(request?.end_date).format("D MMM")}
                        </div>
                      </div>

                      <div className="bg-slate-50/80 border border-slate-100 rounded-md py-2 px-3 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] capitalize tracking-wider font-bold font-montserrat text-slate-400">
                          <FileText className="h-3 w-3" />
                          Leave Type
                        </div>
                        <div className="font-semibold text-slate-900 font-montserrat">
                          {request.leave_type?.leave_type}
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
                      <div className="text-sm">
                        {request?.status === "approved" && (
                          <div className="flex items-center gap-2 text-emerald-600 font-semibold font-montserrat bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                            <CheckCircle className="h-4 w-4" />
                            Approved on {dayjs(request?.updatedAt).format("D MMM YYYY")}
                          </div>
                        )}
                        {request?.status === "pending" && (
                          <div className="flex items-center gap-2 text-amber-600 font-semibold font-montserrat bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                            <Clock className="h-4 w-4" />
                            Awaiting Review
                          </div>
                        )}
                        {request?.status === "rejected" && (
                          <div className="flex items-center gap-2 text-rose-600 font-semibold font-montserrat bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                            <XCircle className="h-4 w-4" />
                            Rejected on {dayjs(request?.updatedAt).format("D MMM YYYY")}
                          </div>
                        )}
                      </div>

                      {request?.status === "pending" && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 font-montserrat"
                            onClick={() => {
                              ConfirmFn({
                                onDelete: async () => {
                                  try {
                                    const resp = await leaveApi.leaveApproved(
                                      request.id,
                                      request.employee_id
                                    );
                                    if (resp?.status === 200) fetchLeaveData();
                                  } catch (error) { console.log(error); }
                                },
                                text_no: "Cancel",
                                text_yes: "Approve",
                                title: "Approve Leave",
                                message: "Approve this leave request? Balances will update immediately.",
                              });
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 sm:flex-none text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 font-semibold font-montserrat px-4"
                            onClick={() => {
                              ConfirmFn({
                                onDelete: async () => {
                                  try {
                                    const resp = await leaveApi.leaveRejected(
                                      request.id,
                                      request.employee_id
                                    );
                                    if (resp?.status === 200) fetchLeaveData();
                                  } catch (error) { console.log(error); }
                                },
                                text_yes: "Reject",
                                text_no: "Cancel",
                                title: "Reject Leave",
                                message: "Reject this leave request? The employee will be notified.",
                              });
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredLeaveRequest?.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl py-20">
              <NoDataFound />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="border-slate-200 shadow-sm rounded-md overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-700 font-montserrat capitalize tracking-wider flex items-center justify-between">
                Quick Overview
                <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
                   <Eye className="h-4 w-4" />
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    label: "Pending Requests",
                    value: leaveDash?.pending_requests,
                    tone: "amber",
                    icon: AlertCircle,
                  },
                  {
                    label: "Approved Requests",
                    value: leaveDash?.approved_requests,
                    tone: "emerald",
                    icon: CheckCircle,
                  },
                  {
                    label: "Total Leave Days",
                    value: leaveDash?.total_leave_days,
                    tone: "blue",
                    icon: Calendar,
                  },
                  {
                    label: "Taken This Month",
                    value: leaveDash?.this_month,
                    tone: "indigo",
                    icon: Clock,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="group flex items-center justify-between px-4 py-2 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all duration-300"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold font-montserrat capitalize tracking-wider text-slate-400">
                          {item.label}
                        </p>
                        <p className="text-xl font-bold font-montserrat capitalize tracking-wider text-slate-900">
                          {item.value ?? 0}
                        </p>
                      </div>
                      <div
                        className={`h-10 w-10 rounded-xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300 ${tone[item.tone]}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Filters Card */}
          <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-700 font-montserrat capitalize tracking-wider flex items-center justify-between">
                Filters
                <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
                   <Filter className="h-4 w-4" />
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="h-11 pl-10 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
                      placeholder="Employee or leave type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Status</label>
                  <Select
                    value={statusFilter.status}
                    onValueChange={(val) =>
                      setStatusFilter((prev) => ({ ...prev, status: val }))
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-slate-200 rounded-xl font-medium">
                      <SelectValue placeholder="All Status" className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat" />
                    </SelectTrigger>
                    <SelectContent className="border border-slate-200 focus:border-slate-900 transition-all font-montserrat">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Leave Type</label>
                  <Select
                    value={statusFilter.leave_type_id}
                    onValueChange={(val) =>
                      setStatusFilter((prev) => ({ ...prev, leave_type_id: val }))
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-slate-200 rounded-xl font-medium">
                      <SelectValue placeholder="All Types" className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat" />
                    </SelectTrigger>
                    <SelectContent className="border border-slate-200 focus:border-slate-900 transition-all font-montserrat">
                      <SelectItem value={0}>All Types</SelectItem>
                      {leavePolicy?.map((policy) => (
                        <SelectItem key={policy.id} value={policy.id}>
                          {policy?.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Showing {filteredRequestCount} results
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Leave Modal */}
      <Dialog
        open={showCreateLeaveModal}
        onOpenChange={setShowCreateLeaveModal}
      >
        <DialogContent className="p-0 max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl border-none shadow-2xl">
          <AdminLeaveModal
            onClose={() => setShowCreateLeaveModal(false)}
            onSuccess={() => {
              fetchLeaveData();
              setShowCreateLeaveModal(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Leave Policy Modal */}
      <Dialog
        open={showLeavePolicyModal}
        onOpenChange={(open) => setShowLeavePolicyModal(open)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl font-bold text-slate-900">Company Leave Policy</DialogTitle>
            <p className="text-slate-500 font-medium">Current annual leave allocations for all types</p>
          </DialogHeader>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leavePolicy &&
                leavePolicy?.length > 0 &&
                leavePolicy?.map((section, idx) => (
                  <Card key={idx} className="border-slate-100 shadow-sm rounded-2xl bg-slate-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold text-indigo-600">{section?.type}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Annual Allowance</span>
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-lg">
                          {section?.annual_days} <span className="text-sm font-medium text-slate-400 uppercase">Days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
          <div className="px-6 pb-6 flex justify-end">
            <Button onClick={() => setShowLeavePolicyModal(false)} className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leave;
