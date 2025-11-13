import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import holidayJsonData from "../../data/holiday.json";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  Users,
  Bell,
  Award,
  Play,
  Square,
  FileText,
  CalendarPlus,
  Timer,
} from "lucide-react";
import { EmpDashboardApi } from "../../api/employee/dashboard";
import { Alert, AlertDescription } from "../../components/ui/alert";
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
          ?.map((notification) => (
            <Alert
              key={notification.id}
              className="p-2 border-0 shadow-red-400 rounded-lg shadow-md "
              style={{ color: "white !important" }}
              onClick={async () => {
                const resp = await authAPI.readNotification(notification.id);
                if (resp.status) {
                  fetchNotification();
                }
              }}
            >
              <AlertDescription className="text-sm text-slate-700">
                <strong>{notification.title}</strong>:{" "}
                <span className="text-blue-600">{notification.message}</span>
              </AlertDescription>
            </Alert>
          ))}

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back,{" "}
                {basicProfile?.first_name + " " + basicProfile?.last_name}!
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your team today.
              </p>
            </div>
            <button
              onClick={() => setShowHolidayModal(true)}
              className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 shadow"
            >
              View Holidays
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>
                Employee ID:{" "}
                {basicProfile?.employee_no ?? `EMP-${basicProfile?.id}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Department: {basicProfile?.department?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Position: {basicProfile?.designation?.title}</span>
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
                className={`border-0 shadow-lg bg-white hover:shadow-xl transition-shadow
                  
                  `}
                // ${index == 1 ? "blur pointer-events-none" : ""}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-800 mt-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
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
          <Card className="lg:col-span-2 border-0 shadow-lg">
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
                  className="rounded-md border pointer-events-auto"
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
                  <h4 className="font-semibold text-slate-800">
                    {selectedDate
                      ? format(selectedDate, "MMMM d, yyyy")
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
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities?.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-3 bg-slate-50 rounded-lg"
                  >
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
    </>
  );
};

export default EmployeeDashboard;
