import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";

const validationSchema = {
  first_name: [{ type: "required", message: "First name is required" }],
  last_name: [{ type: "optional", message: "Last name is required" }],
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

const DatePickerField = ({ name, label, value, required, onChange, onBlur, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse date safely
  const dateValue = value ? (typeof value === 'string' ? parseISO(value) : new Date(value)) : null;
  const displayValue = dateValue && isValid(dateValue) ? format(dateValue, "PPP") : "Pick a date";

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={name} className="text-[#131313] font-montserrat">
        {label} {required && "*"}
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border-gray-200 h-10 px-3",
              !dateValue && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[100]" align="start" sideOffset={4}>
          <Calendar
            mode="single"
            selected={dateValue && isValid(dateValue) ? dateValue : undefined}
            onSelect={(date) => {
              if (date) {
                onChange(name, date);
                setIsOpen(false);
                onBlur(name);
              }
            }}
            initialFocus
            className="font-montserrat"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const BasicInfoForm = forwardRef(
  ({ initialValues, onChange, departments, designations }, ref) => {
    const { values, errors, touched, handleChange, handleBlur, validateForm } =
      useFormValidation(initialValues, validationSchema, {
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
      });

    useEffect(() => {
      onChange(values);
    }, [values, onChange]);

    useImperativeHandle(ref, () => ({
      validateForm: () => validateForm(),
    }));

    const handleDateChange = (name, date) => {
      if (date) {
        handleChange({
          target: { name, value: format(date, "yyyy-MM-dd") },
        });
      }
    };

    const triggerBlur = (name) => {
      handleBlur({ target: { name } });
    };

    const renderError = (field) =>
      touched[field] && errors[field] ? (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      ) : null;

    if (!values) {
      return "Loading...";
    }

    return (
      <div className="font-montserrat text-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-gray-100 rounded-xl shadow-sm bg-white">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">First Name *</Label>
            <Input
              id="first_name"
              name="first_name"
              value={values.first_name || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
            />
            {renderError("first_name")}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={values.last_name || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
            />
            {renderError("last_name")}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
            />
            {renderError("email")}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Phone *</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={values.phone_number || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
            />
            {renderError("phone_number")}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Gender *</Label>
            <Select
              value={values.gender || ""}
              onValueChange={(val) =>
                handleChange({
                  target: { name: "gender", value: val },
                })
              }
            >
              <SelectTrigger onBlur={() => triggerBlur("gender")} className="h-11 font-montserrat border border-slate-200 focus:border-slate-900 transition-all">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="font-montserrat">
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

          {/* Marital Status */}
          <div className="space-y-2">
            <Label htmlFor="martial_status" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Marital Status *</Label>
            <Select
              value={values.martial_status || ""}
              onValueChange={(val) =>
                handleChange({
                  target: { name: "martial_status", value: val },
                })
              }
            >
              <SelectTrigger onBlur={() => triggerBlur("martial_status")} className="h-11 font-montserrat border border-slate-200 focus:border-slate-900 transition-all">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="font-montserrat">
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            {renderError("martial_status")}
          </div>

          {/* Date of Joining */}
          <DatePickerField
            name="date_of_joining"
            label="Date of Joining"
            value={values.date_of_joining}
            required
            onChange={handleDateChange}
            onBlur={triggerBlur}
            error={touched.date_of_joining && errors.date_of_joining ? errors.date_of_joining : null}
          />

          {/* Date of Birth */}
          <DatePickerField
            name="date_of_birth"
            label="Date of Birth"
            value={values.date_of_birth}
            required
            onChange={handleDateChange}
            onBlur={triggerBlur}
            error={touched.date_of_birth && errors.date_of_birth ? errors.date_of_birth : null}
          />

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department_id" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Department *</Label>
            <Select
              value={String(values.department_id || "")}
              onValueChange={(val) =>
                handleChange({ target: { name: "department_id", value: val } })
              }
            >
              <SelectTrigger onBlur={() => triggerBlur("department_id")} className="w-full h-11 font-montserrat border border-slate-200 focus:border-slate-900 transition-all">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="font-montserrat">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderError("department_id")}
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <Label htmlFor="designation_id" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Designation *</Label>
            <Select
              value={String(values.designation_id || "")}
              onValueChange={(val) =>
                handleChange({ target: { name: "designation_id", value: val } })
              }
            >
              <SelectTrigger onBlur={() => triggerBlur("designation_id")} className="w-full h-11 font-montserrat border border-slate-200 focus:border-slate-900 transition-all">
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent className="font-montserrat">
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
            {renderError("designation_id")}
          </div>

          {/* Nationality */}
          <div className="space-y-2 w-full">
            <Label htmlFor="nationality" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Nationality *</Label>
            <Input
              id="nationality"
              name="nationality"
              value={values.nationality || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
            />
            {renderError("nationality")}
          </div>
        </div>
      </div>
    );

  }
);

export default BasicInfoForm;
