import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { employeeAPI } from "../api/employeeApi";
import { generalAPI } from "../api/generalApi";
import { User, Mail } from "lucide-react";
import { employeePayload } from "../utility/employeePayload";
const validationSchema = {
  firstName: [{ type: "required", message: "First name is required" }],
  lastName: [{ type: "required", message: "Last name is required" }],
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

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation(initialValues, validationSchema);

  const onSubmit = async (formData) => {
    const empId =
      formData.employeeId || `EMP${Date.now().toString().slice(-3)}`;
    try {
      const payload = employeePayload(formData);
      const result = await employeeAPI.create(payload);
      if (result.status == 201) {
        toast({
          title: "Employee Added Successfully!",
          description: `Invitation email sent to ${
            result.email || formData.email
          }. Employee ID: ${result.employeeId || empId}`,
        });

        onSuccess?.();
        onClose?.();
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
      <p className="text-red-500 text-sm">{errors[field]}</p>
    ) : null;
  return (
    <Card className="w-full max-w-4xl mx-auto min-h-[70vh] max-h-[70vh] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto px-6 mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {renderError("firstName")}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {renderError("lastName")}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {renderError("email")}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {renderError("phone")}
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={values.gender}
                onValueChange={(val) =>
                  handleChange({ target: { name: "gender", value: val } })
                }
                onBlur={() => handleBlur({ target: { name: "gender" } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
              {renderError("gender")}
            </div>
            <div>
              <Label htmlFor="maritalStatus">Marital Status *</Label>
              <Select
                value={values.maritalStatus}
                onValueChange={(val) =>
                  handleChange({
                    target: { name: "maritalStatus", value: val },
                  })
                }
                onBlur={() => handleBlur({ target: { name: "maritalStatus" } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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

          {/* Work Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select
                value={values.department}
                onValueChange={(val) =>
                  handleChange({ target: { name: "department", value: val } })
                }
                onBlur={() => handleBlur({ target: { name: "department" } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
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
            <div>
              <Label htmlFor="designation">Designation *</Label>
              <Select
                value={values.designation}
                onValueChange={(val) =>
                  handleChange({ target: { name: "designation", value: val } })
                }
                onBlur={() => handleBlur({ target: { name: "designation" } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((designation, index) => (
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

          {/* Dates + Optional ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {renderError("dateOfBirth")}
            </div>
            <div>
              <Label htmlFor="dateOfJoining">Date of Joining *</Label>
              <Input
                id="dateOfJoining"
                name="dateOfJoining"
                type="date"
                value={values.dateOfJoining}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {renderError("dateOfJoining")}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Create & Send Invitation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEmployeeForm;
