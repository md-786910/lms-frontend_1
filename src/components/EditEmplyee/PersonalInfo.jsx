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

    return (
      <div className="space-y-4 p-4 border rounded-md shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergency_contact_person">
              Emergency Contact Name
            </Label>
            <Input
              id="emergency_contact_person"
              name="emergency_contact_person"
              value={values.emergency_contact_person}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.emergency_contact_person &&
              errors.emergency_contact_person && (
                <p className="text-red-500 text-sm">
                  {errors.emergency_contact_person}
                </p>
              )}
          </div>

          <div>
            <Label htmlFor="emergency_contact_number">
              Emergency Contact Phone
            </Label>
            <Input
              id="emergency_contact_number"
              name="emergency_contact_number"
              value={values.emergency_contact_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.emergency_contact_number &&
              errors.emergency_contact_number && (
                <p className="text-red-500 text-sm">
                  {errors.emergency_contact_number}
                </p>
              )}
          </div>

          <div>
            <Label htmlFor="emergency_contact_relationship">Relationship</Label>
            <Input
              id="emergency_contact_relationship"
              name="emergency_contact_relationship"
              value={values.emergency_contact_relationship}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.emergency_contact_relationship &&
              errors.emergency_contact_relationship && (
                <p className="text-red-500 text-sm">
                  {errors.emergency_contact_relationship}
                </p>
              )}
          </div>

          <div>
            <Label htmlFor="blood_group">Blood Group *</Label>
            <Select
              value={values.blood_group}
              onValueChange={(value) => setFieldValue("blood_group", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.blood_group && (
              <p className="text-red-500 text-sm">{errors.blood_group}</p>
            )}
          </div>
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="epf_no">EPF Number</Label>
            <Input
              id="epf_no"
              name="epf_no"
              value={values.epf_no}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.epf_no && errors.epf_no && (
              <p className="text-red-500 text-sm">{errors.epf_no}</p>
            )}
          </div>

          <div>
            <Label htmlFor="pan_no">PAN Number</Label>
            <Input
              id="pan_no"
              name="pan_no"
              value={values.pan_no}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.pan_no && errors.pan_no && (
              <p className="text-red-500 text-sm">{errors.pan_no}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="medical_conditions">Medical Conditions</Label>
          <Textarea
            id="medical_conditions"
            name="medical_conditions"
            value={values.medical_conditions}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <Label htmlFor="hobbies">Hobbies & Interests</Label>
          <Textarea
            id="hobbies"
            name="hobbies"
            value={values.hobbies}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* <div>
          <Label htmlFor="esic_no">ESIC Number</Label>
          <Input
            id="esic_no"
            name="esic_no"
            value={values.esic_no}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.esic_no && errors.esic_no && (
            <p className="text-red-500 text-sm">{errors.esic_no}</p>
          )}
        </div> */}

        {/* <div>
          <Label htmlFor="aadhaar_no">Aadhaar Number</Label>
          <Input
            id="aadhaar_no"
            name="aadhaar_no"
            value={values.aadhaar_no}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.aadhaar_no && errors.aadhaar_no && (
            <p className="text-red-500 text-sm">{errors.aadhaar_no}</p>
          )}
        </div> */}

        {/* <div>
          <Label htmlFor="passport_no">Passport Number</Label>
          <Input
            id="passport_no"
            name="passport_no"
            value={values.passport_no}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.passport_no && errors.passport_no && (
            <p className="text-red-500 text-sm">{errors.passport_no}</p>
          )}
        </div> */}

        {/* <div>
          <Label htmlFor="uan_no">UAN Number</Label>
          <Input
            id="uan_no"
            name="uan_no"
            value={values.uan_no}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.uan_no && errors.uan_no && (
            <p className="text-red-500 text-sm">{errors.uan_no}</p>
          )}
        </div> */}
      </div>
    );
  }
);

export default PersonalInfoForm;
