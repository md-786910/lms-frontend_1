import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const leaveRequests = [
    {
      id: 1,
      type: "Annual Leave",
      startDate: "2024-02-20",
      endDate: "2024-02-22",
      days: 3,
      status: "Approved",
      reason: "Family vacation",
      appliedDate: "2024-02-01",
    },
    {
      id: 2,
      type: "Sick Leave",
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      days: 1,
      status: "Approved",
      reason: "Medical appointment",
      appliedDate: "2024-01-14",
    },
    {
      id: 3,
      type: "Personal Leave",
      startDate: "2024-03-10",
      endDate: "2024-03-12",
      days: 3,
      status: "Pending",
      reason: "Personal matters",
      appliedDate: "2024-02-28",
    },
  ];

  const leaveBalance = [
    { type: "Annual Leave", total: 25, used: 7, remaining: 18 },
    { type: "Sick Leave", total: 15, used: 5, remaining: 10 },
    { type: "Personal Leave", total: 10, used: 3, remaining: 7 },
    { type: "Emergency Leave", total: 5, used: 0, remaining: 5 },
  ];

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
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-1">Request and manage your leave applications efficiently.</p>
        </div>
        <button 
          onClick={() => {
            setReadOnly(false);
            setLeaveRequestViewMode({});
            setShowRequestModal(true);
          }}
          className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-bold shadow-glow transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request Leave
        </button>
      </div>

      {/* Leave Balance */}
      <div className="bg-white rounded-md border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Leave Balance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaveDash?.leaves?.map((leave, index) => (
            <div 
              key={index}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-900">{leave.leave_type}</h4>
                <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600">Annual</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total:</span>
                  <span className="font-bold text-slate-900">{leave.leave_count || 0} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Used:</span>
                  <span className="font-bold text-red-500">{leave.leave_used || 0} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining:</span>
                  <span className="font-bold text-[#7BCD40]">{leave.leave_remaing || 0} days</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#7BCD40] h-2 rounded-full" 
                    style={{ width: `${
                          ((leave.leave_remaing || 0) / leave.leave_count) * 100
                        }%` }}
                    ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-md border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">My Leave Requests</h3>
        </div>
        {leaveRequest?.map((request) => (
          <div 
            key={request.id}
            className="bg-slate-50 my-2 rounded-2xl border border-slate-100 p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                <h3 className="font-semibold text-slate-800">
                  {request.type}
                </h3>
                <Badge
                  className={getStatusColor(
                    LEAVE_STATUS[request?.status]
                  )}
                >
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(LEAVE_STATUS[request?.status])}
                    <span>{request?.status}</span>
                  </div>
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Duration</p>
                <p className="font-bold text-slate-900 text-base">
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
                <p className="text-xs text-slate-500 mt-1">
                  {request.total_days} day
                  {request.total_days > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex-1 lg:px-8">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm font-medium text-slate-700">{request.reason}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Applied Date</p>
                <p className="font-bold text-slate-900 text-sm">
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
                  className="px-4 py-2 bg-white border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-md border border-border dark:border-border-dark shadow-card flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-base" />
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Approved</h4>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{leaveDash?.total_approved || 0} <span className="text-sm text-slate-400 font-normal">days</span></p>
          <p className="text-xs text-slate-400">This year</p>
        </div>
        <div className="bg-white dark:bg-dark-surface p-6 rounded-md border border-border dark:border-border-dark shadow-card flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-md bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center mb-2">
            <Clock className="h-8 w-8 text-base" />
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Pending</h4>
          <p className="text-3xl font-bold text-orange-500">{leaveDash?.total_pending || 0} <span className="text-sm text-slate-400 font-normal">days</span></p>
          <p className="text-xs text-slate-400">Awaiting approval</p>
        </div>
        <div className="bg-white dark:bg-dark-surface p-6 rounded-md border border-border dark:border-border-dark shadow-card flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-2">
            <CalendarDays className="h-8 w-8 text-base" />
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Remaining</h4>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{leaveDash?.total_remaining || 0} <span className="text-sm text-slate-400 font-normal">days</span></p>
          <p className="text-xs text-slate-400">Available balance</p>
        </div>
      </div>

      {/* Leave Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
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
