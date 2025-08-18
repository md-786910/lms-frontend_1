import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
} from "lucide-react";

const Timing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
    <div className="space-y-6 ">
      {/* Header */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Time & Attendance
          </h1>
          <p className="text-slate-600">
            Track employee working hours and attendance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Clock className="h-4 w-4 mr-2" />
            Time Settings
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Present Today
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {presentCount}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Late Arrivals
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {lateCount}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalWorkHours.toFixed(1)}h
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by employee name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button variant="outline">Filter by Status</Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Records Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>
            Today's Attendance - {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Employee
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">
                    Department
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Check In
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Check Out
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Work Hours
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Break Time
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Overtime
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {timeRecords.map((record) => (
                  <tr
                    key={record.employeeId}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="font-medium text-slate-800">
                            {record.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {record.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {record.department}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-800">
                      {record.checkIn}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-800">
                      {record.checkOut}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-slate-800">
                      {record.workHours}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600">
                      {record.breakTime}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600">
                      {record.overtime}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600">
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <div
                  key={day}
                  className="text-center p-4 bg-slate-50 rounded-lg"
                >
                  <p className="text-sm font-medium text-slate-600">{day}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">
                    {index < 5
                      ? Math.floor(Math.random() * 10) + 35
                      : Math.floor(Math.random() * 5) + 5}
                  </p>
                  <p className="text-xs text-slate-500">Present</p>
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
