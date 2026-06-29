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

  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="font-graphik text-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-gray-100 rounded-xl shadow-sm bg-white">
        <div className="space-y-2">
          <Label htmlFor="street" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">Street Address *</Label>
          <Input
            id="street"
            name="street"
            value={values.street}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
          />
          {renderError("street")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">City *</Label>
          <Input
            id="city"
            name="city"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
          />
          {renderError("city")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">State *</Label>
          <Input
            id="state"
            name="state"
            value={values.state}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
          />
          {renderError("state")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip_code" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">ZIP Code *</Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={values.zip_code}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
          />
          {renderError("zip_code")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">Country</Label>
          <Input
            id="country"
            name="country"
            value={values.country}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
          />
          {renderError("country")}
        </div>
        
        <div className="col-span-full space-y-2">
          <Label htmlFor="permanent_address" className="text-sm font-bold text-slate-700 font-graphik uppercase tracking-wider">Permanent Address</Label>
          <Textarea
            id="permanent_address"
            name="permanent_address"
            value={values.permanent_address}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
            className="border border-slate-200 focus:border-slate-900 transition-all font-graphik min-h-[100px]"
          />
          {renderError("permanent_address")}
        </div>
      </div>
    </div>
  );
});

export default AddressForm;
