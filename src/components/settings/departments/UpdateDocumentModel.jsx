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
      <div className="p-4 bg-slate-50 ">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <Input
            placeholder="Document Name"
            name="type"
            value={newDocument.type}
            onChange={handleChange}
          />
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => OnClose()}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loader}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {loader ? "saving data..." : "Update Document"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default UpdateDocumentModel;
