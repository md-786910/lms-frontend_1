import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit3, Trash2, BookA } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import NoDataFound from "../../common/NoDataFound";
import ConfirmFn from "../../utility/confirmFn";
import CustomeModel from "../../common/CustomeModel";
import UpdateDesignationModel from "./departments/UpdateDesignationModel";
import { useFormValidation } from "../../hooks/useFormValidation";

function Designations({ value }) {
  const [loader, setLoader] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [newDesignation, setNewDesignation] = useState({
    title: "",
    department_id: "",
    department: "",
  });

  const initialValues = {
    title: "",
    department_id: "",
  };

  const validationSchema = {
    title: [{ type: "required", message: "Designation name is required" }],
    department_id: [
      { type: "required", message: "Department name is required" },
    ],
  };

  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const addDesignation = async () => {
    const isValid = formValidation(["title", "department_id"], newDesignation);
    console.log(isValid);
    if (!isValid) {
      console.error("Please fill all required fields for the designation.");
      return;
    }
    setLoader(true);
    try {
      if (!newDesignation?.department_id) return;

      const { title, department_id } = newDesignation;

      const resp = await axiosInstance.post("/setting/designation", {
        title,
        department_id,
      });

      if (resp.status === 200) {
        getDesignationDetails();
        setNewDesignation({ title: "", department_id: "", department: "" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getDesignationDetails = async () => {
    try {
      const response = await axiosInstance.get(`/setting/designation`);
      if (response.status === 200) {
        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const designationsList = data.map((item) => ({
          id: item.id,
          title: item.title,
          department_id: item.department?.id,
          department_name: item.department?.name,
        }));
        setDesignations(designationsList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDepartmentDetails = async () => {
    try {
      const resp = await axiosInstance.get("/setting/department");
      setDepartmentsList(resp.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDesignationDetails();
    getDepartmentDetails();
  }, []);

  return (
    <>
      <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-2xl">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-5">
          <CardTitle className="flex items-center space-x-3 text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
            <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
              <BookA className="h-5 w-5" />
            </span>
            <div>
              <span>Designation Management</span>
              <p className="text-xs text-[#2E2E2E]/60 font-sans normal-case tracking-normal mt-0.5 font-normal">
                Define job roles, hierarchical titles, and map them to appropriate departments
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Add New Designation */}
          <div className="p-5 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-2xl shadow-sm">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#734425] mb-4">
              Add New Designation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
                  placeholder="Designation Name"
                  value={newDesignation.title}
                  onChange={(e) =>
                    setNewDesignation({
                      ...newDesignation,
                      title: e.target.value,
                    })
                  }
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <Select
                  onValueChange={(value) => {
                    const selected = departmentsList.find(
                      (dept) => dept.id.toString() === value
                    );
                    setNewDesignation({
                      ...newDesignation,
                      department_id: selected.id,
                      department: selected.name,
                    });
                  }}
                  value={newDesignation.department_id?.toString()}
                >
                  <SelectTrigger className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="border-[#E1D4C7] bg-[#FAF6F2] rounded-xl">
                    {departmentsList?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.department_id}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={addDesignation}
              disabled={loader}
              className="mt-4 bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md px-6 py-2.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loader ? "Saving data...." : "Save Designation Details"}
            </Button>
          </div>

          <div className="space-y-3">
            {designations.map((designation) => (
              <div
                key={designation.id}
                className="flex items-center justify-between p-4 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl hover:border-[#734425] transition-all shadow-sm"
              >
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#24130A]">
                    {designation.title}
                  </h4>
                  <div className="text-xs text-[#2E2E2E]/70 font-sans mt-0.5">
                    <span>{designation.department_name}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#734425] hover:bg-[#734425]/10 rounded-xl"
                    onClick={() => setSelectedDesignation(designation)}
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
                              `/setting/designation/${designation.id}`
                            );
                            if (resp.status === 200) {
                              getDesignationDetails();
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

          {designations.length === 0 && <NoDataFound />}
        </CardContent>
      </Card>

      {/* Update Designation Dialog */}
      {selectedDesignation && (
        <CustomeModel
          open={!!selectedDesignation}
          title="Update Designation"
          OnClose={() => setSelectedDesignation(null)}
        >
          <UpdateDesignationModel
            data={selectedDesignation}
            OnClose={() => {
              setSelectedDesignation(null);
              getDesignationDetails();
            }}
          />
        </CustomeModel>
      )}
    </>
  );
}

export default Designations;
