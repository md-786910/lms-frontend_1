import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  User,
  UserRoundX,
  Loader2,
} from "lucide-react";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import EditEmployeeForm from "@/components/EditEmployeeForm";
import { employeeAPI } from "../../api/employeeApi";
import { useToast } from "@/hooks/use-toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import NoDataFound from "../../common/NoDataFound";
import { Label } from "@/components/ui/label";
import { capitalizeFirstLetter } from "../../utility/utility";
import axiosInstance from "../../api/axiosInstance";
const Employees = ({
  filterByStatus = [],
  showAddButton = true,
  readOnly = false,
  customTitle = "Employee Management",
  customSubtitle = "Manage your team members and their information",
}) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employeeActiveStatus, setEmployeActiveStatus] = useState(false);
  const [activeTabEdit, setActiveTabEdit] = useState("basic");
  const [avatarLoadingId, setAvatarLoadingId] = useState(null);
  const fetchEmployees = async () => {
    try {
      const params = {
        is_suspended: employeeActiveStatus,
      };
      const response = await employeeAPI.getAll(params);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [employeeActiveStatus]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const departments = [
    "all",
    ...new Set(employees.map((emp) => emp.department?.name).filter(Boolean)),
  ];

  const filteredEmployees = employees.filter((employee) => {
    const nameMatches =
      employee.name &&
      String(employee.name).toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatches =
      employee.email &&
      String(employee.email).toLowerCase().includes(searchTerm.toLowerCase());
    const departmentMatches =
      employee.department?.name &&
      String(employee.department.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatches || emailMatches || departmentMatches;
    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department?.name === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'true':
  //       return 'bg-green-100 text-green-800';
  //     case 'On Leave':
  //       return 'bg-orange-100 text-orange-800';
  //     case 'false':
  //       return 'bg-red-100 text-red-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditForm(true);
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((emp) => emp.is_active).length;
  const suspendedEmployees = employees.filter((emp) => !emp.is_active).length;
  const uniqueDepartments = new Set(
    employees.map((emp) => emp.department?.name).filter(Boolean)
  ).size;

  const handleDeleteEmployee = async () => {
    try {
      await employeeAPI.delete(employeeToDelete.id);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== employeeToDelete.id)
      );
      setShowConfirmDelete(false);
      setEmployeeToDelete(null);
      toast({
        title: "Employee Deleted Successfully!",
        description: `The employee has been removed from the system.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Delete Employee",
        description:
          "There was an issue deleting the employee. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting employee:", error);
    }
  };
  const handleAddSuccess = () => {
    fetchEmployees();
    setShowAddForm(false);
  };

  const handleEditSuccess = () => {
    fetchEmployees();
    setShowEditForm(false);
  };

  const handleEditClose = () => {
    setShowEditForm(false);
  };

  const handleAvatarChange = async (event, employeeId) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      setAvatarLoadingId(employeeId);
      const uploaded = await employeeAPI.uploadFile(formData);
      if (uploaded?.fileIds[0]?.file_path) {
        const updatePayload = {
          profile: uploaded?.fileIds[0]?.file_path,
        };
        await employeeAPI.profilePic(employeeId, updatePayload);
      }

      fetchEmployees();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: "There was an issue uploading the avatar.",
        variant: "destructive",
      });
      setAvatarLoadingId(null);
    } finally {
      setAvatarLoadingId(null);
    }
  };

  const handleDeleteAvatar = async (employeeId) => {
    try {
      setAvatarLoadingId(employeeId);
      const updatePayload = {
        profile: null,
      };
      await employeeAPI.profilePic(employeeId, updatePayload);

      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === employeeId ? { ...emp, profile: null } : emp
        )
      );

      toast({
        title: "Avatar Removed",
        description: "Employee profile picture has been removed.",
      });
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast({
        title: "Delete Failed",
        description: "There was an issue removing the avatar.",
        variant: "destructive",
      });
    } finally {
      setAvatarLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white shadow-xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_15%_20%,rgba(94,234,212,0.18),transparent_25%),radial-gradient(circle_at_82%_0%,rgba(59,130,246,0.22),transparent_23%),radial-gradient(circle_at_58%_85%,rgba(99,102,241,0.16),transparent_22%)]" />
        <div className="relative p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-100 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                People Operations
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-white">
                  {customTitle}
                </h1>
                <p className="text-sm md:text-base text-slate-200 max-w-2xl">
                  {customSubtitle}
                </p>
              </div>
            </div>
            {showAddButton && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg border border-white/60 rounded-xl px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            )}
          </div>

          {/* Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total employees",
                value: totalEmployees,
                tone: "primary",
              },
              { label: "Active", value: activeEmployees, tone: "emerald" },
              { label: "Suspended", value: suspendedEmployees, tone: "amber" },
              { label: "Departments", value: uniqueDepartments, tone: "indigo" },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="border border-white/10 bg-white/10 text-white shadow-lg rounded-md backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <CardContent className="p-4 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold leading-tight text-white">
                    {stat.value}
                  </p>
                  <div
                    className={`mt-3 h-1.5 w-16 rounded-full ${
                      stat.tone === "primary"
                        ? "bg-primary"
                        : stat.tone === "emerald"
                        ? "bg-emerald-400"
                        : stat.tone === "amber"
                        ? "bg-amber-400"
                        : "bg-indigo-400"
                    }`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* Search and Filters */}
      <Card className="border border-slate-200 shadow-sm rounded-md">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Find and filter employees
              </p>
              <p className="text-xs text-slate-500">
                Search by name, email, department or toggle suspended staff.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employees by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-700">
                  {employeeActiveStatus ? "Suspended" : "Active"}
                </p>
                <p className="text-[11px] text-slate-500">
                  Toggle to view suspended records
                </p>
              </div>
              <Switch
                className="relative top-0.5 w-12"
                title="suspended employees"
                defaultChecked={true}
                onCheckedChange={(val) => {
                  setEmployeActiveStatus(!val);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmployees.map((employee) => {
          const leaveSummary = employee.employee_leaves?.reduce(
            (acc, leave) => {
              acc.total += leave.leave_count || 0;
              acc.used += leave.leave_used || 0;
              acc.remaining += leave.leave_remaing || 0;
              return acc;
            },
            { total: 0, used: 0, remaining: 0 }
          );
          return (
            <Card
              key={employee.id}
              className="border border-slate-200 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Avatar & quick status */}
                  <div className="flex md:flex-col items-center gap-3 md:w-32">
                    <div
                      className="relative group h-20 w-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                    >
                      {employee.profile ? (
                        <img
                          src={employee.profile}
                          alt={`${employee.first_name} ${employee.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xl uppercase">
                          {avatarLoadingId === employee.id ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <>
                              {employee?.first_name?.charAt(0)}
                              {employee?.last_name?.charAt(0)}
                            </>
                          )}
                        </div>
                      )}
                      {!readOnly && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-2">
                            <label className="cursor-pointer text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-md shadow">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleAvatarChange(e, employee.id)}
                                className="hidden"
                              />
                              Edit
                            </label>
                            {employee.profile && (
                              <button
                                className="text-white text-xs font-semibold bg-red-600/80 px-2 py-1 rounded-md shadow"
                                onClick={() => handleDeleteAvatar(employee.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge
                        className={
                          employee.is_active === true
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }
                      >
                        {employee.is_active === true ? "Active" : "Not Active"}
                      </Badge>
                      {employee.department?.name && (
                        <Badge
                          variant="outline"
                          className="border-slate-200 text-slate-700 bg-white"
                        >
                          {employee.department?.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Core details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start gap-3 justify-between">
                      <div>
                        <CardTitle className="text-lg text-slate-900">
                          {employee.first_name} {employee.last_name}
                        </CardTitle>
                        <p className="text-sm text-slate-600">
                          {employee.designation?.title || "Role not set"}
                        </p>
                      </div>
                      {!readOnly && (
                        <div className="flex gap-2">
                          <Button
                            title="Edit"
                            variant="ghost"
                            size="icon"
                            className="text-slate-600"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          {!employeeActiveStatus ? (
                            <Button
                              title="Suspend"
                              variant="ghost"
                              size="icon"
                              className="text-rose-600"
                              onClick={() => {
                                setEmployeeToDelete(employee);
                                setShowConfirmDelete(true);
                              }}
                            >
                              <UserRoundX className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              title="Suspend"
                              variant="outline"
                              size="sm"
                              className="text-rose-600 border-rose-200"
                              onClick={async () => {
                                const resp =
                                  await employeeAPI.activateSuspendedEmployee(
                                    employee.id
                                  );
                                if (resp?.status) {
                                  fetchEmployees();
                                }
                              }}
                            >
                              Revoke suspend
                            </Button>
                          )}

                          {!employee?.is_password_created &&
                            !employeeActiveStatus && (
                              <Button
                                title="Resend invite"
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const resp = await employeeAPI.resendInvite(
                                      employee.id
                                    );
                                    if (resp?.status) {
                                      toast({
                                        title: "Success",
                                        description: resp?.data?.message,
                                        variant: "success",
                                      });
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description:
                                        error?.response?.data?.message ||
                                        "Something went wrong",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                className="px-3"
                              >
                                Resend invite
                              </Button>
                            )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-700">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">ID</span>
                        <span className="text-slate-600">
                          {employee?.employee_no || employee.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">Email</span>
                        <span className="text-slate-600 truncate">
                          {employee.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">Phone</span>
                        <span className="text-slate-600">
                          {employee.phone_number}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">Location</span>
                        <span className="text-slate-600">
                          {employee.address?.city}, {employee.address?.zip_code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <IndianRupee className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">Payable</span>
                        <span className="text-slate-600">
                          {employee.employee_salary?.payable_salary ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">Joined</span>
                        <span className="text-slate-600">
                          {new Date(
                            employee.date_of_joining
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Leave Balance */}
                    {!readOnly && (
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm mt-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-700 font-semibold">
                          Leave balance
                        </span>
                        <div className="flex flex-wrap gap-3 text-xs font-semibold">
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Remaining: {leaveSummary.remaining}
                          </Badge>
                          <Badge className="bg-amber-50 text-amber-700 border border-amber-100">
                            Used: {leaveSummary.used}
                          </Badge>
                          <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                            Total: {leaveSummary.total}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filteredEmployees.length === 0 && <NoDataFound />}

      {/* Add Employee Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[100vh]">
          <DialogHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Add New Employee</span>
            </CardTitle>
          </DialogHeader>
          <AddEmployeeForm
            onClose={() => setShowAddForm(false)}
            onSuccess={() => handleAddSuccess()}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-6xl max-h-[100vh]">
          <DialogHeader>
            <DialogTitle>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                {/* keep first letter caps */}
                <span>
                  Edit Employee :{" "}
                  <span className="text-blue-600">
                    (
                    {selectedEmployee?.first_name +
                      " " +
                      selectedEmployee?.last_name}
                    ) &nbsp; - &nbsp;
                    {capitalizeFirstLetter(activeTabEdit)}
                  </span>
                </span>
              </CardTitle>
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EditEmployeeForm
              employeeId={selectedEmployee?.id}
              onClose={handleEditClose}
              onSuccess={handleEditSuccess}
              handleTabActive={(props) => setActiveTabEdit(props)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => handleDeleteEmployee()}
        employee={employeeToDelete}
      />
    </div>
  );
};

export default Employees;
