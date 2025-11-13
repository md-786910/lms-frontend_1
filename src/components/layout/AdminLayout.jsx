import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Building2,
  Bell,
  Settings,
  CalendarClock,
  User,
  IndianRupee,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useSocketContext } from "../../contexts/SocketContext";
import { toast } from "sonner";
import { toast as toastNotify } from "react-toastify";
import dayjs from "dayjs";
import { companyAPI } from "../../api/companyApi";
const AdminLayout = (props) => {
  const { socket, connectSocket, updateDashboard, setUpdateDashboard } =
    useSocketContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [companyData, setCompanyData] = useState(null);

  const getCompanyDetails = async () => {
    try {
      const response = await axiosInstance.get("/company");
      if (response.status == 200) {
        const data = response.data?.data;
        const { company_name, logo = null } = data;
        setCompanyData({
          company_name,
          logo,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCompanyDetails();
  }, [updateDashboard]);

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Employees", path: "/admin/employees" },
    { icon: IndianRupee, label: "Salary", path: "/admin/salary" },
    { icon: Calendar, label: "Leave", path: "/admin/leave" },
    { icon: Clock, label: "Timing", path: "/admin/timing" },
    // { icon: CalendarClock, label: "Employee History", path: "/admin/history" },
    { icon: User, label: "User Management", path: "/admin/user" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  // api
  useEffect(() => {
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
    fetchNotification();
  }, [updateDashboard]);

  // handle real time notification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }
  }, [connectSocket]);

  const unreadCount = useMemo(() => {
    return notifications?.filter((n) => !n.read)?.length;
  }, [notifications]);

  useEffect(() => {
    if (!socket) {
      return toast.error("Please refresh to connect to get real time updates");
    }
    socket.on("notify:user", ({ message }) => {
      setUpdateDashboard(Math.random()); // Trigger update
      return toastNotify.success(message);
    });

    return () => {
      socket.off("notify:user");
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            {companyData?.logo ? (
              <img
                src={companyData.logo}
                alt={companyData.name || "Company Logo"}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            )}
            <span className="text-lg font-semibold text-slate-800">
              {companyData?.company_name || "HR Admin"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-6 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                style={{
                  display:
                    item.path == "/admin/user" && user.role === "light_admin"
                      ? "none"
                      : "",
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 bg-slate-50 rounded-lg mb-4">
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs text-blue-600 font-medium">Administrator</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white shadow-sm border-b border-slate-200 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 lg:ml-0 ml-4">
              <h1 className="text-xl font-semibold text-slate-800">
                {menuItems.find((item) => item.path === location.pathname)
                  ?.label || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              <Popover
                open={notificationOpen}
                onOpenChange={setNotificationOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 mr-4" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">
                        Notifications
                      </h3>
                      <Badge variant="secondary">{unreadCount} new</Badge>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {notifications?.map((notification) => (
                        <Card
                          key={notification.id}
                          className={`border-0 shadow-sm ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                  !notification.read
                                    ? "bg-blue-500"
                                    : "bg-slate-300"
                                }`}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-slate-800">
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-slate-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                  {dayjs(notification?.createdAt).fromNow()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full text-sm">
                      Mark all as read
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-20 p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
