import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Timing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const timeRecords = [
    {
      employeeId: "EMP001",
      name: "John Doe",
      department: "Engineering",
      checkIn: "09:00 AM",
      checkOut: "06:30 PM",
      workHours: "8h 30m",
      breakTime: "1h 00m",
      overtime: "0h 30m",
      status: "Present",
      location: "Office",
    },
    {
      employeeId: "EMP002",
      name: "Jane Smith",
      department: "Design",
      checkIn: "08:45 AM",
      checkOut: "05:45 PM",
      workHours: "8h 00m",
      breakTime: "1h 00m",
      overtime: "0h 00m",
      status: "Present",
      location: "Remote",
    },
    {
      employeeId: "EMP003",
      name: "Mike Johnson",
      department: "Sales",
      checkIn: "09:15 AM",
      checkOut: "07:00 PM",
      workHours: "8h 45m",
      breakTime: "1h 00m",
      overtime: "0h 45m",
      status: "Late",
      location: "Office",
    },
    {
      employeeId: "EMP004",
      name: "Sarah Wilson",
      department: "Marketing",
      checkIn: "---",
      checkOut: "---",
      workHours: "0h 00m",
      breakTime: "0h 00m",
      overtime: "0h 00m",
      status: "Absent",
      location: "N/A",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-orange-100 text-orange-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Late":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "Absent":
        return <User className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const presentCount = timeRecords.filter(
    (record) => record.status === "Present"
  ).length;
  const lateCount = timeRecords.filter(
    (record) => record.status === "Late"
  ).length;
  const absentCount = timeRecords.filter(
    (record) => record.status === "Absent"
  ).length;
  const totalWorkHours = timeRecords.reduce((sum, record) => {
    const hours =
      parseFloat(
        record.workHours.replace("h", "").replace("m", "").split(" ")[0]
      ) || 0;
    return sum + hours;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="border border-[#E1D4C7]/30 shadow-xl rounded-2xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <span className="inline-block text-[11px] font-heading font-bold tracking-widest text-[#E1D4C7] uppercase bg-white/10 px-3 py-1 rounded-full">
                Attendance & Schedule
              </span>
              <h1 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-white">
                Time &amp; Attendance
              </h1>
              <p className="text-white/80 text-sm font-sans">
                Track employee working hours, attendance logs, and daily productivity.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#24130A] font-heading font-semibold text-xs uppercase tracking-wider"
              >
                Export Report
              </Button>
              <Button className="bg-[#FAF6F2] text-[#734425] hover:bg-white hover:text-[#5D361D] font-heading font-bold text-xs uppercase tracking-wider shadow-lg rounded-xl">
                <Clock className="h-4 w-4 mr-2 text-[#C26819]" />
                Time Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2E2E2E]/70 text-xs font-heading font-bold uppercase tracking-wider">
                  Present Today
                </p>
                <p className="text-3xl font-heading font-extrabold text-[#24130A] mt-1">
                  {presentCount}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#734425]/10 text-[#734425]">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2E2E2E]/70 text-xs font-heading font-bold uppercase tracking-wider">
                  Late Arrivals
                </p>
                <p className="text-3xl font-heading font-extrabold text-[#C26819] mt-1">
                  {lateCount}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#C26819]/15 text-[#C26819]">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2E2E2E]/70 text-xs font-heading font-bold uppercase tracking-wider">Absent</p>
                <p className="text-3xl font-heading font-extrabold text-[#8A522D] mt-1">{absentCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#8A522D]/15 text-[#8A522D]">
                <User className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2E2E2E]/70 text-xs font-heading font-bold uppercase tracking-wider">
                  Total Hours
                </p>
                <p className="text-3xl font-heading font-extrabold text-[#24130A] mt-1">
                  {totalWorkHours.toFixed(1)}h
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#734425]/10 text-[#734425]">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#734425]/50" />
              <Input
                placeholder="Search by employee name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#FAF6F2] border-[#E1D4C7] text-[#2E2E2E] focus:border-[#734425] rounded-xl"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-48 justify-start text-left font-normal bg-[#FAF6F2] border-[#E1D4C7] text-[#2E2E2E] rounded-xl",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[#734425]" />
                    {selectedDate ? (
                      format(new Date(selectedDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-[#E1D4C7] bg-[#FAF6F2] rounded-2xl" align="end">
                  <Calendar
                    mode="single"
                    selected={new Date(selectedDate)}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date.toISOString().split("T")[0]);
                        setDatePickerOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button variant="outline" className="border-[#E1D4C7] bg-[#FAF6F2] text-[#2E2E2E] hover:bg-[#734425]/5 rounded-xl font-heading font-semibold text-xs uppercase tracking-wider">
              Filter by Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Records Table */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2] overflow-hidden">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-4">
          <CardTitle className="font-heading font-bold uppercase tracking-tight text-lg text-[#24130A]">
            Today's Attendance - {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E1D4C7] bg-[#FAF6F2]/80">
                  <th className="text-left py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Employee
                  </th>
                  <th className="text-left py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Department
                  </th>
                  <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Check In
                  </th>
                  <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Check Out
                  </th>
                  <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Work Hours
                  </th>
                  <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Break Time
                  </th>
                  <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Overtime
                  </th>
                  <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Status
                  </th>
                  <th className="text-center py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-xs text-[#734425]">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1D4C7]/60 bg-[#FAF6F2]">
                {timeRecords.map((record) => (
                  <tr
                    key={record.employeeId}
                    className="hover:bg-[#734425]/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="font-heading font-bold text-sm text-[#24130A]">
                            {record.name}
                          </p>
                          <p className="text-xs text-[#2E2E2E]/60 font-sans">
                            {record.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#2E2E2E]">
                      {record.department}
                    </td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-[#2E2E2E]">
                      {record.checkIn}
                    </td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-[#2E2E2E]">
                      {record.checkOut}
                    </td>
                    <td className="py-4 px-4 text-center text-sm font-heading font-bold text-[#734425]">
                      {record.workHours}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-[#2E2E2E]/70">
                      {record.breakTime}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-[#2E2E2E]/70">
                      {record.overtime}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-[#2E2E2E]/70">
                      {record.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl bg-[#FAF6F2]">
        <CardHeader>
          <CardTitle className="font-heading font-bold uppercase tracking-tight text-lg text-[#24130A]">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <div
                  key={day}
                  className="text-center p-4 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-xl hover:border-[#734425] transition-all"
                >
                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">{day}</p>
                  <p className="text-2xl font-heading font-extrabold text-[#24130A] mt-2">
                    {index < 5
                      ? Math.floor(Math.random() * 10) + 35
                      : Math.floor(Math.random() * 5) + 5}
                  </p>
                  <p className="text-xs text-[#2E2E2E]/60 font-sans mt-0.5">Present</p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timing;
