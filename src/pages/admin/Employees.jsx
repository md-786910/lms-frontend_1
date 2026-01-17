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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
  MoreVertical,
  Briefcase,
  Users,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditForm(true);
  };

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
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{customTitle}</h1>
              <p className="text-blue-100 text-sm">{customSubtitle}</p>
            </div>
          </div>
          {showAddButton && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <Switch
              id="suspended-mode"
              checked={employeeActiveStatus}
              onCheckedChange={setEmployeActiveStatus}
              className="data-[state=checked]:bg-red-500"
            />
            <Label htmlFor="suspended-mode" className="text-sm text-slate-600 cursor-pointer select-none">
              {employeeActiveStatus ? "Suspended" : "Active"}
            </Label>
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
              className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              <CardHeader className="p-0">
                <div className="h-20 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100 relative">
                  {!readOnly && (
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/50">
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                            <Edit3 className="h-4 w-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          
                          {!employeeActiveStatus ? (
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setEmployeeToDelete(employee);
                                setShowConfirmDelete(true);
                              }}
                            >
                              <UserRoundX className="h-4 w-4 mr-2" /> Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-green-600 focus:text-green-600"
                              onClick={async () => {
                                const resp = await employeeAPI.activateSuspendedEmployee(employee.id);
                                if (resp?.status) fetchEmployees();
                              }}
                            >
                              <User className="h-4 w-4 mr-2" /> Reactivate User
                            </DropdownMenuItem>
                          )}

                          {!employee?.is_password_created && !employeeActiveStatus && (
                            <DropdownMenuItem 
                              onClick={async () => {
                                try {
                                  const resp = await employeeAPI.resendInvite(employee.id);
                                  if (resp?.status) {
                                    toast({ title: "Success", description: resp?.data?.message, variant: "success" });
                                  }
                                } catch (error) {
                                  toast({ title: "Error", description: error?.response?.data?.message || "Error", variant: "destructive" });
                                }
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" /> Resend Invite
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
                
                <div className="px-6 -mt-10 flex justify-between items-end">
                  <div className="relative group/avatar">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-sm cursor-pointer">
                      <AvatarImage src={employee.profile} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                         {avatarLoadingId === employee.id ? (
                          <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                          `${employee.first_name?.charAt(0)}${employee.last_name?.charAt(0)}`
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    {!readOnly && (
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center gap-1">
                         <label className="cursor-pointer p-1 hover:bg-white/20 rounded-full transition-colors">
                           <Edit3 className="h-4 w-4 text-white" />
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarChange(e, employee.id)} />
                         </label>
                         {employee.profile && (
                           <button 
                             onClick={() => handleDeleteAvatar(employee.id)}
                             className="p-1 hover:bg-red-500/80 rounded-full transition-colors"
                           >
                             <Trash2 className="h-4 w-4 text-white" />
                           </button>
                         )}
                      </div>
                    )}
                  </div>
                  
                  <Badge variant={employee.is_active ? "success" : "secondary"} className={`mb-4 ${employee.is_active ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-600"}`}>
                    {employee.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="px-6 py-4 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <div className="flex items-center text-slate-500 text-sm mt-1">
                    <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                    {employee.designation?.title || "No Designation"}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 text-sm">
                   <div className="flex items-center text-slate-600">
                     <Mail className="h-4 w-4 mr-3 text-slate-400" />
                     <span className="truncate">{employee.email}</span>
                   </div>
                   <div className="flex items-center text-slate-600">
                     <Phone className="h-4 w-4 mr-3 text-slate-400" />
                     <span>{employee.phone_number || "N/A"}</span>
                   </div>
                   <div className="flex items-center text-slate-600">
                     <User className="h-4 w-4 mr-3 text-slate-400" />
                     <span>ID: {employee.employee_no || employee.id}</span>
                   </div>
                </div>
              </CardContent>

              {!readOnly && (
                <CardFooter className="bg-slate-50/50 px-6 py-3 border-t border-slate-100">
                   <div className="w-full flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Leave Balance</span>
                      <div className="flex gap-3">
                         <span className="text-green-600 font-semibold" title="Remaining">{leaveSummary.remaining} rem</span>
                         <span className="text-slate-400">|</span>
                         <span className="text-slate-600" title="Total">{leaveSummary.total} total</span>
                      </div>
                   </div>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
      
      {filteredEmployees.length === 0 && <NoDataFound />}

      {/* Add Employee Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="p-6 bg-white border-b border-slate-100">
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                 <User className="h-5 w-5 text-blue-600" />
              </div>
              <span>Add New Employee</span>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-85px)]">
             <AddEmployeeForm
               onClose={() => setShowAddForm(false)}
               onSuccess={() => handleAddSuccess()}
             />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-white border-b border-slate-100">
            <DialogTitle className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5 text-blue-600" />
              <div className="flex flex-col">
                <span>Edit Employee Profile</span>
                <span className="text-sm font-normal text-slate-500">
                  {selectedEmployee?.first_name} {selectedEmployee?.last_name} • {capitalizeFirstLetter(activeTabEdit)}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-85px)] p-6 bg-slate-50/50">
            {selectedEmployee && (
              <EditEmployeeForm
                employeeId={selectedEmployee?.id}
                onClose={handleEditClose}
                onSuccess={handleEditSuccess}
                handleTabActive={(props) => setActiveTabEdit(props)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => handleDeleteEmployee()}
        title="Suspend Employee"
        message={`Are you sure you want to suspend ${employeeToDelete?.first_name} ${employeeToDelete?.last_name}? They will lose access to the system.`}
        confirmText="Suspend"
      />
    </div>
  );
};

export default Employees;
