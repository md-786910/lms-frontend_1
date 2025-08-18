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
import UpdateDocumentModel from "./departments/UpdateDocumentModel";
import NoDataFound from "../../common/NoDataFound";
import { useFormValidation } from "../../hooks/useFormValidation";

function Documents({ value }) {
  const [loader, setLoader] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [listDocument, setListDocument] = useState([]);
  const [newDocument, setNewDocument] = useState({
    type: "",
  });

  const initialValues = {
    type: "",
  };

  const validationSchema = {
    type: [{ type: "required", message: "Document name is required" }],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({
      ...newDocument,
      [name]: value,
    });
  };

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const addDocument = async () => {
    const isValid = formValidation(["type"], newDocument);
    console.log(isValid);

    if (!isValid) {
      console.error("Please fill all required fields for the document.");
      return;
    }
    setLoader(true);
    try {
      const { type } = newDocument;
      const resp = await axiosInstance.post("/setting/document-category", {
        type,
      });
      if (resp.status === 200) {
        getDocumentDetails();
      } else {
        // alert
      }
    } catch (error) {
      // alert
      console.log(error);
    } finally {
      setNewDocument({ type: "" });
      setLoader(false);
    }
  };

  const getDocumentDetails = async () => {
    try {
      const response = await axiosInstance.get(`/setting/document-category`);
      if (response.status == 200) {
        const data = response.data?.data;
        setListDocument(Array.isArray(data) ? data : []);
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
    getDocumentDetails();
  }, []);

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Document Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Department */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800 mb-4">
              Add New Document
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <Input
                name="type"
                placeholder="Document Name"
                value={newDocument.type}
                onChange={handleChange}
              />

              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type}</p>
              )}
            </div>
            <Button
              onClick={addDocument}
              disabled={loader}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loader ? "saving data.." : "Save Document Details"}
            </Button>
          </div>

          {/* Existing Departments */}
          <div className="space-y-4">
            {listDocument?.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-slate-800">{doc.type}</h4>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDocument(doc)}
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
                              `/setting/document-category/${doc?.id}`
                            );
                            if (resp?.status === 200) {
                              getDocumentDetails();
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

          {listDocument?.length == 0 && <NoDataFound />}
        </CardContent>
      </Card>
      {selectedDocument && (
        <CustomeModel
          open={!!selectedDocument}
          title="Update Department"
          OnClose={(props) => {
            setSelectedDocument(props);
          }}
        >
          <UpdateDocumentModel
            data={selectedDocument}
            OnClose={(props) => {
              setSelectedDocument(null);
              getDocumentDetails();
            }}
          />
        </CustomeModel>
      )}
    </>
  );
}

export default Documents;
