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
    <div className="mt-6 rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white shadow-sm">
        <span className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F5ECE4]">
          <FileText className="h-4 w-4" />
        </span>
        <h3 className="text-base font-heading font-extrabold uppercase tracking-wide text-white">
          Documents
        </h3>
      </div>

      {/* Content */}
      <div className="p-6">
        {documents.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#5C5C5C]">
            <FileText className="h-10 w-10 mb-3 opacity-30 text-[#734425]" />
            <p className="text-sm font-medium">No documents available</p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              documents.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group relative overflow-hidden rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative flex items-start justify-between gap-4">
                  {/* Left - Info */}
                  <div>
                    <Label className="text-sm font-heading font-bold text-[#734425] uppercase tracking-wider">
                      {doc.document_category?.type || "Unknown Document"}
                    </Label>

                    <p className="mt-1 text-xs text-[#5C5C5C]">
                      Document Number:{" "}
                      {doc.document_number ? (
                        <span className="font-semibold text-[#2E2E2E]">
                          {doc.document_number}
                        </span>
                      ) : (
                        <span className="italic text-[#5C5C5C]/60">
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
                      className="inline-flex items-center gap-2 rounded-xl bg-[#734425] hover:bg-[#5D361D] px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:scale-105"
                    >
                      <Download className="h-3.5 w-3.5" />
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
