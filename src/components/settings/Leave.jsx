import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "react-quill/dist/quill.snow.css";
import {
  Calendar,
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Leave Policy Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Leave Type */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800 mb-4">
              Add New Leave Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
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
            <Button
              onClick={addLeaveType}
              disabled={loader}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                  <h4 className="font-medium text-slate-800">{leave.type}</h4>
                  <div className="flex space-x-4 text-sm text-slate-500 mt-1">
                    <span>Annual Days: {leave.annual_days}</span>
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
