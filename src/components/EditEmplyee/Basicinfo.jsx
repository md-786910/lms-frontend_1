import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { forwardRef, useImperativeHandle, useEffect } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";

const validationSchema = {
  first_name: [{ type: "required", message: "First name is required" }],
  last_name: [{ type: "required", message: "Last name is required" }],
  email: [
    { type: "required", message: "Email is required" },
    { type: "email", message: "Invalid email format" },
  ],
  phone_number: [
    { type: "required", message: "Phone is required" },
    { type: "phone", message: "Invalid phone number" },
  ],
  gender: [{ type: "required", message: "Gender is required" }],
  martial_status: [{ type: "required", message: "Marital status is required" }],
  date_of_joining: [
    { type: "required", message: "Date of joining is required" },
  ],
  date_of_birth: [{ type: "required", message: "Date of birth is required" }],
  department_id: [{ type: "required", message: "Department is required" }],
  designation_id: [{ type: "required", message: "Designation is required" }],
  nationality: [{ type: "required", message: "Nationality is required" }],
};

const BasicInfoForm = forwardRef(
  ({ initialValues, onChange, departments, designations }, ref) => {
    const { values, errors, touched, handleChange, handleBlur, validateForm } =
      useFormValidation(initialValues, validationSchema, {
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
      });

    const formattedDateJoining = values?.date_of_joining
      ? new Date(values.date_of_joining).toISOString().split("T")[0]
      : "";

    const formattedDateBirth = values?.date_of_birth
      ? new Date(values.date_of_birth).toISOString().split("T")[0]
      : "";

    useEffect(() => {
      onChange(values);
    }, [values, onChange]);

    useImperativeHandle(ref, () => ({
      validateForm: () => validateForm(),
    }));

    const renderError = (field) =>
      touched[field] && errors[field] ? (
        <p className="text-red-500 text-sm">{errors[field]}</p>
      ) : null;

    if (!values) {
      return "Loading...";
    }

    return (
      <>
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md shadow-sm">
          {/* First Name */}
          <div style={{ paddingTop: "20px" }}>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={values.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.first_name && errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.last_name && errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone_number">Phone</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={values.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.phone_number && errors.phone_number && (
              <p className="text-red-500 text-sm">{errors.phone_number}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              name="gender"
              value={values.gender}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.gender && errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* Marital Status */}
          <div>
            <Label htmlFor="martial_status">Marital Status *</Label>
            <Select
              value={values.martial_status}
              onValueChange={(val) =>
                handleChange({
                  target: { name: "martial_status", value: val },
                })
              }
              onBlur={() => handleBlur({ target: { name: "martial_status" } })}
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
            {renderError("martial_status")}
          </div>

          {/* <div>
            <Label htmlFor="martial_status">Marital Status</Label>
            <Input
              id="martial_status"
              name="martial_status"
              value={values.martial_status}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.martial_status && errors.martial_status && (
              <p className="text-red-500 text-sm">{errors.martial_status}</p>
            )}
          </div> */}

          {/* Date of Joining */}
          <div>
            <Label htmlFor="date_of_joining">Date of Joining</Label>
            <Input
              id="date_of_joining"
              name="date_of_joining"
              type="date"
              value={formattedDateJoining}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.date_of_joining && errors.date_of_joining && (
              <p className="text-red-500 text-sm">{errors.date_of_joining}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formattedDateBirth}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.date_of_birth && errors.date_of_birth && (
              <p className="text-red-500 text-sm">{errors.date_of_birth}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <Label htmlFor="department_id">Department *</Label>
            <Select
              value={values.department_id}
              onValueChange={(val) =>
                handleChange({ target: { name: "department_id", value: val } })
              }
              onBlur={() => handleBlur({ target: { name: "department_id" } })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.department_id && errors.department_id && (
              <p className="text-red-500 text-sm">{errors.department_id}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <Label htmlFor="designation_id">Designation *</Label>
            <Select
              value={values.designation_id}
              onValueChange={(val) =>
                handleChange({ target: { name: "designation_id", value: val } })
              }
              onBlur={() => handleBlur({ target: { name: "designation_id" } })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {designations.map((designation) => (
                  <SelectItem
                    key={designation.id}
                    value={String(designation.id)}
                  >
                    {designation.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.designation_id && errors.designation_id && (
              <p className="text-red-500 text-sm">{errors.designation_id}</p>
            )}
          </div>

          {/* Nationality */}
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              name="nationality"
              value={values.nationality}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.nationality && errors.nationality && (
              <p className="text-red-500 text-sm">{errors.nationality}</p>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default BasicInfoForm;
