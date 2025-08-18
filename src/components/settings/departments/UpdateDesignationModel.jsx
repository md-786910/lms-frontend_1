import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3 } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { useFormValidation } from "../../../hooks/useFormValidation";

function UpdateDesignationForm(props) {
  const [loader, setLoader] = useState(false);
  const { data, OnClose } = props;

  const [departmentsList, setDepartmentsList] = useState([]);
  const [newDesignation, setNewDesignation] = useState({
    id: "",
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

  useEffect(() => {
    if (data) {
      setNewDesignation({
        id: data.id,
        title: data.title || "",
        department_id: data.department_id || "",
        department: data.department || "",
      });
    }
  }, [data]);

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const getDepartmentDetails = async () => {
    try {
      const resp = await axiosInstance.get("/setting/department");
      setDepartmentsList(resp.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDepartmentDetails();
  }, []);

  const handleSubmit = async () => {
    const isValid = formValidation(["title", "department_id"], newDesignation);
    console.log(isValid);
    if (!isValid) {
      console.error("Please fill all required fields for the designation.");
      return;
    }
    setLoader(true);
    try {
      const { id, title, department_id } = newDesignation;

      if (!department_id || !title || !id) return;

      const resp = await axiosInstance.put(`/setting/designation/${id}`, {
        title,
        department_id,
      });

      if (resp.status === 200) {
        OnClose(); // Close modal and refresh list
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="p-4 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
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
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        <div>
          <Select
            value={newDesignation.department_id?.toString()}
            onValueChange={(value) => {
              const selected = departmentsList.find(
                (dept) => dept.id.toString() === value
              );
              setNewDesignation({
                ...newDesignation,
                department_id: selected?.id,
                department: selected?.name,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departmentsList.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department_id && (
            <p className="text-red-500 text-sm mt-1">{errors.department_id}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={OnClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loader}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {loader ? "saving data" : "Update Designation"}
        </Button>
      </div>
    </div>
  );
}

export default UpdateDesignationForm;
