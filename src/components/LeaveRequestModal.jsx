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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { employeeLeaveApi } from "../api/employee/leaveApi";
import { useFormValidation } from "../hooks/useFormValidation";
import { formatLeaveDays } from "../utility/utility";

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
  const availableBalance =
    leaveCalculate?.cycle_leave_remaining ?? leaveCalculate?.leave_remaing ?? 0;
  const formattedAvailableBalance = formatLeaveDays(availableBalance);
  const remainingAfterRequest = availableBalance - totalLeaveCount;
  const formattedRemainingAfterRequest = formatLeaveDays(remainingAfterRequest);
  const negativeBalanceDrift =
    remainingAfterRequest < 0 ? Math.abs(remainingAfterRequest) : 0;
  const availableBalanceClass =
    availableBalance < 0 ? "text-rose-600" : "text-slate-900";
  const remainingAfterClass =
    remainingAfterRequest < 0 ? "text-rose-600" : "text-emerald-700";

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

  const calculateLeave = useCallback((leaveId = leaves?.[0]?.leave_id) => {
    const acc = leaves?.find((l) => l.leave_id == leaveId);
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
                    {readOnly ? "Leave Request Details" : "New Leave Request"}
                  </h2>
                  <p className="text-[#FFFFFF] font-montserrat font-medium">
                    {readOnly
                      ? "Review what you submitted and its current status."
                      : "Submit time away with clear dates, reasons, and coverage."}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:justify-end pb-2">
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
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-md hover:bg-slate-100 bg-[#e2e8f0] text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 scroll-slim">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,350px]">
            <div className="space-y-6">
              {/* Leave Details Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 border-b border-slate-50 pb-4">
                  <div className="h-8 w-8 border-[#047857] bg-[#e2e8f0] text-[#047857] flex items-center justify-center rounded-md">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold font-montserrat text-slate-900 text-lg capitalize tracking-tight">Leave Details</h3>
                </div>

                <div className="space-y-4">
                  {/* Leave Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">
                      Leave Type <span className="text-rose-500 font-montserrat font-medium text-sm">*</span>
                    </Label>
                    <Select
                      value={leaveType ? leaveType.toString() : ""}
                      onValueChange={(val) => {
                        setLeaveType(Number(val));
                        calculateLeave(Number(val));
                      }}
                      disabled={readOnly}
                    >
                      <SelectTrigger className="h-12 bg-white border-slate-200 font-montserrat rounded-xl focus:ring-indigo-500/20 focus:border-[#131313] transition-all font-medium">
                        <SelectValue placeholder="Choose leave type..." className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider" />
                      </SelectTrigger>
                      <SelectContent className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">
                        {leaves?.map((type) => (
                          <SelectItem
                            key={type?.id}
                            value={type?.leave_id.toString()}
                            className="py-3 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-700 font-montserrat capitalize tracking-wider">
                                {type?.leave_type}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.leave_type && (
                      <p className="text-rose-500 text-xs font-bold flex items-center gap-1.5 mt-1 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.leave_type}
                      </p>
                    )}
                  </div>

                  {/* Date Selection Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">Start Date <span className="text-rose-500 font-montserrat font-medium text-sm">*</span></Label>
                      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left text-sm font-medium text-slate-700 font-montserrat capitalize tracking-wider hover:bg-slate-50 hover:border-slate-300 transition-all",
                              !startDate && !dates?.start_date && "text-slate-400"
                            )}
                            disabled={readOnly}
                          >
                            <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-6 w-6 items-center font-montserrat justify-center rounded-md">
                              <CalendarIcon className="w-3 h-3" />
                            </span>
                            {startDate || dates?.start_date ? format(startDate || dates?.start_date, "dd MMM yyyy") : <span>Pick start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate || dates?.start_date}
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
                              !endDate && !dates?.end_date && "text-slate-400"
                            )}
                            disabled={readOnly}
                          >
                            <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-6 w-6 items-center font-montserrat justify-center rounded-md">
                              <CalendarIcon className="w-3 h-3" />
                            </span>
                            {endDate || dates?.end_date ? format(endDate || dates?.end_date, "dd MMM yyyy") : <span>Pick end date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate || dates?.end_date}
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
              </div>

              {/* Day Selection Grid */}
              {dayCount > 0 && (
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

                  <div className="divide-y divide-slate-100 max-h-64 md:max-h-80 overflow-y-auto scroll-slim">
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

                        <div className="w-full md:w-48">
                          <Select
                            value={day?.type?.toString()}
                            onValueChange={(val) => handleLeaveTypeChange(index, val)}
                            disabled={readOnly}
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
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2.5 mb-5 border-b border-slate-50 pb-4">
                  <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-8 w-8 items-center font-montserrat justify-center rounded-md">
                    <FileText className="h-4 w-4" />
                  </span>
                  <h3 className="font-semibold font-montserrat text-slate-900 text-lg capitalize tracking-tight">Justification</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">Reason for Leave <span className="text-rose-500 font-montserrat font-medium text-sm">*</span></Label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Why is this leave being requested?"
                      rows={4}
                      disabled={readOnly}
                      className="bg-white border-slate-200 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-medium fontmontserrat text-sm text-slate-700"
                    />
                    {errors.reason && (
                      <p className="text-rose-500 text-xs font-bold mt-1">{errors.reason}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] capitalize tracking-wider font-semibold font-montserrat text-slate-600 flex items-center gap-1">Emergency Contact <span className="text-slate-400 font-montserrat font-medium text-xs">(optional)</span></Label>
                    <Input
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Who can be reached while you are away?"
                      disabled={readOnly}
                      className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium fontmontserrat text-sm text-slate-700"
                    />
                  </div>
                </div>
              </div>
              </div>

            {/* Premium Summary Sidebar */}
            <div className="space-y-6">
              {leaveCalculate ? (
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
                      <h3 className="font-semibold font-montserrat text-[#FFFFFF] capitalize tracking-tight text-md">Leave Summary</h3>
                    </div>

                    <div className="space-y-4 relative">
                      <div className="space-y-1">
                        <p className="text-indigo-100 text-[10px] capitalize font-semibold font-montserrat tracking-widest">Leave Type</p>
                        <p className="font-black text-lg font-montserrat truncate">{leaveCalculate?.leave_type || "-"}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <div className="space-y-1">
                          <p className="text-indigo-100 text-[10px] capitalize font-semibold font-montserrat tracking-widest">Selected Days</p>
                          <p className="font-bold text-xl font-montserrat">{totalLeaveCount || 0} <span className="text-xs font-medium font-montserrat">Days</span></p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-indigo-100 text-[10px] capitalize font-montserrat font-semibold tracking-widest">Total Days</p>
                          <p className="font-bold text-lg font-montserrat">{dayCount || 0}</p>
                        </div>
                      </div>

                      {startDate && endDate && (
                        <div className="mt-2 p-3 bg-white/10 rounded-xl border border-white/10 text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-white/20 transition-colors">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {format(startDate, "dd MMM")} {" - "} {format(endDate, "dd MMM yyyy")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Policy Snapshot Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-50">
                      <span className="border-[#047857] bg-[#e2e8f0] text-[#047857] flex h-8 w-8 items-center justify-center rounded-md">
                        <CalendarDays className="h-4 w-4" />
                      </span>
                      <h3 className="font-semibold text-slate-900 text-sm capitalize font-montserrat tracking-tight">Leave Balance</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between group">
                        <span className="text-xs font-semibold font-montserrat text-slate-400 capitalize tracking-wider group-hover:text-slate-600 transition-colors">Cycle Available Balance</span>
                        <span className={`font-black text-slate-900 text-md ${availableBalanceClass}`}>{formattedAvailableBalance}</span>
                      </div>
                      <div className="flex items-center justify-between group">
                        <span className="text-xs font-semibold font-montserrat text-slate-400 capitalize tracking-wider group-hover:text-slate-600 transition-colors">Working Days Selected</span>
                        <span className="font-black text-slate-900 text-md">{dayCount || 0}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between group">
                        <span className="text-xs font-semibold font-montserrat text-emerald-600 capitalize tracking-wider">Remaining After Request</span>
                        <span className={`font-black text-md group-hover:scale-110 transition-transform ${remainingAfterClass}`}>
                          {formattedRemainingAfterRequest}
                        </span>
                      </div>
                      {remainingAfterRequest < 0 && (
                        <div className="rounded-xl border border-dashed border-rose-200 bg-rose-50/60 px-3 py-2.5 text-xs text-rose-600 font-semibold flex items-center gap-2">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Drops {formatLeaveDays(negativeBalanceDrift)} below zero
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                  <div className="h-10 w-10 border-[#047857] bg-[#e2e8f0] text-[#047857] flex items-center mx-auto justify-center rounded-md">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 capitalize font-montserrat tracking-widest">Select leave type to see summary</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Modern Action Footer */}
      <div className="flex-shrink-0 px-4 md:px-8 py-4 md:py-6 bg-white border-t border-slate-200">
        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-4 w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300 w-full sm:w-auto"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          {!readOnly && (
            <Button
              type="submit"
              onClick={handleSubmit}
              className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-Montserrat w-full sm:w-auto"
            >
              <CheckCircle2 className="h-5 w-5" />
              Submit Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
