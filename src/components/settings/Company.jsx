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
import { useSocketContext } from "../../contexts/SocketContext";
function Company({ value }) {
  const { setUpdateDashboard } = useSocketContext();
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
        company_name,
      } = companyData;

      const resp = await axiosInstance.put("/company", {
        address,
        company_website,
        tax_no,
        logo, // ⬅️ Save logo too
        phone_number,
        company_name,
      });

      if (resp.status === 200) {
        getCompanyDetails();
        setUpdateDashboard(Math.random());
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
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-slate-700 font-montserrat capitalize tracking-wider">
            <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
              <Building2 className="h-5 w-5" />
            </span>
            <span>Company Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Company Name</Label>
              <Input
                id="companyName"
                name="company_name"
                value={companyData?.company_name ?? ""}
                onChange={handleChange}
                className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm">{errors.company_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                name="email"
                value={companyData?.email ?? ""}
                onChange={handleChange}
                className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
                disabled
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Phone</Label>
              <Input
                id="companyPhone"
                name="phone_number"
                value={companyData?.phone_number ?? ""}
                onChange={handleChange}
                className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm">{errors.phone_number}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Website</Label>
              <Input
                id="companyWebsite"
                name="company_website"
                value={companyData?.company_website ?? ""}
                onChange={handleChange}
                className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              />
              {errors.company_website && (
                <p className="text-red-500 text-sm">{errors.company_website}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">CIN Number</Label>
              <Input
                id="taxId"
                name="tax_no"
                value={companyData?.tax_no ?? ""}
                onChange={handleChange}
                className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              />
              {errors.tax_no && (
                <p className="text-red-500 text-sm">{errors.tax_no}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="companyLogo" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Logo</label>
              <div className="flex item-center space-x-3">
                <input
                  className="rounded-md border  border-input bg-background px-3 py-2 ring-offset-background file:border-0  w-full text-sm text-gray-600"
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
            <Label htmlFor="companyAddress" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Address</Label>
            <Textarea
              id="companyAddress"
              name="address"
              value={companyData?.address ?? ""}
              onChange={handleChange}
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              rows={3}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <Button
            onClick={() => handleSave()}
            disabled={loader}
            className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-montserrat"
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
