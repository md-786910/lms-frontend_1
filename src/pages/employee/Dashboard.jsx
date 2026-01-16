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
  DollarSign,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  Users,
  Award,
  X,
  AlertCircle,
  BellRing,
  CalendarPlus,
  Contact,
  Code,
  Ribbon
} from "lucide-react";
import { EmpDashboardApi } from "../../api/employee/dashboard";
import { useSocketContext } from "../../contexts/SocketContext";
import { authAPI } from "../../api/authapi/authAPI";
import dayjs from "dayjs";
import NoDataFound from "../../common/NoDataFound";
import { employeeLeaveApi } from "../../api/employee/leaveApi";
const EmployeeDashboard = () => {
  const { updateDashboard, setUpdateDashboard } = useSocketContext();
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
  // Leave Request Modal State
  const [readOnly, setReadOnly] = useState(false);
  const [leaveDash, setLeaveDash] = useState(null);
   const [leaveRequest, setLeaveRequest] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveRequestViewMode, setLeaveRequestViewMode] = useState({});
  const [greeting, setGreeting] = useState("");
  // Mock leave data for calendar
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

  const upcomingEvents = [
    {
      title: "Team Meeting",
      date: "Today, 2:00 PM",
      type: "meeting",
    },
    {
      title: "Project Deadline",
      date: "Tomorrow, 6:00 PM",
      type: "deadline",
    },
    {
      title: "Performance Review",
      date: "Feb 28, 10:00 AM",
      type: "review",
    },
  ];

  const getLeaveForDate = (date) => {
    return myLeaveData.filter((leave) => isSameDay(leave.date, date));
  };

  const selectedDateLeaves = selectedDate ? getLeaveForDate(selectedDate) : [];

  const handleClockIn = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setClockedIn(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleClockOut = async () => {
    setIsLoading(true);
    // Simulate API call
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
        // Fire all API calls in parallel
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
            value: `₹${dashboard.net_salary || 0}`,
            subtitle: "Annual gross",
            icon: IndianRupee,
            color: "from-purple-500 to-purple-600",
          },
          // {
          //   title: "Hours This Month",
          //   value: "162h",
          //   subtitle: "8h remaining",
          //   icon: Clock,
          //   color: "from-green-500 to-green-600",
          // },
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
      date: new Date(), // API does not provide leave date, assuming today
      type: leave.leave_type.leave_type,
      status: leave.status,
      leaveOn: JSON.parse(leave?.leave_on)?.find(
        (f) => f.date === format(new Date(), "yyyy-MM-dd")
      ),
    })
  );

  const recentActivities = (dashboardData?.activities || []).map(
    (activity) => ({
      type: "employee",
      message: activity.title,
      time: new Date(activity.createdAt).toLocaleString(),
      status: "completed",
      createdAt: activity.createdAt,
    })
  );
  return (
    <>
      <div className="space-y-6">
        {/* Welcome Header */}
        {notifications
          ?.filter((a) => !a.read)
          ?.map((notification) => {
            const isLeaveRequest = notification.title?.toLowerCase().includes("leave");
            const isApproved = notification.message?.toLowerCase().includes("approved");
            const isRejected = notification.message?.toLowerCase().includes("rejected");

            const getIcon = () => {
              if (isApproved) return <CheckCircle className="h-5 w-5 text-white" />;
              if (isRejected) return <X className="h-5 w-5 text-white" />;
              if (isLeaveRequest) return <CalendarIcon className="h-5 w-5 text-white" />;
              return <Bell className="h-5 w-5 text-white" />;
            };

            const getGradient = () => {
              if (isApproved) return "from-emerald-500 to-green-600";
              if (isRejected) return "from-red-500 to-rose-600";
              if (isLeaveRequest) return "from-violet-500 to-purple-600";
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
                className="relative bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200"
                onClick={async () => {
                  const resp = await authAPI.readNotification(notification.id);
                  if (resp.status) {
                    fetchNotification();
                  }
                }}
              >
                <div className="flex items-start gap-4 p-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-md`}>
                    {getIcon()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-800 text-sm">
                        {getTitle()}
                      </h4>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        New
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {dayjs(notification.createdAt).fromNow()}
                    </p>
                  </div>

                  {/* Close button */}
                  <button
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const resp = await authAPI.readNotification(notification.id);
                      if (resp.status) {
                        fetchNotification();
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient()}`} />
              </div>
            );
          })}
        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-md p-0 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-10" />
          <div className="absolute -right-20 -top-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-all duration-700" />
          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50  border border-green-100  text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Active Employee
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                {greeting},{" "}
                {basicProfile?.first_name + " " + basicProfile?.last_name}! 👋
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-6">Here's what's happening with your team <strong className="text-slate-900 dark:text-white">today.</strong></p>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setReadOnly(false);
                    setLeaveRequestViewMode({});
                    setShowRequestModal(true);
                  }}
                  className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 dark:shadow-white/10 transition-all flex items-center gap-2 transform active:scale-95"
                >
                  <CalendarPlus className="w-4 h-4 text-white" />
                  Apply for Leave
                </button>
                <button 
                  onClick={() => setShowHolidayModal(true)}
                  className="bg-white  text-slate-700 border border-slate-200 hover:bg-gray-800 hover:text-white hover:border-none hover:shadow-lg hover:shadow-slate-900/20 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                >
                  View Policy
                </button>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-3 items-end opacity-90">
              {/* Employee ID */}
              <div
                className="flex items-center gap-3 bg-white/60 dark:bg-white/5 backdrop-blur-sm
                border border-slate-100 dark:border-white/10 p-3 rounded-xl shadow-sm
                animate-fade-up animate-float
                transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: "0ms" }}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Contact className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Employee ID
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {basicProfile?.employee_no ?? `EMP-${basicProfile?.id}`}
                  </p>
                </div>
              </div>
              {/* Department */}
              <div
                className="flex items-center gap-3 bg-white/80 dark:bg-white/10 backdrop-blur-md
                border border-slate-100 dark:border-white/10 p-3 pr-8 rounded-xl shadow-md z-10
                animate-fade-up animate-float
                transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: "300ms" }}
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Department
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {basicProfile?.department?.name}
                  </p>
                </div>
              </div>
              {/* Position */}
              <div
                className="absolute top-24 right-52 flex items-center gap-3 bg-white/80 dark:bg-white/10
                backdrop-blur-md border border-slate-100 dark:border-white/10 p-3 pr-8 rounded-xl shadow-md z-10
                animate-fade-up animate-float
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: "600ms", animationDuration: "5s" }}
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Ribbon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Position
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {basicProfile?.designation?.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickStat?.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`bg-white border border-slate-100 shadow-md
                  
                  `}
                // ${index == 1 ? "blur pointer-events-none" : ""}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#000000] text-md font-medium">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-800 mt-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-[#242f40] mt-1">
                        {stat.subtitle}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Leave Calendar */}
          <Card className="lg:col-span-2 bg-white border border-slate-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <span>My Leave Calendar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  // onSelect={setSelectedDate}
                  className="w-full"
                  modifiers={{
                    hasLeave: myLeaveData.map((leave) => leave.date),
                  }}
                  modifiersStyles={{
                    hasLeave: {
                      backgroundColor: "#dbeafe",
                      color: "#1d4ed8",
                      fontWeight: "bold",
                    },
                  }}
                />

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Date</p>
                  <h4 className="text-2xl font-bold text-slate-900">
                    {selectedDate
                      ? format(selectedDate, "EEEE, dd MMMM")
                      : "Select a date"}
                  </h4>
                  {leaveData?.length > 0 ? (
                    <div className="space-y-3">
                      {leaveData?.map((leave) => (
                        <div
                          key={leave.id}
                          className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-slate-800">
                                <p className="font-medium text-slate-800 flex  items-center justify-between">
                                  {leave.employeeName}{" "}
                                  <span className="mx-3 border p-1 rounded text-[12px] text-blue-600">
                                    {leave?.leaveOn?.id}
                                  </span>
                                </p>
                              </span>
                              <p className="text-sm text-slate-600">
                                {leave.employeeId}
                              </p>
                              <p className="text-sm text-orange-700 font-medium">
                                {leave.type}
                              </p>
                              {/* <p className="text-sm text-slate-600">
                              {leave.reason}
                            </p> */}
                            </div>
                            <Badge
                              className={
                                leave.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-green-100 text-orange-800"
                              }
                            >
                              {leave.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NoDataFound />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white border border-slate-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BellRing className="h-5 w-5 text-blue-600" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivities?.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-[0.4rem]">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === "success" && (
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                      )}
                      {activity.type === "info" && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                      )}
                      {activity.type === "warning" && (
                        <div className="h-2 w-2 bg-orange-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {activity.title}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        {dayjs(activity.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}

                {recentActivities?.length === 0 && <NoDataFound />}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Employee of the Month */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Month Employee of the Month */}
          <Card className="bg-white border border-slate-100 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Ribbon className="h-5 w-5 text-yellow-600" />
                <span>
                  My leaves for Month - {format(new Date(), "MMMM yyyy")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
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
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-slate-800">
                              {emp.employee_name ||
                                `${emp.first_name || ""} ${
                                  emp.last_name || ""
                                }`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600 text-right">
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

          {/* Previous Month Employee of the Month */}
          <Card className="bg-white border border-slate-100 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span>
                  My leaves for Month -{" "}
                  {format(
                    new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    "MMMM yyyy"
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
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
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-slate-800">
                              {emp.employee_name ||
                                `${emp.first_name || ""} ${
                                  emp.last_name || ""
                                }`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600 text-right">
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

        {/* Quick Actions */}
        {/* <Card className="border-0 shadow-lg  ">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <Button
                onClick={handleClockIn}
                disabled={clockedIn || isLoading}
                className="h-20 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex flex-col space-y-2"
              >
                <Play className="h-5 w-5" />
                <span className="text-sm">
                  {isLoading ? "Clocking In..." : "Clock In"}
                </span>
              </Button>
              <Button
                onClick={handleClockOut}
                disabled={!clockedIn || isLoading}
                variant="outline"
                className="h-20 flex flex-col space-y-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Square className="h-5 w-5" />
                <span className="text-sm">
                  {isLoading ? "Clocking Out..." : "Clock Out"}
                </span>
              </Button>
              <Button
                onClick={() => navigate("/employee/leave")}
                className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex flex-col space-y-2"
              >
                <CalendarPlus className="h-5 w-5" />
                <span className="text-sm">Request Leave</span>
              </Button>
              <Button
                onClick={() => navigate("/employee/salary")}
                variant="outline"
                className="h-20 flex flex-col space-y-2"
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">View Payslip</span>
              </Button>
              <Button
                onClick={() => navigate("/employee/time-logs")}
                variant="outline"
                className="h-20 flex flex-col space-y-2"
              >
                <Timer className="h-5 w-5" />
                <span className="text-sm">Time Logs</span>
              </Button>
              <Button
                onClick={() => navigate("/employee/profile")}
                variant="outline"
                className="h-20 flex flex-col space-y-2"
              >
                <Users className="h-5 w-5" />
                <span className="text-sm">Update Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
      {showHolidayModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setShowHolidayModal(false)}
          />
          {/* Slide-in panel */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl transform translate-x-0 transition-transform duration-300 ease-in-out flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                📅 Holiday List
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
              <h4 className="font-medium ">Restrcited Holidays</h4>
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
    </>
  );
};

export default EmployeeDashboard;
