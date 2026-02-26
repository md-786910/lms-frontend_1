import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  ArrowLeft,
  Loader2,
  Search,
  User,
  MapPin,
  FileText,
  Heart,
  IndianRupee,
  Calendar,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoDataFound from "../../common/NoDataFound";
import { employeeAPI } from "../../api/employeeApi";
import { leaveApi as leaveHistoryApi } from "../../api/leave/leave";
import { leaveApi as employeeLeaveApi } from "../../api/employeeLeave/employeeLeave";
import { formatLeaveDays } from "../../utility/utility";
import { useToast } from "@/hooks/use-toast";

// Sub-forms from Edit Employee
import BasicInfoForm from "../../components/EditEmplyee/Basicinfo";
import AddressForm from "../../components/EditEmplyee/AddressInfo";
import DocumentsForm from "../../components/EditEmplyee/DocumentsInfo";
import PersonalInfoForm from "../../components/EditEmplyee/PersonalInfo";
import SalaryForm from "../../components/EditEmplyee/SalaryInfo";
import LeaveInfoForm from "../../components/EditEmplyee/LeaveInfoForm";

// Utilities
import { getTabPayload, validateTabForm } from "../../utility/employeeUpdate";
import { formatPersonalInfo } from "../../utility/destructure/personalInfo";
import { formatBasicInfo } from "../../utility/destructure/basicInfo";
import { formatAddressInfo } from "../../utility/destructure/addressInfo";
import { formatSalaryInfo } from "../../utility/destructure/formatSalaryInfo";
import { buildDocumentUploadPayload } from "../../utility/document";
import { mapLeaveFormToDeltaPayload } from "../../utility/leaveMapper";
import { generalAPI } from "../../api/generalApi";
import axiosInstance from "../../api/axiosInstance";

const statusStyles = {
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  rejected: "bg-rose-50 text-rose-700 border border-rose-100",
  other: "bg-slate-50 text-slate-700 border border-slate-100",
};

const parseLeaveDays = (leave) => {
  if (!leave?.leave_on) return [];
  try {
    return JSON.parse(leave.leave_on);
  } catch (error) {
    console.warn("Failed to parse leave_on payload", error);
    return [];
  }
};

const getInitials = (employee) => {
  if (!employee) return "EE";
  const firstInitial = employee.first_name?.[0] ?? "";
  const lastInitial = employee.last_name?.[0] ?? "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase().trim();
  return initials || "EE";
};

const EmployeeHistory = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("basic");
  const [employee, setEmployee] = useState(null);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Tab-specific data
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [hit, setHit] = useState(Math.random());
  
  // Form states
  const [basicInfo, setBasicInfo] = useState({});
  const [addressInfo, setAddressInfo] = useState({});
  const [documents, setDocuments] = useState([]);
  const [newDocs, setNewDocs] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({});
  const [salaryInfo, setSalaryInfo] = useState({});
  const [leaveInfo, setLeaveInfo] = useState([]);

  // Refs for validation
  const basicInfoRef = useRef();
  const addressInfoRef = useRef();
  const documentsRef = useRef();
  const personalRef = useRef();
  const salaryRef = useRef();
  const leaveRef = useRef();

  // Filters for Leave History
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  useEffect(() => {
    if (!employeeId) {
      setError("Employee ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [employeeResp, leaveResp] = await Promise.all([
          employeeAPI.getById(employeeId),
          leaveHistoryApi.getLeaveRequest("", { employee_id: employeeId }),
        ]);
        setEmployee(employeeResp?.data ?? null);
        setLeaveRecords(leaveResp?.data?.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [employeeId]);

  useEffect(() => {
    const fetchTabData = async () => {
      if (!employeeId) return;
      try {
        if (activeTab === "basic") {
          const [basicRes, deptData, desigData] = await Promise.all([
            employeeAPI.getBasicInfo(employeeId),
            generalAPI.getDepartments(),
            generalAPI.getDesignations(),
          ]);
          setBasicInfo(formatBasicInfo(basicRes.data));
          setDepartments(deptData.data || []);
          setDesignations(desigData.data || []);
        } else if (activeTab === "address") {
          const res = await employeeAPI.getAddressInfo(employeeId);
          setAddressInfo(formatAddressInfo(res.data));
        } else if (activeTab === "documents") {
          const res = await employeeAPI.getDocumentsInfo(employeeId);
          setDocuments(res.data);
          const resp1 = await axiosInstance.get(`/setting/document-category`);
          if (resp1.status === 200) {
            setDocumentType(Array.isArray(resp1.data?.data) ? resp1.data.data : []);
          }
        } else if (activeTab === "personal") {
          const res = await employeeAPI.getPersonalInfo(employeeId);
          setPersonalInfo(formatPersonalInfo(res.data));
        } else if (activeTab === "salary") {
          const res = await employeeAPI.getSalaryInfo(employeeId);
          setSalaryInfo(formatSalaryInfo(res.data));
        } else if (activeTab === "leave_balance") {
          const res = await employeeLeaveApi.getAllLeave(employeeId);
          setLeaveInfo(res.data);
        }
      } catch (error) {
        console.error(`Error loading ${activeTab} data:`, error);
      }
    };

    fetchTabData();
  }, [activeTab, employeeId, hit]);

  const handleSave = async () => {
    setSaveLoading(true);
    const isValid = await validateTabForm(activeTab === "leave_balance" ? "leave" : activeTab, {
      basicInfoRef,
      addressInfoRef,
      documentsRef,
      personalRef,
      salaryRef,
      leaveRef,
    });

    if (!isValid && !["documents", "leave_balance"].includes(activeTab)) {
      setSaveLoading(false);
      toast({
        title: "Please fill all required fields.",
        variant: "destructive",
        duration: 800,
      });
      return;
    }

    const payload = getTabPayload({
      activeTab: activeTab === "leave_balance" ? "leave" : activeTab,
      employeeId,
      basicInfo,
      addressInfo,
      documents,
      personalInfo,
      salaryInfo,
    });

    try {
      switch (activeTab) {
        case "basic":
          await employeeAPI.updateBasicInfo(employeeId, payload);
          break;
        case "address":
          await employeeAPI.updateAddressInfo(employeeId, payload);
          break;
        case "documents":
          if (newDocs?.length === 0) {
            toast({
              title: "Please add document",
              variant: "destructive",
              duration: 800,
            });
            setSaveLoading(false);
            return;
          }
          const documentPayload = await buildDocumentUploadPayload(newDocs);
          await employeeAPI.updateDocumentsInfo(employeeId, documentPayload);
          setNewDocs([]);
          break;
        case "personal":
          await employeeAPI.updatePersonalInfo(employeeId, payload);
          break;
        case "salary":
          await employeeAPI.updateSalaryInfo(employeeId, payload);
          break;
        case "leave_balance":
          const leavePayload = mapLeaveFormToDeltaPayload(leaveInfo);
          await employeeLeaveApi.updateLeave(employeeId, leavePayload);
          break;
        default:
          break;
      }
      toast({
        title: "Update Successful",
        description: `${activeTab.replace("_", " ")} information has been updated.`,
      });
      setHit(Math.random());
    } catch (error) {
      toast({
        title: "Error updating employee",
        description: error?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Leave History logic
  const leaveTypeOptions = useMemo(() => {
    const types = new Set();
    leaveRecords.forEach((leave) => {
      const typeLabel = leave?.leave_type?.leave_type;
      if (typeLabel) types.add(typeLabel);
    });
    return Array.from(types);
  }, [leaveRecords]);

  const leaveSummary = useMemo(() => {
    const aggregated = (employee?.employee_leaves ?? []).reduce(
      (acc, leave) => {
        acc.total += Number(leave?.leave_count) || 0;
        acc.used += Number(leave?.leave_used) || 0;
        acc.remaining += Number(leave?.leave_remaing) || 0;
        return acc;
      },
      { total: 0, used: 0, remaining: 0 }
    );
    return aggregated;
  }, [employee]);

  const monthOptions = useMemo(() => {
    const dateCandidates = leaveRecords.flatMap((leave) => [
      leave?.start_date,
      leave?.end_date,
      leave?.createdAt,
    ]);
    const validDates = dateCandidates.map((d) => dayjs(d)).filter((d) => d.isValid());
    if (!validDates.length) return [dayjs().format("YYYY-MM")];
    const minMonth = dayjs(Math.min(...validDates.map((d) => d.startOf("month").valueOf())));
    const maxMonth = dayjs(Math.max(...validDates.map((d) => d.startOf("month").valueOf())));
    const rangeMonths = [];
    let cursor = maxMonth.startOf("month");
    const end = minMonth.startOf("month");
    while (cursor.isAfter(end) || cursor.isSame(end)) {
      rangeMonths.push(cursor.format("YYYY-MM"));
      cursor = cursor.subtract(1, "month");
    }
    return rangeMonths;
  }, [leaveRecords]);

  const filteredLeaves = useMemo(() => {
    let results = leaveRecords;
    if (statusFilter !== "all") {
      results = results.filter((leave) => (leave?.status ?? "").toLowerCase() === statusFilter.toLowerCase());
    }
    if (leaveTypeFilter !== "all") {
      results = results.filter((leave) => (leave?.leave_type?.leave_type ?? "").toLowerCase() === leaveTypeFilter.toLowerCase());
    }
    if (monthFilter !== "all") {
      results = results.filter((leave) => {
        return [leave?.start_date, leave?.end_date, leave?.createdAt].some(
          (d) => d && dayjs(d).isValid() && dayjs(d).format("YYYY-MM") === monthFilter
        );
      });
    }
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      results = results.filter((leave) => {
        return (
          leave.leave_type?.leave_type?.toLowerCase().includes(s) ||
          leave.reason?.toLowerCase().includes(s)
        );
      });
    }
    return results.sort((a, b) => new Date(b.start_date || b.createdAt) - new Date(a.start_date || a.createdAt));
  }, [leaveRecords, statusFilter, leaveTypeFilter, monthFilter, searchTerm]);

  const historySummary = useMemo(() => {
    const counts = { approved: 0, pending: 0, rejected: 0 };
    let totalDays = 0;
    leaveRecords.forEach((leave) => {
      const status = (leave?.status || "").toLowerCase();
      if (counts.hasOwnProperty(status)) counts[status]++;
      totalDays += Number(leave?.total_days || 0);
    });
    return { counts, totalDays };
  }, [leaveRecords]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const employeeName = employee ? `${employee.first_name || ""} ${employee.last_name || ""}`.trim() : "Employee";

  return (
    <div className="space-y-6 pb-10">
      {/* Header Card */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-800" />
        <CardContent className="relative -mt-12 p-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-end gap-6">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white border-4 border-white shadow-xl text-slate-900 font-bold text-4xl overflow-hidden">
                {employee?.profile ? (
                  <img src={employee.profile} className="h-full w-full object-cover" />
                ) : getInitials(employee)}
              </div>
              <div className="pb-2 space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900">{employeeName}</h1>
                  <Badge className={employee?.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}>
                    {employee?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-slate-500 font-medium">
                  {employee?.designation?.title || "No Designation"} • {employee?.department?.name || "No Department"}
                </p>
                <p className="text-xs text-slate-400 font-mono tracking-wider">{employee?.employee_no}</p>
              </div>
            </div>
            <div className="pb-2">
              <Button variant="outline" onClick={() => navigate("/admin/employees")} className="rounded-xl shadow-sm border-slate-200">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employees
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white min-h-[600px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <TabsList className="flex flex-wrap gap-3 bg-transparent p-0">
              {[
                { id: "basic", label: "Basic Info", icon: User },
                { id: "address", label: "Address", icon: MapPin },
                { id: "documents", label: "Documents", icon: FileText },
                { id: "personal", label: "Personal", icon: Heart },
                { id: "salary", label: "Salary", icon: IndianRupee },
                { id: "leave_balance", label: "Leave Balance", icon: Calendar },
                { id: "history", label: "Leave History", icon: History },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 group-data-[state=active]:border-transparent group-data-[state=active]:bg-white group-data-[state=active]:text-slate-900">
                    <tab.icon className="h-4 w-4" />
                  </span>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="basic" className="mt-0">
              <BasicInfoForm ref={basicInfoRef} initialValues={basicInfo} onChange={setBasicInfo} departments={departments} designations={designations} />
            </TabsContent>

            <TabsContent value="address" className="mt-0">
              <AddressForm ref={addressInfoRef} addressInfo={addressInfo} setAddressInfo={setAddressInfo} />
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <DocumentsForm ref={documentsRef} documents={documents} employeeId={employeeId} setDocuments={setDocuments} documentType={documentType} setNewDocs={setNewDocs} />
            </TabsContent>

            <TabsContent value="personal" className="mt-0">
              <PersonalInfoForm ref={personalRef} personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />
            </TabsContent>

            <TabsContent value="salary" className="mt-0">
              <SalaryForm ref={salaryRef} salaryInfo={salaryInfo} setSalaryInfo={setSalaryInfo} />
            </TabsContent>

            <TabsContent value="leave_balance" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Annual Leave Balances</h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Remaining: {formatLeaveDays(leaveSummary.remaining)}</Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">Used: {leaveSummary.used}</Badge>
                </div>
              </div>
              <LeaveInfoForm ref={leaveRef} leaveInfo={leaveInfo} setLeaveInfo={setLeaveInfo} />
            </TabsContent>

            <TabsContent value="history" className="mt-0 space-y-6">
              {/* Leave History Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Requests", value: leaveRecords.length, color: "bg-slate-50" },
                  { label: "Approved", value: historySummary.counts.approved, color: "bg-emerald-50 text-emerald-700" },
                  { label: "Pending", value: historySummary.counts.pending, color: "bg-amber-50 text-amber-700" },
                  { label: "Rejected", value: historySummary.counts.rejected, color: "bg-rose-50 text-rose-700" },
                ].map((stat) => (
                  <div key={stat.label} className={`p-4 rounded-2xl border border-slate-100 ${stat.color}`}>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 border-none outline-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search leaves..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11" />
                </div>
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-40 h-11"><SelectValue placeholder="Month" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {monthOptions.map(m => <SelectItem key={m} value={m}>{dayjs(m).format("MMM YYYY")}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 h-11"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredLeaves.length === 0 ? (
                <NoDataFound title="No leave records found" />
              ) : (
                <div className="space-y-4">
                  {filteredLeaves.map((leave) => (
                    <div key={leave.id} className="p-5 rounded-2xl border border-emerald-50 bg-white shadow-sm transition-shadow">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-lg ${statusStyles[leave.status?.toLowerCase()] || statusStyles.other}`}>
                            {leave.leave_type?.leave_type?.[0] || "L"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{leave.leave_type?.leave_type}</span>
                              <Badge className={statusStyles[leave.status?.toLowerCase()] || statusStyles.other}>
                                {leave.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500">{dayjs(leave.start_date).format("D MMM YYYY")} - {dayjs(leave.end_date).format("D MMM YYYY")} ({leave.total_days} days)</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center text-right">
                          <p className="text-xs text-slate-400 font-medium">Applied on {dayjs(leave.createdAt).format("D MMM YYYY")}</p>
                          {leave.reason && <p className="text-sm text-slate-600 mt-1 max-w-md truncate italic">"{leave.reason}"</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>

          {/* Action Bar (Sticky at bottom if needed, but here simple) */}
          {activeTab !== "history" && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setHit(Math.random())} disabled={saveLoading}>Reset Changes</Button>
              <Button onClick={handleSave} disabled={saveLoading} className="min-w-[120px]">
                {saveLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          )}
        </Tabs>
      </Card>
    </div>
  );
};

export default EmployeeHistory;
