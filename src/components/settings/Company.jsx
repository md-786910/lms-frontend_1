import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import "react-quill/dist/quill.snow.css";
import { Building2, Save } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useFormValidation } from "../../hooks/useFormValidation";
import { employeeAPI } from "../../api/employeeApi";
function Company({ value }) {
  const [loader, setLoader] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyData, setCompanyData] = useState({
    company_name: "",
    email: "",
    phone_number: "",
    address: "",
    company_website: "",
    tax_no: "",
    logo: "",
  });

  const initialValues = {
    // Company section
    company_name: "",
    email: "",
    phone_number: "",
    company_website: "",
    address: "",
    tax_no: "",
  };

  const validationSchema = {
    // Company validation rules
    company_name: [{ type: "required", message: "Company name is required" }],
    email: [
      { type: "required", message: "Email is required" },
      { type: "email", message: "Invalid email format" },
    ],
    phone_number: [{ type: "required", message: "Phone number is required" }],
    company_website: [{ type: "required", message: "Website is required" }],
    address: [{ type: "optional", message: "Address is required" }],
    tax_no: [{ type: "optional", message: "Tax ID is required" }],
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCompanyData({
      ...companyData,
      [name]: value,
    });
  };

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const validateCompanySection = () => {
    return formValidation(
      [
        "company_name",
        "email",
        "phone_number",
        "company_website",
        "address",
        "tax_no",
      ],
      companyData
    );
  };

  const handleSave = async () => {
    const isValid = validateCompanySection();
    if (!isValid) {
      console.error("Please fill all required fields.");
      return;
    }

    setLoader(true);
    try {
      const {
        address,
        company_website,
        tax_no,
        logo, // ⬅️ Include this
        phone_number,
      } = companyData;

      const resp = await axiosInstance.put("/company", {
        address,
        company_website,
        tax_no,
        logo, // ⬅️ Save logo too
        phone_number,
      });

      if (resp.status === 200) {
        getCompanyDetails();
      }
    } catch (error) {
      console.log("Save failed:", error);
    } finally {
      setLoader(false);
    }
  };

  const getCompanyDetails = async () => {
    try {
      const response = await axiosInstance.get("/company");
      if (response.status == 200) {
        const data = response.data?.data;
        const {
          company_name,
          user: { email, phone_number },
          address = "",
          company_website = "",
          tax_no = "",
          logo = null,
        } = data;

        setCompanyData({
          company_name,
          email,
          phone_number,
          address,
          company_website,
          tax_no,
          logo,
        });

        if (logo) setCompanyLogo(logo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLogoUploading(true); // Start loader

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const uploaded = await employeeAPI.uploadFile(formData); // Or companyAPI

      const filePath = uploaded?.fileIds?.[0]?.file_path;
      if (!filePath) {
        console.error("Upload failed: No file path returned");
        return;
      }

      // Store in companyData
      setCompanyData((prev) => ({
        ...prev,
        logo: filePath,
      }));

      // Preview
      setCompanyLogo(filePath);
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setLogoUploading(false); // Stop loader
    }
  };

  useEffect(() => {
    getCompanyDetails();
  }, []);

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Company Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="company_name"
                value={companyData?.company_name ?? ""}
                onChange={handleChange}
                disabled
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm">{errors.company_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                name="email"
                value={companyData?.email ?? ""}
                onChange={handleChange}
                disabled
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone</Label>
              <Input
                id="companyPhone"
                name="phone_number"
                value={companyData?.phone_number ?? ""}
                onChange={handleChange}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm">{errors.phone_number}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Website</Label>
              <Input
                id="companyWebsite"
                name="company_website"
                value={companyData?.company_website ?? ""}
                onChange={handleChange}
              />
              {errors.company_website && (
                <p className="text-red-500 text-sm">{errors.company_website}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                name="tax_no"
                value={companyData?.tax_no ?? ""}
                onChange={handleChange}
              />
              {errors.tax_no && (
                <p className="text-red-500 text-sm">{errors.tax_no}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="companyLogo">Logo</label>
              <div className="flex item-center space-x-3">
                <input
                  className="rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0  w-full text-sm text-gray-600"
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {companyLogo && (
                  <img
                    src={companyLogo}
                    alt="Company Logo"
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
              </div>
              {logoUploading && (
                <div className="text-red-800">Uploading...</div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Address</Label>
            <Textarea
              id="companyAddress"
              name="address"
              value={companyData?.address ?? ""}
              onChange={handleChange}
              rows={3}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <Button
            onClick={() => handleSave()}
            disabled={loader}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loader ? "saving data..." : "Save Company Details"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default Company;
