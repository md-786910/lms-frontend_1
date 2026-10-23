import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import {
  Users,
  UserX,
  UserCheck,
  Clock,
  Calendar as CalendarIcon,
  TimerReset,
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
  ClipboardCheck,
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
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

  const unreadNotifications = notifications?.filter((a) => !a.read) || [];

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
    // {
    //   title: "Pending Proof of Work",
    //   value: dashboardData?.pending_proof_of_work_count ?? 0,
    //   icon: ClipboardCheck,
    //   tone: "blue",
    // },
  ];

  const leaveData = (dashboardData?.on_leave_today || []).map(
    (leave, index) => ({
      id: index,
      employeeName: `${leave.employee.first_name} ${leave.employee.last_name}`,
      employeeId: leave.employee?.employee_no ?? leave?.employee?.id,
      date: new Date(),
      type: leave.leave_type?.leave_type,
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
      accent: "bg-[#734425]",
      icon: "bg-[#734425]/15 text-[#734425]",
      chip: "bg-[#734425]/10 text-[#734425]",
      dot: "bg-[#734425]",
    },
    amber: {
      accent: "bg-[#C26819]",
      icon: "bg-[#C26819]/15 text-[#C26819]",
      chip: "bg-[#C26819]/10 text-[#C26819]",
      dot: "bg-[#C26819]",
    },
    emerald: {
      accent: "bg-[#8A522D]",
      icon: "bg-[#8A522D]/15 text-[#8A522D]",
      chip: "bg-[#8A522D]/10 text-[#8A522D]",
      dot: "bg-[#8A522D]",
    },
    slate: {
      accent: "bg-[#2E2E2E]",
      icon: "bg-[#E1D4C7]/60 text-[#2E2E2E]",
      chip: "bg-[#E1D4C7]/40 text-[#2E2E2E]",
      dot: "bg-[#2E2E2E]",
    },
    blue: {
      accent: "bg-[#C26819]",
      icon: "bg-[#C26819]/15 text-[#C26819]",
      chip: "bg-[#C26819]/10 text-[#C26819]",
      dot: "bg-[#C26819]",
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

        {unreadNotifications.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="w-full"
          >
            {unreadNotifications.map((notification) => {
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
                if (isApproved) return <CheckCircle className="h-6 w-6" />;
                if (isRejected) return <X className="h-6 w-6" />;
                if (isLeaveRequest)
                  return <CalendarIcon className="h-6 w-6" />;
                return <Bell className="h-6 w-6" />;
              };

              const getTitle = () => {
                if (isApproved) return "Leave Approved";
                if (isRejected) return "Leave Rejected";
                if (isLeaveRequest) return "Leave Update";
                return notification.title || "Notification";
              };

              return (
                <SwiperSlide key={notification.id}>
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
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
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${palette.icon} shadow-md`}
                      >
                        {getIcon()}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {getTitle()}
                          </p>

                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${palette.badge}`}
                          >
                            New
                          </span>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-600">
                          {notification.message}
                        </p>

                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {dayjs(notification.createdAt).fromNow()}
                        </p>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

        <Card className="border border-[#E1D4C7] shadow-xl rounded-3xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
          <CardContent className="p-6 md:p-8 relative">
            <div className="grid grid-cols-12 items-center gap-4 relative z-10">
              <div className="col-span-12 md:col-span-8 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight uppercase">
                    Welcome back, Admin!
                  </h1>
                </div>
                <p className="text-[#F5ECE4]/80 font-medium text-sm max-w-2xl font-sans">
                  Keep a pulse on people, leave, and payroll with a clean
                  control room built for quick actions.
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 flex md:justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="rounded-xl shadow-sm border border-white/20 flex items-center py-2 px-4 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] bg-[#FAF6F2] hover:bg-[#E1D4C7] cursor-pointer transition ease-in-out duration-300"
                    onClick={() => setShowHolidayModal(true)}
                  >
                    View Holidays
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl shadow-sm border border-white/20 flex items-center py-2 px-4 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] bg-[#FAF6F2] hover:bg-[#E1D4C7] cursor-pointer transition ease-in-out duration-300"
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
                className="relative overflow-hidden rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`absolute inset-x-0 top-0 h-[1px] ${palette.accent}`} />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold capitalize font-graphik tracking-wide ${palette.chip}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${palette.dot}`} />
                        Live metric
                      </span>
                      <p className="text-lg font-semibold text-slate-900 font-graphik">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 leading-tight font-graphik">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-2xl ${palette.icon} flex items-center justify-center shadow-sm shrink-0`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border rounded-md border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100 rounded-t-md md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 capitalize font-graphik">
              <span className="border border-[#734425]/20 bg-[#734425]/10 text-[#734425] flex h-10 w-10 items-center justify-center rounded-xl shadow-sm shrink-0">
                <TimerReset className="h-6 w-6" />
              </span>
              Pending leave requests
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/admin/leave")}
              className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-graphik font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingLeaveRequests.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500 ">
                No pending leave requests at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                {pendingLeaveRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => navigate("/admin/leave")}
                    className="flex flex-row gap-6 rounded-2xl border border-[#E1D4C7] cursor-pointer bg-[#FAF6F2] hover:bg-[#F5ECE4]/80 px-5 py-4 shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#734425] text-sm font-heading font-bold capitalize text-white shadow-sm">
                        {request.employee?.first_name?.[0]}
                        {request.employee?.last_name?.[0]}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-base font-heading font-bold text-[#2E2E2E]">
                          {request.employee?.first_name} {request.employee?.last_name}
                        </p>

                        <p className="text-xs text-[#2E2E2E]/60 font-sans">
                          {request.employee?.employee_no}
                        </p>

                        <p className="text-xs font-semibold text-[#734425] mt-1 font-sans">
                          {dayjs(request.start_date).format("D MMM YYYY")} -{" "}
                          {dayjs(request.end_date).format("D MMM YYYY")} -{" "}
                          {request.total_days || 0} days
                        </p>

                        {request.reason && (
                          <p className="text-xs text-[#2E2E2E]/70 mt-1 font-sans">
                            {request.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-heading font-bold capitalize tracking-wider text-amber-700">
                        Pending
                      </span>

                      <p className="text-[10px] font-medium text-[#2E2E2E]/60 font-sans">
                        Applied {dayjs(request.createdAt).fromNow()}
                      </p>

                      <p className="text-[10px] font-heading font-semibold text-[#734425]">
                        {request.leave_type?.leave_type || "Leave"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-[#E1D4C7] rounded-2xl shadow-sm bg-[#FAF6F2]">
          <CardHeader className="flex flex-col gap-3 px-6 py-4 bg-[#FAF6F2] border-b border-[#E1D4C7] rounded-t-2xl md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-3 text-base font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
              <span className="border border-[#734425]/20 bg-[#734425]/10 text-[#734425] flex h-10 w-10 items-center justify-center rounded-xl shadow-sm shrink-0">
                <ClipboardCheck className="h-6 w-6" />
              </span>
              Pending proof of work
            </CardTitle>
            <Badge variant="outline" className="rounded-full border-[#E1D4C7] bg-[#FAF6F2] text-[#734425] font-heading text-[10px] font-bold uppercase tracking-wider">
              {dashboardData?.pending_proof_of_work_count ?? 0} pending
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {dashboardData?.pending_proof_of_work_submissions?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.pending_proof_of_work_submissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() =>
                      submission.employee?.id &&
                      navigate(
                        `/admin/employees/${submission.employee.id}/history?tab=proof_of_work`
                      )
                    }
                    className="cursor-pointer flex items-center justify-between gap-4 rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/50 p-4 shadow-sm transition hover:bg-[#F5ECE4]"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-heading font-bold text-[#2E2E2E]">
                        {submission.title}
                      </p>
                      <p className="text-xs text-[#2E2E2E]/70 font-sans mt-0.5">
                        {submission.employee?.first_name} {submission.employee?.last_name} • {submission.employee?.employee_no}
                      </p>
                      <p className="text-xs text-[#734425] font-sans mt-0.5 font-medium">
                        {dayjs(submission.work_date).format("D MMM YYYY")}
                      </p>
                    </div>
                    <Badge className="rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-heading font-bold text-amber-700">
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-[#2E2E2E]/60 font-sans">
                No pending proof of work submissions.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 rounded-2xl border border-[#E1D4C7] shadow-sm overflow-hidden bg-[#FAF6F2]">
            <CardHeader className="border-b border-[#E1D4C7] bg-[#FAF6F2] px-6 py-4">
              <CardTitle className="text-base font-heading font-bold text-[#2E2E2E] flex items-center gap-3 uppercase tracking-tight">
                <span className="border border-[#734425]/20 bg-[#734425]/10 text-[#734425] flex h-10 w-10 items-center justify-center rounded-xl shadow-sm shrink-0">
                  <CalendarIcon className="h-6 w-6" />
                </span>
                Employee Leave Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 border-b md:border-b-0 md:border-r border-[#E1D4C7]">
                  <div className="rounded-xl border border-[#E1D4C7] shadow-sm bg-[#FAF6F2] p-2">
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
                          "grid grid-cols-7 text-xs text-[#734425] font-heading font-bold uppercase",
                        head_cell: "text-center py-1",
                        row: "grid grid-cols-7 text-center",
                        cell: "text-sm relative",
                        day: "h-10 w-10 mx-auto flex items-center justify-center rounded-full font-heading font-semibold hover:bg-[#734425]/10 text-[#2E2E2E]",
                        day_selected:
                          "bg-[#734425] text-white shadow-lg shadow-[#734425]/20 hover:bg-[#5D361D]",
                        day_today:
                          "border border-[#734425]/40 text-[#734425] font-bold",
                      }}
                      modifiers={{
                        hasLeave: leaveData.map((leave) => leave.date),
                      }}
                      modifiersStyles={{
                        hasLeave: {
                          border: "2px solid rgba(194, 104, 25, 0.4)",
                          backgroundColor: "rgba(194, 104, 25, 0.1)",
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
                        {selectedDate
                          ? format(selectedDate, "EEEE, dd MMMM")
                          : "Select a date"}
                      </h4>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-[#E1D4C7] bg-[#FAF6F2] text-[#734425] font-heading text-[10px] font-bold uppercase tracking-wider"
                    >
                      Calendar
                    </Badge>
                  </div>

                  <div className="rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#E1D4C7] bg-[#F5ECE4]/60 flex items-center gap-2">
                      <span className="h-7 w-7 rounded-lg bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex items-center justify-center">
                        <CalendarIcon className="h-4 w-4" />
                      </span>
                      <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#2E2E2E]">
                        Team on leave today
                      </p>
                    </div>
                    <div className="divide-y divide-[#E1D4C7]/60">
                      {selectedDateLeaves.length > 0 ? (
                        selectedDateLeaves.map((leave) => (
                          <div
                            key={leave.id}
                            className="p-4 flex items-center justify-between gap-3 bg-[#FAF6F2]"
                          >
                            <div>
                              <p className="text-sm font-heading font-bold text-[#2E2E2E]">
                                {leave.employeeName}
                              </p>
                              <p className="text-xs text-[#2E2E2E]/60 font-sans">
                                ID: {leave.employeeId}
                              </p>
                            </div>
                            <Badge
                              className="rounded-full text-xs font-heading font-semibold border-[#E1D4C7] bg-[#F5ECE4] text-[#734425]"
                              variant="outline"
                            >
                              {leave.type}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 flex flex-col items-center text-center gap-2 bg-[#FAF6F2]">
                          <div className="h-10 w-10 rounded-full bg-[#734425]/10 text-[#734425] border border-[#734425]/20 flex items-center justify-center">
                            <CalendarX className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
                            Clear schedule
                          </p>
                          <p className="text-xs text-[#2E2E2E]/60 font-sans">
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
          <Card className="border border-[#E1D4C7] rounded-2xl shadow-sm bg-[#FAF6F2]">
            <CardHeader className="border-b border-[#E1D4C7] bg-[#FAF6F2] px-6 py-4">
              <CardTitle className="text-base font-heading font-bold text-[#2E2E2E] flex items-center gap-3 uppercase tracking-tight">
                <span className="border border-[#734425]/20 bg-[#734425]/10 text-[#734425] flex h-10 w-10 items-center justify-center rounded-xl shadow-sm shrink-0">
                  <BellRing className="h-6 w-6" />
                </span>
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E1D4C7] flex items-center justify-center text-[#734425] shadow-sm shrink-0">
                      <AlertCircle className="h-6 w-6 text-[#734425]" />
                    </div>
                    {index !== recentActivities.length - 1 && (
                      <div className="absolute left-1/2 top-10 -ml-px h-8 w-[2px] bg-[#E1D4C7]" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-heading font-bold text-[#2E2E2E]">
                      {activity.message}
                    </p>
                    <p className="text-xs text-[#2E2E2E]/60 font-sans">
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
          <Card className="relative overflow-hidden rounded-2xl border border-[#E1D4C7] shadow-sm bg-[#FAF6F2]">
            <CardHeader className="border-b border-[#E1D4C7] bg-[#FAF6F2] px-6 py-4">
              <CardTitle className="flex items-center gap-3 text-base font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
                <span className="h-10 w-10 rounded-xl bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex items-center justify-center shadow-sm shrink-0">
                  <Award className="h-6 w-6" />
                </span>
                <span>
                  Leaves - {format(new Date(), "MMMM yyyy")}
                </span>
              </CardTitle>
              <p className="text-xs text-[#2E2E2E]/60 font-sans mt-0.5">Current month snapshot</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5ECE4] border-b border-[#E1D4C7] text-left">
                    <tr>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">
                        Employee Name
                      </th>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] text-center">
                        Leave
                      </th>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] text-right">
                        Leave Deduction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1D4C7]/60 bg-[#FAF6F2]">
                    {(dashboardData?.current_month_leaves || []).length > 0 ? (
                      dashboardData.current_month_leaves.map(
                        (
                          {
                            first_name,
                            last_name,
                            total_leave,
                            leave_availed,
                            leave_deduction,
                          },
                          index
                        ) => (
                          <tr
                            key={index}
                            className="hover:bg-[#F5ECE4]/50 transition-colors"
                          >
                            <td className="py-3 px-6 text-sm font-heading font-semibold text-[#2E2E2E]">
                              {`${first_name || ""} ${last_name || ""}`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-6 text-sm text-[#24130A] text-center font-bold">
                              {leave_availed ?? total_leave ?? 0}
                            </td>
                            <td className="py-3 px-6 text-sm text-rose-600 text-right font-bold">
                              {leave_deduction ?? 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-8 text-center text-[#2E2E2E]/60 text-sm font-sans"
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

          <Card className="relative overflow-hidden rounded-2xl border border-[#E1D4C7] shadow-sm bg-[#FAF6F2]">
            <CardHeader className="border-b border-[#E1D4C7] bg-[#FAF6F2] px-6 py-4">
              <CardTitle className="flex justify-between items-center text-base font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex items-center justify-center shadow-sm shrink-0">
                    <Award className="h-6 w-6" />
                  </span>
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
                    className="border-[#E1D4C7] bg-[#FAF6F2] text-[#734425] hover:bg-[#F5ECE4] rounded-xl h-9 w-9"
                    onClick={() => setShowEmailConfirm(true)}
                    disabled={sendingEmail}
                    title="Send report via email"
                  >
                    {sendingEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#734425]" />
                    ) : (
                      <Mail className="h-4 w-4 text-[#734425]" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[#E1D4C7] bg-[#FAF6F2] text-emerald-700 hover:bg-[#F5ECE4] rounded-xl h-9 w-9"
                    onClick={() => setShowDownloadConfirm(true)}
                    disabled={downloading}
                    title="Download report"
                  >
                    {downloading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
                    ) : (
                      <Download className="h-4 w-4 text-emerald-700" />
                    )}
                  </Button>
                </div>
              </CardTitle>
              <p className="text-xs text-[#2E2E2E]/60 font-sans mt-0.5">Previous month snapshot</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5ECE4] border-b border-[#E1D4C7] text-left">
                    <tr>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">
                        Employee Name
                      </th>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] text-center">
                        Leave
                      </th>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] text-right">
                        Leave Deduction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1D4C7]/60 bg-[#FAF6F2]">
                    {(dashboardData?.previous_month_leaves || []).length > 0 ? (
                      dashboardData.previous_month_leaves.map(
                        (
                          {
                            first_name,
                            last_name,
                            total_leave,
                            leave_availed,
                            leave_deduction,
                          },
                          index
                        ) => (
                          <tr
                            key={index}
                            className="hover:bg-[#F5ECE4]/50 transition-colors"
                          >
                            <td className="py-3 px-6 text-sm font-heading font-semibold text-[#2E2E2E]">
                              {`${first_name || ""} ${last_name || ""}`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-6 text-sm text-[#24130A] text-center font-bold">
                              {leave_availed ?? total_leave ?? 0}
                            </td>
                            <td className="py-3 px-6 text-sm text-rose-600 text-right font-bold">
                              {leave_deduction ?? 0}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-8 text-center text-[#2E2E2E]/60 text-sm font-sans"
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
            className="absolute inset-0 bg-[#24130A]/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowHolidayModal(false)}
          />
          {/* Slide-in panel */}
          <div className="relative w-full max-w-md h-full bg-[#FAF6F2] border-l border-[#E1D4C7] shadow-2xl transform translate-x-0 transition-transform duration-300 ease-in-out flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#E1D4C7] bg-[#F5ECE4]">
              <h2 className="text-base font-heading font-bold text-[#24130A] uppercase tracking-tight flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-[#734425]" />
                Holiday List
              </h2>
              <button
                onClick={() => setShowHolidayModal(false)}
                className="text-[#734425] hover:text-[#24130A] text-2xl font-bold transition duration-200"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Fixed Holidays</h4>
              {holidayList?.fixed_holidays?.map((holiday, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#F5ECE4]/60 hover:bg-[#F5ECE4] border border-[#E1D4C7] rounded-xl transition duration-200"
                >
                  <h3 className="font-heading font-bold text-sm text-[#2E2E2E]">
                    {index + 1}. {holiday.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#C26819] mt-1 font-sans">
                    {new Date(holiday.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}

              <div className="pt-2">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Floating Holidays</h4>
              </div>
              {holidayList?.restricted_holidays?.map((holiday, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#F5ECE4]/60 hover:bg-[#F5ECE4] border border-[#E1D4C7] rounded-xl transition duration-200"
                >
                  <h3 className="font-heading font-bold text-sm text-[#2E2E2E]">
                    {index + 1}. {holiday.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#C26819] mt-1 font-sans">
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
            className="absolute inset-0 bg-[#24130A]/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setShowDownloadConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#FAF6F2] p-6 shadow-2xl space-y-4 border border-[#E1D4C7]">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
                Confirm download
              </h3>
            </div>
            <p className="text-xs text-[#2E2E2E]/70 leading-relaxed text-center font-sans">
              Are you sure you want to download the leave report for{" "}
              {dayjs().subtract(1, "month").format("MMMM YYYY")}? This will
              generate a fresh CSV of all leave records from the last completed
              month.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="ghost"
                className="rounded-xl font-heading font-semibold text-xs text-[#2E2E2E]/70 hover:bg-[#734425]/10 uppercase tracking-wider"
                onClick={() => setShowDownloadConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow-sm"
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
            className="absolute inset-0 bg-[#24130A]/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setShowEmailConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#FAF6F2] p-6 shadow-2xl space-y-4 border border-[#E1D4C7]">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="h-10 w-10 rounded-xl bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
                Confirm email
              </h3>
            </div>
            <p className="text-xs text-[#2E2E2E]/70 leading-relaxed text-center font-sans">
              Are you sure you want to send the latest leave report via email?
              This will trigger the notification workflow immediately.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="ghost"
                className="rounded-xl font-heading font-semibold text-xs text-[#2E2E2E]/70 hover:bg-[#734425]/10 uppercase tracking-wider"
                onClick={() => setShowEmailConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow-sm"
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
