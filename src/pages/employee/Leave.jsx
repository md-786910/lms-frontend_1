import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Plus,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LeaveRequestModal from "@/components/LeaveRequestModal";
import { employeeLeaveApi } from "../../api/employee/leaveApi";
import ConfirmFn from "../../utility/confirmFn";

const LEAVE_STATUS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const EmployeeLeave = () => {
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
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Leave Management
          </h1>
          <p className="text-slate-600">
            Request and manage your leave applications
          </p>
        </div>
        <Button
          onClick={() => {
            setReadOnly(false);
            setLeaveRequestViewMode({});
            setShowRequestModal(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request Leave
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Total Approved
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {leaveDash?.total_approved || 0} days
            </p>
            <p className="text-sm text-slate-600">This year</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Pending
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              {leaveDash?.total_pending || 0} days
            </p>
            <p className="text-sm text-slate-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <CalendarDays className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Remaining
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {leaveDash?.total_remaining || 0} days
            </p>
            <p className="text-sm text-slate-600">Available balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <span>Leave Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {leaveDash?.leaves?.map((leave, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border"
              >
                <h3 className="font-semibold text-slate-800">
                  {leave.leave_type}
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-medium">
                      {leave.leave_count || 0} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Used:</span>
                    <span className="font-medium text-red-600">
                      {leave.leave_used || 0} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Remaining:</span>
                    <span className="font-medium text-green-600">
                      {leave.leave_remaing || 0} days
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          ((leave.leave_remaing || 0) / leave.leave_count) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>My Leave Requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveRequest?.map((request) => (
              <div
                key={request.id}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Duration:</span>
                        <p className="font-medium">
                          {new Date(request.start_date).toLocaleDateString()} -{" "}
                          {new Date(request.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-slate-500">
                          {request.total_days} day
                          {request.total_days > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600">Reason:</span>
                        <p className="font-medium">{request.reason}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Applied Date:</span>
                        <p className="font-medium">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {request.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
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
                      </Button>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request New Leave</DialogTitle>
          </DialogHeader>
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
