import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "react-quill/dist/quill.snow.css";
import { Settings as SettingsIcon, Edit3 } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { useFormValidation } from "../../../hooks/useFormValidation";

function UpdateDocumentModel(props) {
  const [loader, setLoader] = useState(false);
  const {
    data: { id, type },
    OnClose,
  } = props;

  const [newDocument, setNewDocument] = useState({
    type: "",
  });

  const initialValues = {
    // Departments
    type: "",
  };

  const validationSchema = {
    // Departments validation rules
    type: [{ type: "required", message: "Document name is required" }],
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewDocument({
      ...newDocument,
      [name]: value,
    });
  };

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const handleSubmit = async () => {
    const isValid = formValidation(["type"], newDocument);
    console.log(isValid);

    if (!isValid) {
      console.error("Please fill all required fields for the document.");
      return;
    }
    setLoader(true);
    try {
      const { type } = newDocument;

      if (!id) {
        throw new Error("Id is required");
      }

      const resp = await axiosInstance.put(`/setting/document-category/${id}`, {
        type,
      });

      if (resp.status === 200) {
        OnClose();
      } else {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setNewDocument({
      type,
    });
  }, [props]);

  return (
    <>
      <div className="p-5 bg-[#FAF6F2] rounded-2xl border border-[#E1D4C7]">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <Input
            className="h-11 border border-[#E1D4C7] bg-white focus:ring-[#734425]/20 focus:border-[#734425] transition-all font-sans text-sm text-[#2E2E2E] rounded-xl"
            placeholder="Document Name"
            name="type"
            value={newDocument.type}
            onChange={handleChange}
          />
          {errors.type && <p className="text-red-500 text-xs font-bold mt-1 font-sans">{errors.type}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            className="rounded-xl shadow-sm border border-[#E1D4C7] text-sm font-heading font-bold text-[#2E2E2E] bg-white hover:bg-[#F5ECE4] cursor-pointer transition ease-in-out duration-300"
            onClick={() => OnClose()}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loader}
            className="rounded-xl bg-[#734425] hover:bg-[#5D361D] text-white shadow-lg shadow-[#734425]/20 font-heading font-bold"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {loader ? "Saving data..." : "Update Document"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default UpdateDocumentModel;
