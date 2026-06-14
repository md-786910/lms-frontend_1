import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
    monthlyAccrual: "",
    resetCycleMonths: "",
    carryForwardEnabled: true,
    salaryDeductionEnabled: true,
    status: "active",
  });

  const initialValues = {
    // Leave Types
    type: "",
    annual_days: "",
    monthlyAccrual: "",
    resetCycleMonths: "",
  };

  const validationSchema = {
    type: [{ type: "required", message: "Leave type name is required" }],
    annual_days: [{ type: "required", message: "Total entitlement is required" }],
    monthlyAccrual: [{ type: "required", message: "Monthly accrual is required" }],
    resetCycleMonths: [{ type: "required", message: "Reset cycle is required" }],
  };

  useEffect(() => {
    if (data) {
      setNewLeaveType({
        id: data.id,
        type: data.type || "",
        annual_days: data.totalEntitlement ?? data.annual_days ?? "",
        monthlyAccrual: data.monthlyAccrual ?? "",
        resetCycleMonths: data.resetCycleMonths ?? 6,
        carryForwardEnabled: data.carryForwardEnabled ?? true,
        salaryDeductionEnabled: data.salaryDeductionEnabled ?? true,
        status: data.status || "active",
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
    const isValid = formValidation(
      ["type", "annual_days", "monthlyAccrual", "resetCycleMonths"],
      newLeaveType
    );
    console.log(isValid);
    if (!isValid) {
      console.error("Please fill all required fields for the leave type.");
      return;
    }
    setLoader(true);
    try {
      if (!data?.id) {
        console.error("Missing ID for update.");
        return;
      }

      const resp = await axiosInstance.put(`/setting/leave/${data.id}`, {
        ...newLeaveType,
        annual_days: Number(newLeaveType.annual_days),
        monthlyAccrual: Number(newLeaveType.monthlyAccrual),
        resetCycleMonths: Number(newLeaveType.resetCycleMonths),
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-semibold text-slate-600">Leave Type</Label>
            <Input
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
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
            <Label className="text-xs font-semibold text-slate-600">Total Entitlement</Label>
            <Input
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              type="number"
              placeholder="Total entitlement"
              value={newLeaveType.annual_days}
              onChange={(e) =>
                setNewLeaveType({
                  ...newLeaveType,
                  annual_days: e.target.value,
                })
              }
            />
            {errors.annual_days && (
              <p className="text-red-500 text-sm">{errors.annual_days}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600">Monthly Accrual</Label>
            <Input
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              type="number"
              step="0.5"
              placeholder="Monthly accrual"
              value={newLeaveType.monthlyAccrual}
              onChange={(e) =>
                setNewLeaveType({
                  ...newLeaveType,
                  monthlyAccrual: e.target.value,
                })
              }
            />
            {errors.monthlyAccrual && (
              <p className="text-red-500 text-sm">{errors.monthlyAccrual}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600">Reset Cycle Months</Label>
            <Input
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
              type="number"
              min="1"
              max="12"
              placeholder="6"
              value={newLeaveType.resetCycleMonths}
              onChange={(e) =>
                setNewLeaveType({
                  ...newLeaveType,
                  resetCycleMonths: e.target.value,
                })
              }
            />
            {errors.resetCycleMonths && (
              <p className="text-red-500 text-sm">{errors.resetCycleMonths}</p>
            )}
          </div>
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
            <Label className="text-sm font-semibold text-slate-600">Carry Forward</Label>
            <Switch
              checked={newLeaveType.carryForwardEnabled}
              onCheckedChange={(checked) =>
                setNewLeaveType({
                  ...newLeaveType,
                  carryForwardEnabled: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
            <Label className="text-sm font-semibold text-slate-600">Salary Deduction</Label>
            <Switch
              checked={newLeaveType.salaryDeductionEnabled}
              onCheckedChange={(checked) =>
                setNewLeaveType({
                  ...newLeaveType,
                  salaryDeductionEnabled: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
            <Label className="text-sm font-semibold text-slate-600">Active</Label>
            <Switch
              checked={newLeaveType.status === "active"}
              onCheckedChange={(checked) =>
                setNewLeaveType({
                  ...newLeaveType,
                  status: checked ? "active" : "inactive",
                })
              }
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-montserrat font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300" onClick={OnClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loader}
            className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-Montserrat"
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
