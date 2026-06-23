import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import holidayJsonData from "../../data/holiday.json";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LeaveRequestModal from "@/components/LeaveRequestModal";
import ProofOfWorkModal from "@/components/ProofOfWorkModal";
import {
  Calendar as CalendarIcon,
  Clock,
  RotateCcw,
  IndianRupee,
  TrendingUp,
  Check,
  Award,
  X,
  AlertCircle,
  BellRing,
  Bell,
  CalendarPlus,
  Ribbon,
  CalendarX,
  CheckCircle,
  FileCheck2,
} from "lucide-react";
import { EmpDashboardApi } from "../../api/employee/dashboard";
import { useSocketContext } from "../../contexts/SocketContext";
import { authAPI } from "../../api/authapi/authAPI";
import dayjs from "dayjs";
import NoDataFound from "../../common/NoDataFound";
import { employeeLeaveApi } from "../../api/employee/leaveApi";
import { proofOfWorkApi } from "../../api/proofOfWorkApi";
import { formatLeaveDays } from "../../utility/utility";

const EmployeeDashboard = () => {
  const { updateDashboard } = useSocketContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickStat, setQuickStat] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayList, setHolidayList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [basicProfile, setBasicProfile] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [readOnly, setReadOnly] = useState(false);
  const [leaveDash, setLeaveDash] = useState(null);
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showProofOfWorkModal, setShowProofOfWorkModal] = useState(false);
  const [proofOfWorkRecords, setProofOfWorkRecords] = useState([]);
  const [proofOfWorkLoading, setProofOfWorkLoading] = useState(false);
  const [leaveRequestViewMode, setLeaveRequestViewMode] = useState({});
  const [greeting, setGreeting] = useState("");
  const statToneMap = {
    amber: {
      accent: "bg-amber-500",
      chip: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      iconBg: "bg-amber-100 text-amber-700",
    },
    blue: {
      accent: "bg-blue-600",
      chip: "bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
      iconBg: "bg-blue-100 text-blue-700",
    },
    violet: {
      accent: "bg-violet-600",
      chip: "bg-violet-50 text-violet-700",
      dot: "bg-violet-500",
      iconBg: "bg-violet-100 text-violet-700",
    },
    emerald: {
      accent: "bg-emerald-600",
      chip: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    default: {
      accent: "bg-slate-500",
      chip: "bg-slate-100 text-slate-700",
      dot: "bg-slate-500",
      iconBg: "bg-slate-100 text-slate-700",
    },
    rose: {
      accent: "bg-rose-500",
      chip: "bg-rose-50 text-rose-700",
      dot: "bg-rose-500",
      iconBg: "bg-rose-100 text-rose-700",
    },
  };
  const myLeaveData = [
    {
      id: 1,
      date: new Date(2024, 1, 20),
      type: "Vacation",
      status: "Approved",
      reason: "Family vacation",
    },
    {
      id: 2,
      date: new Date(2024, 1, 21),
      type: "Vacation",
      status: "Approved",
      reason: "Family vacation",
    },
    {
      id: 3,
      date: new Date(2024, 2, 15),
      type: "Sick Leave",
      status: "Pending",
      reason: "Medical appointment",
    },
  ];

  const getLeaveForDate = (date) => {
    return myLeaveData.filter((leave) => isSameDay(leave.date, date));
  };

  const selectedDateLeaves = selectedDate ? getLeaveForDate(selectedDate) : [];

  const handleClockIn = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setClockedIn(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleClockOut = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setClockedIn(false);
      setIsLoading(false);
    }, 1000);
  };

  const fetchNotification = async () => {
    try {
      const response = await authAPI.getNotification();
      if (response.status) {
        setNotifications(response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  useEffect(() => {
    const year = new Date().getFullYear();
    const holidayData = holidayJsonData.holiday_data?.find(
      (item) => item.year === year
    );
    if (holidayData) {
      setHolidayList(holidayData);
    }

    const fetchDashboard = async () => {
      try {
        const [dashboardRes, profileRes, leaveRes] = await Promise.all([
          EmpDashboardApi.getDashboard(),
          EmpDashboardApi.getProfileBasicInfo(),
          employeeLeaveApi.getLeave(),
        ]);

        const allSuccessful =
          dashboardRes?.status === 200 &&
          profileRes?.status === 200 &&
          leaveRes?.status === 200;

        if (!allSuccessful) {
          console.warn("Some API responses were not 200.");
          return;
        }

        const dashboard = dashboardRes.data?.data || {};
        const leaveBalanceValue = dashboard.leave_balance ?? 0;
        const leaveBalanceText = formatLeaveDays(leaveBalanceValue);
        const leaveBalanceTone = leaveBalanceValue < 0 ? "rose" : "blue";
        const profile = profileRes.data?.data || {};
        const leaves = leaveRes.data?.data || {};

        const quickStats = [
          {
            title: "Total Approved leave",
            value: `${leaves.total_approved || 0} days`,
            subtitle: "This year",
            icon: TrendingUp,
            tone: "amber",
          },
          {
            title: "Leave Balance",
            value: leaveBalanceText,
            subtitle: "Available this year",
            icon: CalendarIcon,
            tone: leaveBalanceTone,
          },
          {
            title: "Current Salary",
            value: `\u20B9${dashboard.net_salary || 0}`,
            subtitle: "Annual gross",
            icon: IndianRupee,
            tone: "violet",
          },
        ];

        setQuickStat(quickStats);
        setDashboardData(dashboard);
        setBasicProfile(profile);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
    fetchDashboard();
  }, [updateDashboard]);
  const handleRequestSuccess = () => {
    console.log("Leave request submitted successfully");
  };

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

  const fetchProofOfWork = async () => {
    setProofOfWorkLoading(true);
    try {
      const resp = await proofOfWorkApi.getMySubmissions();
      if (resp.status === 200) {
        setProofOfWorkRecords(resp.data?.data || []);
      }
    } catch (error) {
      console.error("Proof of Work fetch error:", error);
    } finally {
      setProofOfWorkLoading(false);
    }
  };

  useEffect(() => {
    fetchLeave();
    getLeaveRequest();
    fetchProofOfWork();
  }, [updateDashboard]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) setGreeting("Good Morning");
      else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
      else if (hour >= 17 && hour < 22) setGreeting("Good Evening");
      else setGreeting("Good Night");
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-600 text-lg">
        Loading dashboard...
      </div>
    );
  }
  const leaveData = (dashboardData?.employeesOnLeaveToday || []).map(
    (leave, index) => ({
      id: index,
      emp_id: leave.employee.id,
      employeeName: `${leave.employee.first_name} ${leave.employee.last_name}`,
      employeeId: leave.employee.employee_no,
      date: new Date(),
      type: leave.leave_type.leave_type,
      status: leave.status,
      leaveOn: JSON.parse(leave?.leave_on)?.find(
        (f) => f.date === format(new Date(), "yyyy-MM-dd")
      ),
    })
  );

  const recentActivities = (dashboardData?.activities || []).map((activity) => {
    const activityType = (
      activity?.type ||
      activity?.status ||
      "info"
    )
      ?.toString()
      .toLowerCase();

    return {
      type: activityType,
      message: activity.title,
      time: new Date(activity.createdAt).toLocaleString(),
      status: "completed",
      createdAt: activity.createdAt,
      title: activity.title,
    };
  });
  const dashboardLeaveBalance = dashboardData?.leave_balance ?? 0;
  const formattedDashboardBalance = formatLeaveDays(dashboardLeaveBalance);
  const dashboardBalanceClass =
    dashboardLeaveBalance < 0 ? "text-rose-200" : "text-emerald-200";
  const proofStatusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rejected: "bg-rose-50 text-rose-700 border-rose-100",
  };
  const proofTypeLabels = {
    remote: "Remote Work",
    overtime: "Overtime",
    special_assignment: "Special Assignment",
    task_completion: "Task Completion",
  };
  const recentProofOfWork = proofOfWorkRecords.slice(0, 5);
  return (
    <>
      <div className="space-y-8">
        {notifications?.filter((a) => !a.read)?.length > 0 && (
          <div className="grid gap-3">
            {notifications
              ?.filter((a) => !a.read)
              ?.map((notification) => {
                const isLeaveRequest =
                  notification.title?.toLowerCase().includes("leave");
                const isApproved =
                  notification.message?.toLowerCase().includes("approved");
                const isRejected =
                  notification.message?.toLowerCase().includes("rejected");

                const tone = (() => {
                  if (isApproved) return "emerald";
                  if (isRejected) return "rose";
                  if (isLeaveRequest) return "indigo";
                  return "blue";
                })();

                const tonePalette = {
                  emerald: {
                    indicator: "bg-emerald-500",
                    icon: "bg-emerald-100 text-emerald-700",
                    badge: "bg-emerald-50 text-emerald-700",
                  },
                  rose: {
                    indicator: "bg-rose-500",
                    icon: "bg-rose-100 text-rose-700",
                    badge: "bg-rose-50 text-rose-700",
                  },
                  indigo: {
                    indicator: "bg-indigo-500",
                    icon: "bg-indigo-100 text-indigo-700",
                    badge: "bg-indigo-50 text-indigo-700",
                  },
                  blue: {
                    indicator: "bg-blue-500",
                    icon: "bg-blue-100 text-blue-700",
                    badge: "bg-blue-50 text-blue-700",
                  },
                };

                const palette = tonePalette[tone];

                const getIcon = () => {
                  if (isApproved)
                    return <CheckCircle className="h-5 w-5" />;
                  if (isRejected) return <X className="h-5 w-5" />;
                  if (isLeaveRequest)
                    return <CalendarIcon className="h-5 w-5" />;
                  return <Bell className="h-5 w-5" />;
                };

                const getTitle = () => {
                  if (isApproved) return "Leave Approved";
                  if (isRejected) return "Leave Rejected";
                  if (isLeaveRequest) return "Leave Update";
                  return notification.title || "Notification";
                };

                return (
                  <div
                    key={notification.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    onClick={async () => {
                      const resp = await authAPI.readNotification(
                        notification.id
                      );
                      if (resp.status) {
                        fetchNotification();
                      }
                    }}
                  >
                    <div className={`absolute inset-y-0 left-0 w-1 ${palette.indicator}`} />
                    <div className="flex items-start gap-4 p-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl ${palette.icon} flex items-center justify-center shadow-md`}
                      >
                        {getIcon()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm">
                            {getTitle()}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`text-[11px] font-semibold ${palette.badge} border border-transparent`}
                          >
                            New
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {dayjs(notification.createdAt).fromNow()}
                        </p>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const resp = await authAPI.readNotification(
                            notification.id
                          );
                          if (resp.status) {
                            fetchNotification();
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        <Card className="border border-slate-200 shadow-md rounded-md bg-slate-900 text-white overflow-hidden">
          <CardContent className="p-5 md:p-7 relative">
            <div className="grid grid-cols-12 items-center gap-4 relative z-10">
              <div className="col-span-12 md:col-span-8 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#FFFFFF] tracking-tight font-monserrat">
                    {greeting}, {basicProfile?.first_name + " " + basicProfile?.last_name}!
                  </h1>
                </div>
                <p className="text-[#FFFFFF] opacity-90 font-medium text-sm max-w-2xl font-montserrat">
                  Stay on top of your leave balance, team updates, and recent activity with a dashboard built for daily flow.
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 flex md:justify-end">
                <div className="flex items-center gap-3">
                  <Button
                    size="lg"
                    className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
                    onClick={() => {
                      setReadOnly(false);
                      setLeaveRequestViewMode({});
                      setShowRequestModal(true);
                    }}
                  >
                    Apply for Leave
                  </Button>                  <Button
                    size="lg"
                    className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
                    onClick={() => setShowProofOfWorkModal(true)}
                  >
                    Apply for Proof of Work
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
                    onClick={() => setShowHolidayModal(true)}
                  >
                    View Leave Policy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStat?.map((stat, index) => {
            const Icon = stat.icon;
            const palette = statToneMap[stat.tone] || statToneMap.default;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border rounded-md border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`absolute inset-x-0 top-0 h-[1px] ${palette.accent}`} />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold capitalize font-montserrat tracking-wide ${palette.chip}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${palette.dot}`} />
                        {stat.subtitle}
                      </span>
                      <p className="text-lg font-semibold text-slate-900 font-montserrat">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 leading-tight font-montserrat">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-2xl ${palette.iconBg} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Card className="rounded-md border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center font-montserrat gap-2">
              <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
                <FileCheck2 className="h-5 w-5" />
              </span>
              My Proof of Work
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {proofOfWorkLoading ? (
              <p className="text-sm font-semibold text-slate-500 font-montserrat">Loading submissions...</p>
            ) : recentProofOfWork.length > 0 ? (
              <div className="space-y-3">
                {recentProofOfWork.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 font-montserrat">{submission.title}</p>
                        <Badge className={"capitalize border text-xs " + (proofStatusStyles[submission.status] || proofStatusStyles.pending)}>
                          {submission.status}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium text-slate-500 font-montserrat">
                        {proofTypeLabels[submission.work_type] || submission.work_type} - {dayjs(submission.work_date).format("D MMM YYYY")} - {(submission.attachments || []).length} evidence file{(submission.attachments || []).length === 1 ? "" : "s"}
                      </p>
                    </div>
                    {submission.manager_comment && (
                      <p className="text-xs font-semibold text-slate-500 lg:max-w-md">
                        {submission.manager_comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <NoDataFound title="No proof of work submitted yet" />
            )}
          </CardContent>
        </Card>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 rounded-md border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center font-montserrat gap-2">
                <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
                  <CalendarIcon className="h-5 w-5" />
                </span>
                Schedule & Team Leaves
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100">
                  <div className="rounded-xl border border-slate-200 shadow-sm bg-slate-50">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      required
                      className="w-full m-0"
                      classNames={{
                        months: "space-y-4",
                        month: "space-y-4",
                        table: "w-full border-collapse",
                        head_row:
                          "grid grid-cols-7 text-xs text-slate-500 font-semibold",
                        head_cell: "text-center py-1",
                        row: "grid grid-cols-7 text-center",
                        cell: "text-sm relative",
                        day: "h-10 w-10 mx-auto flex items-center justify-center rounded-full font-semibold",
                        day_selected:
                          "bg-slate-900 text-white shadow-lg shadow-slate-900/15",
                        day_today:
                          "border border-slate-900/30 text-slate-900",
                      }}
                      modifiers={{
                        hasLeave: leaveData.map((leave) => leave.date),
                      }}
                      modifiersStyles={{
                        hasLeave: {
                          border: "2px solid rgba(59,130,246,0.35)",
                          backgroundColor: "rgba(59,130,246,0.08)",
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">
                        {selectedDate
                          ? format(selectedDate, "EEEE, dd MMMM")
                          : "Select a date"}
                      </h4>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-slate-200 text-slate-700 font-montserrat"
                    >
                      Calendar
                    </Badge>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-slate-900 font-montserrat">
                        Team on leave today
                      </p>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {leaveData?.length > 0 ? (
                        leaveData.map((leave) => (
                          <div
                            key={leave.id}
                            className="p-4 flex items-center justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900 font-montserrat">
                                {leave.employeeName}
                              </p>
                              <p className="text-xs text-slate-500 font-montserrat">
                                ID: {leave.employeeId}
                              </p>
                            </div>
                            <Badge
                              className="rounded-full text-xs font-semibold font-montserrat border-slate-200"
                              variant="outline"
                            >
                              {leave.type}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 flex flex-col items-center text-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                            <CalendarX className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-semibold text-slate-900 font-montserrat">
                            Clear schedule
                          </p>
                          <p className="text-xs text-slate-500 font-montserrat">
                            No one is on leave today.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border border-slate-200 rounded-md shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center font-montserrat gap-2">
                <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
                  <BellRing className="h-5 w-5" />
                </span>
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
                      <AlertCircle className="h-5 w-5 text-primary" />
                    </div>
                    {index !== recentActivities.length - 1 && (
                      <div className="absolute left-1/2 top-10 -ml-px h-8 w-[2px] bg-slate-100" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900 font-montserrat">
                      {activity.message}
                    </p>
                    <p className="text-xs text-slate-500 font-montserrat">
                      {dayjs(activity.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Leave Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden rounded-md border border-slate-200 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-amber-500" />
            <CardHeader className="py-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold font-montserrat text-slate-900">
                <Award className="h-5 w-5 text-amber-600" />
                <span>
                  My leaves for Month - {format(new Date(), "MMMM yyyy")}
                </span>
              </CardTitle>
              <p className="text-sm text-slate-500">Current month snapshot</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-t border-slate-100">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="py-3 px-4 text-md font-semibold capitalize tracking-wide text-slate-600 font-montserrat">
                        Name
                      </th>
                      <th className="py-3 px-4 text-md font-semibold capitalize tracking-wide text-slate-600 text-right font-montserrat">
                        Total Leave (Days)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData?.current_month_leaves || []).length > 0 ? (
                      dashboardData.current_month_leaves.map(
                        ({ employee: emp, total_leave }, index) => (
                          <tr
                            key={index}
                            className="border-t border-slate-100 hover:bg-slate-50/70 font-montserrat"
                          >
                            <td className="py-3 px-4 text-sm text-slate-900 font-montserrat">
                              {emp.employee_name ||
                                `${emp.first_name || ""} ${emp.last_name || ""
                                  }`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700 text-right font-semibold font-montserrat">
                              {total_leave ?? 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="py-6 text-center text-slate-500 text-sm font-montserrat"
                        >
                          No leave data available for this month
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden rounded-md border border-slate-200 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-primary" />
            <CardHeader className="py-3">
              <CardTitle className="flex justify-between items-center text-base font-semibold text-slate-900 font-montserrat">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>
                    My leaves for Month -{" "}
                    {format(
                      new Date(new Date().setMonth(new Date().getMonth() - 1)),
                      "MMMM yyyy"
                    )}
                  </span>
                </div>
              </CardTitle>
              <p className="text-sm text-slate-500">Previous month snapshot</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-t border-slate-100">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="text-left py-3 px-4 text-md font-montserrat font-semibold capitalize tracking-wide text-slate-600">
                        Name
                      </th>
                      <th className="text-right py-3 px-4 text-md font-montserrat font-semibold capitalize tracking-wide text-slate-600">
                        Total Leave (Days)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData?.previous_month_leaves || []).length > 0 ? (
                      dashboardData.previous_month_leaves.map(
                        ({ employee: emp, total_leave }, index) => (
                          <tr
                            key={index}
                            className="border-t border-slate-100 hover:bg-slate-50/70 font-montserrat"
                          >
                            <td className="py-3 px-4 text-sm text-slate-900 font-montserrat">
                              {emp.employee_name ||
                                `${emp.first_name || ""} ${emp.last_name || ""
                                  }`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700 text-right font-semibold font-montserrat">
                              {total_leave ?? 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="py-6 text-center text-slate-500 text-sm font-montserrat"
                        >
                          No leave data available for previous month
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showHolidayModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setShowHolidayModal(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl transform translate-x-0 transition-transform duration-300 ease-in-out flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                ?? Holiday List
              </h2>
              <button
                onClick={() => setShowHolidayModal(false)}
                className="text-slate-500 hover:text-red-500 text-2xl font-bold transition duration-200"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="font-medium ">Fixed Holidays</h4>
              {holidayList?.fixed_holidays?.map((holiday, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border rounded-lg transition duration-200"
                >
                  <h3 className="font-medium text-slate-800">
                    {index + 1}. {holiday.name}
                  </h3>
                  <p className="text-sm text-[#ea580c]">
                    {new Date(holiday.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}

              <br />
              <h4 className="font-medium ">Restricted Holidays</h4>
              {holidayList?.restricted_holidays?.map((holiday, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border rounded-lg transition duration-200"
                >
                  <h3 className="font-medium text-slate-800">
                    {index + 1}. {holiday.name}
                  </h3>
                  <p className="text-sm  text-[#ea580c]">
                    {new Date(holiday.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
      <Dialog open={showProofOfWorkModal} onOpenChange={setShowProofOfWorkModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scroll-slim p-0 gap-0">
          <ProofOfWorkModal
            onClose={() => setShowProofOfWorkModal(false)}
            onSuccess={fetchProofOfWork}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeDashboard;
