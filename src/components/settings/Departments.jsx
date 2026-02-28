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
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-slate-700 font-montserrat capitalize tracking-wider">
            <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-full">
              <Users className="h-5 w-5" />
            </span>
            <span>Department Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Department */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-bold text-slate-700 font-montserrat capitalize tracking-wider mb-4">
              Add New Department
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
                  placeholder="Department Name"
                  name="name"
                  value={newDepartment?.name ?? ""}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Input
                  className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
                  placeholder="Description"
                  name="description"
                  value={newDepartment?.description ?? ""}
                  onChange={handleChange}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
            </div>
            <Button
              onClick={addDepartment}
              disabled={loader}
              className="mt-4 border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-montserrat"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loader ? "saving data..." : "Save Department Details"}
            </Button>
          </div>

          {/* Existing Departments */}
          <div className="space-y-4">
            {listDepartment?.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-4 font-montserrat border border-slate-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-slate-800 font-montserrat">{dept.name}</h4>
                  <p className="text-sm text-slate-500 font-montserrat">{dept.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
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
