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
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";
import { useFormValidation } from "../../hooks/useFormValidation";
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
import { format, parseISO } from "date-fns";
import { useSocketContext } from "../../contexts/SocketContext";

// Validation schema for leave policy modal
const leavePolicySchema = {
  annualAllowance: [
    { type: "required" },
    { type: "number", message: "Must be a number" },
  ],
  carryForwardLimit: [{ type: "required" }, { type: "number" }],
  noticePeriod: [{ type: "required" }, { type: "number" }],
  sickAllowance: [{ type: "required" }, { type: "number" }],
  sickCertificate: [{ type: "required" }, { type: "number" }],
  personalAllowance: [{ type: "required" }, { type: "number" }],
  personalNotice: [{ type: "required" }, { type: "number" }],
  personalMaxDays: [{ type: "required" }, { type: "number" }],
  maternityLeave: [{ type: "required" }, { type: "number" }],
  paternityLeave: [{ type: "required" }, { type: "number" }],
  maternityNotice: [{ type: "required" }, { type: "number" }],
};

const LEAVE_STATUS = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
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
  const [leaveDash, setLeaveDash] = useState(null);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [leavePolicy, setLeavePolicy] = useState([]);
  const {
    values: policyForm,
    errors: policyErrors,
    touched: policyTouched,
    handleChange,
    handleBlur,
    validateForm,
  } = useFormValidation(
    {
      annualAllowance: "25",
      carryForwardLimit: "5",
      noticePeriod: "7",
      sickAllowance: "10",
      sickCertificate: "3",
      personalAllowance: "5",
      personalNotice: "1",
      personalMaxDays: "2",
      maternityLeave: "90",
      paternityLeave: "15",
      maternityNotice: "30",
    },
    leavePolicySchema,
    {
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Fetch leave data (with optional search param)
  const fetchLeaveData = async (query = "", statusFilter = {}) => {
    try {
      const [dashboardResult, requestsResult, policyResult] =
        await Promise.allSettled([
          leaveApi.getDashboard(),
          leaveApi.getLeaveRequest(query, {
            ...statusFilter,
          }),
          leaveAPI.getleave(),
        ]);

      if (
        dashboardResult.status === "fulfilled" &&
        dashboardResult.value.status
      ) {
        setLeaveDash(dashboardResult.value.data?.data);
      }
      if (
        requestsResult.status === "fulfilled" &&
        requestsResult.value.status
      ) {
        setLeaveRequest(requestsResult.value.data?.data);
      }

      if (policyResult.status === "fulfilled" && policyResult.value.status) {
        setLeavePolicy(policyResult.value?.data);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  // Debounced version
  const debouncedSearch = useCallback(
    debounce((query, sort) => fetchLeaveData(query, sort), 500),
    []
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchLeaveData();
  }, [updateDashboard]);

  // Watch search input changes and trigger debounced fetch
  useEffect(() => {
    debouncedSearch(searchTerm, statusFilter);
  }, [searchTerm, statusFilter]);
  const tooltip = {
    children:
      "You can import all employees into the salary module manually by using this button if they are not imported automatically.",
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Leave Management
          </h1>
          <p className="text-slate-600">
            Manage employee leave requests and approvals
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setShowLeavePolicyModal(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Leave Policy
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Pending Requests
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {leaveDash?.pending_requests}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Approved Requests
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {leaveDash?.approved_requests}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Leave Days
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {" "}
                  {leaveDash?.total_leave_days}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-purple-600">
                  {leaveDash?.this_month}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by employee name or leave type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter.status}
              onValueChange={(val) => {
                setStatusFilter((prev) => ({ ...prev, status: val }));
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter.leave_type_id}
              onValueChange={(val) => {
                setStatusFilter((prev) => ({ ...prev, leave_type_id: val }));
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={0}>All type</SelectItem>
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

      {/* Leave Requests */}
      <div className="grid grid-cols-1 gap-6">
        {leaveRequest?.map((request) => (
          <Card
            key={request.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(LEAVE_STATUS[request?.status])}
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {request.employee?.first_name}{" "}
                        {request.employee?.last_name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {request.employee?.employee_no}
                      </p>
                    </div>
                    <Badge
                      className={getStatusColor(LEAVE_STATUS[request?.status])}
                    >
                      {request?.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Leave Type</p>
                      <p className="font-medium text-slate-800">
                        {request.leave_type?.leave_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Duration</p>
                      <p className="font-medium text-slate-800">
                        {new Date(request?.start_date).toLocaleDateString()} -{" "}
                        {new Date(request?.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Days</p>
                      <p className="font-medium text-slate-800">
                        {request?.total_days} days
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Applied Date</p>
                      <p className="font-medium text-slate-800">
                        {new Date(request?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {request?.status === "approved" && (
                      <div>
                        <p className="text-green-500">Approved Date</p>
                        <p className="font-medium text-slate-800">
                          {new Date(request?.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-slate-500 text-sm">Reason</p>
                    <p className="text-slate-800">{request?.reason}</p>
                  </div>
                </div>

                {request?.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
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
                          text_yes: "Approved",
                          title: "Approve Leave",
                          message:
                            "Are you sure you want to approve this leave request?",
                        });
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
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
                          text_no: "Cancel",
                          text_yes: "Reject",
                          title: "Reject Leave",
                          message:
                            "Are you sure you want to Reject this leave request?",
                        });
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                <Tooltip delayDuration={100} className="cursor-pointer">
                  <TooltipTrigger asChild>
                    <Eye className="cursor-pointer h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    align="center"
                    className="text-xs "
                    children={
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <div className="max-h-36 w-full overflow-y-auto">
                          <TableBody>
                            {JSON.parse(request?.leave_on)?.map((log) => (
                              <TableRow key={log.date}>
                                <TableCell className="font-medium">
                                  {format(parseISO(log?.date), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell>{log?.id || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </div>
                      </Table>
                    }
                  />
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leaveRequest?.length == 0 && <NoDataFound />}

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
              {/* Render leave policy cards */}
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
