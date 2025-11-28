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
} from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { employeeLeaveApi } from "../api/employee/leaveApi";
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

const LeaveRequestModal = ({
  onClose,
  onSuccess,
  leaves = [],
  readOnly = false,
  leaveRequestViewMode = {},
}) => {
  console.log({
    leaves,
    readOnly,
    leaveRequestViewMode,
  });
  const { toast } = useToast();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [leaveType, setLeaveType] = useState(leaves?.[0]?.id);
  const [reason, setReason] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [dayCount, setDayCount] = useState(0);
  const [leaveCalculate, setLeaveCalculate] = useState(() => {
    return leaves?.find((l) => l.id == leaveType);
  });

  const [leaveDays, setLeaveDays] = useState([]);
  const [totalLeaveCount, setTotalLeaveCount] = useState(0);
  const [dates, setDates] = useState({
    start_date: "",
    end_date: "",
  });
  const [dayErrors, setDayErrors] = useState([]);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const initialValues = {
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    emergencyContact: "",
  };

  const validationSchema = {
    leave_type: [{ type: "required", message: "Leave Type is required" }],
    start_date: [{ type: "required", message: "Start Date is required" }],
    end_date: [{ type: "required", message: "End Date is required" }],
    reason: [{ type: "required", message: "Reason is required" }],
  };

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const validateLeaveSection = () => {
    // Main form validation
    const isMainValid = formValidation(
      ["leave_type", "start_date", "end_date", "reason", "name"],
      {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
        name: name,
      }
    );

    // Validate each day's leave type
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
    // if (!startDate || !endDate || !leaveType || !reason) {
    //   toast({
    //     title: "Missing Information",
    //     description: "Please fill in all required fields.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    const isValid = validateLeaveSection();
    if (!isValid) {
      console.error("Please fill all required fields.");
      return;
    }

    const resp = await employeeLeaveApi.createNewLeaveRequest({
      leave_type_id: leaveCalculate?.id,
      start_date: startDate,
      end_date: endDate,
      total_days: totalLeaveCount,
      leave_on: JSON.stringify(leaveDays),
      reason,
      emergency_contact_person: emergencyContact,
    });

    if (resp.status == 200) {
      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been submitted successfully.",
      });
      onSuccess();
      onClose();
    }
  };

  const calculateLeave = useCallback((id = leaves?.[0]?.id) => {
    const acc = leaves?.find((l) => l.id == id);
    setLeaveCalculate(acc);
  }, []);

  // calculate date diff
  const handleLeaveTypeChange = (index, selectedId) => {
    const updated = [...leaveDays];

    // Update the selected leave type and its count
    const selectedType = parseInt(selectedId);
    const typeObj = LEAVE.find((t) => t.id === selectedType);
    updated[index].type = selectedType;
    updated[index].count = typeObj?.count || 0;
    updated[index].id = typeObj?.name;

    // Update state once with modified leaveDays
    setLeaveDays(updated);

    // Recalculate total leave count
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
          const dayOfWeek = currentDate.day(); // 0 = Sunday, 6 = Saturday

          // Skip Saturday and Sunday
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
      } else {
        setDayCount(0);
        setLeaveDays([]);
      }
    }
  }, [startDate, endDate]);

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     const start = dayjs(startDate);
  //     const end = dayjs(endDate);
  //     const diffInDays = end.diff(start, "day");
  //     setDayCount(diffInDays + 1);

  //     if (diffInDays >= 0) {
  //       setDayCount(diffInDays + 1);
  //       const tempLeaveDays = [];
  //       for (let i = 0; i <= diffInDays; i++) {
  //         const date = start.add(i, "day").format("YYYY-MM-DD");
  //         tempLeaveDays.push({
  //           date,
  //           type: 0,
  //           id: "full_day",
  //           count: 1,
  //         });
  //       }
  //       setLeaveDays(tempLeaveDays);
  //     } else {
  //       setDayCount(0);
  //       setLeaveDays([]);
  //     }
  //   }
  // }, [startDate, endDate]);

  useEffect(() => {
    if (readOnly) {
      setLeaveType(leaveRequestViewMode?.leave_type_id);
      setDates({
        start_date: new Date(leaveRequestViewMode?.start_date),
        end_date: new Date(leaveRequestViewMode?.end_date),
      });
      setDayCount(leaveRequestViewMode?.total_days);
      setLeaveDays(JSON.parse(leaveRequestViewMode?.leave_on));
      setReason(leaveRequestViewMode?.reason);
      setEmergencyContact(leaveRequestViewMode?.emergency_contact_person);

      const total = JSON.parse(leaveRequestViewMode?.leave_on)?.reduce(
        (sum, day) => {
          const typeObj = LEAVE.find((t) => t.id === day.type);
          return sum + (typeObj?.count || 0);
        },
        0
      );
      setTotalLeaveCount(total);
    }
  }, [leaveRequestViewMode, readOnly]);

  // cuurent
  const today = new Date();
  const disablePast = {
    before: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  };
  const disableWeekends = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      statusStyles[status] || "bg-slate-100 text-slate-800 border-slate-200"
    );
  };

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
                {readOnly ? "Leave Request Details" : "New Leave Request"}
              </h2>
              <p className="text-blue-100 text-sm">
                {readOnly
                  ? "View your submitted request"
                  : "Submit your leave application"}
              </p>
            </div>
          </div>
          {readOnly && leaveRequestViewMode?.status && (
            <span
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border capitalize",
                getStatusBadge(leaveRequestViewMode?.status)
              )}
            >
              {leaveRequestViewMode?.status}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type Selection */}
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
              value={parseInt(leaveType)}
              onValueChange={(val) => {
                setLeaveType(val);
                calculateLeave(val);
              }}
              disabled={readOnly}
            >
              <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaves?.map((type) => (
                  <SelectItem
                    key={type?.id}
                    value={type?.id}
                    className="py-2.5"
                  >
                    {type?.leave_type}
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

          {/* Date Range */}
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
                      !startDate &&
                        !dates?.start_date &&
                        "text-muted-foreground"
                    )}
                    disabled={readOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {startDate || dates?.start_date ? (
                      <span className="text-slate-700">
                        {format(startDate || dates?.start_date, "PPP")}
                      </span>
                    ) : (
                      <span>Select start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate || dates?.start_date}
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
                      !endDate && !dates?.end_date && "text-muted-foreground"
                    )}
                    disabled={readOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {endDate || dates?.end_date ? (
                      <span className="text-slate-700">
                        {format(endDate || dates?.end_date, "PPP")}
                      </span>
                    ) : (
                      <span>Select end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate || dates?.end_date}
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

          {/* Leave Days Selection */}
          {dayCount > 0 && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h4 className="font-medium text-slate-700 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Select Leave Duration for Each Day</span>
                </h4>
              </div>
              <div className="divide-y divide-slate-100">
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
                          {dayjs(day.date).format("MMMM D, YYYY")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Select
                        value={day?.type?.toString()}
                        onValueChange={(val) =>
                          handleLeaveTypeChange(index, val)
                        }
                        disabled={readOnly}
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
              placeholder="Please provide details about your leave request..."
              rows={3}
              disabled={readOnly}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
            {errors.reason && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.reason}</span>
              </p>
            )}
          </div>

          {/* Emergency Contact */}
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
              placeholder="Contact person during your absence"
              disabled={readOnly}
              className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Leave Balance Info */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 p-5">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <span>Leave Summary</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Leave Type
                </p>
                <p className="font-semibold text-slate-800">
                  {leaveCalculate?.leave_type || "—"}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Available Balance
                </p>
                <p className="font-semibold text-blue-600">
                  {leaveCalculate?.leave_remaing || 0} days
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
              {!["approved"].includes(leaveRequestViewMode?.status) && (
                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Leave Count
                  </p>
                  <p className="font-semibold text-purple-600">
                    {totalLeaveCount || 0}
                  </p>
                </div>
              )}
              {!["pending", "approved"].includes(
                leaveRequestViewMode?.status
              ) && (
                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm col-span-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Remaining After Request
                  </p>
                  <p
                    className={cn(
                      "font-semibold",
                      leaveCalculate?.leave_remaing - totalLeaveCount < 0
                        ? "text-red-600"
                        : "text-green-600"
                    )}
                  >
                    {(!readOnly &&
                      leaveCalculate?.leave_remaing - totalLeaveCount) ||
                      0}{" "}
                    days
                    {leaveCalculate?.leave_remaing - totalLeaveCount < 0 && (
                      <span className="text-xs ml-2 font-normal">
                        (Insufficient balance)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 h-11 border-slate-200 hover:bg-slate-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            {!readOnly && (
              <Button
                type="submit"
                className="px-6 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                disabled={leaveCalculate?.leave_remaing - totalLeaveCount < 0}
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
