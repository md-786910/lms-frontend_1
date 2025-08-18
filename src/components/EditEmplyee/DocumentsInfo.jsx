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
import { Eye, Trash2 } from "lucide-react";
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
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-md bg-white border shadow-sm">
        {/* Document Type */}
        <div className="space-y-1">
          <Label
            htmlFor="docType"
            className="text-sm font-medium text-gray-700"
          >
            Document Type
          </Label>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentType.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File Upload */}
        <div className="space-y-1">
          <Label
            htmlFor="docFile"
            className="text-sm font-medium text-gray-700"
          >
            Upload File{" "}
            <span className="text-xs text-gray-500">(PDF, JPG, PNG)</span>
          </Label>
          <Input
            id="docFile"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full text-sm text-gray-600"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Add Button */}
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleAddDocument}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition"
          >
            + Add Document
          </Button>
        </div>
      </div>

      {/* Unsaved Files */}
      {Array.isArray(documents) && documents.some((doc) => doc.isPending) && (
        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-semibold text-yellow-700 border-b pb-1">
            Unsaved Files
          </h3>
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
                  className="border rounded-md shadow-md p-4 flex flex-col md:flex-row items-start md:items-center justify-between bg-yellow-50 hover:bg-yellow-100 transition"
                >
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-yellow-900 flex items-center gap-2">
                      {index + 1}. {docType}
                      <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
                        Pending
                      </span>
                    </div>
                    <div>
                      {doc.previewUrl ? (
                        /\.(jpg|jpeg|png)$/i.test(doc.file.name) ? (
                          <img
                            src={doc.previewUrl}
                            alt={doc.file.name}
                            className="h-24 w-auto object-contain border rounded"
                          />
                        ) : (
                          <span className="text-sm">{doc.file.name}</span>
                        )
                      ) : (
                        <span className="text-sm text-red-500">
                          No preview available
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 md:mt-0 border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteDocument(doc)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
        </div>
      )}

      {/* Uploaded Documents */}
      {Array.isArray(documents) && documents.some((doc) => !doc.isPending) && (
        <div className="space-y-4 mt-10">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
            Uploaded Documents
          </h3>
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
                  className="flex items-center justify-between border rounded-md p-4 shadow-sm bg-white hover:bg-gray-50 transition"
                >
                  {/* File Info */}
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {index + 1}. {docType} - {fileName}
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-3">
                    {/* View */}
                    {filePath && (
                      <a
                        href={filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="View Document"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteDocument(doc)}
                      title="Delete Document"
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {documents.length === 0 && <NoDataFound />}
    </div>
  );
};

export default DocumentsForm;
