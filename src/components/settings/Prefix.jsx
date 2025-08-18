import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import "react-quill/dist/quill.snow.css";
import { Settings as SettingsIcon, Save } from "lucide-react";
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5" />
            <span>Prefix Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {prefixList?.map((pref) => (
            <>
              <div
                key={pref?.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f1f5f9] p-3 rounded-md"
              >
                <div className="space-y-2">
                  <Label htmlFor="empPrefix">Department</Label>
                  <Input id="empPrefix" value={pref?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryPrefix">Prefix</Label>
                  <Input
                    id="salaryPrefix"
                    value={pref?.prefix}
                    name="prefix"
                    onChange={(e) =>
                      handlePrefixChange(pref?.id, e.target.value)
                    }
                  />
                  {errors[pref?.id]?.name && (
                    <p className="text-red-500 text-sm">
                      {errors[pref?.id].name}
                    </p>
                  )}
                </div>
              </div>
            </>
          ))}
          <Button
            onClick={() => handleSave("Prefix")}
            disabled={loader}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loader ? "saving data..." : "Save Prefix Settings"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default Prefix;
