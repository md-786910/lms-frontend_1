import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { forwardRef, useImperativeHandle, useEffect } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";

const validationSchema = {
  street: [{ type: "required", message: "Street address is required" }],
  city: [{ type: "required", message: "City is required" }],
  state: [{ type: "required", message: "State is required" }],
  zip_code: [
    { type: "required", message: "ZIP Code is required" },
    { type: "zip", message: "Invalid ZIP Code" },
  ],
  country: [{ type: "optional", message: "Country is required" }],
  permanent_address: [
    { type: "optional", message: "Permanent address is required" },
  ],
};

const AddressForm = forwardRef(({ addressInfo, setAddressInfo }, ref) => {
  const { values, errors, touched, handleChange, handleBlur, validateForm } =
    useFormValidation(addressInfo, validationSchema, {
      validateOnChange: true,
      validateOnBlur: true,
      enableReinitialize: true,
    });

  useEffect(() => {
    setAddressInfo(values);
  }, [values, setAddressInfo]);

  useImperativeHandle(ref, () => ({
    validateForm: () => validateForm(),
  }));

  return (
    <div className="space-y-4 p-4 border rounded-md shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            name="street"
            value={values.street}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.street ||
            (errors?.street && (
              <p className="text-red-500 text-sm">{errors.street}</p>
            ))}
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.city ||
            (errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            ))}
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            name="state"
            value={values.state}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.state ||
            (errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            ))}
        </div>
        <div>
          <Label htmlFor="zip_code">ZIP Code *</Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={values.zip_code}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.zip_code ||
            (errors.zip_code && (
              <p className="text-red-500 text-sm">{errors.zip_code}</p>
            ))}
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={values.country}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.country ||
            (errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            ))}
        </div>
      </div>

      <div>
        <Label htmlFor="permanent_address">Permanent Address</Label>
        <Textarea
          id="permanent_address"
          name="permanent_address"
          value={values.permanent_address}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
        />
        {touched.permanent_address ||
          (errors.permanent_address && (
            <p className="text-red-500 text-sm">{errors.permanent_address}</p>
          ))}
      </div>
    </div>
  );
});

export default AddressForm;
