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
  AlertCircle,
  MoreHorizontal
} from "lucide-react";
import LeaveRequestModal from "@/components/LeaveRequestModal";
import { employeeLeaveApi } from "../../api/employee/leaveApi";
import ConfirmFn from "../../utility/confirmFn";
import NoDataFound from "../../common/NoDataFound";
import { useSocketContext } from "../../contexts/SocketContext";
import { Progress } from "@/components/ui/progress";

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Rejected":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "Pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "Rejected":
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
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
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Leave Management
          </h1>
          <p className="text-sm text-muted-foreground">
            View balance and manage your leave requests
          </p>
        </div>
        <Button
          onClick={() => {
            setReadOnly(false);
            setLeaveRequestViewMode({});
            setShowRequestModal(true);
          }}
          className="shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request Leave
        </Button>
      </div>

      {/* Leave Balance */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 px-6 py-4 bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span>Leave Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaveDash?.leaves?.map((leave, index) => {
              const percentage = ((leave.leave_remaing || 0) / leave.leave_count) * 100;
              return (
                <div
                  key={index}
                  className="p-5 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-foreground text-sm">
                      {leave.leave_type}
                    </h3>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {leave.leave_count} Total
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-foreground">
                          {leave.leave_remaing || 0}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">Remaining</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-destructive">
                          {leave.leave_used || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Used</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Progress value={percentage} className="h-2 bg-muted" indicatorClassName="bg-primary" />
                      <p className="text-[10px] text-right text-muted-foreground">{Math.round(percentage)}% Available</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Card className="border border-border/50 shadow-sm bg-emerald-50/50 dark:bg-emerald-900/10">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Approved</p>
                  <p className="text-2xl font-bold text-foreground">{leaveDash?.total_approved || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm bg-amber-50/50 dark:bg-amber-900/10">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{leaveDash?.total_pending || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm bg-purple-50/50 dark:bg-purple-900/10">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Total Balance</p>
                  <p className="text-2xl font-bold text-foreground">{leaveDash?.total_remaining || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leave Requests List */}
        <Card className="lg:col-span-2 border border-border/50 shadow-sm h-full">
          <CardHeader className="border-b border-border/50 px-6 py-4 bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Request History</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {leaveRequest?.length > 0 ? (
                leaveRequest.map((request) => (
                  <div
                    key={request.id}
                    className="p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row justify-between gap-4 group"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <h3 className="font-semibold text-foreground text-sm">
                          {request.type}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`font-medium border ${getStatusColor(
                            LEAVE_STATUS[request?.status]
                          )}`}
                        >
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(LEAVE_STATUS[request?.status])}
                            <span>{request?.status}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Duration</p>
                          <p className="text-foreground mt-0.5 font-medium">
                            {new Date(request.start_date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })} 
                            <span className="text-muted-foreground mx-2">→</span>
                            {new Date(request.end_date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}
                            <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {request.total_days} days
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Applied On</p>
                          <p className="text-foreground mt-0.5">
                            {new Date(request.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="col-span-2 mt-2">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Note</p>
                          <p className="text-muted-foreground mt-0.5 italic text-xs">
                            "{request.reason || "No reason provided"}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center sm:items-start gap-2 pt-2 sm:pt-0">
                      {request.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/20 hover:bg-destructive/10 h-8 text-xs"
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
                              text_yes: "Yes, Cancel",
                              title: "Cancel Request",
                              message:
                                "Are you sure you want to cancel this pending leave request?",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setReadOnly(true);
                          setLeaveRequestViewMode(request || {});
                          setShowRequestModal(true);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 flex justify-center">
                  <NoDataFound message="No leave requests found" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-card shadow-2xl">
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
