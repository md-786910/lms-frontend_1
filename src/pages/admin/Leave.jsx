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
  Plus,
  Briefcase,
  Check,
  X,
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
import dayjs from "dayjs";
import AdminLeaveModal from "../../components/AdminLeaveModal";
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
  const [showCreateLeaveModal, setShowCreateLeaveModal] = useState(false);
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
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
      case "Rejected":
        return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
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

  const StatCard = ({ title, value, icon: Icon, colorClass, iconBgClass }) => (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${iconBgClass}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Briefcase className="h-6 w-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-bold">Leave Management</h1>
                <p className="text-blue-100 text-sm">Manage employee leave requests and approvals</p>
             </div>
          </div>
          <div className="flex gap-3">
             <Button 
                onClick={() => setShowCreateLeaveModal(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Leave
             </Button>
             <Button 
                variant="outline"
                onClick={() => setShowLeavePolicyModal(true)}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Filter className="h-4 w-4 mr-2" /> Policy
             </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pending Requests" 
          value={leaveDash?.pending_requests} 
          icon={AlertCircle} 
          colorClass="text-amber-600" 
          iconBgClass="bg-gradient-to-r from-amber-500 to-amber-600" 
        />
        <StatCard 
          title="Approved Requests" 
          value={leaveDash?.approved_requests} 
          icon={CheckCircle} 
          colorClass="text-green-600" 
          iconBgClass="bg-gradient-to-r from-green-500 to-green-600" 
        />
        <StatCard 
          title="Total Leave Days" 
          value={leaveDash?.total_leave_days} 
          icon={Calendar} 
          colorClass="text-blue-600" 
          iconBgClass="bg-gradient-to-r from-blue-500 to-blue-600" 
        />
        <StatCard 
          title="This Month" 
          value={leaveDash?.this_month} 
          icon={Clock} 
          colorClass="text-purple-600" 
          iconBgClass="bg-gradient-to-r from-purple-500 to-purple-600" 
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by employee or leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
            />
         </div>
         
         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Select
              value={statusFilter.status}
              onValueChange={(val) => setStatusFilter((prev) => ({ ...prev, status: val }))}
            >
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Status" />
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
              onValueChange={(val) => setStatusFilter((prev) => ({ ...prev, leave_type_id: val }))}
            >
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
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

      {/* Leave Requests Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <CardTitle className="text-lg font-semibold text-slate-800">Leave Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-medium">
                  <tr>
                    <th className="text-left py-3 px-6">Employee</th>
                    <th className="text-left py-3 px-6">Leave Type</th>
                    <th className="text-left py-3 px-6">Duration</th>
                    <th className="text-center py-3 px-6">Days</th>
                    <th className="text-center py-3 px-6">Applied On</th>
                    <th className="text-center py-3 px-6">Status</th>
                    <th className="text-center py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaveRequest?.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {request.employee?.first_name} {request.employee?.last_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {request.employee?.employee_no}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        {request.leave_type?.leave_type}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                         {dayjs(request?.start_date).format("D MMM")} - {dayjs(request?.end_date).format("D MMM YYYY")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Badge variant="outline" className="font-normal bg-slate-50">
                          {request?.total_days} days
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-slate-500">
                        {dayjs(request?.createdAt).format("D MMM YYYY")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Badge variant="secondary" className={getStatusColor(LEAVE_STATUS[request?.status])}>
                          {request?.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-1">
                          {request?.status === "pending" && (
                             <>
                                <Tooltip>
                                   <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => {
                                          ConfirmFn({
                                            onDelete: async () => {
                                              try {
                                                const resp = await leaveApi.leaveApproved(request.id, request.employee_id);
                                                if (resp?.status === 200) fetchLeaveData();
                                              } catch (error) { console.log(error); }
                                            },
                                            text_no: "Cancel",
                                            text_yes: "Approve",
                                            title: "Approve Leave",
                                            message: "Are you sure you want to approve this leave request?",
                                          });
                                        }}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                   </TooltipTrigger>
                                   <TooltipContent>Approve</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                   <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                          ConfirmFn({
                                            onDelete: async () => {
                                              try {
                                                const resp = await leaveApi.leaveRejected(request.id, request.employee_id);
                                                if (resp?.status === 200) fetchLeaveData();
                                              } catch (error) { console.log(error); }
                                            },
                                            text_no: "Cancel",
                                            text_yes: "Reject",
                                            title: "Reject Leave",
                                            message: "Are you sure you want to reject this leave request?",
                                            warning: true,
                                          });
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                   </TooltipTrigger>
                                   <TooltipContent>Reject</TooltipContent>
                                </Tooltip>
                             </>
                          )}
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-pointer">
                                  {/* Using a Div as trigger to avoid button nesting issues if any, 
                                      but mostly Button is fine. Keeping Button for consistency */}
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                      <Eye className="h-4 w-4" />
                                  </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent 
                              side="left" 
                              className="w-64 p-0 border-slate-200 bg-white shadow-xl"
                            >
                                <div className="p-3 bg-slate-50 border-b border-slate-100 font-medium text-sm">
                                   Leave Breakdown
                                </div>
                                <div className="max-h-48 overflow-y-auto p-2">
                                  <table className="w-full text-xs">
                                     <tbody>
                                       {JSON.parse(request?.leave_on)?.map((log, i) => (
                                          <tr key={i} className="border-b border-slate-50 last:border-0">
                                             <td className="py-2 px-2 text-slate-600">{dayjs(log?.date).format("D MMM YYYY")}</td>
                                             <td className="py-2 px-2 text-right font-medium">{log?.id || "Full Day"}</td>
                                          </tr>
                                       ))}
                                     </tbody>
                                  </table>
                                </div>
                                {request.reason && (
                                   <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                                      <p className="text-xs text-slate-500 font-medium mb-1">Reason:</p>
                                      <p className="text-xs text-slate-700 italic">"{request.reason}"</p>
                                   </div>
                                )}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
             {leaveRequest?.length === 0 && (
                <div className="py-12">
                   <NoDataFound />
                </div>
             )}
          </div>
        </CardContent>
      </Card>

      {/* Create Leave Modal */}
      <Dialog
        open={showCreateLeaveModal}
        onOpenChange={setShowCreateLeaveModal}
      >
        <DialogContent className="p-0 max-w-4xl max-h-[90vh] overflow-hidden bg-slate-50">
          <div className="overflow-y-auto max-h-[90vh]">
             <AdminLeaveModal
               onClose={() => setShowCreateLeaveModal(false)}
               onSuccess={() => {
                 fetchLeaveData();
                 setShowCreateLeaveModal(false);
               }}
             />
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Policy Modal */}
      <Dialog
        open={showLeavePolicyModal}
        onOpenChange={setShowLeavePolicyModal}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-xl">
               <div className="p-2 bg-purple-100 rounded-lg">
                  <Filter className="h-5 w-5 text-purple-600" />
               </div>
               Leave Policy Configuration
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leavePolicy?.map((section, idx) => (
                <Card key={idx} className="border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-slate-50 py-3 px-4 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold text-slate-700 truncate" title={section?.type}>
                        {section?.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-500">Annual Allowance</span>
                       <Badge variant="outline" className="text-base font-bold text-slate-800 border-slate-200 bg-slate-50">
                          {section?.annual_days}
                       </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {leavePolicy?.length === 0 && <NoDataFound />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leave;
