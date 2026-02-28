import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, FileText, UploadCloud, Badge } from "lucide-react";
import { employeeAPI } from "../../api/employeeApi";
import NoDataFound from "../../common/NoDataFound";
import axiosInstance from "../../api/axiosInstance";

const documentTypes = [
  { label: "Aadhaar Card", value: "aadhaar" },
  { label: "PAN Card", value: "pan" },
  { label: "Matric Certificate", value: "matric" },
  { label: "Driving License", value: "license" },
];

const DocumentsForm = ({
  documents,
  setDocuments,
  documentType,
  employeeId,
  setNewDocs,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  if (!Array.isArray(documents)) {
    console.error("Expected documents to be an array but got:", documents);
    return <div>Error: Documents data is invalid.</div>;
  }

  const handleAddDocument = () => {
    if (selectedType && selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);

      const newDoc = {
        id: Date.now(),
        type: selectedType,
        file: selectedFile,
        previewUrl: previewUrl,
        isPending: true,
      };
      const newDoc1 = {
        document_category_id: selectedType,
        file: selectedFile,
        isPending: true,
      };

      setDocuments((prev) => [...prev, newDoc]);
      setNewDocs((prev) => [...prev, newDoc1]);

      setSelectedType("");
      setSelectedFile(null);
      const input = document.getElementById("docFile");
      if (input) input.value = "";
    } else {
      alert("Please select both document type and file");
    }
  };

  const handleDeleteDocument = async (doc) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmDelete) return;

    try {
      if (doc.isPending) {
        // Just remove from local state
        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      } else {
        // Call API to delete existing one
        await employeeAPI.deleteDocument(doc.id, employeeId);
        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Error deleting the document. Please try again.");
    }
  };
  const isImage = (fileName) => /\.(jpg|jpeg|png)$/i.test(fileName);
  const isPdf = (fileName) => /\.pdf$/i.test(fileName);
  return (
    <div className="space-y-8 font-montserrat">
      {/* Upload Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border border-gray-100 rounded-xl shadow-sm bg-white">
        {/* Document Type */}
        <div className="space-y-2">
          <Label
            htmlFor="docType"
            className="text-sm font-bold text-slate-700 font-montserrat uppercase tracking-wider"
          >
            Document Type *
          </Label>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger className="h-11 border-slate-200 focus:border-slate-900 transition-all font-montserrat rounded-md shadow-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="font-montserrat">
              {documentType.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label
            htmlFor="docFile"
            className="text-sm font-bold text-slate-700 font-montserrat uppercase tracking-wider"
          >
            File <span className="text-[10px] text-slate-400 font-normal">(PDF, JPG, PNG)</span> *
          </Label>
          <Input
            id="docFile"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat cursor-pointer file:font-bold file:text-slate-700 file:bg-slate-50 file:border-0 file:mr-4 file:h-full"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Add Button */}
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleAddDocument}
            className="w-full h-11 border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-lg transition-all font-montserrat font-bold uppercase tracking-wider"
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Unsaved Files */}
      {Array.isArray(documents) && documents.some((doc) => doc.isPending) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
            <h3 className="text-lg font-bold text-amber-700 font-montserrat uppercase tracking-wider">
              Unsaved Files
            </h3>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold">New</Badge>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {documents
              .filter((doc) => doc.isPending)
              .reverse()
              .map((doc, index) => {
                const docType =
                  documentTypes.find((d) => d.value === doc.type)?.label ||
                  "Unknown Document";

                return (
                  <div
                    key={doc.id || index}
                    className="border border-amber-100 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between bg-amber-50/30 hover:bg-amber-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          {docType}
                        </div>
                        <div className="text-xs text-slate-500 max-w-[200px] truncate">
                          {doc.file.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                      {doc.previewUrl && /\.(jpg|jpeg|png)$/i.test(doc.file.name) && (
                        <div className="h-14 w-20 border rounded-lg overflow-hidden bg-white shadow-sm">
                          <img src={doc.previewUrl} alt="preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-lg h-10 px-4"
                        onClick={() => handleDeleteDocument(doc)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Uploaded Documents */}
      {Array.isArray(documents) && documents.some((doc) => !doc.isPending) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-lg font-bold text-slate-700 font-montserrat uppercase tracking-wider">
              Uploaded Documents
            </h3>
            <Badge variant="outline" className="text-slate-400 border-slate-200 font-bold">{documents.filter(d => !d.isPending).length}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {documents
              .filter((doc) => !doc.isPending)
              .reverse()
              .map((doc, index) => {
                const docType =
                  doc.document_category?.type ||
                  documentTypes.find((d) => d.value === doc.type)?.label ||
                  "Unknown Document";

                const filePath = doc.file?.file_path || doc.previewUrl || null;
                const fileName =
                  doc.file?.file_name || doc.file?.name || "unknown";

                return (
                  <div
                    key={doc.id || index}
                    className="flex items-center justify-between border border-slate-100 rounded-xl p-5 bg-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                          {docType}
                        </div>
                        <div className="text-xs text-slate-400 font-medium truncate max-w-[250px]">
                          {fileName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {filePath && (
                        <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full">
                          <a href={filePath} target="_blank" rel="noopener noreferrer" title="View Document">
                            <Eye className="w-5 h-5" />
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full"
                        onClick={() => handleDeleteDocument(doc)}
                        title="Delete Document"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {documents.length === 0 && <div className="p-12"><NoDataFound /></div>}
    </div>
  );
};

export default DocumentsForm;
