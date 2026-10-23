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
  FolderTree
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
      <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-2xl">
        <CardHeader className="border-b border-[#E1D4C7]/60 pb-5">
          <CardTitle className="flex items-center space-x-3 text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
            <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
              <FolderTree className="h-5 w-5" />
            </span>
            <div>
              <span>Document Management</span>
              <p className="text-xs text-[#2E2E2E]/60 font-sans normal-case tracking-normal mt-0.5 font-normal">
                Organize employee document types, compliance categories, and proof requirements
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Add New Document */}
          <div className="p-5 bg-[#F5ECE4]/70 border border-[#E1D4C7] rounded-2xl shadow-sm">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#734425] mb-4">
              Add New Document Category
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Input
                className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
                name="type"
                placeholder="Document Category Name"
                value={newDocument.type}
                onChange={handleChange}
              />

              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
            </div>
            <Button
              onClick={addDocument}
              disabled={loader}
              className="mt-4 bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md px-6 py-2.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loader ? "Saving data..." : "Save Document Category"}
            </Button>
          </div>

          {/* Existing Documents */}
          <div className="space-y-3">
            {listDocument?.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl hover:border-[#734425] transition-all shadow-sm"
              >
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#24130A]">{doc.type}</h4>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#734425] hover:bg-[#734425]/10 rounded-xl"
                    onClick={() => setSelectedDocument(doc)}
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
