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
  Clock,
  DollarSign,
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

const EmployeeDashboard = () => {
  const { updateDashboard, setUpdateDashboard } = useSocketContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickStat, setQuickStat] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
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

  const quickStats = [
    {
      title: "Leave Balance",
      value: "18 days",
      subtitle: "Available this year",
      icon: CalendarIcon,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Hours This Month",
      value: "162h",
      subtitle: "8h remaining",
      icon: Clock,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Current Salary",
      value: "$85,000",
      subtitle: "Annual gross",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Performance",
      value: "92%",
      subtitle: "This quarter",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentActivities = [
    {
      title: "Clocked In",
      description: "Started work at 9:00 AM today",
      time: "2 hours ago",
      type: "success",
    },
    {
      title: "Leave Request Approved",
      description: "Your leave request for Feb 20-21 has been approved",
      time: "1 day ago",
      type: "success",
    },
    {
      title: "Salary Slip Generated",
      description: "January 2024 salary slip is now available",
      time: "3 days ago",
      type: "info",
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
    const fetDashboard = async () => {
      try {
        const resp = await EmpDashboardApi.getDashboard();
        const resp1 = await EmpDashboardApi.getProfileBasicInfo();
        if (resp.status == 200 || resp1.status == 200) {
          const quickStats = [
            {
              title: "Leave Balance",
              value: `${resp.data?.data?.leave_balance} days`,
              subtitle: "Available this year",
              icon: CalendarIcon,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Hours This Month",
              value: "162h",
              subtitle: "8h remaining",
              icon: Clock,
              color: "from-green-500 to-green-600",
            },
            {
              title: "Current Salary",
              value: "$85,000",
              subtitle: "Annual gross",
              icon: DollarSign,
              color: "from-purple-500 to-purple-600",
            },
            {
              title: "Performance",
              value: "92%",
              subtitle: "This quarter",
              icon: TrendingUp,
              color: "from-orange-500 to-orange-600",
            },
          ];
          setQuickStat(quickStats);
          setDashboardData(resp.data?.data);
          setBasicProfile(resp1.data?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotification();
    fetDashboard();
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
    })
  );

  // const recentActivities = (dashboardData?.activities || []).map((activity) => ({
  //   type: 'employee',
  //   message: activity.title,
  //   time: new Date(activity.createdAt).toLocaleString(),
  //   status: 'completed'
  // }));
  return (
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
        <h1 className="text-2xl font-bold mb-2">
          Welcome back,{" "}
          {basicProfile?.first_name + " " + basicProfile?.last_name}!
        </h1>
        <p className="text-blue-100 mb-4">
          Here's your dashboard overview for today.
        </p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStat?.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`border-0 shadow-lg bg-white hover:shadow-xl transition-shadow
              ${index == 1 ? "blur pointer-events-none" : ""}
                
                `}
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
                              {leave.employeeName} -{" "}
                              {leave.employeeId ?? `EMP-${leave.emp_id}`}
                            </span>
                            <p className="text-sm text-slate-800">
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
                  <p className="text-slate-500 text-sm">
                    No leave scheduled for this day
                  </p>
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
              {recentActivities.map((activity, index) => (
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
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg blur pointer-events-none">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
      </Card>

      {/* Upcoming Events & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 blur pointer-events-none">
        {/* Upcoming Events */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-800">{event.title}</p>
                    <p className="text-sm text-slate-600">{event.date}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      event.type === "meeting"
                        ? "bg-blue-100 text-blue-800"
                        : event.type === "deadline"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {event.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">92%</span>
                </div>
                <p className="font-medium text-slate-800">
                  Overall Performance
                </p>
                <p className="text-sm text-slate-600">
                  Excellent work this quarter
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <p className="text-sm text-slate-600">Projects Completed</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">8.5</div>
                  <p className="text-sm text-slate-600">Team Rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
