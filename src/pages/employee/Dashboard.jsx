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
      accent: "bg-[#C26819]",
      chip: "bg-[#C26819]/10 text-[#C26819]",
      dot: "bg-[#C26819]",
      iconBg: "bg-[#C26819]/15 text-[#C26819]",
    },
    blue: {
      accent: "bg-[#734425]",
      chip: "bg-[#734425]/10 text-[#734425]",
      dot: "bg-[#734425]",
      iconBg: "bg-[#734425]/15 text-[#734425]",
    },
    violet: {
      accent: "bg-[#8A522D]",
      chip: "bg-[#8A522D]/10 text-[#8A522D]",
      dot: "bg-[#8A522D]",
      iconBg: "bg-[#8A522D]/15 text-[#8A522D]",
    },
    emerald: {
      accent: "bg-[#734425]",
      chip: "bg-[#734425]/10 text-[#734425]",
      dot: "bg-[#734425]",
      iconBg: "bg-[#734425]/15 text-[#734425]",
    },
    default: {
      accent: "bg-[#2E2E2E]",
      chip: "bg-[#E1D4C7]/40 text-[#2E2E2E]",
      dot: "bg-[#2E2E2E]",
      iconBg: "bg-[#E1D4C7]/60 text-[#2E2E2E]",
    },
    rose: {
      accent: "bg-[#A6540F]",
      chip: "bg-[#C26819]/10 text-[#C26819]",
      dot: "bg-[#C26819]",
      iconBg: "bg-[#C26819]/15 text-[#C26819]",
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
        const profile = profileRes.data?.data || {};
        const leaves = leaveRes.data?.data || {};
        const leavePolicyValue = leaves.yearly_total ?? 0;
        const approvedLeaveValue = leaves.yearly_availed ?? leaves.yearly_used ?? 0;
        const leaveDeductionValue = leaves.yearly_deduction ?? 0;
        const leaveBalanceValue = leaves.yearly_remaining ?? dashboard.leave_balance ?? 0;
        const leaveBalanceText = formatLeaveDays(leaveBalanceValue);
        const leaveBalanceTone = leaveBalanceValue < 0 ? "rose" : "blue";
        const extraWorkLeaveBalanceText = formatLeaveDays(
          leaves.extra_work_leave_balance?.balance ?? 0
        );
        const currentYear = new Date().getFullYear();

        const quickStats = [
          {
            title: "Total Approved leave",
            value: formatLeaveDays(approvedLeaveValue),
            subtitle: `approved`,
            icon: TrendingUp,
            tone: "amber",
          },
          {
            title: "Total Leave Policy",
            value: formatLeaveDays(leavePolicyValue),
            subtitle: `policy`,
            icon: Ribbon,
            tone: "emerald",
          },
          {
            title: "Total Leave Deduction",
            value: formatLeaveDays(leaveDeductionValue),
            subtitle: `deduction`,
            icon: CalendarX,
            tone: "rose",
          },
          {
            title: "Total Leave Balance",
            value: leaveBalanceText,
            subtitle: `Available`,
            icon: CalendarIcon,
            tone: leaveBalanceTone,
          },
          {
            title: "Extra Work Leave",
            value: extraWorkLeaveBalanceText,
            subtitle: "earned balance",
            icon: Award,
            tone: "default",
          },
          {
            title: "Total Current Salary",
            value: `\u20B9${dashboard.net_salary || 0}`,
            subtitle: "Annual gross",
            icon: IndianRupee,
            tone: "violet",
          },
        ];

        setQuickStat(quickStats);
        setDashboardData(dashboard);
        setLeaveDash(leaves);
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
      type: leave.leave_type?.leave_type,
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
  const firstCycleLeaveSummary = leaveDash?.first_cycle_leave_summary ?? {
    cycle_name: leaveDash?.first_cycle_name || "First Cycle",
    cycle_label: leaveDash?.first_cycle_label || "Jan-Jun",
    total: leaveDash?.first_cycle_total ?? 0,
    availed: leaveDash?.first_cycle_availed ?? leaveDash?.first_cycle_used ?? 0,
    used: leaveDash?.first_cycle_used ?? leaveDash?.first_cycle_availed ?? 0,
    remaining: leaveDash?.first_cycle_remaining ?? 0,
    deduction: leaveDash?.first_cycle_deduction ?? 0,
    extra_work: 0,
  };
  const secondCycleLeaveSummary = leaveDash?.second_cycle_leave_summary ?? {
    cycle_name: leaveDash?.second_cycle_name || "Second Cycle",
    cycle_label: leaveDash?.second_cycle_label || "Jul-Dec",
    total: leaveDash?.second_cycle_total ?? 0,
    availed: leaveDash?.second_cycle_availed ?? leaveDash?.second_cycle_used ?? 0,
    used: leaveDash?.second_cycle_used ?? leaveDash?.second_cycle_availed ?? 0,
    remaining: leaveDash?.second_cycle_remaining ?? 0,
    deduction: leaveDash?.second_cycle_deduction ?? 0,
    extra_work: 0,
  };
  const cycleSummaries = [
    {
      cycle: "first",
      cycle_name: firstCycleLeaveSummary?.cycle_name || "First Cycle",
      cycle_label: firstCycleLeaveSummary?.cycle_label,
      summary: firstCycleLeaveSummary,
      tone: "blue",
    },
    {
      cycle: "second",
      cycle_name: secondCycleLeaveSummary?.cycle_name || "Second Cycle",
      cycle_label: secondCycleLeaveSummary?.cycle_label,
      summary: secondCycleLeaveSummary,
      tone: "emerald",
    },
  ];
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
  const workingHoursLabels = {
    half_day: "Half Day",
    full_day: "Full Day",
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
                    return <CheckCircle className="h-6 w-6" />;
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
                  <div
                    key={notification.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
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

        <Card className="border border-[#E1D4C7] shadow-xl rounded-3xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
          <CardContent className="p-6 md:p-8 relative">
            <div className="grid grid-cols-12 items-center gap-4 relative z-10">
              <div className="col-span-12 md:col-span-8 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight uppercase">
                    {greeting}, {basicProfile?.first_name + " " + basicProfile?.last_name}!
                  </h1>
                </div>
                <p className="text-[#F5ECE4]/80 font-medium text-sm max-w-2xl font-sans">
                  Stay on top of your leave balance, team updates, and recent activity with a dashboard built for daily flow.
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 flex md:justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="rounded-xl shadow-sm border border-white/20 flex items-center py-2 px-4 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] bg-[#FAF6F2] hover:bg-[#E1D4C7] cursor-pointer transition ease-in-out duration-300"
                    onClick={() => {
                      setReadOnly(false);
                      setLeaveRequestViewMode({});
                      setShowRequestModal(true);
                    }}
                  >
                    Apply for Leave
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-xl shadow-sm border border-white/20 flex items-center py-2 px-4 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] bg-[#FAF6F2] hover:bg-[#E1D4C7] cursor-pointer transition ease-in-out duration-300"
                    onClick={() => setShowProofOfWorkModal(true)}
                  >
                    Apply for Proof of Work
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl shadow-sm border border-white/20 flex items-center py-2 px-4 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] bg-[#FAF6F2] hover:bg-[#E1D4C7] cursor-pointer transition ease-in-out duration-300"
                    onClick={() => setShowHolidayModal(true)}
                  >
                    View Leave Policy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cycleSummaries.map(({ cycle, cycle_name, summary }) => {
            const stats = [
              {
                label: "Leave Policy",
                value: formatLeaveDays(summary?.total ?? 0),
                bg: "bg-[#FAF6F2]",
                border: "border-[#E1D4C7]",
                text: "text-[#24130A]",
              },
              {
                label: "Leave Used",
                value: formatLeaveDays(summary?.availed ?? summary?.used ?? 0),
                bg: "bg-[#FAF6F2]",
                border: "border-[#E1D4C7]",
                text: "text-[#C26819]",
              },
              {
                label: "Leave Balance",
                value: formatLeaveDays(summary?.remaining ?? 0),
                bg: "bg-[#FAF6F2]",
                border: "border-[#E1D4C7]",
                text: "text-emerald-700",
              },
              {
                label: "Deduction",
                value: formatLeaveDays(summary?.deduction ?? 0),
                bg: "bg-[#FAF6F2]",
                border: "border-[#E1D4C7]",
                text: "text-rose-700",
              },
              {
                label: "Extra Work",
                value: formatLeaveDays(summary?.extra_work ?? 0),
                bg: "bg-[#FAF6F2]",
                border: "border-[#E1D4C7]",
                text: "text-[#734425]",
              },
            ];

            return (
              <div
                key={cycle}
                className="overflow-hidden rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-[#E1D4C7] bg-[#FAF6F2] py-4 px-6 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-base font-heading font-bold text-[#2E2E2E] uppercase tracking-tight whitespace-nowrap">
                    {cycle === "first" ? "First Cycle - Jan-Jun 2026" : "Second Cycle - Jul-Dec 2026"}
                  </h2>
                  <span className="inline-flex items-center rounded-xl bg-[#734425]/10 border border-[#734425]/20 px-3 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-[#734425]">
                    Cycle Overview
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 xl:grid-cols-5">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className={`${item.bg} ${item.border} rounded-xl border p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
                    >
                      <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#734425]">
                        {item.label}
                      </p>

                      <h3 className={`mt-1 text-xl font-heading font-extrabold ${item.text}`}>
                        {item.value}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 rounded-2xl border border-[#E1D4C7] shadow-sm overflow-hidden bg-[#FAF6F2]">
            <CardHeader className="border-b border-[#E1D4C7] bg-[#FAF6F2] px-6 py-4">
              <CardTitle className="text-base font-heading font-bold text-[#2E2E2E] flex items-center gap-3 uppercase tracking-tight">
                <span className="h-10 w-10 rounded-xl bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex items-center justify-center shadow-sm shrink-0">
                  <CalendarIcon className="h-6 w-6" />
                </span>
                Schedule & Team Leaves
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
                      {leaveData?.length > 0 ? (
                        leaveData.map((leave) => (
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
                          <div className="h-10 w-10 rounded-full bg-[#734425]/10 text-[#734425] border border-[#734425]/20 flex items-center justify-center shrink-0">
                            <CalendarX className="h-6 w-6" />
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
                <span className="h-10 w-10 rounded-xl bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex items-center justify-center shadow-sm shrink-0">
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
                    <p className="text-xs text-slate-500 font-sans">
                      {dayjs(activity.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Extra Work Sidebar Category */}
          <Card className="border border-[#E1D4C7] rounded-2xl shadow-sm bg-[#FAF6F2]">
            <CardHeader className="border-b border-[#E1D4C7] bg-[#FAF6F2] px-6 py-4">
              <CardTitle className="text-base font-heading font-bold text-[#2E2E2E] flex items-center gap-3 uppercase tracking-tight">
                <span className="h-10 w-10 rounded-xl bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex items-center justify-center shadow-sm shrink-0">
                  <Award className="h-6 w-6" />
                </span>
                Extra Work
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {proofOfWorkRecords.length > 0 ? (
                proofOfWorkRecords.map((submission) => (
                  <div
                    key={submission.id}
                    className="rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/50 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-heading font-bold text-[#2E2E2E]">
                        {submission.title}
                      </p>
                      <Badge
                        className={`capitalize text-xs font-semibold ${proofStatusStyles[submission.status] || proofStatusStyles.pending}`}
                      >
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#2E2E2E]/70 mt-2 font-sans">
                      {proofTypeLabels[submission.work_type] || submission.work_type} • {workingHoursLabels[submission.working_hours] || submission.working_hours || "Full Day"}
                    </p>
                    <p className="text-xs text-[#2E2E2E]/60 mt-1 font-sans">
                      {dayjs(submission.work_date).format("D MMM YYYY")}
                    </p>
                  </div>
                ))
              ) : (
                <NoDataFound />
              )}
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
                  My leaves for Month - {format(new Date(), "MMMM yyyy")}
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
                        Name
                      </th>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] text-right">
                        Total Deduction
                      </th>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] text-right">
                        Total Leave (Days)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1D4C7]/60 bg-[#FAF6F2]">
                    {(dashboardData?.current_month_leaves || []).length > 0 ? (
                      dashboardData.current_month_leaves.map(
                        (
                          {
                            employee: emp,
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
                              {emp.employee_name ||
                                `${emp.first_name || ""} ${emp.last_name || ""
                                  }`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-6 text-sm text-[#734425] text-right font-bold">
                              {leave_deduction ?? 0}
                            </td>
                            <td className="py-3 px-6 text-sm text-[#24130A] text-right font-bold">
                              {leave_availed ?? total_leave ?? 0}
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
              <CardTitle className="flex items-center gap-3 text-base font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
                <span className="h-10 w-10 rounded-xl bg-[#734425]/10 border border-[#734425]/20 text-[#734425] flex items-center justify-center shadow-sm shrink-0">
                  <Award className="h-6 w-6" />
                </span>
                <span>
                  My leaves for Month -{" "}
                  {format(
                    new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    "MMMM yyyy"
                  )}
                </span>
              </CardTitle>
              <p className="text-xs text-[#2E2E2E]/60 font-sans mt-0.5">Previous month snapshot</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5ECE4] border-b border-[#E1D4C7] text-left">
                    <tr>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">
                        Name
                      </th>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] text-right">
                        Total Deduction
                      </th>
                      <th className="py-3 px-6 text-xs font-heading font-bold uppercase tracking-wider text-[#734425] text-right">
                        Total Leave (Days)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1D4C7]/60 bg-[#FAF6F2]">
                    {(dashboardData?.previous_month_leaves || []).length > 0 ? (
                      dashboardData.previous_month_leaves.map(
                        (
                          {
                            employee: emp,
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
                              {emp.employee_name ||
                                `${emp.first_name || ""} ${emp.last_name || ""
                                  }`.trim() ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-6 text-sm text-[#734425] text-right font-bold">
                              {leave_deduction ?? 0}
                            </td>
                            <td className="py-3 px-6 text-sm text-[#24130A] text-right font-bold">
                              {leave_availed ?? total_leave ?? 0}
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
      </div>
      {showHolidayModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#24130A]/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowHolidayModal(false)}
          />
          <div className="relative w-full max-w-md h-full bg-[#FAF6F2] border-l border-[#E1D4C7] shadow-2xl transform translate-x-0 transition-transform duration-300 ease-in-out flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#E1D4C7] bg-[#F5ECE4]">
              <h2 className="text-base font-heading font-bold text-[#24130A] uppercase tracking-tight flex items-center gap-2">
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
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Restricted Holidays</h4>
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
            extraWorkLeaveBalance={leaveDash?.extra_work_leave_balance}
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
