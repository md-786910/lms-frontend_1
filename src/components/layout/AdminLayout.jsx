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
import { showNotification } from "../../utils/customToast";
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
    // { icon: Clock, label: "Timing", path: "/admin/timing" },
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

  const handleReadNotification = async (id) => {
    try {
      const resp = await companyAPI.readNotification(id);
      if (resp?.status) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notification read:", error);
      toast.error("Could not mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    // gather unread notifications
    const unread = notifications?.filter((n) => !n.read) || [];
    if (!unread.length) return;
    try {
      // mark all in parallel
      await Promise.allSettled(
        unread.map((n) => companyAPI.readNotification(n.id))
      );
      // update locally
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications read:", error);
      toast.error("Could not mark all notifications as read");
    }
    toast.success("All notifications marked as read");
  };

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
      showNotification(message);
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
                className="w-9 h-9 rounded-lg object-cover"
              />
            ) : (
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            )}
            <span className="font-bold text-xl text-slate-900 leading-none mb-1">
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

        <div className="p-4 absolute bottom-4 left-4 right-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-600 shadow-sm">
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-sm">{user?.first_name?.[0]?.toUpperCase()} {user?.last_name?.[0]?.toUpperCase()}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              vairent="outline"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all shadow-sm text-slate-600 dark:text-slate-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="material-symbols-outlined text-base">Sign Out</span>
            </button>
          </div>
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

            <div className="flex items-center space-x-4">
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
                          } cursor-pointer`}
                          onClick={() => handleReadNotification(notification.id)}
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
                    <Button
                      variant="outline"
                      className="w-full text-sm"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                    >
                      Mark all as read
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center space-x-3">
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : "Admin User"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">Administrator</p>
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
