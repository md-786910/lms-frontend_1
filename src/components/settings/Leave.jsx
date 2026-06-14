import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "react-quill/dist/quill.snow.css";
import {
  CalendarClock,
  Settings as SettingsIcon,
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import ConfirmFn from "../../utility/confirmFn";
import CustomeModel from "../../common/CustomeModel";
import UpdateLeaveModel from "./departments/UpdateLeaveModel";
import { useFormValidation } from "../../hooks/useFormValidation";
import NoDataFound from "../../common/NoDataFound";

const emptyPolicy = {
  type: "",
  annual_days: 18,
  monthlyAccrual: 1.5,
  resetCycleMonths: 6,
  carryForwardEnabled: true,
  salaryDeductionEnabled: true,
  status: "active",
};

function Leave({ value }) {
  const [loader, setLoader] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);

  const [newLeaveType, setNewLeaveType] = useState(emptyPolicy);

  const [selectedDesignation, setSelectedDesignation] = useState(null);

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

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const addLeaveType = async () => {
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
      const resp = await axiosInstance.post("/setting/leave", {
        ...newLeaveType,
        annual_days: Number(newLeaveType.annual_days),
        monthlyAccrual: Number(newLeaveType.monthlyAccrual),
        resetCycleMonths: Number(newLeaveType.resetCycleMonths),
      });

      if (resp.status === 200) {
        getLeaveDetails();
        setNewLeaveType(emptyPolicy);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const getLeaveDetails = async () => {
    try {
      const response = await axiosInstance.get(`/setting/leave`);
      if (response.status === 200) {
        setLeaveTypes(response.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // alert
    }
  };
  useEffect(() => {
    getLeaveDetails();
  }, []);

  return (
    <>
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-slate-700 font-montserrat capitalize tracking-wider">
            <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
              <CalendarClock className="h-5 w-5" />
            </span>
            <span>Leave Policy Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Leave Type */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-bold text-slate-700 font-montserrat capitalize tracking-wider mb-4">
              Add New Leave Type
            </h3>
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
            <Button
              onClick={addLeaveType}
              disabled={loader}
              className="mt-4 border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-Montserrat"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loader ? "saving data..." : "Save Leave"}
            </Button>
          </div>

          {/* Existing Leave Types */}
          <div className="space-y-4">
            {leaveTypes.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-slate-800 font-montserrat">{leave.type}</h4>
                  <div className="text-sm text-slate-500 font-montserrat mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Total: {leave.totalEntitlement ?? leave.annual_days}</span>
                    <span>Monthly: {leave.monthlyAccrual}</span>
                    <span>Cycle: {leave.resetCycleMonths} months</span>
                    <span>Carry: {leave.carryForwardEnabled ? "On" : "Off"}</span>
                    <span>Salary deduction: {leave.salaryDeductionEnabled ? "On" : "Off"}</span>
                    <span className={leave.status === "active" ? "text-emerald-600" : "text-slate-400"}>
                      {leave.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDesignation(leave)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => {
                      ConfirmFn({
                        onDelete: async () => {
                          try {
                            const resp = await axiosInstance.delete(
                              `/setting/leave/${leave.id}`
                            );
                            if (resp.status === 200) {
                              getLeaveDetails();
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        },
                        text_no: "Cancel",
                        text_yes: "Delete",
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {leaveTypes?.length == 0 && <NoDataFound />}
        </CardContent>
      </Card>

      {/* Update Designation Dialog */}
      {selectedDesignation && (
        <CustomeModel
          open={!!selectedDesignation}
          title="Update Leave"
          OnClose={() => setSelectedDesignation(null)}
        >
          <UpdateLeaveModel
            data={selectedDesignation}
            OnClose={() => {
              setSelectedDesignation(null);
              getLeaveDetails();
            }}
          />
        </CustomeModel>
      )}
    </>
  );
}

export default Leave;
