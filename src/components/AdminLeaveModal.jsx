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
  Hash,
  Loader2,
  X,
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
    // disable dates before the selected start date (exclusive)
    return dayjs(date).isBefore(dayjs(startDate), "day");
  };

  const selectedEmployeeData = employees.find(
    (emp) => emp.id === parseInt(selectedEmployee)
  );

  return (
    <div className="w-full max-h-[90vh] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-slate-900 px-6 py-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Create Leave Request
              </h2>
              <p className="text-slate-300 text-sm">
                Submit a request on behalf of an employee
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-200 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-5 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              {/* Employee Selection */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <Users className="h-4 w-4 text-slate-700" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Employee</h3>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Select Employee <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedEmployee || ""}
                    onValueChange={handleEmployeeChange}
                  >
                    <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/15 focus:ring-2">
                      <SelectValue placeholder="Choose an employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedEmployees.map((emp) => (
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

              {/* Leave Details */}
              {selectedEmployee && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <Briefcase className="h-4 w-4 text-slate-700" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Leave Details
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Leave Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={leaveType ? leaveType.toString() : ""}
                      onValueChange={(val) => setLeaveType(parseInt(val))}
                    >
                      <SelectTrigger className="h-11 bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/15 focus:ring-2">
                        <SelectValue placeholder="Select leave type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedLeaveTypes?.map((type) => (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Popover
                        open={startDateOpen}
                        onOpenChange={setStartDateOpen}
                      >
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
                            disabled={[disableWeekends, disableBeforeStartDate]}
                            fromDate={startDate}
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

              {/* Duration */}
              {dayCount > 0 && selectedEmployee && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg">
                          <Clock className="h-4 w-4 text-slate-700" />
                        </div>
                        <h3 className="font-semibold text-slate-900">
                          Leave duration
                        </h3>
                      </div>
                      <span className="text-sm text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                        {dayCount} {dayCount === 1 ? "day" : "days"} selected
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {leaveDays?.map((day, index) => (
                      <div
                        key={day.date}
                        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[11px] font-medium leading-none text-slate-200">
                              {dayjs(day.date).format("MMM")}
                            </span>
                            <span className="text-base font-semibold leading-none">
                              {dayjs(day.date).format("DD")}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {dayjs(day.date).format("dddd")}
                            </p>
                            <p className="text-sm text-slate-600">
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

              {/* Reason */}
              {selectedEmployee && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <Briefcase className="h-4 w-4 text-slate-700" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
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
                      placeholder="Provide a brief description..."
                      rows={3}
                      className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/15 focus:ring-2 resize-none"
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
            </div>

            {/* Summary Sidebar */}
            {selectedEmployee && (
              <div className="space-y-4 lg:sticky lg:top-4 h-fit">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-slate-700" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Request Summary
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Employee</span>
                      <span className="font-semibold text-slate-900">
                        {selectedEmployeeData?.first_name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Leave Type</span>
                      <span className="font-semibold text-slate-900">
                        {leaveTypes.find((t) => t.leave_id === leaveType)
                          ?.leave_type || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Days selected</span>
                      <span className="font-semibold text-slate-900">
                        {dayCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Leave count</span>
                      <span className="font-semibold text-slate-900">
                        {totalLeaveCount || 0}
                      </span>
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {format(startDate, "dd MMM yyyy")}{" "}
                      <span className="text-slate-400">to</span>{" "}
                      {format(endDate, "dd MMM yyyy")}
                    </div>
                  )}
                </div>

                {leaveType && (
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-sm space-y-2">
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-600" />
                      Leave policy snapshot
                    </p>
                    {(() => {
                      const policy = leaveTypes.find(
                        (t) => t.leave_id === leaveType
                      );
                      if (!policy) return null;
                      return (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Total</span>
                            <span className="font-semibold text-slate-900">
                              {policy.leave_count ?? 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Used</span>
                            <span className="font-semibold text-slate-900">
                              {policy.leave_used ?? 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Remaining</span>
                            <span className="font-semibold text-emerald-600">
                              {policy.leave_remaing ?? 0}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-5 h-10 border-slate-200 hover:bg-white text-slate-700"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {selectedEmployee && (
            <Button
              type="submit"
              onClick={handleSubmit}
              className="px-6 h-10 bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
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
