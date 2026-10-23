import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function Leave({ value }) {
  const [loader, setLoader] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);

  const [newLeaveType, setNewLeaveType] = useState({
    type: "",
    annual_days: "",
  });

  const [selectedDesignation, setSelectedDesignation] = useState(null);

  const initialValues = {
    // Leave Types
    type: "",
    annual_days: "",
  };

  const validationSchema = {
    type: [{ type: "required", message: "Leave type name is required" }],
    annual_days: [{ type: "required", message: "Number of days is required" }],
  };

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const addLeaveType = async () => {
    const isValid = formValidation(["type", "annual_days"], newLeaveType);
    console.log(isValid);
    if (!isValid) {
      console.error("Please fill all required fields for the leave type.");
      return;
    }
    setLoader(true);
    try {
      const { type, annual_days } = newLeaveType;
      const resp = await axiosInstance.post("/setting/leave", {
        type,
        annual_days,
      });

      if (resp.status === 200) {
        getLeaveDetails();
        setNewLeaveType({ type: "", annual_days: "" });
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
      <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-2xl">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-5">
          <CardTitle className="flex items-center space-x-3 text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
            <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div>
              <span>Leave Policy Management</span>
              <p className="text-xs text-[#2E2E2E]/60 font-sans normal-case tracking-normal mt-0.5 font-normal">
                Configure annual entitlement allowances, custom categories, and deduction policies
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Add New Leave Type */}
          <div className="p-5 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-2xl shadow-sm">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#734425] mb-4">
              Add New Leave Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
                  placeholder="Leave Type Name"
                  value={newLeaveType.type}
                  onChange={(e) =>
                    setNewLeaveType({ ...newLeaveType, type: e.target.value })
                  }
                />
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>
              <div>
                <Input
                  className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
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
                  <p className="text-red-500 text-xs mt-1">{errors.annual_days}</p>
                )}
              </div>
            </div>
            <Button
              onClick={addLeaveType}
              disabled={loader}
              className="mt-4 bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md px-6 py-2.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loader ? "Saving data..." : "Save Leave Type"}
            </Button>
          </div>

          {/* Existing Leave Types */}
          <div className="space-y-3">
            {leaveTypes.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-4 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl hover:border-[#734425] transition-all shadow-sm"
              >
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#24130A]">{leave.type}</h4>
                  <div className="text-xs text-[#2E2E2E]/70 font-sans mt-0.5">
                    <span>Annual Entitlement: <strong className="font-heading text-[#734425]">{leave.annual_days} Days</strong></span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#734425] hover:bg-[#734425]/10 rounded-xl"
                    onClick={() => setSelectedDesignation(leave)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 rounded-xl"
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
