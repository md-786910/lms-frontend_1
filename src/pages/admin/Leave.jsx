import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";
import { leaveApi } from "../../api/leave/leave";
import { leaveAPI } from "../../api/settingsApi/leaveApi";
import debounce from "lodash/debounce";
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
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
  blue: "bg-blue-50 text-blue-700",
  indigo: "bg-indigo-50 text-indigo-700",
};

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Pending":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-slate-50 text-slate-800 border border-slate-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Approved":
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case "Pending":
      return <AlertCircle className="h-4 w-4 text-amber-600" />;
    case "Rejected":
      return <XCircle className="h-4 w-4 text-rose-600" />;
    default:
      return <Clock className="h-4 w-4 text-slate-600" />;
  }
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

  const fetchLeaveData = async (query = "", statusFilter = {}) => {
    try {
      const [dashboardResult, requestsResult, policyResult] =
        await Promise.allSettled([
          leaveApi.getDashboard(),
          leaveApi.getLeaveRequest(query, { ...statusFilter }),
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

  const debouncedSearch = useCallback(
    debounce((query, sort) => fetchLeaveData(query, sort), 500),
    []
  );

  useEffect(() => {
    fetchLeaveData();
  }, [updateDashboard]);

  useEffect(() => {
    debouncedSearch(searchTerm, statusFilter);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
            Leave workspace
          </p>
          <div className="flex flex-wrap flex-col items-baseline gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">
              Leave Management
            </h1>
            <div className="text-sm text-slate-500">
              Approvals, balances, and audit-ready context
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-slate-200 text-slate-800 hover:bg-slate-50"
            onClick={() => setShowLeavePolicyModal(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Leave policy
          </Button>
          <Button
            className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
            onClick={() => setShowCreateLeaveModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create leave
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-5">
        {/* Left column */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            {leaveRequest?.map((request) => (
              <Card
                key={request.id}
                className="border-slate-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold">
                          {request.employee?.first_name?.[0]}
                          {request.employee?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {request.employee?.first_name} {request.employee?.last_name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {request.employee?.employee_no}
                          </p>
                        </div>
                        <Badge className={getStatusColor(LEAVE_STATUS[request?.status])}>
                          {request?.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">
                            Leave type
                          </p>
                          <p className="font-semibold text-slate-900">
                            {request.leave_type?.leave_type}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">
                            Duration
                          </p>
                          <p className="font-semibold text-slate-900">
                            {dayjs(request?.start_date).format("D MMM YYYY")} - {dayjs(request?.end_date).format("D MMM YYYY")}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">
                            Days
                          </p>
                          <p className="font-semibold text-slate-900">
                            {request?.total_days} days
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">
                            Applied
                          </p>
                          <p className="font-semibold text-slate-900">
                            {dayjs(request?.createdAt).format("D MMM YYYY")}
                          </p>
                        </div>
                        {request?.status === "approved" && (
                          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                            <p className="text-xs uppercase tracking-[0.08em] text-emerald-600 font-semibold">
                              Approved
                            </p>
                            <p className="font-semibold text-slate-900">
                              {dayjs(request?.updatedAt).format("D MMM YYYY")}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 bg-white">
                        <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">
                          Reason
                        </p>
                        <p className="text-sm text-slate-800 mt-1">
                          {request?.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 items-start">
                      {request?.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={async () => {
                              ConfirmFn({
                                onDelete: async () => {
                                  try {
                                    const resp = await leaveApi.leaveApproved(
                                      request.id,
                                      request.employee_id
                                    );

                                    if (resp?.status === 200) {
                                      fetchLeaveData();
                                    }
                                  } catch (error) {
                                    console.log(error);
                                  }
                                },
                                text_no: "Cancel",
                                text_yes: "Approve",
                                title: "Approve Leave",
                                message:
                                  "Approve this leave request? Balances will update immediately.",
                              });
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={async () => {
                              ConfirmFn({
                                onDelete: async () => {
                                  try {
                                    const resp = await leaveApi.leaveRejected(
                                      request.id,
                                      request.employee_id
                                    );

                                    if (resp?.status === 200) {
                                      fetchLeaveData();
                                    }
                                  } catch (error) {
                                    console.log(error);
                                  }
                                },
                                text_yes: "Reject",
                                text_no: "Cancel",
                                title: "Reject Leave",
                                message:
                                  "Reject this leave request? The employee will be notified.",
                              });
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}

                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-slate-600 px-2">
                            <Eye className="h-4 w-4 mr-2" />
                            View dates
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="left"
                          align="center"
                          className="text-xs"
                        >
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>ID</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="max-h-36 w-full overflow-y-auto block">
                              {JSON.parse(request?.leave_on)?.map((log) => (
                                <TableRow key={log.date} className="grid grid-cols-2">
                                  <TableCell className="font-medium">
                                    {dayjs(log?.date).format("D MMM YYYY")}
                                  </TableCell>
                                  <TableCell>{log?.id || "-"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {leaveRequest?.length === 0 && <NoDataFound />}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sticky top-20 self-start z-40">
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-5 space-y-4">
              <p className="text-sm font-semibold text-slate-800">Overview</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                {[
                  {
                    label: "Pending requests",
                    value: leaveDash?.pending_requests,
                    tone: "amber",
                    icon: AlertCircle,
                  },
                  {
                    label: "Approved requests",
                    value: leaveDash?.approved_requests,
                    tone: "emerald",
                    icon: CheckCircle,
                  },
                  {
                    label: "Total leave days",
                    value: leaveDash?.total_leave_days,
                    tone: "blue",
                    icon: Calendar,
                  },
                  {
                    label: "This month",
                    value: leaveDash?.this_month,
                    tone: "indigo",
                    icon: Clock,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 bg-white"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">
                          {item.label}
                        </p>
                        <p className="text-xl font-semibold text-slate-900">
                          {item.value ?? 0}
                        </p>
                      </div>
                      <div
                        className={[
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          tone[item.tone],
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Filters</p>
                <p className="text-xs text-slate-500">
                  {leaveRequest?.length ?? 0} requests
                </p>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by employee or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>

                <Select
                  value={statusFilter.status}
                  onValueChange={(val) =>
                    setStatusFilter((prev) => ({ ...prev, status: val }))
                  }
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter.leave_type_id}
                  onValueChange={(val) =>
                    setStatusFilter((prev) => ({ ...prev, leave_type_id: val }))
                  }
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={0}>All types</SelectItem>
                    {leavePolicy?.map((policy) => (
                      <SelectItem key={policy.id} value={policy.id}>
                        {policy?.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        <DialogContent className="p-0 max-w-4xl max-h-[90vh] overflow-y-auto">
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
        onOpenChange={() => setShowLeavePolicyModal()}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Leave Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leavePolicy &&
                leavePolicy?.length > 0 &&
                leavePolicy?.map((section, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{section?.type}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Input value={section?.annual_days} disabled />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leave;
