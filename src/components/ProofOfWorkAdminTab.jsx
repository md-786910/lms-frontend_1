import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import NoDataFound from "../common/NoDataFound";
import { proofOfWorkApi } from "../api/proofOfWorkApi";
import { useSocketContext } from "../contexts/SocketContext";
import {
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Loader2,
  XCircle,
} from "lucide-react";

const WORK_TYPE_LABELS = {
  remote: "Remote Work",
  overtime: "Overtime",
  special_assignment: "Special Assignment",
  task_completion: "Task Completion",
};

const WORKING_HOURS_LABELS = {
  half_day: "Half Day",
  full_day: "Full Day",
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
};

const ProofOfWorkAdminTab = ({ employeeId }) => {
  const { toast } = useToast();
  const { setUpdateDashboard } = useSocketContext();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [reviewingId, setReviewingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectComment, setRejectComment] = useState("");

  const fetchSubmissions = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const response = await proofOfWorkApi.getEmployeeSubmissions(employeeId);
      setSubmissions(response?.data?.data || []);
    } catch (error) {
      toast({
        title: "Could not load Proof of Work",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [employeeId]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
      const matchesType = typeFilter === "all" || submission.work_type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [submissions, statusFilter, typeFilter]);

  const reviewSubmission = async (submission, status, managerComment = "") => {
    setReviewingId(submission.id);
    try {
      if (status === "approved") {
        await proofOfWorkApi.approveSubmission(submission.id, { manager_comment: managerComment });
      } else {
        await proofOfWorkApi.rejectSubmission(submission.id, { manager_comment: managerComment });
      }
      toast({
        title: `Proof of Work ${status}`,
        description: "The employee has been notified.",
      });
      setRejectTarget(null);
      setRejectComment("");
      await fetchSubmissions();
      setUpdateDashboard(Math.random());
    } catch (error) {
      toast({
        title: "Review failed",
        description: error?.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="p-6 border border-[#E1D4C7] rounded-2xl shadow-sm bg-[#FAF6F2] font-sans space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-heading font-extrabold uppercase tracking-tight text-[#2E2E2E]">Proof of Work</h3>
          <p className="text-xs font-sans text-slate-500 font-medium">
            Review evidence submitted by this employee.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44 h-11 border-[#E1D4C7] bg-[#FAF6F2] font-sans text-sm text-[#2E2E2E] rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
              <SelectItem value="all" className="focus:bg-[#F5ECE4] focus:text-[#734425]">All Status</SelectItem>
              <SelectItem value="pending" className="focus:bg-[#F5ECE4] focus:text-[#734425]">Pending</SelectItem>
              <SelectItem value="approved" className="focus:bg-[#F5ECE4] focus:text-[#734425]">Approved</SelectItem>
              <SelectItem value="rejected" className="focus:bg-[#F5ECE4] focus:text-[#734425]">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-56 h-11 border-[#E1D4C7] bg-[#FAF6F2] font-sans text-sm text-[#2E2E2E] rounded-xl">
              <SelectValue placeholder="Work Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#FAF6F2] border-[#E1D4C7]">
              <SelectItem value="all" className="focus:bg-[#F5ECE4] focus:text-[#734425]">All Types</SelectItem>
              {Object.entries(WORK_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="focus:bg-[#F5ECE4] focus:text-[#734425]">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-[#734425]" />
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <NoDataFound title="No proof of work submissions found" />
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="border border-[#E1D4C7] rounded-2xl shadow-sm bg-[#FAF6F2]">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-heading font-bold text-[#2E2E2E]">{submission.title}</h4>
                      <Badge className={`capitalize border ${statusStyles[submission.status] || statusStyles.pending}`}>
                        {submission.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span>{WORK_TYPE_LABELS[submission.work_type] || submission.work_type}</span>
                      <span>{WORKING_HOURS_LABELS[submission.working_hours] || submission.working_hours || "Full Day"}</span>
                      <span>Applied {dayjs(submission.createdAt).format("D MMM YYYY")}</span>
                      <span>Work date {dayjs(submission.work_date).format("D MMM YYYY")}</span>
                    </div>
                  </div>
                  {submission.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        className="bg-[#734425] hover:bg-[#5D361D] text-white font-heading font-bold rounded-xl"
                        disabled={reviewingId === submission.id}
                        onClick={() => reviewSubmission(submission, "approved")}
                      >
                        {reviewingId === submission.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 font-heading font-bold rounded-xl"
                        disabled={reviewingId === submission.id}
                        onClick={() => setRejectTarget(submission)}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                <p className="rounded-xl border border-[#E1D4C7]/60 bg-[#F5ECE4]/70 p-3 text-sm font-medium leading-relaxed text-[#2E2E2E]">
                  {submission.description}
                </p>

                {submission.manager_comment && (
                  <div className="rounded-xl border border-[#E1D4C7]/60 bg-[#F5ECE4]/70 p-3 text-sm text-slate-600">
                    <span className="font-heading font-bold text-[#734425]">Manager comment: </span>
                    {submission.manager_comment}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {(submission.attachments || []).map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.file?.file_path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 px-3 py-2 text-xs font-semibold text-[#734425] hover:bg-[#FAF6F2]"
                    >
                      <FileCheck2 className="h-4 w-4 text-[#734425]" />
                      {attachment.file?.file_name || `File #${attachment.file_id}`}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(rejectTarget)} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="bg-[#FAF6F2] border-[#E1D4C7] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-[#2E2E2E]">Reject Proof of Work</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="font-heading font-semibold text-[#2E2E2E]">Manager Comment</Label>
            <Textarea
              value={rejectComment}
              onChange={(event) => setRejectComment(event.target.value)}
              placeholder="Explain what evidence or detail is missing."
              rows={4}
              className="border-[#E1D4C7] bg-[#F5ECE4]/50 focus:border-[#734425] rounded-xl text-[#2E2E2E]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#E1D4C7] bg-[#F5ECE4] text-[#734425] hover:bg-[#FAF6F2] rounded-xl" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
              disabled={!rejectComment.trim() || reviewingId === rejectTarget?.id}
              onClick={() => reviewSubmission(rejectTarget, "rejected", rejectComment.trim())}
            >
              {reviewingId === rejectTarget?.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProofOfWorkAdminTab;
