import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { employeeAPI } from "../api/employeeApi";
import { generalAPI } from "../api/generalApi";
import { 
  Mail, User, Briefcase, Phone, Calendar, Info, 
  ArrowRight, CheckCircle2, Building2, UserCircle 
} from "lucide-react";
import { employeePayload } from "../utility/employeePayload";
import { cn } from "@/lib/utils";

const validationSchema = {
  firstName: [{ type: "required", message: "First name is required" }],
  lastName: [{ type: "optional", message: "Last name is required" }],
  email: [
    { type: "required", message: "Email is required" },
    { type: "email", message: "Invalid email format" },
  ],
  phone: [{ type: "phone", message: "Invalid phone number" }],
  gender: [{ type: "required", message: "Gender is required" }],
  maritalStatus: [{ type: "required", message: "Marital status is required" }],
  department: [{ type: "required", message: "Department is required" }],
  designation: [{ type: "required", message: "Designation is required" }],
  dateOfJoining: [{ type: "required", message: "Date of joining is required" }],
  dateOfBirth: [{ type: "required", message: "Date of birth is required" }],
};

const AddEmployeeForm = ({ onClose, onSuccess }) => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [deptData, desigData] = await Promise.all([
          generalAPI.getDepartments(),
          generalAPI.getDesignations(),
        ]);

        setDepartments(deptData.data || []);
        setDesignations(desigData.data || []);
      } catch (err) {
        console.error("Dropdown data fetch failed:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    maritalStatus: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    dateOfBirth: "",
    employeeId: "",
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, formValidation } =
    useFormValidation(initialValues, validationSchema);

  const onSubmit = async (formData) => {
    const empId = formData.employeeId || `EMP${Date.now().toString().slice(-3)}`;
    try {
      const payload = employeePayload(formData);
      const result = await employeeAPI.create(payload);
      if (result.status == 201) {
        onSuccess?.();
        onClose?.();
        toast({
            title: "Success",
            description: "Employee created successfully",
            variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Add Employee",
        description:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top-1 fade-in duration-200">
        <Info className="h-3 w-3" /> {errors[field]}
      </p>
    ) : null;

  const handleNext = () => {
      // Validate first tab fields
      const isPersonalValid = formValidation(
          ["firstName", "email", "phone", "gender", "maritalStatus", "dateOfBirth"],
          values
      );
      
      if (isPersonalValid) {
          setActiveTab("employment");
      } else {
          toast({
              title: "Validation Error",
              description: "Please fill all required fields in this step correctly.",
              variant: "destructive",
          });
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/30">
        {/* Progress Steps Header */}
        <div className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between mb-8 max-w-xl mx-auto relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
                
                <div className={cn("flex flex-col items-center gap-2 bg-slate-50 px-2", activeTab === "personal" ? "text-blue-600" : "text-green-600")}>
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                        activeTab === "personal" 
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25" 
                            : "bg-green-600 border-green-600 text-white"
                    )}>
                        {activeTab === "employment" ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                    </div>
                    <span className="text-xs font-semibold">Personal</span>
                </div>

                <div className={cn("flex flex-col items-center gap-2 bg-slate-50 px-2", activeTab === "employment" ? "text-blue-600" : "text-slate-400")}>
                     <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                        activeTab === "employment" 
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25" 
                            : "bg-slate-50 border-slate-300 text-slate-400"
                    )}>
                        2
                    </div>
                    <span className="text-xs font-semibold">Employment</span>
                </div>
            </div>
        </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
           <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto pr-1">
                <TabsContent value="personal" className="mt-0 space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <UserCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. John"
                                    className="h-10 focus-visible:ring-blue-500"
                                />
                                {renderError("firstName")}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    placeholder="e.g. Doe"
                                    className="h-10 focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="john.doe@company.com"
                                        className="h-10 pl-9 focus-visible:ring-blue-500"
                                    />
                                </div>
                                {renderError("email")}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="+1 234 567 8900"
                                        className="h-10 pl-9 focus-visible:ring-blue-500"
                                    />
                                </div>
                                {renderError("phone")}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
                                <Input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={values.dateOfBirth}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="h-10 focus-visible:ring-blue-500"
                                />
                                {renderError("dateOfBirth")}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                                <Select
                                    value={values.gender}
                                    onValueChange={(val) =>
                                        handleChange({ target: { name: "gender", value: val } })
                                    }
                                >
                                    <SelectTrigger className="h-10 focus:ring-blue-500">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {renderError("gender")}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="maritalStatus">Marital Status <span className="text-red-500">*</span></Label>
                                <Select
                                    value={values.maritalStatus}
                                    onValueChange={(val) =>
                                        handleChange({ target: { name: "maritalStatus", value: val } })
                                    }
                                >
                                    <SelectTrigger className="h-10 focus:ring-blue-500">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                        <SelectItem value="widowed">Widowed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {renderError("maritalStatus")}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="employment" className="mt-0 space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Building2 className="h-5 w-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800">Employment Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                                <Select
                                    value={values.department}
                                    onValueChange={(val) =>
                                        handleChange({ target: { name: "department", value: val } })
                                    }
                                >
                                    <SelectTrigger className="h-10 focus:ring-blue-500">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept, index) => (
                                            <SelectItem
                                                key={`${dept.id}-${index}`}
                                                value={String(dept.id)}
                                            >
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {renderError("department")}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
                                <Select
                                    value={values.designation}
                                    onValueChange={(val) =>
                                        handleChange({ target: { name: "designation", value: val } })
                                    }
                                >
                                    <SelectTrigger className="h-10 focus:ring-blue-500">
                                        <SelectValue placeholder="Select Designation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {designations
                                            ?.filter((a) => a?.department_id == values?.department)
                                            ?.map((designation, index) => (
                                                <SelectItem
                                                    key={`${designation.id}-${index}`}
                                                    value={String(designation.id)}
                                                >
                                                    {designation.title}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {renderError("designation")}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="dateOfJoining">Date of Joining <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="dateOfJoining"
                                        name="dateOfJoining"
                                        type="date"
                                        value={values.dateOfJoining}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="h-10 pl-9 focus-visible:ring-blue-500"
                                    />
                                </div>
                                {renderError("dateOfJoining")}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="employeeId">Employee ID <span className="text-slate-400 font-normal">(Auto-generated)</span></Label>
                                <Input
                                    id="employeeId"
                                    value={values.employeeId || `EMP${Date.now().toString().slice(-3)}`}
                                    disabled
                                    className="h-10 bg-slate-50 text-slate-500 font-mono"
                                />
                            </div>
                        </div>
                        
                         <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-1">
                                <Info className="h-4 w-4" /> Note
                            </h4>
                            <p className="text-xs text-blue-600 leading-relaxed">
                                An email invitation will be automatically sent to <strong>{values.email || "the employee"}</strong> with login credentials and setup instructions upon successful creation.
                            </p>
                        </div>
                    </div>
                </TabsContent>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 mt-2 border-t border-slate-100 flex justify-between items-center bg-white px-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={onClose} 
                    className="text-slate-500 hover:text-slate-800"
                  >
                      Cancel
                  </Button>
                  
                  <div className="flex gap-3">
                      {activeTab === "employment" && (
                          <Button 
                             type="button" 
                             variant="outline"
                             onClick={() => setActiveTab("personal")}
                             className="border-slate-200"
                          >
                              Back
                          </Button>
                      )}
                      
                      {activeTab === "personal" ? (
                          <Button 
                             type="button"
                             onClick={handleNext}
                             className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
                          >
                              Next <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                      ) : (
                          <Button 
                             type="submit"
                             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/25 min-w-[140px]"
                          >
                              <CheckCircle2 className="h-4 w-4 mr-2" /> Create Employee
                          </Button>
                      )}
                  </div>
              </div>
           </Tabs>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
