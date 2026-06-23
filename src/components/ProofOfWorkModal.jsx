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
  { value: "remote", label: "Remote Work" },
  { value: "overtime", label: "Overtime" },
  { value: "special_assignment", label: "Special Assignment" },
  { value: "task_completion", label: "Task Completion" },
];

const ProofOfWorkModal = ({ onClose, onSuccess }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState("");
  const [workDate, setWorkDate] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!workType) nextErrors.workType = "Work type is required";
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
    <div className="w-full max-h-[95vh] flex flex-col overflow-hidden">
      <Card className="bg-slate-900 text-white rounded-none border-0">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-12 md:col-span-9 space-y-1">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-emerald-700">
                  <FileUp className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-semibold font-montserrat text-white tracking-tight">
                    Apply for Proof of Work
                  </h2>
                  <p className="text-sm font-medium text-white/90 font-montserrat">
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
                className="rounded-md bg-slate-100 text-slate-700 hover:bg-white"
                disabled={submitting}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-6 space-y-5 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold tracking-wide text-slate-600 font-montserrat">
              Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Completed remote support shift"
              className="h-12 rounded-xl border-slate-200 font-montserrat"
            />
            {errors.title && <p className="text-xs font-semibold text-rose-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold tracking-wide text-slate-600 font-montserrat">
              Work Type <span className="text-rose-500">*</span>
            </Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200 font-montserrat">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                {WORK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.workType && <p className="text-xs font-semibold text-rose-500">{errors.workType}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold tracking-wide text-slate-600 font-montserrat">
              Work Date <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="date"
              value={workDate}
              onChange={(event) => setWorkDate(event.target.value)}
              className="h-12 rounded-xl border-slate-200 font-montserrat"
            />
            {errors.workDate && <p className="text-xs font-semibold text-rose-500">{errors.workDate}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold tracking-wide text-slate-600 font-montserrat">
              Evidence Files <span className="text-rose-500">*</span>
            </Label>
            <Input
              type="file"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
              className="h-12 rounded-xl border-slate-200 font-montserrat file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700"
            />
            {errors.files && <p className="text-xs font-semibold text-rose-500">{errors.files}</p>}
            {files.length > 0 && (
              <p className="text-xs font-semibold text-slate-500 font-montserrat">
                {files.length} file{files.length === 1 ? "" : "s"} selected
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold tracking-wide text-slate-600 font-montserrat">
            Description <span className="text-rose-500">*</span>
          </Label>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the completed work and reference the attached evidence."
            rows={5}
            className="rounded-xl border-slate-200 font-montserrat resize-none"
          />
          {errors.description && <p className="text-xs font-semibold text-rose-500">{errors.description}</p>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="w-full sm:w-auto rounded-xl border-slate-200 font-montserrat"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-montserrat"
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
