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
      <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-2xl">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-5">
          <CardTitle className="flex items-center space-x-3 text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
            <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <span>Company Information</span>
              <p className="text-xs text-[#2E2E2E]/60 font-sans normal-case tracking-normal mt-0.5 font-normal">
                Manage organization profile, business identifiers, and public details
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Company Name</Label>
              <Input
                id="companyName"
                name="company_name"
                value={companyData?.company_name ?? ""}
                onChange={handleChange}
                className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/50 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              />
              {errors.company_name && (
                <p className="text-red-500 text-xs">{errors.company_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                name="email"
                value={companyData?.email ?? ""}
                onChange={handleChange}
                className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/50 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
                disabled
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Phone</Label>
              <Input
                id="companyPhone"
                name="phone_number"
                value={companyData?.phone_number ?? ""}
                onChange={handleChange}
                className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/50 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-xs">{errors.phone_number}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Website</Label>
              <Input
                id="companyWebsite"
                name="company_website"
                value={companyData?.company_website ?? ""}
                onChange={handleChange}
                className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/50 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              />
              {errors.company_website && (
                <p className="text-red-500 text-xs">{errors.company_website}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">CIN Number</Label>
              <Input
                id="taxId"
                name="tax_no"
                value={companyData?.tax_no ?? ""}
                onChange={handleChange}
                className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/50 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              />
              {errors.tax_no && (
                <p className="text-red-500 text-xs">{errors.tax_no}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="companyLogo" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425] block">Logo</label>
              <div className="flex items-center space-x-3">
                <input
                  className="rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/50 px-3 py-2 text-xs text-[#2E2E2E] w-full"
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {companyLogo && (
                  <img
                    src={companyLogo}
                    alt="Company Logo"
                    className="w-10 h-10 object-cover rounded-xl border border-[#E1D4C7]"
                  />
                )}
              </div>
              {logoUploading && (
                <div className="text-xs text-[#C26819]">Uploading...</div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Address</Label>
            <Textarea
              id="companyAddress"
              name="address"
              value={companyData?.address ?? ""}
              onChange={handleChange}
              className="border border-[#E1D4C7] bg-[#F5ECE4]/50 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              rows={3}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}
          </div>
          <Button
            onClick={() => handleSave()}
            disabled={loader}
            className="bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md px-6 py-2.5"
          >
            <Save className="h-4 w-4 mr-2" />
            {loader ? "Saving data..." : "Save Company Details"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default Company;
