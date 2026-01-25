import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LayoutDashboard,
  User,
  Calendar,
  LogOut,
  Menu,
  X,
  Building2,
  Bell,
  IndianRupee,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { showNotification } from "../../utils/customToast";
import { useSocketContext } from "../../contexts/SocketContext";
import { authAPI } from "../../api/authapi/authAPI";
const EmployeeLayout = () => {
  const { socket, connectSocket, updateDashboard, setUpdateDashboard } =
    useSocketContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);

  const handleReadNotification = async (id) => {
    try {
      const resp = await authAPI.readNotification(id);
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
    const unread = notifications?.filter((n) => !n.read) || [];
    if (!unread.length) return;
    try {
      await Promise.allSettled(unread.map((n) => authAPI.readNotification(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications read:", error);
      toast.error("Could not mark all notifications as read");
    }
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 500);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/employee/dashboard" },
    { icon: User, label: "Profile", path: "/employee/profile" },
    { icon: Calendar, label: "Leave", path: "/employee/leave" },
    { icon: IndianRupee, label: "Salary", path: "/employee/salary" },
    { icon: Settings, label: "Settings", path: "/employee/settings/reset-password" },
  ];

  // api
  useEffect(() => {
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
    fetchNotification();
  }, [updateDashboard]);

  // handle real time notification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }
  }, [connectSocket]);

  useEffect(() => {
    if (!socket) {
      return toast.error("Please refresh to connect to get real time updates");
    }
    socket.on("notify:user", ({ message }) => {
      setUpdateDashboard(Math.random());
      showNotification(message);
    });

    return () => {
      socket.off("notify:user");
    };
  }, [socket]);

  const unreadCount = useMemo(() => {
    return notifications?.filter((n) => !n.read)?.length;
  }, [notifications]);

  const currentPage =
    menuItems.find((item) => location.pathname.startsWith(item.path))?.label ||
    "Dashboard";

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-xl transform transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {user?.logo ? (
              <img
                src={user.logo}
                alt={user.name || "Company Logo"}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-semibold">
                {user?.company_name || "LMS"}
              </p>
              <p className="text-xs text-slate-500">Employee Workspace</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-5 py-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Navigate
          </p>
          <nav className="mt-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-all ${
                    isActive
                      ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 px-5 py-4 bg-white/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              {user?.first_name?.[0]?.toUpperCase()}
              {user?.last_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-3 w-full justify-center gap-2 border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72 flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                  Employee area
                </p>
                <h1 className="text-lg font-semibold leading-tight text-slate-900">
                  {currentPage}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Popover
                open={notificationOpen}
                onOpenChange={setNotificationOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-slate-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] rounded-full bg-primary px-1 text-[11px] font-semibold text-white leading-5 text-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-96 p-0 border border-slate-200 shadow-xl rounded-xl"
                  align="end"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Notifications
                      </p>
                      <p className="text-xs text-slate-500">
                        Stay current with account updates
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-700"
                    >
                      {unreadCount} new
                    </Badge>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications?.length ? (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleReadNotification(notification.id)}
                          className={`w-full text-left px-4 py-3 flex gap-3 transition hover:bg-slate-50 ${
                            !notification.read ? "bg-slate-50" : "bg-white"
                          }`}
                        >
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              !notification.read
                                ? "bg-primary/10 text-primary"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Bell className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {notification.title || "Notification"}
                            </p>
                            <p className="text-xs text-slate-600">
                              {notification.message}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {dayjs(notification?.createdAt).fromNow()}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-slate-500">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-200"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                    >
                      Mark all as read
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotificationOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Signed in</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : "Employee User"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.position || "Employee"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeLayout;
