import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, FileUp, Loader2, X } from "lucide-react";
import { proofOfWorkApi } from "../api/proofOfWorkApi";

const WORK_TYPES = [
  { value: "overtime", label: "Overtime" },
  { value: "special_assignment", label: "Special Assignment" },
];

const WORKING_HOURS = [
  { value: "half_day", label: "Half Day" },
  { value: "full_day", label: "Full Day" },
];

const ProofOfWorkModal = ({ onClose, onSuccess }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [workDate, setWorkDate] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!workType) nextErrors.workType = "Work type is required";
    if (!workingHours) nextErrors.workingHours = "Working hours is required";
    if (!workDate) nextErrors.workDate = "Work date is required";
    if (!description.trim()) nextErrors.description = "Description is required";
    if (!files.length) nextErrors.files = "At least one evidence file is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const uploadFiles = async () => {
    const fileIds = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await proofOfWorkApi.uploadEvidence(formData);
      const uploadedFileId = response?.data?.fileIds?.[0]?.file_id;
      if (!uploadedFileId) {
        throw new Error(`Could not upload ${file.name}`);
      }
      fileIds.push(uploadedFileId);
    }
    return fileIds;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fileIds = await uploadFiles();
      await proofOfWorkApi.createSubmission({
        title: title.trim(),
        work_type: workType,
        working_hours: workingHours,
        work_date: workDate,
        description: description.trim(),
        file_ids: fileIds,
      });
      toast({
        title: "Proof of Work Submitted",
        description: "Your submission has been sent for review.",
      });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error?.response?.data?.message || error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-h-[95vh] flex flex-col overflow-hidden bg-[#FAF6F2]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white p-5 md:p-6 shadow-md border-b border-[#734425]/40 flex-shrink-0">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-12 md:col-span-9 space-y-1">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-[#F5ECE4] flex items-center justify-center shadow-inner">
                <FileUp className="h-5 w-5 text-[#F5ECE4]" />
              </span>
              <div>
                <h2 className="text-xl md:text-2xl font-heading font-extrabold uppercase tracking-tight text-white">
                  Apply for Proof of Work
                </h2>
                <p className="text-xs md:text-sm font-medium text-white/80 font-sans">
                  Submit work details and evidence for admin review.
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 flex md:justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl hover:bg-white/20 bg-white/10 text-white border border-white/20 transition-all"
              disabled={submitting}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-6 space-y-5 bg-[#F5ECE4]/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">
              Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Completed remote support shift"
              className="h-12 rounded-xl border-[#E1D4C7] bg-[#FAF6F2] focus:ring-[#734425]/20 focus:border-[#734425] font-sans text-sm text-[#2E2E2E]"
            />
            {errors.title && <p className="text-xs font-bold text-rose-500 font-sans">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">
              Work Type <span className="text-rose-500">*</span>
            </Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="h-12 rounded-xl border-[#E1D4C7] bg-[#FAF6F2] focus:ring-[#734425]/20 focus:border-[#734425] font-sans text-sm text-[#2E2E2E]">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
                {WORK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="focus:bg-[#F5ECE4] focus:text-[#734425]">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.workType && <p className="text-xs font-bold text-rose-500 font-sans">{errors.workType}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">
              Work Date <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="date"
              value={workDate}
              onChange={(event) => setWorkDate(event.target.value)}
              className="h-12 rounded-xl border-[#E1D4C7] bg-[#FAF6F2] focus:ring-[#734425]/20 focus:border-[#734425] font-sans text-sm text-[#2E2E2E]"
            />
            {errors.workDate && <p className="text-xs font-bold text-rose-500 font-sans">{errors.workDate}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">
              Working Hours <span className="text-rose-500">*</span>
            </Label>
            <Select value={workingHours} onValueChange={setWorkingHours}>
              <SelectTrigger className="h-12 rounded-xl border-[#E1D4C7] bg-[#FAF6F2] focus:ring-[#734425]/20 focus:border-[#734425] font-sans text-sm text-[#2E2E2E]">
                <SelectValue placeholder="Select working hours" />
              </SelectTrigger>
              <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
                {WORKING_HOURS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="focus:bg-[#F5ECE4] focus:text-[#734425]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.workingHours && <p className="text-xs font-bold text-rose-500 font-sans">{errors.workingHours}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">
              Evidence Files <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="file"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
              className="h-12 rounded-xl border-[#E1D4C7] bg-[#FAF6F2] focus:ring-[#734425]/20 focus:border-[#734425] font-sans file:mr-4 file:rounded-lg file:border-0 file:bg-[#734425]/10 file:px-3 file:py-1.5 file:text-xs file:font-heading file:font-bold file:text-[#734425]"
            />
            {errors.files && <p className="text-xs font-bold text-rose-500 font-sans">{errors.files}</p>}
            {files.length > 0 && (
              <p className="text-xs font-semibold text-[#734425] font-sans">
                {files.length} file{files.length === 1 ? "" : "s"} selected
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-wider font-heading font-bold text-[#734425]">
            Description <span className="text-rose-500">*</span>
          </Label>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the completed work and reference the attached evidence."
            rows={5}
            className="rounded-xl border-[#E1D4C7] bg-[#FAF6F2] focus:ring-[#734425]/20 focus:border-[#734425] font-sans resize-none text-sm text-[#2E2E2E]"
          />
          {errors.description && <p className="text-xs font-bold text-rose-500 font-sans">{errors.description}</p>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#E1D4C7]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="w-full sm:w-auto rounded-xl border-[#E1D4C7] bg-[#F5ECE4] hover:bg-[#FAF6F2] text-[#2E2E2E] font-heading font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto rounded-xl bg-[#734425] hover:bg-[#5D361D] text-white font-heading font-bold px-6 shadow-lg shadow-[#734425]/20"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Submit Proof
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProofOfWorkModal;
