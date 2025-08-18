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
  DollarSign,
  User,
  UserRoundX,
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

      const uploaded = await employeeAPI.uploadFile(formData);
      if (uploaded?.fileIds[0]?.file_path) {
        const updatePayload = {
          profile: uploaded?.fileIds[0]?.file_path,
        };
        await employeeAPI.profilePic(employeeId, updatePayload);
      }
      toast({
        title: "Avatar Updated",
        description: "Employee profile picture has been updated successfully.",
      });

      fetchEmployees();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: "There was an issue uploading the avatar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{customTitle}</h1>
          <p className="text-slate-600">{customSubtitle}</p>
        </div>
        {showAddButton && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
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
            <div className="relative top-1">
              <Label>
                {!employeeActiveStatus
                  ? "Active Employees"
                  : "Suspended Employees"}
              </Label>
              <Switch
                className="relative top-1 mx-2"
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
              className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/*  Header Box */}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <CardTitle className="text-lg text-slate-800">
                        {employee.first_name} {employee.last_name}
                      </CardTitle>
                      <p className="text-slate-600">
                        {employee.designation?.title}
                      </p>
                      <Badge
                        className={
                          employee.is_active === true
                            ? "mt-2 bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }
                      >
                        {employee.is_active === true ? "Active" : "Not Active"}
                      </Badge>
                    </div>
                  </div>

                  {/* Action buttons  */}
                  {!readOnly && (
                    <div className="flex space-x-2">
                      <Button
                        title="Edit"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEmployee(employee.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {!employeeActiveStatus ? (
                        <Button
                          title="Suspend"
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
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
                          variant="danger"
                          size="sm"
                          className="text-red-600"
                          // onClick={() => {
                          //   setEmployeeToDelete(employee);
                          //   setShowConfirmDelete(true);
                          // }}
                        >
                          suspend
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/*Employee Details  */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">ID: {employee.id}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {employee.phone_number}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {employee.department?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{employee.salary}</span>
                    </div>

                    <div className="w-[34vw] flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">
                          Joined:{" "}
                          {new Date(
                            employee.date_of_joining
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {readOnly && (
                        <span className="text-slate-600">
                          Suspended:{" "}
                          {new Date(
                            employee.date_of_joining
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Avatar Box */}
                  <div
                    className="relative group"
                    style={{ width: "8rem", height: "8rem" }}
                  >
                    {employee.profile ? (
                      <img
                        src={employee.profile}
                        alt={`${employee.first_name} ${employee.last_name}`}
                        className="w-full h-full object-cover rounded-md border border-slate-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl rounded-md">
                        {employee.avatar}
                      </div>
                    )}
                    {!readOnly && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black bg-opacity-50 rounded-b-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAvatarChange(e, employee.id)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Edit3 className="text-white w-4 h-4 z-10" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Leave Balance */}
                {!readOnly && (
                  <div className="flex items-center justify-between text-sm mt-4 p-2 bg-slate-50 rounded-md">
                    <span className="text-slate-600 font-medium">
                      Leave Balance:
                    </span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-green-600">
                        Remaining: {leaveSummary.remaining}
                      </span>
                      <span className="text-orange-600">
                        Used: {leaveSummary.used}
                      </span>
                      <span className="text-slate-500">
                        Total: {leaveSummary.total}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filteredEmployees.length === 0 && <NoDataFound />}

      {/* Add Employee Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
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
        <DialogContent className="max-w-5xl max-h-[100vh]">
          <DialogHeader>
            <DialogTitle>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                {/* keep first letter caps */}
                <span>
                  Edit Employee :{" "}
                  <span className="text-blue-600">
                    {capitalizeFirstLetter(activeTabEdit)}
                  </span>
                </span>
              </CardTitle>
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EditEmployeeForm
              employeeId={selectedEmployee}
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
