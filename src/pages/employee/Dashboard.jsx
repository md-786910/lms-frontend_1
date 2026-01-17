import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  IndianRupee,
  CheckCircle,
  Users,
  Award,
  X,
  BellRing,
  CalendarX,
} from "lucide-react";
import { EmpDashboardApi } from "../../api/employee/dashboard";
import { useSocketContext } from "../../contexts/SocketContext";
import { authAPI } from "../../api/authapi/authAPI";
import dayjs from "dayjs";
import NoDataFound from "../../common/NoDataFound";
import { employeeLeaveApi } from "../../api/employee/leaveApi";
import HolidayModal from "../../components/HolidayModal";

const EmployeeDashboard = () => {
  const { updateDashboard, setUpdateDashboard } = useSocketContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quickStat, setQuickStat] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [basicProfile, setBasicProfile] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Mock leave data for calendar indicators
  const myLeaveData = [
    { id: 1, date: new Date(2024, 1, 20), status: "Approved" },
    { id: 2, date: new Date(2024, 1, 21), status: "Approved" },
  ];

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
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, profileRes, leaveRes] = await Promise.all([
          EmpDashboardApi.getDashboard(),
          EmpDashboardApi.getProfileBasicInfo(),
          employeeLeaveApi.getLeave(),
        ]);

        if (dashboardRes?.status === 200 && profileRes?.status === 200 && leaveRes?.status === 200) {
          const dashboard = dashboardRes.data?.data || {};
          const profile = profileRes.data?.data || {};
          const leaves = leaveRes.data?.data || {};

          const quickStats = [
            {
              title: "Approved Leaves",
              value: `${leaves.total_approved || 0} Days`,
              subtitle: "Current Calendar Year",
              icon: CheckCircle,
              color: "text-emerald-600",
              bg: "bg-emerald-100",
            },
            {
              title: "Available Balance",
              value: `${dashboard.leave_balance || 0} Days`,
              subtitle: "Requestable Balance",
              icon: CalendarIcon,
              color: "text-blue-600",
              bg: "bg-blue-100",
            },
            {
              title: "Est. Net Salary",
              value: `₹${dashboard.net_salary || 0}`,
              subtitle: "Current Month Estimate",
              icon: IndianRupee,
              color: "text-indigo-600",
              bg: "bg-indigo-100",
            },
          ];

          setQuickStat(quickStats);
          setDashboardData(dashboard);
          setBasicProfile(profile);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
    fetchDashboard();
  }, [updateDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const recentActivities = (dashboardData?.activities || []).map(
    (activity) => ({
      message: activity.title,
      createdAt: activity.createdAt,
    })
  );

  return (
    <div className="space-y-8 animate-enter">
      {/* Notifications */}
      {notifications?.filter((a) => !a.read).map((notification) => (
        <div
          key={notification.id}
          className="relative bg-card border border-border rounded-xl p-4 shadow-sm flex items-start gap-4 hover:shadow-md transition-all cursor-pointer animate-enter"
          onClick={async () => {
            const resp = await authAPI.readNotification(notification.id);
            if (resp.status) fetchNotification();
          }}
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
             <BellRing className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-foreground">{notification.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{notification.message}</p>
          </div>
          <button className="text-muted-foreground/40 hover:text-destructive transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* Welcome Header */}
      <div className="bg-primary rounded-2xl p-8 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight uppercase">
                Welcome, {basicProfile?.first_name}
              </h1>
              <p className="text-primary-foreground/70 font-medium text-lg mt-1">
                Your professional portal is up to date.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border border-white/10">
                <CheckCircle className="h-3 w-3" />
                <span>ID: {basicProfile?.employee_no}</span>
              </div>
              <div className="px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border border-white/10">
                <Users className="h-3 w-3" />
                <span>{basicProfile?.department?.name}</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => setShowHolidayModal(true)}
            variant="secondary"
            className="font-bold shadow-lg uppercase tracking-widest text-xs h-11 px-6"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Holidays
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quickStat?.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-black text-foreground tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 font-medium italic">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bg} group-hover:rotate-6 transition-transform duration-300 shadow-inner`}>
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
          <CardTitle className="text-base font-bold flex items-center gap-3 text-foreground">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span>My Personal Schedule & Attendance</span>
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
                  head_cell: "text-muted-foreground rounded-md w-12 font-bold text-[10px] uppercase tracking-[0.2em] text-center",
                  row: "flex w-full justify-between mt-2",
                  cell: "h-14 w-14 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: "h-12 w-12 p-0 font-bold aria-selected:opacity-100 hover:bg-primary/5 rounded-full transition-all duration-200",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-xl shadow-primary/40 scale-110",
                  day_today: "bg-muted text-foreground border border-primary/20",
                }}
                modifiers={{
                  hasLeave: myLeaveData.map((leave) => leave.date),
                }}
                modifiersStyles={{
                  hasLeave: {
                    border: "2px solid hsl(var(--primary) / 0.3)",
                    backgroundColor: "hsl(var(--primary) / 0.05)",
                  },
                }}
              />
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-4 bg-muted/5 flex flex-col h-full min-h-[500px]">
              <div className="p-8 border-b border-border/50 bg-muted/10">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Timeline</p>
                <h4 className="text-2xl font-black text-foreground tracking-tight">
                  {format(selectedDate, "EEEE, dd MMMM")}
                </h4>
              </div>
              
              <div className="flex-1 flex flex-col justify-center p-8">
                 <div className="p-10 border-2 border-dashed border-border/50 rounded-3xl flex flex-col items-center justify-center text-center bg-card/50 shadow-inner animate-enter">
                    <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-6 border border-border/50">
                       <CalendarX className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                    <h4 className="font-bold text-foreground text-base mb-2 tracking-tight uppercase">Clear Day</h4>
                    <p className="text-xs text-muted-foreground max-w-[180px] leading-relaxed font-medium uppercase tracking-tighter opacity-60">No leaves or events recorded for this specific date.</p>
                 </div>
              </div>
              
              <div className="p-6 border-t border-border/50 bg-muted/10">
                 <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-[0.2em] h-11 border-border/60 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm" onClick={() => navigate('/employee/leave')}>
                    Request New Leave
                 </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* System Updates */}
        <Card className="border border-border/50 shadow-sm flex flex-col h-full">
          <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-[400px] overflow-y-auto custom-scrollbar">
              {recentActivities?.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="p-5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors flex gap-4 animate-enter">
                    <div className="mt-1"><div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground leading-snug truncate">{activity.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-2 font-black uppercase tracking-widest">{dayjs(activity.createdAt).fromNow()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10"><NoDataFound /></div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Month Leave */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="bg-muted/20 border-b border-border/50 px-6 py-4">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-foreground">
              <Award className="h-4 w-4 text-yellow-500" />
              {format(new Date(), "MMMM")} Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                   <tr><th className="text-left py-3 px-6">Category</th><th className="text-right py-3 px-6">Days</th></tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                   {(dashboardData?.current_month_leaves || []).length > 0 ? (
                      dashboardData.current_month_leaves.map((leave, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="py-4 px-6 font-bold text-foreground">Personal Leaves</td>
                          <td className="py-4 px-6 text-right font-black text-primary bg-primary/[0.02]">{leave.total_leave || 0}</td>
                        </tr>
                      ))
                   ) : (
                     <tr><td colSpan="2" className="py-12 text-center text-muted-foreground italic text-xs">No records found</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>

        {/* Previous Month Leave */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="bg-muted/20 border-b border-border/50 px-6 py-4">
             <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-foreground">
              <Award className="h-4 w-4 text-purple-500" />
              {format(dayjs().subtract(1, 'month').toDate(), "MMMM")} Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                   <tr><th className="text-left py-3 px-6">Category</th><th className="text-right py-3 px-6">Days</th></tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                   {(dashboardData?.previous_month_leaves || []).length > 0 ? (
                      dashboardData.previous_month_leaves.map((leave, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="py-4 px-6 font-bold text-foreground">Personal Leaves</td>
                          <td className="py-4 px-6 text-right font-black text-primary bg-primary/[0.02]">{leave.total_leave || 0}</td>
                        </tr>
                      ))
                   ) : (
                     <tr><td colSpan="2" className="py-12 text-center text-muted-foreground italic text-xs">No records found</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Holiday Modal */}
      <HolidayModal 
        isOpen={showHolidayModal} 
        onClose={() => setShowHolidayModal(false)} 
      />
    </div>
  );
};

export default EmployeeDashboard;