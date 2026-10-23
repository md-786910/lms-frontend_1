import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Users,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Building2,
  Bell,
  Settings,
  User,
  IndianRupee,
  Calendar,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useSocketContext } from "../../contexts/SocketContext";
import { toast } from "sonner";
import { showNotification } from "../../utils/customToast";
import dayjs from "dayjs";
import { companyAPI } from "../../api/companyApi";

const AdminLayout = () => {
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
      if (response.status === 200) {
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Employees", path: "/admin/employees" },
    { icon: IndianRupee, label: "Salary", path: "/admin/salary" },
    { icon: Calendar, label: "Leave", path: "/admin/leave" },
    { icon: User, label: "User Management", path: "/admin/user" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const filteredMenu = menuItems.filter(
    (item) => !(item.path === "/admin/user" && user?.role === "light_admin")
  );

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
    const unread = notifications?.filter((n) => !n.read) || [];
    if (!unread.length) return;
    try {
      await Promise.allSettled(
        unread.map((n) => companyAPI.readNotification(n.id))
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications read:", error);
      toast.error("Could not mark all notifications as read");
    }
  };

  // handle real time notification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token);
    }
  }, [connectSocket]);

  const unreadCount = useMemo(
    () => notifications?.filter((n) => !n.read)?.length || 0,
    [notifications]
  );

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
  }, [socket, setUpdateDashboard]);

  const currentPage =
    filteredMenu.find((item) => location.pathname.startsWith(item.path))
      ?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-[#F5ECE4] text-[#2E2E2E] font-sans">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#FAF6F2] border-r border-[#E1D4C7] shadow-xl transform transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#E1D4C7]">
          <div className="flex items-center gap-3">
            {companyData?.logo ? (
              <img
                src={companyData.logo}
                alt={companyData.name || "Company Logo"}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-[#734425] text-white flex items-center justify-center shadow-sm shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-heading font-bold uppercase tracking-tight text-[#2E2E2E]">
                {companyData?.company_name || "Admin Console"}
              </p>
              <p className="text-xs text-[#2E2E2E]/60 font-medium">Control Center</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#2E2E2E]/70 hover:bg-[#734425]/10 hover:text-[#734425]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-5 py-4 space-y-1">
          <nav className="space-y-1">
            {filteredMenu.map((item) => {
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
                      ? "border-[#734425]/30 bg-[#734425]/10 text-[#734425] shadow-sm font-heading"
                      : "border-transparent text-[#2E2E2E]/80 hover:border-[#E1D4C7] hover:bg-[#734425]/5 hover:text-[#734425]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors shrink-0 ${
                      isActive
                        ? "bg-[#734425] text-white shadow-sm"
                        : "bg-[#E1D4C7]/50 text-[#734425] group-hover:bg-[#734425]/15"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#C26819]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#E1D4C7] px-5 py-4 bg-[#FAF6F2]/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#734425] text-white flex items-center justify-center font-bold font-heading shadow-sm">
              {user?.first_name?.[0]?.toUpperCase()}
              {user?.last_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate text-[#2E2E2E]">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-[#2E2E2E]/60 truncate font-medium">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-3 w-full justify-center gap-2 border-[#E1D4C7] text-[#2E2E2E] hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all font-medium rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72 flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#FAF6F2]/90 backdrop-blur supports-[backdrop-filter]:bg-[#FAF6F2]/70 border-b border-[#E1D4C7]">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#2E2E2E] hover:bg-[#734425]/10 hover:text-[#734425]"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg font-heading font-black leading-tight uppercase tracking-tight text-[#2E2E2E] truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
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
                  <Button variant="ghost" size="icon" className="relative text-[#734425] hover:bg-[#734425]/10">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] rounded-full bg-[#C26819] px-1 text-[11px] font-bold text-white leading-5 text-center shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-96 p-0 border border-[#E1D4C7] shadow-xl rounded-2xl bg-[#FAF6F2]"
                  align="end"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#E1D4C7]/60">
                    <div>
                      <p className="text-sm font-heading font-bold text-[#2E2E2E] uppercase tracking-tight">
                        Notifications
                      </p>
                      <p className="text-xs text-[#2E2E2E]/60">
                        Latest updates for your company
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[#734425]/10 text-[#734425] font-semibold"
                    >
                      {unreadCount} new
                    </Badge>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E1D4C7]/60">
                    {notifications?.length ? (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleReadNotification(notification.id)}
                          className={`w-full text-left px-4 py-3 flex gap-3 transition hover:bg-[#734425]/5 ${
                            !notification.read ? "bg-[#734425]/5" : "bg-transparent"
                          }`}
                        >
                          <div
                            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                              !notification.read
                                ? "bg-[#C26819]/15 text-[#C26819]"
                                : "bg-[#E1D4C7]/60 text-[#2E2E2E]/70"
                            }`}
                          >
                            <Bell className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-bold text-[#2E2E2E]">
                              {notification.title || "Notification"}
                            </p>
                            <p className="text-xs text-[#2E2E2E]/75">
                              {notification.message}
                            </p>
                            <p className="text-[11px] text-[#2E2E2E]/50">
                              {dayjs(notification?.createdAt).fromNow()}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="mt-2 h-2 w-2 rounded-full bg-[#C26819]" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-[#2E2E2E]/60 text-center font-medium">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 border-t border-[#E1D4C7]/60">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[#E1D4C7] text-[#734425] hover:bg-[#734425]/10 rounded-xl font-medium"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                    >
                      Mark all as read
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#2E2E2E]/70 hover:bg-[#734425]/10 hover:text-[#734425] rounded-xl"
                      onClick={() => setNotificationOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#2E2E2E]">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : "Admin User"}
                  </p>
                  <p className="text-xs text-[#734425] font-semibold uppercase tracking-wider">Administrator</p>
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

export default AdminLayout;
