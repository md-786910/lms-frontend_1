import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CalendarIcon, CalendarPlus } from "lucide-react";
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
      total_days: dayCount,
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
    updated[index].type = parseInt(selectedId); // update selected type
    setLeaveDays(updated);
    const total = updated.reduce((sum, day) => {
      const typeObj = LEAVE.find((t) => t.id === day.type);
      return sum + (typeObj?.count || 0);
    }, 0);
    setTotalLeaveCount(total);
  };
  useEffect(() => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const diffInDays = end.diff(start, "day");
      setDayCount(diffInDays + 1);

      if (diffInDays >= 0) {
        setDayCount(diffInDays + 1);
        const tempLeaveDays = [];
        for (let i = 0; i <= diffInDays; i++) {
          const date = start.add(i, "day").format("YYYY-MM-DD");
          tempLeaveDays.push({
            date,
            type: 0,
            id: "full_day",
            count: 1,
          });
        }
        setLeaveDays(tempLeaveDays);
      } else {
        setDayCount(0);
        setLeaveDays([]);
      }
    }
  }, [startDate, endDate]);

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
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarPlus className="h-5 w-5 text-blue-600" />
          <span>
            {readOnly ? "View Leave Request" : "Request Leave"} :{" "}
            <span className="text-blue-600">
              {readOnly && leaveRequestViewMode?.status}
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type */}
          <div>
            <Label htmlFor="leaveType">Leave Type *</Label>
            <Select
              value={parseInt(leaveType)}
              onValueChange={(val) => {
                setLeaveType(val);
                calculateLeave(val);
              }}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaves?.map((type) => (
                  <SelectItem key={type?.id} value={type?.id}>
                    {type?.leave_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leave_type && (
              <p className="text-red-500 text-sm">{errors.leave_type}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate ||
                        (!dates?.start_date && "text-muted-foreground")
                    )}
                    disabled={readOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate || dates?.start_date ? (
                      format(startDate || dates?.start_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate || dates?.start_date}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.start_date && (
                <p className="text-red-500 text-sm">{errors.start_date}</p>
              )}
            </div>

            <div>
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate || (!dates?.end_date && "text-muted-foreground")
                    )}
                    disabled={readOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate || dates?.end_date ? (
                      format(endDate || dates?.end_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate || dates?.end_date}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.end_date && (
                <p className="text-red-500 text-sm">{errors.end_date}</p>
              )}
            </div>
          </div>

          {dayCount > 0 && (
            <div className="shadow p-1">
              {leaveDays.map((day, index) => (
                <div
                  key={day.date}
                  className="grid grid-cols-2 md:grid-cols-2 gap-4 items-center mt-2"
                >
                  <div>
                    <Label htmlFor="emergencyContact">
                      {dayjs(day.date).format("dddd, MMMM D, YYYY")}
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="leaveType">Leave</Label>
                    <Select
                      value={day?.type?.toString()}
                      onValueChange={(val) => handleLeaveTypeChange(index, val)}
                      disabled={readOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem key={"0"} value={"0"}>
                          Select Leave
                        </SelectItem>
                        {LEAVE?.map((type) => (
                          <SelectItem
                            key={type?.id}
                            value={type?.id.toString()}
                          >
                            {type?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {dayErrors[index] && (
                      <p className="text-red-500 text-sm mt-1">
                        {dayErrors[index]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Reason for Leave *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide details about your leave request..."
              rows={4}
              disabled={readOnly}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm">{errors.reason}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div>
            <Label htmlFor="emergencyContact">
              Emergency Contact (Optional)
            </Label>
            <Input
              id="emergencyContact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Contact person during your absence"
              disabled={readOnly}
            />
            {errors.emergencyContact && (
              <p className="text-red-500 text-sm">{errors.emergencyContact}</p>
            )}
          </div>

          {/* Leave Balance Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Leave Balance</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">
                  {leaveCalculate?.leave_type}:
                </span>
                <span className="font-medium text-blue-900 ml-2">
                  {leaveCalculate?.leave_remaing} days
                </span>
              </div>
              <div>
                <span className="text-blue-700">
                  You are select total days{" "}
                </span>
                <span className="font-medium text-blue-900 ml-2">
                  {dayCount} days
                </span>
                <br />
                <span className="text-blue-700">Total Leave count spent </span>
                <span className="font-medium text-blue-900 ml-2">
                  {totalLeaveCount}
                </span>
              </div>

              {leaveRequestViewMode?.status !== "pending" && (
                <div>
                  <span className="text-blue-700">Remaining :</span>
                  <span className="font-medium text-blue-900 ml-2">
                    {leaveCalculate?.leave_remaing - totalLeaveCount} &nbsp;
                    <span className="text-xs text-red-600">
                      {leaveCalculate?.leave_remaing - totalLeaveCount < 0
                        ? "(you dont have sufficient balace)"
                        : "days"}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={
                readOnly || leaveCalculate?.leave_remaing - totalLeaveCount < 0
              }
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestModal;
