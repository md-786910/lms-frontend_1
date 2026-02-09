import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import {
  Users,
  UserX,
  UserCheck,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  Award,
  AlertCircle,
  X,
  Bell,
  CheckCircle,
  Mail,
  Loader2,
  Download,
  BellRing,
  CalendarX,
} from "lucide-react";

import { toast } from "sonner";

import holidayJsonData from "../../data/holiday.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { companyAPI } from "../../api/companyApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSocketContext } from "../../contexts/SocketContext";
import EmployeeLeaveTable from "../../components/EmployeeLeaveTable";
import dayjs from "dayjs";
const AdminDashboard = () => {
  const { updateDashboard, setUpdateDashboard } = useSocketContext();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayList, setHolidayList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);

  const fetchNotification = async () => {
    try {
      const response = await companyAPI.getNotification();
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
    const fetchDashboardData = async () => {
      try {
        const response = await companyAPI.dashboard();
        if (response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchNotification();
  }, [updateDashboard]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: "Total Employees",
      value: dashboardData?.total_employee ?? 0,
      icon: Users,
      tone: "indigo",
    },
    {
      title: "On Leave Today",
      value: dashboardData?.on_leave_today_count ?? 0,
      icon: UserX,
      tone: "amber",
    },
    {
      title: "Active Employees",
      value: dashboardData?.active_employee ?? 0,
      icon: UserCheck,
      tone: "emerald",
    },
  ];

  const leaveData = (dashboardData?.on_leave_today || []).map(
    (leave, index) => ({
      id: index,
      employeeName: `${leave.employee.first_name} ${leave.employee.last_name}`,
      employeeId: leave.employee?.employee_no ?? leave?.employee?.id,
      date: new Date(),
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
      createdAt: activity?.createdAt,
    })
  );
  const pendingLeaveRequests = dashboardData?.pending_leave_requests || [];

  const topPerformers = [
    // { name: "Md Ashif", department: "Engineering", score: 98 },
    // { name: "Md Amir", department: "Engineering", score: 95 },
    // { name: "Sohail", department: "Engineering", score: 92 },
    // { name: "Saddam", department: "Marketing", score: 90 },
  ];

  const toneStyles = {
    indigo: {
      accent: "bg-indigo-600",
      icon: "bg-indigo-100 text-indigo-700",
      chip: "bg-indigo-50 text-indigo-700",
      dot: "bg-indigo-600",
    },
    amber: {
      accent: "bg-amber-500",
      icon: "bg-amber-100 text-amber-700",
      chip: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    emerald: {
      accent: "bg-emerald-600",
      icon: "bg-emerald-100 text-emerald-700",
      chip: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-600",
    },
    slate: {
      accent: "bg-slate-600",
      icon: "bg-slate-100 text-slate-700",
      chip: "bg-slate-50 text-slate-700",
      dot: "bg-slate-600",
    },
  };

  const getEmployeesOnLeave = (date) =>
    leaveData?.filter((leave) => isSameDay(leave.date, date));

  const handleSendMail = async () => {
    try {
      setSendingEmail(true);
      const response = await companyAPI.sendLeaveReport();
      if (response.status) {
        toast.success(response.message || "Email sent successfully");
      } else {
        toast.error(response.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error.response?.data?.message || "Internal server error");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await companyAPI.downloadLeaveReport();

      // Create a blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employee_leave_records.csv");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download leave records");
    } finally {
      setDownloading(false);
    }
  };

  const selectedDateLeaves = selectedDate
    ? getEmployeesOnLeave(selectedDate)
    : [];

  return (
    <>
      <div className="space-y-5">

        {notifications?.filter((a) => !a.read)?.length > 0 && (
          <div className="grid gap-3">
            {notifications
              ?.filter((a) => !a.read)
              ?.map((notification) => {
                const isLeaveRequest =
                  notification.title?.toLowerCase().includes("leave");
                const isApproved = notification.message
                  ?.toLowerCase()
                  .includes("approved");
                const isRejected = notification.message
                  ?.toLowerCase()
                  .includes("rejected");

                const tone = (() => {
                  if (isApproved) return "emerald";
                  if (isRejected) return "rose";
                  if (isLeaveRequest) return "indigo";
                  return "blue";
                })();

                const tonePalette = {
                  emerald: {
                    indicator: "bg-emerald-500",
                    icon: "bg-emerald-50 text-emerald-700",
                    badge: "bg-emerald-50 text-emerald-700",
                  },
                  rose: {
                    indicator: "bg-rose-500",
                    icon: "bg-rose-50 text-rose-700",
                    badge: "bg-rose-50 text-rose-700",
                  },
                  indigo: {
                    indicator: "bg-indigo-500",
                    icon: "bg-indigo-50 text-indigo-700",
                    badge: "bg-indigo-50 text-indigo-700",
                  },
                  blue: {
                    indicator: "bg-blue-500",
                    icon: "bg-blue-50 text-blue-700",
                    badge: "bg-blue-50 text-blue-700",
                  },
                };

                const palette = tonePalette[tone];

                const getIcon = () => {
                  if (isApproved) return <CheckCircle className="h-5 w-5" />;
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
                      const resp = await companyAPI.readNotification(
                        notification.id
                      );
                      if (resp.status) {
                        fetchNotification();
                      }
                    }}
                  >
                    <div
                      className={`absolute inset-y-0 left-0 w-1 ${palette.indicator}`}
                    />
                    <div className="flex items-start gap-4 p-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl ${palette.icon} flex items-center justify-center shadow-md`}
                      >
                        {getIcon()}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm">
                            {getTitle()}
                          </p>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${palette.badge} border border-transparent`}
                          >
                            New
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
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
                          const resp = await companyAPI.readNotification(
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

        <Card className="border border-slate-200 shadow-lg rounded-md bg-slate-900 text-white">
          <CardContent className="p-5 md:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-4 max-w-2xl">
                <Badge className="bg-white/10 text-white border border-white/20 font-semibold rounded-full px-3 py-1 shadow-sm w-fit uppercase tracking-wide">
                  Admin Workspace
                </Badge>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
                    Welcome back, Admin!
                  </h2>
                  <p className="text-sm md:text-base text-slate-200 max-w-xl">
                    Keep a pulse on people, leave, and payroll with a clean
                    control room built for quick actions.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="border border-white/40 bg-white/10 text-white hover:bg-white hover:text-slate-900 rounded-lg px-4"
                    onClick={() => setShowHolidayModal(true)}
                  >
                    View Holidays
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-slate-900 hover:bg-white/10 hover:text-white rounded-lg px-4"
                    onClick={() => setShowDownloadConfirm(true)}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download leave CSV
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:min-w-[340px] w-auto">
                <div className="rounded-md bg-white/10 border border-white/15 px-4 py-2 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-200 font-semibold">
                    Total employees
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {dashboardData?.total_employee ?? 0}
                  </p>
                </div>
                <div className="rounded-md bg-white/10 border border-white/15 px-4 py-2 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-200 font-semibold">
                    On leave today
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {dashboardData?.on_leave_today_count ?? 0}
                  </p>
                </div>
                <div className="rounded-md bg-white/10 border border-white/15 px-4 py-2 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-200 font-semibold">
                    Active employees
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {dashboardData?.active_employee ?? 0}
                  </p>
                </div>
                <div className="rounded-md bg-white/10 border border-white/15 px-4 py-2 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-200 font-semibold">
                    Pending leave
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {dashboardData?.pending_leave ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const palette = toneStyles[stat.tone] || toneStyles.slate;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`absolute inset-x-0 top-0 h-[1px] ${palette.accent}`} />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${palette.chip}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${palette.dot}`} />
                        Live metric
                      </span>
                      <p className="text-base font-semibold text-slate-900">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 leading-tight">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-2xl ${palette.icon} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100 rounded-t-2xl md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Pending leave requests
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/admin/leave")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingLeaveRequests.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No pending leave requests at the moment.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLeaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold uppercase text-white">
                        {request.employee?.first_name?.[0]}
                        {request.employee?.last_name?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {request.employee?.first_name}{" "}
                          {request.employee?.last_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {request.employee?.employee_no}
                        </p>
                        <p className="text-xs text-slate-500">
                          {dayjs(request.start_date).format("D MMM YYYY")} -{" "}
                          {dayjs(request.end_date).format("D MMM YYYY")} -{" "}
                          {request.total_days || 0} days
                        </p>
                        {request.reason && (
                          <p className="text-xs text-slate-400">
                            {request.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                        Pending
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Applied {dayjs(request.createdAt).fromNow()}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {request.leave_type?.leave_type || "Leave"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Employee Leave Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50">
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-3">
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
                        head_row:
                          "grid grid-cols-7 text-xs text-slate-500 font-semibold",
                        head_cell: "text-center py-1",
                        row: "grid grid-cols-7 text-center",
                        cell: "p-2 text-sm relative",
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
                <div className="p-6 space-y-4 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Selected Date
                      </p>
                      <h4 className="text-lg font-semibold text-slate-900">
                        {selectedDate
                          ? format(selectedDate, "EEEE, dd MMMM")
                          : "Select a date"}
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
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-slate-900">
                        Team on leave today
                      </p>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {selectedDateLeaves.length > 0 ? (
                        selectedDateLeaves.map((leave) => (
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <BellRing className="h-5 w-5 text-primary" />
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
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-slate-500">
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
          <Card className="relative overflow-hidden border border-slate-200 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-amber-500" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Award className="h-5 w-5 text-amber-600" />
                <span>
                  Leaves - {format(new Date(), "MMMM yyyy")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-t border-slate-100">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Employee Name
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right">
                        Total Leave (Days)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData?.current_month_leaves || []).length > 0 ? (
                      dashboardData.current_month_leaves.map(
                        ({ first_name, last_name, total_leave }, index) => (
                          <tr
                            key={index}
                            className="border-t border-slate-100 hover:bg-slate-50/70"
                          >
                            <td className="py-3 px-4 text-sm text-slate-900">
                              {`${first_name || ""} ${last_name || ""}`.trim() ||
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

          <Card className="relative overflow-hidden border border-slate-200 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-primary" />
            <CardHeader className="py-3">
              <CardTitle className="flex justify-between items-center text-base font-semibold text-slate-900">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>
                    Leaves -{" "}
                    {format(
                      new Date(new Date().setMonth(new Date().getMonth() - 1)),
                      "MMMM yyyy"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-200"
                    onClick={() => setShowEmailConfirm(true)}
                    disabled={sendingEmail}
                    title="Send report via email"
                  >
                    {sendingEmail ? (
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    ) : (
                      <Mail className="h-3 w-3 text-primary" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-200"
                    onClick={() => setShowDownloadConfirm(true)}
                    disabled={downloading}
                    title="Download report"
                  >
                    {downloading ? (
                      <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                    ) : (
                      <Download className="h-3 w-3 text-emerald-600" />
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-t border-slate-100">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Employee Name
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Total Leave (Days)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData?.previous_month_leaves || []).length > 0 ? (
                      dashboardData.previous_month_leaves.map(
                        ({ first_name, last_name, total_leave }, index) => (
                          <tr
                            key={index}
                            className="border-t border-slate-100 hover:bg-slate-50/70"
                          >
                            <td className="py-3 px-4 text-sm text-slate-900">
                              {`${first_name || ""} ${last_name || ""}`.trim() ||
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
        <EmployeeLeaveTable />
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
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Holiday List
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
              <h4 className="font-medium ">Floating Holidays</h4>
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
      {showDownloadConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-200"
            onClick={() => setShowDownloadConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-900">
                Confirm download
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to download the latest leave report? This
              will generate a fresh CSV of all leave records.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="ghost"
                onClick={() => setShowDownloadConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDownloadConfirm(false);
                  handleDownload();
                }}
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  "Confirm download"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showEmailConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-200"
            onClick={() => setShowEmailConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-slate-900">
                Confirm email
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to send the latest leave report via email?
              This will trigger the notification workflow immediately.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="ghost"
                onClick={() => setShowEmailConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowEmailConfirm(false);
                  handleSendMail();
                }}
                disabled={sendingEmail}
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Confirm send"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
