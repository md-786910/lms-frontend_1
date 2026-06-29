import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "react-quill/dist/quill.snow.css";
import { Settings as SettingsIcon, Edit3 } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { useFormValidation } from "../../../hooks/useFormValidation";

function UpdateLeaveModel(props) {
  const [loader, setLoader] = useState(false);
  const { data, OnClose } = props;

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState({
    type: "",
    annual_days: "",
  });

  const initialValues = {
    // Leave Types
    type: "",
    annual_days: "",
  };

  const validationSchema = {
    type: [{ type: "required", message: "Leave type name is required" }],
    annual_days: [{ type: "required", message: "Number of days is required" }],
  };

  useEffect(() => {
    if (data) {
      setNewLeaveType({
        id: data.id,
        type: data.type || "",
        annual_days: data.annual_days || "",
      });
    }
  }, [data]);

  const getLeaveDetails = async () => {
    try {
      const response = await axiosInstance.get(`/setting/leave`);
      setLeaveTypes(response.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      // alert
    }
  };
  useEffect(() => {
    getLeaveDetails();
  }, []);

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const handleSubmit = async () => {
    const isValid = formValidation(["type", "annual_days"], newLeaveType);
    console.log(isValid);
    if (!isValid) {
      console.error("Please fill all required fields for the leave type.");
      return;
    }
    setLoader(true);
    try {
      const { type, annual_days } = newLeaveType;

      if (!data?.id) {
        console.error("Missing ID for update.");
        return;
      }

      const resp = await axiosInstance.put(`/setting/leave/${data.id}`, {
        type,
        annual_days,
      });

      if (resp.status === 200) {
        OnClose(); // success
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
              placeholder="Leave Type Name"
              value={newLeaveType.type}
              onChange={(e) =>
                setNewLeaveType({ ...newLeaveType, type: e.target.value })
              }
            />
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}
          </div>
          <div>
            <Input
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
              type="number"
              placeholder="Annual Days"
              value={newLeaveType.annual_days}
              onChange={(e) =>
                setNewLeaveType({
                  ...newLeaveType,
                  annual_days: parseInt(e.target.value) || 0,
                })
              }
            />
            {errors.annual_days && (
              <p className="text-red-500 text-sm">{errors.annual_days}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-graphik font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300" onClick={OnClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loader}
            className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-graphik"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {loader ? "saving data...." : "Update Leave"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default UpdateLeaveModel;
