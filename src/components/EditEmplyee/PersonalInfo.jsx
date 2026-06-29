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
import { forwardRef, useImperativeHandle, useEffect } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { BLOOD_GROUPS } from "../../data/bloodgroup";

const validationSchema = {
  emergency_contact_person: [],
  emergency_contact_number: [
    { type: "optional", message: "Invalid phone number" },
  ],
  emergency_contact_relationship: [],
  blood_group: [{ type: "required", message: "Blood group is required" }],
  medical_conditions: [], // Optional, so no validation
  hobbies: [], // Optional, so no validation
  epf_no: [],
  esic_no: [],
  pan_no: [],
  aadhaar_no: [],
  passport_no: [],
  uan_no: [],
};

const PersonalInfoForm = forwardRef(
  ({ personalInfo, setPersonalInfo }, ref) => {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      setFieldValue,
      validateForm,
    } = useFormValidation(personalInfo, validationSchema, {
      validateOnChange: true,
      validateOnBlur: true,
      enableReinitialize: true,
    });

    useEffect(() => {
      setPersonalInfo(values);
    }, [values, setPersonalInfo]);

    useImperativeHandle(ref, () => ({
      validateForm: () => validateForm(),
    }));

    const renderError = (field) =>
      touched[field] && errors[field] ? (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      ) : null;

    return (
      <div className="font-graphik text-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-gray-100 rounded-xl shadow-sm bg-white">
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_person" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">
              Emergency Contact Name
            </Label>
            <Input
              id="emergency_contact_person"
              name="emergency_contact_person"
              value={values.emergency_contact_person}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
            />
            {renderError("emergency_contact_person")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact_number" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">
              Emergency Contact Phone
            </Label>
            <Input
              id="emergency_contact_number"
              name="emergency_contact_number"
              value={values.emergency_contact_number}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
            />
            {renderError("emergency_contact_number")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact_relationship" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">Relationship</Label>
            <Input
              id="emergency_contact_relationship"
              name="emergency_contact_relationship"
              value={values.emergency_contact_relationship}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
            />
            {renderError("emergency_contact_relationship")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="blood_group" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">Blood Group *</Label>
            <Select
              value={values.blood_group}
              onValueChange={(value) => setFieldValue("blood_group", value)}
            >
              <SelectTrigger className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent className="font-graphik">
                {BLOOD_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderError("blood_group")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="epf_no" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">EPF Number</Label>
            <Input
              id="epf_no"
              name="epf_no"
              value={values.epf_no}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
            />
            {renderError("epf_no")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pan_no" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">PAN Number</Label>
            <Input
              id="pan_no"
              name="pan_no"
              value={values.pan_no}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
            />
            {renderError("pan_no")}
          </div>

          <div className="col-span-full space-y-2">
            <Label htmlFor="medical_conditions" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">Medical Conditions</Label>
            <Textarea
              id="medical_conditions"
              name="medical_conditions"
              value={values.medical_conditions}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border border-slate-200 focus:border-slate-900 transition-all font-graphik min-h-[100px]"
            />
          </div>

          <div className="col-span-full space-y-2">
            <Label htmlFor="hobbies" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">Hobbies & Interests</Label>
            <Textarea
              id="hobbies"
              name="hobbies"
              value={values.hobbies}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border border-slate-200 focus:border-slate-900 transition-all font-graphik min-h-[100px]"
            />
          </div>
        </div>
      </div>
    );
  }
);

export default PersonalInfoForm;
