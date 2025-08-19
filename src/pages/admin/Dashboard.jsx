import { useEffect, useState } from "react";
import axios from "axios";
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
} from "lucide-react";

import holidayJsonData from "../../data/holiday.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { companyAPI } from "../../api/companyApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useSocketContext } from "../../contexts/SocketContext";
import dayjs from "dayjs";
const AdminDashboard = () => {
  const { updateDashboard, setUpdateDashboard } = useSocketContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayList, setHolidayList] = useState([]);
  const [notifications, setNotifications] = useState([]);

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
    // fetchNotification();
  }, [updateDashboard]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: "Total Employees",
      value: dashboardData?.total_employee ?? 0,
      change: "+0",
      changeType: "neutral",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "On Leave Today",
      value: dashboardData?.on_leave_today_count ?? 0,
      change: "+0",
      changeType: "neutral",
      icon: UserX,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Active Employees",
      value: dashboardData?.active_employee ?? 0,
      change: "+0",
      changeType: "positive",
      icon: UserCheck,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Avg Working Hours",
      value: "7.8h", // Replace if your API provides this
      change: "+0.2h",
      changeType: "positive",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const leaveData = (dashboardData?.on_leave_today || []).map(
    (leave, index) => ({
      id: index,
      employeeName: `${leave.employee.first_name} ${leave.employee.last_name}`,
      employeeId: leave.employee.employee_no,
      date: new Date(), // API does not provide leave date, assuming today
      type: leave.leave_type.leave_type,
      status: leave.status,
    })
  );

  const recentActivities = (dashboardData?.activities || []).map(
    (activity) => ({
      type: "employee",
      message: activity.title,
      time: new Date(activity.createdAt).toLocaleString(),
      status: "completed",
    })
  );

  const topPerformers = [
    // { name: "Md Ashif", department: "Engineering", score: 98 },
    // { name: "Md Amir", department: "Engineering", score: 95 },
    // { name: "Sohail", department: "Engineering", score: 92 },
    // { name: "Saddam", department: "Marketing", score: 90 },
  ];

  const getEmployeesOnLeave = (date) =>
    leaveData.filter((leave) => isSameDay(leave.date, date));

  const selectedDateLeaves = selectedDate
    ? getEmployeesOnLeave(selectedDate)
    : [];

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
                const resp = await companyAPI.readNotification(notification.id);
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
              <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow"
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
                      {/* <p className={`text-sm font-medium mt-2 ${stat.changeType === 'positive' ? 'text-green-600' :
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-orange-600'
                        }`}>
                        {stat.change} from last month
                      </p> */}
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
          {/* Calendar */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <span>Employee Leave Calendar</span>
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
                    hasLeave: leaveData.map((leave) => leave.date),
                  }}
                  modifiersStyles={{
                    hasLeave: {
                      backgroundColor: "#fef3c7",
                      color: "#d97706",
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
                  {selectedDateLeaves.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateLeaves.map((leave) => (
                        <div
                          key={leave.id}
                          className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-slate-800">
                                {leave.employeeName}
                              </p>
                              <p className="text-sm text-slate-600">
                                {leave.employeeId}
                              </p>
                              <p className="text-sm text-orange-700 font-medium">
                                {leave.type}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {leave.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">
                      No employees on leave this day
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
                <TrendingUp className="h-5 w-5 text-blue-600" />
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
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {dayjs(activity.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <p className="font-medium text-slate-800">
                      {performer.name}
                    </p>
                    <p className="text-sm text-slate-600 mb-3">
                      {performer.department}
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${performer.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {performer.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

export default AdminDashboard;
