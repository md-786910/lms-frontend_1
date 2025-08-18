import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  format,
  differenceInHours,
  differenceInMinutes,
  parseISO,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from "date-fns";
import {
  Clock,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Play,
  Square,
  Coffee,
  MoreHorizontal,
  TrendingUp,
  Timer,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TimeLogs = () => {
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  // Mock time log data (similar to Zoho People)
  const timeLogs = [
    {
      id: 1,
      date: "2024-01-15",
      clockIn: "09:00:00",
      clockOut: "18:30:00",
      breakTime: "01:00:00",
      totalHours: "8:30",
      workingHours: "8:30",
      status: "completed",
      location: "Office",
      notes: "Regular working day",
    },
    {
      id: 2,
      date: "2024-01-14",
      clockIn: "09:15:00",
      clockOut: "17:45:00",
      breakTime: "00:45:00",
      totalHours: "8:30",
      workingHours: "7:45",
      status: "completed",
      location: "Remote",
      notes: "Work from home",
    },
    {
      id: 3,
      date: "2024-01-13",
      clockIn: "08:45:00",
      clockOut: "17:30:00",
      breakTime: "01:15:00",
      totalHours: "8:45",
      workingHours: "7:30",
      status: "completed",
      location: "Office",
      notes: "Early start",
    },
    {
      id: 4,
      date: "2024-01-12",
      clockIn: "09:00:00",
      clockOut: null,
      breakTime: "00:00:00",
      totalHours: null,
      workingHours: null,
      status: "ongoing",
      location: "Office",
      notes: "Current session",
    },
  ];

  // Calculate monthly stats
  const monthlyStats = {
    totalWorkingDays: 22,
    actualWorkedDays: 18,
    totalRequiredHours: 176,
    totalActualHours: 144,
    averageHoursPerDay: 8,
    overtime: 0,
    lateCheckins: 2,
    earlyCheckouts: 1,
  };

  const handleClockIn = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newSession = {
        id: Date.now(),
        date: format(new Date(), "yyyy-MM-dd"),
        clockIn: format(new Date(), "HH:mm:ss"),
        clockOut: null,
        location: "Office",
        status: "ongoing",
      };
      setCurrentSession(newSession);
      setClockedIn(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleClockOut = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          clockOut: format(new Date(), "HH:mm:ss"),
          status: "completed",
        };
        setCurrentSession(updatedSession);
      }
      setClockedIn(false);
      setIsLoading(false);
    }, 1000);
  };

  const getCurrentTime = () => {
    return format(new Date(), "HH:mm:ss");
  };

  const formatDuration = (start, end) => {
    if (!end) return "Ongoing";
    const startTime = parseISO(`2024-01-01T${start}`);
    const endTime = parseISO(`2024-01-01T${end}`);
    const hours = differenceInHours(endTime, startTime);
    const minutes = differenceInMinutes(endTime, startTime) % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6 blur pointer-events-none">
      {/* Header with Current Status */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Time Tracking</h1>
            <p className="text-blue-100">
              Track your work hours and manage attendance
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-col items-center lg:items-end">
            <div className="text-3xl font-mono font-bold mb-2">
              {getCurrentTime()}
            </div>
            <p className="text-blue-100 text-sm">
              {format(currentDate, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      {/* Clock In/Out Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Timer className="h-5 w-5 text-blue-600" />
            <span>Today's Attendance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleClockIn}
                  disabled={clockedIn || isLoading}
                  className="flex-1 h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  <Play className="h-6 w-6 mr-2" />
                  {isLoading && clockedIn === false
                    ? "Clocking In..."
                    : "Clock In"}
                </Button>
                <Button
                  onClick={handleClockOut}
                  disabled={!clockedIn || isLoading}
                  variant="outline"
                  className="flex-1 h-16 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Square className="h-6 w-6 mr-2" />
                  {isLoading && clockedIn === true
                    ? "Clocking Out..."
                    : "Clock Out"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Status
                  </span>
                  <Badge
                    className={
                      clockedIn
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }
                  >
                    {clockedIn ? "Clocked In" : "Clocked Out"}
                  </Badge>
                </div>
                {currentSession && (
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Clock In:</span>
                      <span className="font-medium">
                        {currentSession.clockIn}
                      </span>
                    </div>
                    {currentSession.clockOut && (
                      <div className="flex justify-between">
                        <span>Clock Out:</span>
                        <span className="font-medium">
                          {currentSession.clockOut}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">
                        {formatDuration(
                          currentSession.clockIn,
                          currentSession.clockOut
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Today's Hours
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-2">8h 30m</p>
                <p className="text-sm text-green-600 mt-1">On target</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">
                  42h 15m
                </p>
                <p className="text-sm text-slate-500 mt-1">5 days worked</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">144h</p>
                <p className="text-sm text-orange-600 mt-1">32h remaining</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Attendance</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">95%</p>
                <p className="text-sm text-green-600 mt-1">Excellent</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Logs Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Time Log History</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select defaultValue="this-month">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Break Time</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {format(parseISO(log.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{log.clockIn}</TableCell>
                    <TableCell>{log.clockOut || "-"}</TableCell>
                    <TableCell>{log.breakTime}</TableCell>
                    <TableCell className="font-medium">
                      {log.workingHours || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.location === "Office" ? "default" : "secondary"
                        }
                      >
                        {log.location}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          log.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {log.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {monthlyStats.actualWorkedDays}
              </div>
              <p className="text-sm text-slate-600">Days Worked</p>
              <p className="text-xs text-slate-500">
                of {monthlyStats.totalWorkingDays} required
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {monthlyStats.totalActualHours}h
              </div>
              <p className="text-sm text-slate-600">Total Hours</p>
              <p className="text-xs text-slate-500">
                of {monthlyStats.totalRequiredHours}h required
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {monthlyStats.lateCheckins}
              </div>
              <p className="text-sm text-slate-600">Late Check-ins</p>
              <p className="text-xs text-slate-500">This month</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {monthlyStats.averageHoursPerDay}h
              </div>
              <p className="text-sm text-slate-600">Avg Hours/Day</p>
              <p className="text-xs text-slate-500">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeLogs;
