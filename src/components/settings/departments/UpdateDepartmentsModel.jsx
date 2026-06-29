import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import "react-quill/dist/quill.snow.css";
import { Settings as SettingsIcon, Edit3 } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { useFormValidation } from "../../../hooks/useFormValidation";

function UpdateDepartmentsForm(props) {
  const [loader, setLoader] = useState(false);
  const {
    data: { id, name, description },
    OnClose,
  } = props;
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

  const handleSubmit = async () => {
    const isValid = formValidation(["name", "description"], newDepartment);
    console.log(isValid);

    if (!isValid) {
      console.error("Please fill all required fields for the department.");
      return;
    }
    setLoader(true);
    try {
      const { name, description } = newDepartment;
      if (!id) {
        throw new Error("Id is required");
      }
      const resp = await axiosInstance.put(`/setting/department/${id}`, {
        name,
        description,
      });
      if (resp.status == 200) {
        OnClose();
      } else {
        // alert
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setNewDepartment({
      name,
      description,
    });
  }, [props]);

  return (
    <>
      <div className="p-4 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
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
              className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-graphik"
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
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" onClick={() => OnClose()} className="rounded-xl shadow-sm border-slate-200 flex items-center border py-2 px-4 text-sm font-graphik font-medium text-slate-900 bg-[#FFFFFF] hover:bg-[#F0F0F0] cursor-pointer transition ease-in-out duration-300">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit()}
          disabled={loader}
          className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-graphik"
        >
          <Edit3 className="h-4 w-4" />
          {loader ? "saving data..." : "Update Department"}
        </Button>
      </div>
    </>
  );
}

export default UpdateDepartmentsForm;
