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

  // Fetch employees and leave types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empResponse, leaveResponse] = await Promise.all([
          employeeAPI.getAll(),
          leaveAPI.getleave(),
        ]);
        if (empResponse.data) {
          setEmployees(empResponse.data);
        }
        if (leaveResponse.data) {
          setLeaveTypes(leaveResponse.data);
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

  // Reset form when employee changes
  const handleEmployeeChange = (empId) => {
    setSelectedEmployee(empId);
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
        emergency_contact_person: emergencyContact,
        status: leaveStatus,
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

  return (
    <div className="w-full overflow-hidden">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <CalendarPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Create Leave Request
              </h2>
              <p className="text-blue-100 text-sm">
                Manually create a leave request for an employee
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="employee"
              className="flex items-center space-x-2 text-slate-700 font-medium"
            >
              <Users className="h-4 w-4 text-blue-600" />
              <span>
                Select Employee <span className="text-red-500">*</span>
              </span>
            </Label>
            <Select
              value={selectedEmployee || ""}
              onValueChange={handleEmployeeChange}
            >
              <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.first_name} {emp.last_name || ""} ({emp.employee_no})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employee_id && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.employee_id}</span>
              </p>
            )}
          </div>

          {/* Leave Type Selection */}
          {selectedEmployee && (
            <div className="space-y-2">
              <Label
                htmlFor="leaveType"
                className="flex items-center space-x-2 text-slate-700 font-medium"
              >
                <FileText className="h-4 w-4 text-blue-600" />
                <span>
                  Leave Type <span className="text-red-500">*</span>
                </span>
              </Label>
              <Select
                value={leaveType ? leaveType.toString() : ""}
                onValueChange={(val) => {
                  setLeaveType(parseInt(val));
                }}
              >
                <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes?.map((type) => (
                    <SelectItem
                      key={type?.id}
                      value={type?.id.toString()}
                      className="py-2.5"
                    >
                      {type?.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.leave_type && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.leave_type}</span>
                </p>
              )}
            </div>
          )}

          {/* Date Range */}
          {selectedEmployee && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2 text-slate-700 font-medium">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                  <span>
                    Start Date <span className="text-red-500">*</span>
                  </span>
                </Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal border-slate-200 hover:bg-slate-50",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {startDate ? (
                        <span className="text-slate-700">
                          {format(startDate, "dd/MM/yy")}
                        </span>
                      ) : (
                        <span>Select start date</span>
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
                      disabled={[disablePast, disableWeekends]}
                    />
                  </PopoverContent>
                </Popover>
                {errors.start_date && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.start_date}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2 text-slate-700 font-medium">
                  <CalendarIcon className="h-4 w-4 text-purple-600" />
                  <span>
                    End Date <span className="text-red-500">*</span>
                  </span>
                </Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal border-slate-200 hover:bg-slate-50",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {endDate ? (
                        <span className="text-slate-700">
                          {format(endDate, "dd/MM/yy")}
                        </span>
                      ) : (
                        <span>Select end date</span>
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
                      disabled={[disablePast, disableWeekends]}
                    />
                  </PopoverContent>
                </Popover>
                {errors.end_date && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.end_date}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Leave Status Selection */}
          {selectedEmployee && (
            <div className="space-y-2">
              <Label className="flex items-center space-x-2 text-slate-700 font-medium">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span>Leave Status</span>
              </Label>
              <Select value={leaveStatus} onValueChange={setLeaveStatus}>
                <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Leave Days Selection */}
          {dayCount > 0 && selectedEmployee && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h4 className="font-medium text-slate-700 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Select Leave Duration for Each Day</span>
                </h4>
              </div>
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {leaveDays?.map((day, index) => (
                  <div
                    key={day.date}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {dayjs(day.date).format("DD")}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {dayjs(day.date).format("dddd")}
                        </p>
                        <p className="text-sm text-slate-500">
                          {dayjs(day.date).format("DD MMM YYYY")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Select
                        value={day?.type?.toString()}
                        onValueChange={(val) =>
                          handleLeaveTypeChange(index, val)
                        }
                      >
                        <SelectTrigger className="h-10 border-slate-200">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"0"} className="text-slate-400">
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
                        <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{dayErrors[index]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reason */}
          {selectedEmployee && (
            <div className="space-y-2">
              <Label
                htmlFor="reason"
                className="flex items-center space-x-2 text-slate-700 font-medium"
              >
                <FileText className="h-4 w-4 text-blue-600" />
                <span>
                  Reason for Leave <span className="text-red-500">*</span>
                </span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide details about the leave request..."
                rows={3}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
              {errors.reason && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.reason}</span>
                </p>
              )}
            </div>
          )}

          {/* Emergency Contact */}
          {selectedEmployee && (
            <div className="space-y-2">
              <Label
                htmlFor="emergencyContact"
                className="flex items-center space-x-2 text-slate-700 font-medium"
              >
                <Phone className="h-4 w-4 text-blue-600" />
                <span>
                  Emergency Contact{" "}
                  <span className="text-slate-400 text-sm font-normal">
                    (Optional)
                  </span>
                </span>
              </Label>
              <Input
                id="emergencyContact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Contact person during absence"
                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Leave Summary */}
          {selectedEmployee && (
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 p-5">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span>Leave Summary</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Employee
                  </p>
                  <p className="font-semibold text-slate-800">
                    {selectedEmployeeData?.first_name || "—"}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Leave Type
                  </p>
                  <p className="font-semibold text-slate-800">
                    {leaveTypes.find((t) => t.id === leaveType)?.type || "—"}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Days Selected
                  </p>
                  <p className="font-semibold text-slate-800">
                    {dayCount || 0} days
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Leave Count
                  </p>
                  <p className="font-semibold text-purple-600">
                    {totalLeaveCount || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm col-span-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <p className="font-semibold capitalize text-slate-800">
                    {leaveStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 h-11 border-slate-200 hover:bg-slate-50"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            {selectedEmployee && (
              <Button
                type="submit"
                className="px-6 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                disabled={isSubmitting || dayCount === 0}
              >
                {isSubmitting ? "Creating..." : "Create Leave"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLeaveModal;
