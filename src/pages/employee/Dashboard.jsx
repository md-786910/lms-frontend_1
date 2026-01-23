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
  Bell,
  CalendarPlus,
  Ribbon,
  CalendarX,
  CheckCircle,
} from "lucide-react";
import { EmpDashboardApi } from "../../api/employee/dashboard";
import { useSocketContext } from "../../contexts/SocketContext";
import { authAPI } from "../../api/authapi/authAPI";
import dayjs from "dayjs";
import NoDataFound from "../../common/NoDataFound";
import { employeeLeaveApi } from "../../api/employee/leaveApi";

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
  const [leaveRequestViewMode, setLeaveRequestViewMode] = useState({});
  const [greeting, setGreeting] = useState("");
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
        const profile = profileRes.data?.data || {};
        const leaves = leaveRes.data?.data || {};

        const quickStats = [
          {
            title: "Total Approved leave",
            value: `${leaves.total_approved || 0} days`,
            subtitle: "This year",
            icon: TrendingUp,
            color: "from-orange-500 to-orange-600",
          },
          {
            title: "Leave Balance",
            value: `${dashboard.leave_balance || 0} days`,
            subtitle: "Available this year",
            icon: CalendarIcon,
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "Current Salary",
            value: `\u20B9${dashboard.net_salary || 0}`,
            subtitle: "Annual gross",
            icon: IndianRupee,
            color: "from-purple-500 to-purple-600",
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

  useEffect(() => {
    fetchLeave();
    getLeaveRequest();
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

                const getIcon = () => {
                  if (isApproved)
                    return <CheckCircle className="h-5 w-5 text-white" />;
                  if (isRejected) return <X className="h-5 w-5 text-white" />;
                  if (isLeaveRequest)
                    return <CalendarIcon className="h-5 w-5 text-white" />;
                  return <Bell className="h-5 w-5 text-white" />;
                };

                const getGradient = () => {
                  if (isApproved) return "from-emerald-500 to-green-600";
                  if (isRejected) return "from-red-500 to-rose-600";
                  if (isLeaveRequest) return "from-indigo-500 to-purple-600";
                  return "from-blue-500 to-indigo-600";
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
                    <div
                      className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${getGradient()}`}
                    />
                    <div className="flex items-start gap-4 p-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-md`}
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
                            className="text-[11px] font-semibold bg-slate-100 text-slate-700"
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

        <Card className="relative overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#a5b4fc_0,_transparent_40%),radial-gradient(circle_at_bottom_right,_#67e8f9_0,_transparent_35%)]" />
          <CardContent className="relative p-8 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-4 max-w-2xl">
                <Badge className="bg-white/15 text-white border border-white/20 font-semibold rounded-full px-3 py-1 shadow-sm w-fit uppercase tracking-wide">
                  Active Employee
                </Badge>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
                    {greeting}, {basicProfile?.first_name + " " + basicProfile?.last_name}!{" "}
                    <span className="inline-block align-middle">??</span>
                  </h2>
                  <p className="text-sm md:text-base text-slate-200 max-w-xl">
                    Stay on top of your leave balance, team updates, and recent activity with a
                    dashboard built for daily flow.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-6 shadow-lg shadow-slate-900/20"
                    onClick={() => {
                      setReadOnly(false);
                      setLeaveRequestViewMode({});
                      setShowRequestModal(true);
                    }}
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Apply for Leave
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-[#374151] hover:bg-white/10 hover:text-white rounded-xl px-6"
                    onClick={() => setShowHolidayModal(true)}
                  >
                    View Leave Policy
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:min-w-[340px]">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200 font-semibold">
                    Employee ID
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {basicProfile?.employee_no ?? `EMP-${basicProfile?.id}`}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200 font-semibold">
                    Department
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {basicProfile?.department?.name || "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200 font-semibold">
                    Position
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {basicProfile?.designation?.title || "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-200 font-semibold">
                    Leave Balance
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {dashboardData?.leave_balance || 0} days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStat?.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border border-slate-100 bg-white/90 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`}
                />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        {stat.subtitle}
                      </span>
                      <p className="text-base font-semibold text-slate-900">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 leading-tight">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg shadow-slate-300/40`}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="absolute inset-0 rounded-2xl border border-white/30 opacity-60" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Schedule & Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              <div className="lg:col-span-5 p-6 bg-slate-50">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    required
                    className="w-full"
                    classNames={{
                      months: "space-y-4",
                      month: "space-y-4",
                      table: "w-full border-collapse",
                      head_row: "grid grid-cols-7 text-xs text-slate-500 font-semibold",
                      head_cell: "text-center py-1",
                      row: "grid grid-cols-7 text-center",
                      cell: "p-2 text-sm relative",
                      day: "h-10 w-10 mx-auto flex items-center justify-center rounded-full font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20",
                      day_selected: "bg-slate-900 text-white shadow-lg shadow-slate-900/15",
                      day_today: "border border-slate-900/30 text-slate-900",
                    }}
                    modifiers={{
                      hasLeave: myLeaveData.map((leave) => leave.date),
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

              <div className="lg:col-span-3 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Today
                    </p>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {format(selectedDate, "EEEE, dd MMMM")}
                    </h4>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-slate-200 text-slate-700"
                  >
                    Calendar
                  </Badge>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <CalendarPlus className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-semibold text-slate-900">
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
                            <p className="text-sm font-semibold text-slate-900">
                              {leave.employeeName}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {leave.employeeId}
                            </p>
                          </div>
                          <Badge
                            className="rounded-full text-xs font-semibold"
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
                        <p className="text-sm font-semibold text-slate-900">
                          Clear schedule
                        </p>
                        <p className="text-xs text-slate-500">
                          No one is on leave today.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-center rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100"
                  onClick={() => navigate("/employee/leave")}
                >
                  Open Leave Planner
                </Button>
              </div>
              <div className="lg:col-span-4 bg-white">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg text-slate-900">
                    Recent Activity
                  </h3>
                </div>
                <div className="p-6 space-y-5 max-h-[420px] overflow-y-auto">
                  {recentActivities?.map((activity, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
                          {activity.type === "success" && (
                            <Check className="h-5 w-5 text-emerald-600" />
                          )}
                          {activity.type === "info" && (
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                          )}
                          {activity.type === "warning" && (
                            <RotateCcw className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        {index !== recentActivities.length - 1 && (
                          <div className="absolute left-1/2 top-10 -ml-px h-8 w-[2px] bg-slate-100" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.title}
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          {dayjs(activity.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {recentActivities?.length === 0 && <NoDataFound />}
                </div>
                <div className="p-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    View All Activity
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Ribbon className="h-5 w-5 text-yellow-600" />
                <span>
                  My leaves for Month - {format(new Date(), "MMMM yyyy")}
                </span>
              </CardTitle>
              <p className="text-sm text-slate-500">Current month snapshot</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-t border-slate-100">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Name
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right">
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
                            className="border-t border-slate-100 hover:bg-slate-50/70"
                          >
                            <td className="py-3 px-4 text-sm text-slate-900">
                              {emp.employee_name ||
                                `${emp.first_name || ""} ${
                                  emp.last_name || ""
                                }`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700 text-right font-semibold">
                              {total_leave ?? 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="py-6 text-center text-slate-500 text-sm"
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

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Award className="h-5 w-5 text-purple-600" />
                <span>
                  My leaves for Month -{" "}
                  {format(
                    new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    "MMMM yyyy"
                  )}
                </span>
              </CardTitle>
              <p className="text-sm text-slate-500">Previous month snapshot</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-t border-slate-100">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Name
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
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
                            className="border-t border-slate-100 hover:bg-slate-50/70"
                          >
                            <td className="py-3 px-4 text-sm text-slate-900">
                              {emp.employee_name ||
                                `${emp.first_name || ""} ${
                                  emp.last_name || ""
                                }`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700 text-right font-semibold">
                              {total_leave ?? 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="py-6 text-center text-slate-500 text-sm"
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
    </>
  );
};

export default EmployeeDashboard;
