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
    <div className="space-y-6">
      {/* Header with Current Status */}
      <Card className="border border-[#E1D4C7]/30 shadow-xl rounded-2xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <span className="inline-block text-[11px] font-heading font-bold tracking-widest text-[#E1D4C7] uppercase bg-white/10 px-3 py-1 rounded-full">
                Employee Attendance
              </span>
              <h1 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-white">
                Time Tracking &amp; Logs
              </h1>
              <p className="text-white/80 font-sans text-sm">
                Track your active shift, log daily hours, and view historical timesheets.
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-col items-center lg:items-end bg-white/10 p-4 rounded-xl border border-white/15">
              <div className="text-3xl font-heading font-extrabold tracking-wider text-white mb-1">
                {getCurrentTime()}
              </div>
              <p className="text-[#E1D4C7] text-xs font-sans tracking-wide">
                {format(currentDate, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clock In/Out Section */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg font-heading font-bold uppercase tracking-tight text-[#24130A]">
            <Timer className="h-5 w-5 text-[#734425]" />
            <span>Today's Attendance Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleClockIn}
                  disabled={clockedIn || isLoading}
                  className="flex-1 h-16 bg-[#734425] hover:bg-[#5D361D] text-white font-heading font-bold uppercase tracking-wider text-sm rounded-xl shadow-md transition-all"
                >
                  <Play className="h-5 w-5 mr-2 text-[#E1D4C7]" />
                  {isLoading && clockedIn === false
                    ? "Clocking In..."
                    : "Clock In"}
                </Button>
                <Button
                  onClick={handleClockOut}
                  disabled={!clockedIn || isLoading}
                  variant="outline"
                  className="flex-1 h-16 border-[#C26819] text-[#C26819] hover:bg-[#C26819]/10 font-heading font-bold uppercase tracking-wider text-sm rounded-xl transition-all"
                >
                  <Square className="h-5 w-5 mr-2" />
                  {isLoading && clockedIn === true
                    ? "Clocking Out..."
                    : "Clock Out"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">
                    Status
                  </span>
                  <Badge
                    className={
                      clockedIn
                        ? "bg-emerald-500/15 text-emerald-800 border-emerald-300"
                        : "bg-[#734425]/10 text-[#734425] border-[#E1D4C7]"
                    }
                  >
                    {clockedIn ? "Clocked In" : "Clocked Out"}
                  </Badge>
                </div>
                {currentSession && (
                  <div className="space-y-2 text-xs text-[#2E2E2E]/80 font-sans">
                    <div className="flex justify-between">
                      <span className="font-medium">Clock In:</span>
                      <span className="font-heading font-bold text-[#24130A]">
                        {currentSession.clockIn}
                      </span>
                    </div>
                    {currentSession.clockOut && (
                      <div className="flex justify-between">
                        <span className="font-medium">Clock Out:</span>
                        <span className="font-heading font-bold text-[#24130A]">
                          {currentSession.clockOut}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span className="font-heading font-bold text-[#C26819]">
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
        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2E2E2E]/70 text-xs font-heading font-bold uppercase tracking-wider">
                  Today's Hours
                </p>
                <p className="text-3xl font-heading font-extrabold text-[#24130A] mt-1">8h 30m</p>
                <p className="text-xs text-emerald-700 font-medium mt-1">On target</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#734425]/10 text-[#734425]">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2E2E2E]/70 text-xs font-heading font-bold uppercase tracking-wider">This Week</p>
                <p className="text-3xl font-heading font-extrabold text-[#24130A] mt-1">
                  42h 15m
                </p>
                <p className="text-xs text-[#2E2E2E]/60 mt-1">5 days worked</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#C26819]/15 text-[#C26819]">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2E2E2E]/70 text-xs font-heading font-bold uppercase tracking-wider">This Month</p>
                <p className="text-3xl font-heading font-extrabold text-[#734425] mt-1">144h</p>
                <p className="text-xs text-[#C26819] font-medium mt-1">32h remaining</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#734425]/10 text-[#734425]">
                <CalendarIcon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2E2E2E]/70 text-xs font-heading font-bold uppercase tracking-wider">Attendance</p>
                <p className="text-3xl font-heading font-extrabold text-[#24130A] mt-1">95%</p>
                <p className="text-xs text-emerald-700 font-medium mt-1">Excellent</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Logs Table */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2] overflow-hidden">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2 font-heading font-bold uppercase tracking-tight text-lg text-[#24130A]">
              <Clock className="h-5 w-5 text-[#734425]" />
              <span>Time Log History</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select defaultValue="this-month">
                <SelectTrigger className="w-[180px] bg-[#FAF6F2] border-[#E1D4C7] rounded-xl text-xs font-medium">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="border-[#E1D4C7] bg-[#FAF6F2] rounded-xl">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="bg-[#FAF6F2] border-[#E1D4C7] text-[#734425] hover:bg-[#734425]/5 rounded-xl font-heading font-semibold text-xs uppercase tracking-wider">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E1D4C7] bg-[#FAF6F2]/80">
                  <TableHead className="font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">Date</TableHead>
                  <TableHead className="font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">Clock In</TableHead>
                  <TableHead className="font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">Clock Out</TableHead>
                  <TableHead className="font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">Break Time</TableHead>
                  <TableHead className="font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">Working Hours</TableHead>
                  <TableHead className="font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">Location</TableHead>
                  <TableHead className="font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">Status</TableHead>
                  <TableHead className="font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#E1D4C7]/60 bg-[#FAF6F2]">
                {timeLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-[#734425]/5 transition-colors">
                    <TableCell className="font-heading font-bold text-sm text-[#24130A]">
                      {format(parseISO(log.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-[#2E2E2E]">{log.clockIn}</TableCell>
                    <TableCell className="text-sm font-medium text-[#2E2E2E]">{log.clockOut || "-"}</TableCell>
                    <TableCell className="text-sm text-[#2E2E2E]/70">{log.breakTime}</TableCell>
                    <TableCell className="font-heading font-bold text-sm text-[#734425]">
                      {log.workingHours || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.location === "Office" ? "default" : "secondary"
                        }
                        className="rounded-lg text-xs"
                      >
                        {log.location}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          log.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-800 border border-emerald-300"
                            : "bg-[#734425]/10 text-[#734425] border border-[#E1D4C7]"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[#2E2E2E]/70">
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
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-4">
          <CardTitle className="font-heading font-bold uppercase tracking-tight text-lg text-[#24130A]">Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-xl shadow-sm">
              <div className="text-3xl font-heading font-extrabold text-[#734425]">
                {monthlyStats.actualWorkedDays}
              </div>
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#2E2E2E]/70 mt-1">Days Worked</p>
              <p className="text-[11px] text-[#2E2E2E]/50">
                of {monthlyStats.totalWorkingDays} required
              </p>
            </div>
            <div className="text-center p-4 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-xl shadow-sm">
              <div className="text-3xl font-heading font-extrabold text-[#24130A]">
                {monthlyStats.totalActualHours}h
              </div>
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#2E2E2E]/70 mt-1">Total Hours</p>
              <p className="text-[11px] text-[#2E2E2E]/50">
                of {monthlyStats.totalRequiredHours}h required
              </p>
            </div>
            <div className="text-center p-4 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-xl shadow-sm">
              <div className="text-3xl font-heading font-extrabold text-[#C26819]">
                {monthlyStats.lateCheckins}
              </div>
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#2E2E2E]/70 mt-1">Late Check-ins</p>
              <p className="text-[11px] text-[#2E2E2E]/50">This month</p>
            </div>
            <div className="text-center p-4 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-xl shadow-sm">
              <div className="text-3xl font-heading font-extrabold text-[#8A522D]">
                {monthlyStats.averageHoursPerDay}h
              </div>
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#2E2E2E]/70 mt-1">Avg Hours/Day</p>
              <p className="text-[11px] text-[#2E2E2E]/50">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeLogs;
