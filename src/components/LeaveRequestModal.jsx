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
  const [leaveType, setLeaveType] = useState(leaves?.[0]?.leave_id);
  const [reason, setReason] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [dayCount, setDayCount] = useState(0);
  const [leaveCalculate, setLeaveCalculate] = useState(null);

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
      console.error("Please fill all required fields.");
      return;
    }

    const resp = await employeeLeaveApi.createNewLeaveRequest({
      leave_type_id: leaveCalculate?.leave_id,
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
  }, [leaveRequestViewMode?.leave_type_id, readOnly]);

  const today = new Date();
  const disablePast = {
    before: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  };
  const disableWeekends = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const disableBeforeStartDate = (date) => {
    if (!startDate) return false;
    return dayjs(date).isBefore(dayjs(startDate), "day");
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

  useEffect(() => {
    const match = leaves?.find((l) => l.leave_id == Number(leaveType));
    setLeaveCalculate(match);
  }, [leaveType, leaves]);

  const formattedStart =
    startDate || dates?.start_date
      ? format(startDate || dates?.start_date, "dd MMM, yyyy")
      : "Start date";

  const formattedEnd =
    endDate || dates?.end_date
      ? format(endDate || dates?.end_date, "dd MMM, yyyy")
      : "End date";

  const leaveTypeLabel = leaveCalculate?.leave_type || "Select leave type";

  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <div className="relative bg-gray-800 px-6 py-6 sm:px-8 sm:py-7 text-white">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <CalendarPlus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">
                  {readOnly ? "Leave Request Details" : "New Leave Request"}
                </h2>
                <p className="text-sm text-slate-200">
                  {readOnly
                    ? "Review what you submitted and its current status."
                    : "Submit time away with clear dates, reasons, and coverage."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[13px] text-slate-50/90">
                  <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {formattedStart} to {formattedEnd}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {leaveTypeLabel}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {dayCount || 0} working day{dayCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>
            {readOnly && leaveRequestViewMode?.status && (
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium capitalize shadow-sm",
                  getStatusBadge(leaveRequestViewMode?.status)
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                {leaveRequestViewMode?.status}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-100 bg-white/80 shadow-sm backdrop-blur">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-2 text-slate-800">
                      <User className="h-4 w-4 text-sky-600" />
                      <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Leave Details
                      </span>
                    </div>
                    {!readOnly && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        Complete the steps below
                      </span>
                    )}
                  </div>

                  <div className="space-y-5 px-5 py-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="leaveType"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                      >
                        <FileText className="h-4 w-4 text-sky-600" />
                        Leave Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={parseInt(leaveType)}
                        onValueChange={(val) => {
                          setLeaveType(Number(val));
                          calculateLeave(Number(val));
                        }}
                        disabled={readOnly}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/60 text-slate-800 shadow-inner focus:border-sky-500 focus:ring-sky-500">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                          {leaves?.map((type) => (
                            <SelectItem
                              key={type?.id}
                              value={type?.leave_id}
                              className="py-2.5"
                            >
                              {type?.leave_type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.leave_type && (
                        <p className="flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.leave_type}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <CalendarIcon className="h-4 w-4 text-sky-600" />
                          Start Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 w-full justify-start rounded-xl border-slate-200 bg-slate-50/60 text-left font-medium text-slate-800 hover:bg-slate-100",
                                !startDate && !dates?.start_date && "text-slate-500"
                              )}
                              disabled={readOnly}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                              {startDate || dates?.start_date ? (
                                <span>{formattedStart}</span>
                              ) : (
                                <span>Select start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto rounded-2xl border-slate-100 p-0 shadow-xl" align="start">
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
                          <p className="flex items-center gap-1 text-sm text-red-500">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {errors.start_date}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <CalendarIcon className="h-4 w-4 text-purple-600" />
                          End Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 w-full justify-start rounded-xl border-slate-200 bg-slate-50/60 text-left font-medium text-slate-800 hover:bg-slate-100",
                                !endDate && !dates?.end_date && "text-slate-500"
                              )}
                              disabled={readOnly}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                              {endDate || dates?.end_date ? (
                                <span>{formattedEnd}</span>
                              ) : (
                                <span>Select end date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto rounded-2xl border-slate-100 p-0 shadow-xl" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate || dates?.end_date}
                              onSelect={(date) => {
                                setEndDate(date);
                                setEndDateOpen(false);
                              }}
                              initialFocus
                              className="pointer-events-auto"
                              disabled={[disablePast, disableWeekends, disableBeforeStartDate]}
                              fromDate={startDate}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.end_date && (
                          <p className="flex items-center gap-1 text-sm text-red-500">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {errors.end_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {dayCount > 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-white/80 shadow-sm backdrop-blur">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Clock className="h-4 w-4 text-sky-600" />
                        <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                          Day-by-day duration
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Weekends are skipped automatically
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {leaveDays?.map((day, index) => (
                        <div
                          key={day.date}
                          className="grid grid-cols-1 items-center gap-4 p-4 transition-colors md:grid-cols-2 hover:bg-slate-50/70"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-semibold text-white shadow-inner">
                              {dayjs(day.date).format("DD")}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{dayjs(day.date).format("dddd")}</p>
                              <p className="text-sm text-slate-500">{dayjs(day.date).format("DD MMM YYYY")}</p>
                            </div>
                          </div>
                          <div>
                            <Select
                              value={day?.type?.toString()}
                              onValueChange={(val) => handleLeaveTypeChange(index, val)}
                              disabled={readOnly}
                            >
                              <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/60 text-slate-800 focus:border-sky-500 focus:ring-sky-500">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-lg">
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
                              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {dayErrors[index]}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-100 bg-white/80 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 text-slate-800">
                    <FileText className="h-4 w-4 text-sky-600" />
                    <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Context & coverage
                    </span>
                  </div>
                  <div className="space-y-5 px-5 py-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="reason"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                      >
                        <FileText className="h-4 w-4 text-sky-600" />
                        Reason for Leave <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Provide brief context for your absence, projects impacted, or coverage plan."
                        rows={4}
                        disabled={readOnly}
                        className="rounded-xl border-slate-200 bg-slate-50/60 text-slate-800 focus:border-sky-500 focus:ring-sky-500"
                      />
                      {errors.reason && (
                        <p className="flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.reason}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="emergencyContact"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                      >
                        <Phone className="h-4 w-4 text-sky-600" />
                        Emergency Contact
                        <span className="text-xs font-normal text-slate-500">(optional)</span>
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="Who can be reached while you are away"
                        disabled={readOnly}
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/60 text-slate-800 focus:border-sky-500 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:gap-5">
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-2 text-slate-800">
                      <CheckCircle2 className="h-5 w-5 text-sky-600" />
                      <div>
                        <p className="text-sm font-semibold">Leave Summary</p>
                        <p className="text-xs text-slate-500">Auto-updates as you fill the form.</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {dayCount || 0} day{dayCount === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div className="space-y-4 px-5 py-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.55)]">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Leave Type</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{leaveCalculate?.leave_type || "-"}</p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.55)]">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Available Balance</p>
                        <p className="mt-1 text-base font-semibold text-sky-700">{leaveCalculate?.leave_remaing || 0} days</p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.55)]">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Working Days Selected</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{dayCount || 0}</p>
                      </div>
                      {!["approved"].includes(leaveRequestViewMode?.status) && (
                        <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.55)]">
                          <p className="text-xs uppercase tracking-wide text-slate-500">Leave Count</p>
                          <p className="mt-1 text-base font-semibold text-indigo-700">{totalLeaveCount || 0}</p>
                        </div>
                      )}
                      {!["pending", "approved"].includes(leaveRequestViewMode?.status) && (
                        <div className="col-span-2 rounded-xl border border-slate-100 bg-white px-3 py-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.55)]">
                          <p className="text-xs uppercase tracking-wide text-slate-500">Remaining after request</p>
                          <p
                            className={cn(
                              "mt-1 text-base font-semibold",
                              leaveCalculate?.leave_remaing - totalLeaveCount < 0
                                ? "text-red-600"
                                : "text-emerald-700"
                            )}
                          >
                            {(!readOnly && leaveCalculate?.leave_remaing - totalLeaveCount) || 0} days
                            {leaveCalculate?.leave_remaing - totalLeaveCount < 0 && (
                              <span className="ml-2 text-xs font-normal text-red-600">
                                Insufficient balance
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-sky-600" />
                        <span>
                          Ensure dates exclude weekends; we pre-filter them for you. Balances update in real time.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-700">
                    <User className="h-4 w-4 text-sky-600" />
                    <div>
                      <p className="text-sm font-semibold">Need help?</p>
                      <p className="text-xs text-slate-500">Contact HR if your balance looks off or if you need an exception.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex flex-1 items-center gap-2 text-xs text-slate-500 sm:justify-start">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Real-time validation keeps your request complete before submission.</span>
              </div>
              <div className="flex items-center gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border border-slate-300 text-slate-700  hover:bg-slate-100 px-4 py-2 rounded-xl transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                {!readOnly && (
                  <Button
                    type="submit"
                    className="bg-[#273C7D] hover:bg-[#1F2F63] text-white px-4 py-2 rounded-xl transition-all duration-200 ease-in-out hover:shadow-lg  shadow-[#273C7D]/30"
                    disabled={leaveCalculate?.leave_remaing - totalLeaveCount < 0}
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Submit Request
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
