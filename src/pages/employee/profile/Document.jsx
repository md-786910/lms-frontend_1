import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from "../../../common/NoDataFound";
import { Download, FileText } from "lucide-react";

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
    <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b bg-white/70 backdrop-blur">
        <FileText className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-800">
          Documents
        </h3>
      </div>

      {/* Content */}
      <div className="p-6">
        {documents.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
            <FileText className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">No documents available</p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              documents.length === 1
                ? "grid-cols-1 max-w-xl mx-auto"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-50 to-purple-50" />

                <div className="relative flex items-start justify-between gap-4">
                  {/* Left - Info */}
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      {doc.document_category?.type || "Unknown Document"}
                    </Label>

                    <p className="mt-1 text-sm text-slate-600">
                      Document Number:{" "}
                      {doc.document_number ? (
                        <span className="font-medium text-slate-700">
                          {doc.document_number}
                        </span>
                      ) : (
                        <span className="italic text-slate-400">
                          Not Provided
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Right - Download */}
                  {doc.file?.file_path && (
                    <a
                      href={doc.file.file_path}
                      download={doc.file.file_name || "document"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Document;
