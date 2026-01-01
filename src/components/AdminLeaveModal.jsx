import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import {
  CalendarIcon,
  CalendarPlus,
  Clock,
  User,
  FileText,
  Phone,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  Briefcase,
  CalendarDays,
  Hash,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { leaveApi } from "../api/leave/leave";
import { leaveAPI } from "../api/settingsApi/leaveApi";
import { employeeAPI } from "../api/employeeApi";
import { useFormValidation } from "../hooks/useFormValidation";

const LEAVE = [
  {
    id: 1,
    name: "Full Day",
    count: 1,
  },
  {
    id: 2,
    name: "Half Day",
    count: 0.5,
  },
  {
    id: 3,
    name: "Second Half Day",
    count: 0.5,
  },
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
  const [emergencyContact, setEmergencyContact] = useState("");
  const [dayCount, setDayCount] = useState(0);
  const [leaveDays, setLeaveDays] = useState([]);
  const [totalLeaveCount, setTotalLeaveCount] = useState(0);
  const [dayErrors, setDayErrors] = useState([]);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState("approved");

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
        const [empResponse] = await Promise.all([
          employeeAPI.getAll(),
          // leaveAPI.getleave(),
        ]);
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
          description: `Leave request created and ${leaveStatus}`,
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

          if (dayOfWeek === 0 || dayOfWeek === 6) {
            continue;
          }

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

  const today = new Date();
  const disablePast = {
    before: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  };
  const disableWeekends = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const selectedEmployeeData = employees.find(
    (emp) => emp.id === parseInt(selectedEmployee)
  );

  console.log({ leaveTypes });

  return (
    <div className="w-full max-h-[90vh] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <CalendarPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Create Leave Request
              </h2>
              <p className="text-indigo-200 text-sm mt-0.5">
                Submit a new leave request for an employee
              </p>
            </div>
          </div>
          {/* <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white/80 hover:text-white" />
          </button> */}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Employee Selection Card */}
          <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-100 rounded-lg">
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Employee Details</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Select Employee <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedEmployee || ""}
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2">
                  <SelectValue placeholder="Choose an employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem
                      key={emp.id}
                      value={emp.id.toString()}
                      className="py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {emp.first_name} {emp.last_name || ""}
                        </span>
                        <span className="text-slate-400 text-sm">
                          ({emp.employee_no})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employee_id && (
                <p className="text-red-500 text-sm flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.employee_id}</span>
                </p>
              )}
            </div>
          </div>

          {/* Leave Details Section */}
          {selectedEmployee && (
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-200/60 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Leave Details</h3>
              </div>

              {/* Leave Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Leave Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={leaveType ? leaveType.toString() : ""}
                  onValueChange={(val) => setLeaveType(parseInt(val))}
                >
                  <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2">
                    <SelectValue placeholder="Select leave type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes?.map((type) => (
                      <SelectItem
                        key={type?.leave_id}
                        value={type?.leave_id.toString()}
                        className="py-2.5"
                      >
                        {type?.leave_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.leave_type && (
                  <p className="text-red-500 text-sm flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.leave_type}</span>
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300",
                          !startDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2.5 h-4 w-4 text-slate-400" />
                        {startDate ? (
                          <span className="text-slate-700">
                            {format(startDate, "dd MMM yyyy")}
                          </span>
                        ) : (
                          <span>Pick start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
                        // disabled={[disablePast, disableWeekends]}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.start_date && (
                    <p className="text-red-500 text-sm flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errors.start_date}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-11 justify-start text-left font-normal bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300",
                          !endDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2.5 h-4 w-4 text-slate-400" />
                        {endDate ? (
                          <span className="text-slate-700">
                            {format(endDate, "dd MMM yyyy")}
                          </span>
                        ) : (
                          <span>Pick end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          setEndDateOpen(false);
                        }}
                        initialFocus
                        className="pointer-events-auto"
                        disabled={[disableWeekends]}
                        // disabled={[disablePast, disableWeekends]}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.end_date && (
                    <p className="text-red-500 text-sm flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{errors.end_date}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Leave Duration Selection */}
          {dayCount > 0 && selectedEmployee && (
            <div className="bg-slate-50/50 rounded-lg border border-slate-200/60 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200/60 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">
                      Leave Duration
                    </h3>
                  </div>
                  <span className="text-sm text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {dayCount} {dayCount === 1 ? "day" : "days"} selected
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {leaveDays?.map((day, index) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white shadow-sm">
                        <span className="text-xs font-medium leading-none opacity-80">
                          {dayjs(day.date).format("MMM")}
                        </span>
                        <span className="text-base font-bold leading-none mt-0.5">
                          {dayjs(day.date).format("DD")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {dayjs(day.date).format("dddd")}
                        </p>
                        <p className="text-sm text-slate-500">
                          {dayjs(day.date).format("DD MMMM YYYY")}
                        </p>
                      </div>
                    </div>

                    <div className="w-44">
                      <Select
                        value={day?.type?.toString()}
                        onValueChange={(val) =>
                          handleLeaveTypeChange(index, val)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "h-10 bg-white border-slate-200",
                            dayErrors[index] && "border-red-300 bg-red-50"
                          )}
                        >
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value={"0"}
                            className="text-slate-400"
                            disabled
                          >
                            Select Duration
                          </SelectItem>
                          {LEAVE?.map((type) => (
                            <SelectItem
                              key={type?.id}
                              value={type?.id.toString()}
                              className="py-2"
                            >
                              {type?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {dayErrors[index] && (
                        <p className="text-red-500 text-xs mt-1">
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
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-200/60">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800">
                  Additional Information
                </h3>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Reason for Leave <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a brief description of your leave request..."
                  rows={3}
                  className="bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 resize-none"
                />
                {errors.reason && (
                  <p className="text-red-500 text-sm flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.reason}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Summary Card */}
          {selectedEmployee && (
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg p-4 border border-indigo-100/60">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-800">
                  Request Summary
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Employee
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800 truncate">
                    {selectedEmployeeData?.first_name || "—"}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Type
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800 truncate">
                    {leaveTypes.find((t) => t.leave_id === leaveType)
                      ?.leave_type || "—"}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Days
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800">
                    {dayCount || 0}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Leave Count
                    </p>
                  </div>
                  <p className="font-semibold text-indigo-600">
                    {totalLeaveCount || 0}
                  </p>
                </div>
              </div>

              {startDate && endDate && (
                <div className="mt-4 pt-4 border-t border-indigo-100">
                  <p className="text-sm text-slate-600 text-center">
                    <span className="font-medium">
                      {format(startDate, "dd MMM yyyy")}
                    </span>
                    <span className="mx-2 text-slate-400">to</span>
                    <span className="font-medium">
                      {format(endDate, "dd MMM yyyy")}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 px-4 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-5 h-10 border-slate-200 hover:bg-white text-slate-600"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {selectedEmployee && (
            <Button
              type="submit"
              onClick={handleSubmit}
              className="px-6 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200"
              disabled={isSubmitting || dayCount === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Create Leave Request
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveModal;
