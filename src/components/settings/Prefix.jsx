import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import "react-quill/dist/quill.snow.css";
import { Settings as SettingsIcon, Save, Hash } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

function Prefix({ value }) {
  const [errors, setErrors] = useState({});

  const [loader, setLoader] = useState(false);
  const [prefixList, setPrifixList] = useState([]);

  const handleSave = async () => {
    let isValid = true;
    const newErrors = {};

    prefixList.forEach((pre) => {
      if (!pre.name || pre.name.trim() === "") {
        isValid = false;
        newErrors[pre.id] = {
          name: "Prefix is required",
        };
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      console.error("Please fill all required fields for the prefix.");
      return;
    }

    if (prefixList.length === 0) return;
    setLoader(true);
    try {
      if (prefixList?.length == 0) {
        return;
      }
      const newPrefix = prefixList?.map((pre) => ({
        prefix: pre?.prefix,
        id: pre?.id,
      }));

      const resp = await axiosInstance.put("/setting/prefix", newPrefix);
      if (resp.status == 200) {
        getPrefixDetails();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handlePrefixChange = (id, newValue) => {
    const updatedPrefixList = [...prefixList];
    const index = updatedPrefixList.findIndex((pref) => pref.id === id);
    if (index !== -1) {
      updatedPrefixList[index].prefix = newValue;
      console.log(updatedPrefixList);
      setPrifixList(updatedPrefixList);
    } else {
      console.error("Prefix with given id not found");
    }
  };

  const getPrefixDetails = async () => {
    try {
      const response = await axiosInstance.get("/setting/prefix");
      if (response.status === 200) {
        const data = response.data?.data;
        setPrifixList(data);
      } else {
        // Handle error response
      }
    } catch (error) {}
  };

  useEffect(() => {
    getPrefixDetails();
  }, []);

  return (
    <>
      {/* Prefix & Currency Settings */}
      <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-2xl">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-5">
          <CardTitle className="flex items-center space-x-3 text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
            <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
              <Hash className="h-5 w-5" />
            </span>
            <div>
              <span>Prefix Settings</span>
              <p className="text-xs text-[#2E2E2E]/60 font-sans normal-case tracking-normal mt-0.5 font-normal">
                Configure auto-generation prefixes for employee numbering and departmental codes
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {prefixList?.map((pref) => (
              <div
                key={pref?.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#F5ECE4]/70 border border-[#E1D4C7] p-4 rounded-2xl shadow-sm"
              >
                <div className="space-y-2">
                  <Label htmlFor="empPrefix" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Department</Label>
                  <Input id="empPrefix" className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] text-[#2E2E2E] rounded-xl font-medium" value={pref?.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryPrefix" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Prefix Code</Label>
                  <Input
                    className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]" 
                    id="salaryPrefix"
                    value={pref?.prefix}
                    name="prefix"
                    onChange={(e) =>
                      handlePrefixChange(pref?.id, e.target.value)
                    }
                  />
                  {errors[pref?.id]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[pref?.id].name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={() => handleSave("Prefix")}
            disabled={loader}
            className="bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md px-6 py-2.5"
          >
            <Save className="h-4 w-4 mr-2" />
            {loader ? "Saving data..." : "Save Prefix Settings"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default Prefix;
