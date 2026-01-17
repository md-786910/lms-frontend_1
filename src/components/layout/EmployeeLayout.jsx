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
import MotionWrapper from "../MotionWrapper";

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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-hidden">
      {/* Sidebar - Deep Professional Dark */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#020817] border-r border-slate-800 shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center h-16 px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Leanport <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">HR</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 mt-6 px-0 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
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
                className={`w-full flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-all duration-200 group relative border-l-2 ${isActive
                  ? "bg-gradient-to-r from-blue-600/10 to-transparent text-blue-400 border-blue-500"
                  : "text-slate-400 hover:bg-white/5 hover:text-white border-transparent"
                  }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="text-xs font-bold text-white">
                {user?.first_name?.[0]?.toUpperCase()}
                {user?.last_name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-bold">Employee</p>
            </div>
          </div>
          <Button 
            onClick={() => handleLogout()}
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs h-9 px-3 rounded-md"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 relative">
        {/* Header - Glassy & Clean */}
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-foreground/60 flex items-center gap-2">
                Workspace <span className="text-foreground/20">/</span> 
                <span className="text-foreground font-bold">
                  {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Popover
              open={notificationOpen}
              onOpenChange={setNotificationOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted transition-colors">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full ring-2 ring-background" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-2xl border-border animate-slide-up" align="end">
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                  <h3 className="font-bold text-sm text-foreground">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 rounded-full">
                      {unreadCount} NEW
                    </Badge>
                  )}
                </div>
                <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                  {notifications?.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground text-sm italic">
                      No notifications yet
                    </div>
                  ) : (
                    notifications?.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleReadNotification(notification.id)}
                        className={`p-4 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 ${!notification.read ? "bg-primary/[0.03]" : ""
                          }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notification.read
                            ? "bg-primary"
                            : "bg-muted"
                            }`}
                        />
                        <div className="flex-1">
                          <h4 className={`text-sm ${!notification.read ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground/50 mt-2 font-medium">
                            {dayjs(notification?.createdAt).fromNow().toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-border bg-muted/30">
                  <Button
                    variant="ghost"
                    className="w-full text-[11px] font-bold h-8 uppercase tracking-wider hover:bg-primary/5 hover:text-primary transition-colors"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="h-6 w-px bg-border/60 mx-2" />
            <div className="flex items-center gap-3 pl-1">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                {user?.first_name?.[0]}
               </div>
            </div>
          </div>
        </header>

        {/* Page Content Area */}
        <main className="flex-1 p-6 lg:p-10 bg-muted/30 overflow-y-auto custom-scrollbar">
          <MotionWrapper className="w-full mx-auto space-y-8 max-w-[1600px]">
            <Outlet />
          </MotionWrapper>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeLayout;