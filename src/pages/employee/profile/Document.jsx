import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from "../../../common/NoDataFound";

function Document() {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const resp = await empProfileApi.getDocument();
        if (resp?.status === 200) {
          setDocuments(resp.data?.data || {});
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!documents.length) {
    return <NoDataFound />;
  }

  return (
    <div className="space-y-4 mt-6 p-4 border rounded-md shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
          >
            {/* Left Side - Document Info */}
            <div>
              <Label className="font-semibold text-slate-700">
                {doc.document_category?.type || "Unknown Document"}
              </Label>
              <p className="mt-1 text-sm text-slate-600">
                Document Number:{" "}
                {doc.document_number || (
                  <span className="italic text-slate-400">Not Provided</span>
                )}
              </p>
            </div>

            {/* Right Side - Download Button */}
            {doc.file?.file_path && (
              <a
                href={doc.file.file_path}
                download={doc.file.file_name || "document"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md shadow-md hover:from-blue-700 hover:to-purple-700 transition"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Document;
