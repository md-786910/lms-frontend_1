import { useEffect, useState } from "react";
import axios from "axios";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { companyAPI } from "../../api/companyApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSocketContext } from "../../contexts/SocketContext";
import EmployeeLeaveTable from "../../components/EmployeeLeaveTable";
import dayjs from "dayjs";
import HolidayModal from "../../components/HolidayModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { updateDashboard, setUpdateDashboard } = useSocketContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "On Leave Today",
      value: dashboardData?.on_leave_today_count ?? 0,
      icon: UserX,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Active Employees",
      value: dashboardData?.active_employee ?? 0,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];

  const leaveData = (dashboardData?.on_leave_today || []).map(
    (leave, index) => ({
      id: index,
      employeeName: leave?.employee
        ? `${leave.employee.first_name} ${leave.employee.last_name}`
        : "Unknown",
      employeeId: leave?.employee?.employee_no ?? leave?.employee?.id ?? "N/A",
      date: new Date(),
      type: leave?.leave_type?.leave_type || "N/A",
      status: leave?.status || "Pending",
      leaveOn: JSON.parse(leave?.leave_on || "[]")?.find(
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

  const getEmployeesOnLeave = (date) => {
    if (!date) return [];
    return leaveData?.filter((leave) => isSameDay(leave.date, date));
  };

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
      <div className="space-y-8 animate-enter">
        {/* Notifications */}
        {notifications
          ?.filter((a) => !a.read)
          ?.map((notification) => (
            <div
              key={notification.id}
              className="relative bg-card rounded-xl shadow-sm border border-border overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 animate-enter"
              onClick={async () => {
                const resp = await companyAPI.readNotification(notification.id);
                if (resp.status) fetchNotification();
              }}
            >
              <div className="flex items-start gap-4 p-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground text-sm">
                      {notification.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 uppercase bg-primary/5"
                    >
                      New
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 mt-2 font-bold uppercase tracking-widest">
                    {dayjs(notification.createdAt).fromNow()}
                  </p>
                </div>
                <button className="p-1 text-muted-foreground/40 hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

        {/* Welcome Header */}
        <div className="bg-primary rounded-2xl p-8 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-3xl"></div>

          <div className="flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase">
                Admin Console
              </h1>
              <p className="text-primary-foreground/80 font-medium text-lg">
                Performance tracking and operational overview for today.
              </p>
            </div>
            <Button
              onClick={() => setShowHolidayModal(true)}
              variant="secondary"
              className="font-bold shadow-lg"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Holiday List
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 card-hover group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-black text-foreground tracking-tighter">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`h-7 w-7 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Full Width Calendar Section */}
        <Card className="border border-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/50 bg-muted/20 px-8 py-5">
            <CardTitle className="flex items-center space-x-3 text-base font-bold text-foreground">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>Global Attendance & Leave Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Large Calendar Side */}
              <div className="lg:col-span-8 p-8 flex justify-center border-b lg:border-b-0 lg:border-r border-border/50 bg-card">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  required
                  className="w-full max-w-full"
                  classNames={{
                    months: "w-full space-y-4",
                    month: "w-full space-y-6",
                    table: "w-full border-collapse",
                    head_row: "flex w-full justify-between mb-4",
                    head_cell:
                      "text-muted-foreground rounded-md w-12 font-bold text-[10px] uppercase tracking-[0.2em] text-center",
                    row: "flex w-full justify-between mt-2",
                    cell: "h-14 w-14 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-12 w-12 p-0 font-bold aria-selected:opacity-100 hover:bg-primary/5 rounded-full transition-all duration-200",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-xl shadow-primary/40 scale-110",
                    day_today:
                      "bg-muted text-foreground border border-primary/20",
                  }}
                  modifiers={{
                    hasLeave: leaveData.map((leave) => leave.date),
                  }}
                  modifiersStyles={{
                    hasLeave: {
                      border: "2px solid hsl(var(--primary) / 0.3)",
                      backgroundColor: "hsl(var(--primary) / 0.05)",
                    },
                  }}
                />
              </div>

              {/* Leave Details Side */}
              <div className="lg:col-span-4 bg-muted/5 flex flex-col h-full min-h-[500px]">
                <div className="p-8 border-b border-border/50 bg-muted/10">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                    Timeline for
                  </p>
                  <h4 className="text-2xl font-black text-foreground tracking-tight">
                    {format(selectedDate, "EEEE, dd MMMM")}
                  </h4>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                  {selectedDateLeaves.length > 0 ? (
                    selectedDateLeaves.map((leave) => (
                      <div
                        key={leave.id}
                        className="p-4 bg-card border border-border/60 rounded-2xl shadow-sm hover:border-primary/40 hover:shadow-md transition-all group animate-enter"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/10 shadow-inner">
                            {leave.employeeName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-bold text-foreground text-sm truncate pr-2">
                                {leave.employeeName}
                              </p>
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold h-5 px-2 rounded-full uppercase tracking-tighter ${
                                  leave.status === "Approved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {leave.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">
                                {leave.employeeId}
                              </span>
                              <span className="text-[10px] text-muted-foreground opacity-30">
                                •
                              </span>
                              <span className="text-xs font-medium text-muted-foreground truncate">
                                {leave.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6">
                      <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-6 border border-border/50 shadow-inner">
                        <CalendarX className="h-10 w-10 text-muted-foreground/20" />
                      </div>
                      <h4 className="font-bold text-foreground text-base mb-2 tracking-tight uppercase">
                        Team Full Power
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed font-medium uppercase tracking-tighter opacity-60">
                        No leaves scheduled for this date.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-border/50 bg-muted/10 mt-auto">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-black uppercase tracking-widest h-10 border-border/60 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    onClick={() => navigate("/admin/leave")}
                  >
                    Enter Leave Portal
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row - Activity & Summary Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Activities */}
          <Card className="border border-border/50 shadow-sm flex flex-col h-full">
            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
              <CardTitle className="flex items-center space-x-2 text-sm font-black uppercase tracking-[0.2em] text-foreground">
                <BellRing className="h-4 w-4 text-primary" />
                <span>System Log</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10 group-hover:scale-125 transition-transform"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-bold leading-snug line-clamp-2">
                        {activity.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-2 font-black uppercase tracking-widest">
                        {dayjs(activity.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Month Leave */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20 px-6 py-4">
              <CardTitle className="flex items-center space-x-2 text-sm font-black uppercase tracking-[0.2em] text-foreground">
                <Award className="h-4 w-4 text-yellow-500" />
                <span>{format(new Date(), "MMMM")} Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left py-3 px-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Employee
                      </th>
                      <th className="text-right py-3 px-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Days
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {(dashboardData?.current_month_leaves || []).length > 0 ? (
                      dashboardData.current_month_leaves.map(
                        ({ first_name, last_name, total_leave }, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-4 px-6 text-sm text-foreground font-bold">{`${first_name} ${last_name}`}</td>
                            <td className="py-4 px-6 text-sm text-right font-black text-primary bg-primary/[0.02]">
                              {total_leave ?? 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="py-12 text-center text-muted-foreground italic text-xs"
                        >
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Previous Month Leave */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20 px-6 py-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-foreground">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span>
                    {format(dayjs().subtract(1, "month").toDate(), "MMMM")} Log
                  </span>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSendMail}
                    disabled={sendingEmail}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left py-3 px-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Employee
                      </th>
                      <th className="text-right py-3 px-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Days
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {(dashboardData?.previous_month_leaves || []).length > 0 ? (
                      dashboardData.previous_month_leaves.map(
                        ({ first_name, last_name, total_leave }, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-4 px-6 text-sm text-foreground font-bold">{`${first_name} ${last_name}`}</td>
                            <td className="py-4 px-6 text-sm text-right font-black text-primary bg-primary/[0.02]">
                              {total_leave ?? 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="py-12 text-center text-muted-foreground italic text-xs"
                        >
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yearly Summary Table */}
        <EmployeeLeaveTable />
      </div>

      {/* Holiday Modal */}
      <HolidayModal
        isOpen={showHolidayModal}
        onClose={() => setShowHolidayModal(false)}
      />
    </>
  );
};

export default AdminDashboard;
