import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "react-quill/dist/quill.snow.css";
import {
  Users,
  Settings as SettingsIcon,
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import confirmFn from "../../utility/confirmFn";
import CustomeModel from "../../common/CustomeModel";
import UpdateDepartmentsModel from "./departments/UpdateDepartmentsModel";
import NoDataFound from "../../common/NoDataFound";
import { useFormValidation } from "../../hooks/useFormValidation";

function Departments({ value }) {
  const [loader, setLoader] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [listDepartment, setListDepartment] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });

  const initialValues = {
    name: "",
    description: "",
  };

  const validationSchema = {
    name: [{ type: "required", message: "Department name is required" }],
    description: [{ type: "optional", message: "Description is required" }],
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewDepartment({
      ...newDepartment,
      [name]: value,
    });
  };

  const { values, errors, touched, handleBlur, formValidation } =
    useFormValidation(initialValues, validationSchema);

  const addDepartment = async () => {
    const isValid = formValidation(["name", "description"], newDepartment);
    console.log(isValid);

    if (!isValid) {
      console.error("Please fill all required fields for the department.");
      return;
    }
    setLoader(true);
    try {
      const { name, description } = newDepartment;
      const resp = await axiosInstance.post("/setting/department", {
        name,
        description,
      });
      if (resp.status == 200) {
        getDepartmentDetails();
      } else {
        // alert
      }
    } catch (error) {
      // alert
      console.log(error);
    } finally {
      setNewDepartment({ name: "", description: "" });
      setLoader(false);
    }
  };

  const getDepartmentDetails = async () => {
    try {
      const response = await axiosInstance.get(`/setting/department`);
      if (response.status == 200) {
        const data = response.data?.data;
        setListDepartment(Array.isArray(data) ? data : []);
      } else {
        // throw alert
      }
    } catch (error) {
      console.log(error);
    } finally {
      // loader
    }
  };

  useEffect(() => {
    getDepartmentDetails();
  }, []);

  return (
    <>
      <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-2xl">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-5">
          <CardTitle className="flex items-center space-x-3 text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
            <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <span>Department Management</span>
              <p className="text-xs text-[#2E2E2E]/60 font-sans normal-case tracking-normal mt-0.5 font-normal">
                Define functional teams, business divisions, and departmental descriptions
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Add New Department */}
          <div className="p-5 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-2xl shadow-sm">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#734425] mb-4">
              Add New Department
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
                  placeholder="Department Name"
                  name="name"
                  value={newDepartment?.name ?? ""}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Input
                  className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
                  placeholder="Description"
                  name="description"
                  value={newDepartment?.description ?? ""}
                  onChange={handleChange}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
            </div>
            <Button
              onClick={addDepartment}
              disabled={loader}
              className="mt-4 bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md px-6 py-2.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loader ? "Saving data..." : "Save Department Details"}
            </Button>
          </div>

          {/* Existing Departments */}
          <div className="space-y-3">
            {listDepartment?.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-4 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl hover:border-[#734425] transition-all shadow-sm"
              >
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#24130A]">{dept.name}</h4>
                  <p className="text-xs text-[#2E2E2E]/70 font-sans mt-0.5">{dept.description}</p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#734425] hover:bg-[#734425]/10 rounded-xl"
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={() => {
                      confirmFn({
                        onDelete: async () => {
                          try {
                            const resp = await axiosInstance.delete(
                              `/setting/department/${dept?.id}`
                            );
                            if (resp?.status === 200) {
                              getDepartmentDetails();
                            }
                          } catch (error) {
                            console.log(error);
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

          {listDepartment?.length == 0 && <NoDataFound />}
        </CardContent>
      </Card>
      {/* Update Departments Dialog */}
      {selectedDepartment && (
        <CustomeModel
          open={!!selectedDepartment}
          title="Update Department"
          OnClose={(props) => {
            setSelectedDepartment(props);
          }}
        >
          <UpdateDepartmentsModel
            data={selectedDepartment}
            OnClose={(props) => {
              setSelectedDepartment(null);
              getDepartmentDetails();
            }}
          />
        </CustomeModel>
      )}
    </>
  );
}

export default Departments;
