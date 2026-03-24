import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
  CalendarIcon,
  CalendarPlus,
  Clock,
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Badge,
  Loader2,
  X,
  FileText,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { leaveApi } from "../api/leave/leave";
import { employeeAPI } from "../api/employeeApi";
import { useFormValidation } from "../hooks/useFormValidation";

const LEAVE = [
  { id: 1, name: "Full Day", count: 1 },
  { id: 2, name: "Half Day", count: 0.5 },
  { id: 3, name: "Second Half Day", count: 0.5 },
];

const AdminLeaveModal = ({ onClose, onSuccess }) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [leaveType, setLeaveType] = useState(null);
  const [reason, setReason] = useState("");
  const [dayCount, setDayCount] = useState(0);
  const [leaveDays, setLeaveDays] = useState([]);
  const [totalLeaveCount, setTotalLeaveCount] = useState(0);
  const [dayErrors, setDayErrors] = useState([]);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedEmployees = useMemo(() => {
    const list = [...employees];
    const getFullName = (employee) =>
      `${employee?.first_name ?? ""} ${employee?.last_name ?? ""}`.trim();
    return list.sort((a, b) => {
      const nameA = getFullName(a).toLowerCase();
      const nameB = getFullName(b).toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [employees]);

  const sortedLeaveTypes = useMemo(() => {
    const list = [...leaveTypes];
    return list.sort((a, b) => {
      const nameA = (a?.leave_type ?? "").toLowerCase();
      const nameB = (b?.leave_type ?? "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [leaveTypes]);

  const initialValues = {
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  };

  const validationSchema = {
    employee_id: [{ type: "required", message: "Employee is required" }],
    leave_type: [{ type: "required", message: "Leave Type is required" }],
    start_date: [{ type: "required", message: "Start Date is required" }],
    end_date: [{ type: "required", message: "End Date is required" }],
    reason: [{ type: "required", message: "Reason is required" }],
  };

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empResponse = await employeeAPI.getAll();
        if (empResponse.data) {
          setEmployees(empResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  const handleEmployeeChange = (empId) => {
    const emp = employees.find((e) => e.id.toString() === empId);
    setSelectedEmployee(empId);
    setLeaveTypes(emp?.employee_leaves || []);
    setLeaveType(null);
    setLeaveDays([]);
    setStartDate(null);
    setEndDate(null);
    setTotalLeaveCount(0);
  };

  const validateLeaveSection = () => {
    const isMainValid = formValidation(
      ["employee_id", "leave_type", "start_date", "end_date", "reason"],
      {
        employee_id: selectedEmployee,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      }
    );

    const tempErrors = [];
    leaveDays.forEach((day, index) => {
      if (!day.type || day.type.toString() === "0") {
        tempErrors[index] = "Leave type is required";
      } else {
        tempErrors[index] = "";
      }
    });
    setDayErrors(tempErrors);

    return isMainValid && tempErrors.every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateLeaveSection();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await leaveApi.adminCreateLeave({
        employee_id: parseInt(selectedEmployee),
        leave_type_id: parseInt(leaveType),
        start_date: startDate,
        end_date: endDate,
        total_days: totalLeaveCount,
        leave_on: JSON.stringify(leaveDays),
        reason,
        emergency_contact_person: "",
      });

      if (response.status === 201 || response.status === 200) {
        toast({
          title: "Success",
          description: "Leave request created",
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating leave:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to create leave request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveTypeChange = (index, selectedId) => {
    const updated = [...leaveDays];

    const selectedType = parseInt(selectedId);
    const typeObj = LEAVE.find((t) => t.id === selectedType);
    updated[index].type = selectedType;
    updated[index].count = typeObj?.count || 0;
    updated[index].id = typeObj?.name;

    setLeaveDays(updated);

    const total = updated.reduce((sum, day) => sum + (day.count || 0), 0);
    setTotalLeaveCount(total);
  };

  useEffect(() => {
    if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate), "day")) {
      setEndDate(null);
      return;
    }

    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const diffInDays = end.diff(start, "day");

      if (diffInDays >= 0) {
        const tempLeaveDays = [];
        let validDayCount = 0;

        for (let i = 0; i <= diffInDays; i++) {
          const currentDate = start.add(i, "day");
          const dayOfWeek = currentDate.day();

          if (dayOfWeek === 0 || dayOfWeek === 6) continue;

          validDayCount += 1;

          tempLeaveDays.push({
            date: currentDate.format("YYYY-MM-DD"),
            type: 0,
            id: "full_day",
            count: 1,
          });
        }

        setDayCount(validDayCount);
        setLeaveDays(tempLeaveDays);
        setTotalLeaveCount(validDayCount);
      } else {
        setDayCount(0);
        setLeaveDays([]);
        setTotalLeaveCount(0);
      }
    }
  }, [startDate, endDate]);

  const disableWeekends = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const disableBeforeStartDate = (date) => {
    if (!startDate) return false;
    return dayjs(date).isBefore(dayjs(startDate), "day");
  };

  const selectedEmployeeData = employees.find(
    (emp) => emp.id === parseInt(selectedEmployee)
  );

  return (
    <div className="w-full max-h-[95vh] flex flex-col overflow-hidden">
      {/* Premium Header */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-12 md:col-span-8 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
                    <CalendarPlus className="h-5 w-5" />
                  </span>
                  <div className="space-y-0.5">
                    <h2 className="text-2xl font-semibold font-montserrat text-[#FFFFFF] tracking-tight">
                      Create Leave Request
                    </h2>
                    <p className="text-[#FFFFFF] font-montserrat font-medium">
                      Administrative leave submission for employees
                    </p>
                  </div>
                </div>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:justify-end pb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-md hover:bg-slate-100 bg-[#e2e8f0] text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 scroll-slim">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,350px]">
            <div className="space-y-6">
              {/* Employee Selection Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 border-b border-slate-50 pb-4">
                  <div className="h-8 w-8 border-[#047857] bg-[#e2e8f0] text-[#047857] flex items-center justify-center rounded-md">
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold font-montserrat text-slate-900 text-lg capitalize tracking-tight">Employee Selection</h3>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">
                    Select Employee <span className="text-rose-500 font-montserrat font-medium text-sm">*</span>
                  </Label>
                  <Select
                    value={selectedEmployee || ""}
                    onValueChange={handleEmployeeChange}
                  >
                    <SelectTrigger className="h-12 bg-white border-slate-200 font-montserrat rounded-xl focus:ring-indigo-500/20 focus:border-[#131313] transition-all font-medium">
                      <SelectValue placeholder="Choose an employee..." className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider" />
                    </SelectTrigger>
                    <SelectContent className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">
                      {sortedEmployees.map((emp) => (
                        <SelectItem
                          key={emp.id}
                          value={emp.id.toString()}
                          className="py-3 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700 font-montserrat capitalize tracking-wider">
                              {emp.first_name} {emp.last_name || ""}
                            </span>
                            <span className="text-slate-600 text-xs font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                              #{emp.employee_no}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employee_id && (
                    <p className="text-rose-500 text-xs font-bold flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.employee_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Leave Details Section */}
              {selectedEmployee && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2.5 border-b border-slate-50 pb-4">
                    <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-8 w-8 items-center justify-center rounded-md">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold font-montserrat text-slate-900 text-lg capitalize tracking-tight">Leave Configuration</h3>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">
                      Leave Type <span className="text-rose-500 font-montserrat font-medium text-sm">*</span>
                    </Label>
                    <Select
                      value={leaveType ? leaveType.toString() : ""}
                      onValueChange={(val) => setLeaveType(parseInt(val))}
                    >
                      <SelectTrigger className="h-12 bg-white border-slate-200 font-montserrat rounded-xl focus:ring-indigo-500/20 focus:border-[#131313] transition-all font-medium">
                        <SelectValue placeholder="Select leave type..." className="text-sm font-semibold text-slate-700 font-montserrat capitalize tracking-wider" />
                      </SelectTrigger>
                      <SelectContent className="text-sm font-semibold text-slate-700 font-montserrat capitalize tracking-wider">
                        {sortedLeaveTypes?.map((type) => (
                          <SelectItem
                            key={type?.leave_id}
                            value={type?.leave_id.toString()}
                            className="text-sm font-semibold text-slate-700 font-montserrat capitalize tracking-wider"
                          >
                            {type?.leave_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.leave_type && (
                      <p className="text-rose-500 text-xs font-semibold font-montserrat flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.leave_type}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">Start Date <span className="text-rose-500 font-montserrat font-medium text-sm">*</span></Label>
                      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left text-sm font-medium text-slate-700 font-montserrat capitalize tracking-wider hover:bg-slate-50 hover:border-slate-300 transition-all",
                              !startDate && "text-slate-400"
                            )}
                          >
                            <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-6 w-6 items-center font-montserrat justify-center rounded-md">
                              <CalendarIcon className="w-2 h-2" />
                            </span>
                            {startDate ? format(startDate, "dd MMM yyyy") : <span>Pick start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              setStartDateOpen(false);
                            }}
                            initialFocus
                            className="pointer-events-auto"
                            disabled={[disableWeekends]}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.start_date && (
                        <p className="text-rose-500 text-xs font-bold mt-1">{errors.start_date}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">End Date <span className="text-rose-500 font-montserrat font-medium text-sm">*</span></Label>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left text-sm font-medium text-slate-700 font-montserrat capitalize tracking-wider hover:bg-slate-50 hover:border-slate-300 transition-all",
                              !endDate && "text-slate-400"
                            )}
                          >
                            <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-6 w-6 items-center font-montserrat justify-center rounded-md">
                              <CalendarIcon className="w-2 h-2" />
                            </span>
                            {endDate ? format(endDate, "dd MMM yyyy") : <span>Pick end date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date);
                              setEndDateOpen(false);
                            }}
                            initialFocus
                            className="pointer-events-auto"
                            disabled={[disableWeekends, disableBeforeStartDate]}
                            fromDate={startDate}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.end_date && (
                        <p className="text-rose-500 text-xs font-bold mt-1">{errors.end_date}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Day Selection Grid */}
              {dayCount > 0 && selectedEmployee && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-8 w-8 items-center justify-center rounded-md">
                        <Clock className="h-4 w-4" />
                      </span>
                      <h3 className="font-semibold font-montserrat text-slate-900 text-lg capitalize tracking-tight">Daily Breakdown</h3>
                    </div>
                    <Badge className="bg-white border-slate-200 text-indigo-600 font-bold px-3 py-1 text-xs shadow-sm">
                      {dayCount} {dayCount === 1 ? "Working Day" : "Working Days"}
                    </Badge>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto scroll-slim">
                    {leaveDays?.map((day, index) => (
                      <div
                        key={day.date}
                        className="flex items-center justify-between gap-6 px-6 py-4 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-md">
                            <span className="text-[10px] font-black uppercase leading-none text-slate-400 mb-0.5">
                              {dayjs(day.date).format("MMM")}
                            </span>
                            <span className="text-lg font-black leading-none tracking-tighter">
                              {dayjs(day.date).format("DD")}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {dayjs(day.date).format("dddd")}
                            </p>
                            <p className="text-xs text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">
                              {dayjs(day.date).format("DD MMMM YYYY")}
                            </p>
                          </div>
                        </div>

                        <div className="w-48">
                          <Select
                            value={day?.type?.toString()}
                            onValueChange={(val) => handleLeaveTypeChange(index, val)}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-11 border-slate-200 rounded-xl font-bold transition-all",
                                dayErrors[index] && "border-rose-300 bg-rose-50 text-rose-600"
                              )}
                            >
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                              {LEAVE?.map((type) => (
                                <SelectItem
                                  key={type?.id}
                                  value={type?.id.toString()}
                                  className="py-2.5 font-bold"
                                >
                                  {type?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {dayErrors[index] && (
                            <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-tight">
                              {dayErrors[index]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason Section */}
              {selectedEmployee && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2.5 mb-5 border-b border-slate-50 pb-4">
                    <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-8 w-8 items-center font-montserrat justify-center rounded-md">
                      <FileText className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold font-montserrat text-slate-900 text-lg capitalize tracking-tight">Justification</h3>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">Reason for Leave <span className="text-rose-500 font-montserrat font-medium text-sm">*</span></Label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Why is this leave being requested?"
                      rows={4}
                      className="bg-white border-slate-200 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-medium fontmontserrat text-sm text-slate-700"
                    />
                    {errors.reason && (
                      <p className="text-rose-500 text-xs font-bold mt-1">{errors.reason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Premium Summary Sidebar */}
            <div className="space-y-6">
              {selectedEmployee ? (
                <div className="space-y-6 lg:sticky lg:top-0 h-fit">
                  {/* Summary Card */}
                  <div className="bg-slate-900 rounded-xl py-4 px-6 text-white shadow-xl shadow-indigo-100 overflow-hidden relative group transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                      <LayoutDashboard className="h-24 w-24" />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6 relative">
                      <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-8 w-8 items-center justify-center rounded-md">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <h3 className="font-semibold font-montserrat text-[#FFFFFF] capitalize tracking-tight text-md">Request Summary</h3>
                    </div>

                    <div className="space-y-4 relative">
                      <div className="space-y-1">
                        <p className="text-indigo-100 text-[10px] capitalize font-semibold font-montserrat tracking-widest">Employee</p>
                        <p className="font-black text-xl font-montserrat truncate">{selectedEmployeeData?.first_name} {selectedEmployeeData?.last_name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <div className="space-y-1">
                          <p className="text-indigo-100 text-[10px] capitalize font-semibold font-montserrat tracking-widest">Type</p>
                          <p className="font-bold text-sm font-montserrat">
                            {leaveTypes.find((t) => t.leave_id === leaveType)?.leave_type || "Not set"}
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-indigo-100 text-[10px] capitalize font-montserrat font-semibold tracking-widest">Count</p>
                          <p className="font-bold text-xl font-montserrat">{totalLeaveCount || 0} <span className="text-xs font-medium font-montserrat">Days</span></p>
                        </div>
                      </div>

                      {startDate && endDate && (
                        <div className="mt-2 p-3 bg-white/10 rounded-xl border border-white/10 text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-white/20 transition-colors">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {format(startDate, "dd MMM")} <ArrowRight className="h-3 w-3" /> {format(endDate, "dd MMM yyyy")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Policy Snapshot Card */}
                  {leaveType && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50">
                        <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-8 w-8 items-center justify-center rounded-md">
                          <CalendarDays className="h-4 w-4" />
                        </span>
                        <h3 className="font-semibold text-slate-900 text-sm capitalize font-montserrat tracking-tight">Policy Snapshot</h3>
                      </div>
                      
                      {(() => {
                        const policy = leaveTypes.find((t) => t.leave_id === leaveType);
                        if (!policy) return null;
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between group">
                              <span className="text-xs font-semibold font-montserrat text-slate-400 capitalize tracking-wider group-hover:text-slate-600 transition-colors">Total Annual</span>
                              <span className="font-black text-slate-900 text-md">{policy.leave_count ?? 0}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                              <span className="text-xs font-semibold font-montserrat text-slate-400 capitalize tracking-wider group-hover:text-slate-600 transition-colors">Used to Date</span>
                              <span className="font-black text-slate-900 text-md">{policy.leave_used ?? 0}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between group">
                              <span className="text-xs font-semibold font-montserrat text-emerald-600 capitalize tracking-wider">Remaining</span>
                              <span className="font-black text-emerald-600 text-md group-hover:scale-110 transition-transform">{policy.leave_remaing ?? 0}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                  <div className="h-10 w-10 border-[#047857] bg-[#e2e8f0] text-[#047857] flex items-center mx-auto justify-center rounded-md">
                    <Users className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 capitalize font-montserrat tracking-widest">Select an employee to see summary</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Modern Action Footer */}
      <div className="flex-shrink-0 px-8 py-6 bg-white border-t border-slate-200">
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-Montserrat"
            // disabled={isSubmitting || !selectedEmployee || dayCount === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveModal;
