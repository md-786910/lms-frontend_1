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

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
};

const ProofOfWorkAdminTab = ({ employeeId }) => {
  const { toast } = useToast();
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
    <div className="p-6 border border-gray-100 rounded-xl shadow-sm bg-white font-graphik space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Proof of Work</h3>
          <p className="text-sm font-medium text-slate-500">
            Review evidence submitted by this employee.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44 h-11 border-slate-200 font-graphik">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-56 h-11 border-slate-200 font-graphik">
              <SelectValue placeholder="Work Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(WORK_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <NoDataFound title="No proof of work submissions found" />
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="border border-slate-100 rounded-xl shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-bold text-slate-900">{submission.title}</h4>
                      <Badge className={`capitalize border ${statusStyles[submission.status] || statusStyles.pending}`}>
                        {submission.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span>{WORK_TYPE_LABELS[submission.work_type] || submission.work_type}</span>
                      <span>Applied {dayjs(submission.createdAt).format("D MMM YYYY")}</span>
                      <span>Work date {dayjs(submission.work_date).format("D MMM YYYY")}</span>
                    </div>
                  </div>
                  {submission.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={reviewingId === submission.id}
                        onClick={() => reviewSubmission(submission, "approved")}
                      >
                        {reviewingId === submission.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50"
                        disabled={reviewingId === submission.id}
                        onClick={() => setRejectTarget(submission)}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                <p className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm font-medium leading-relaxed text-slate-700">
                  {submission.description}
                </p>

                {submission.manager_comment && (
                  <div className="rounded-lg border border-slate-100 bg-white p-3 text-sm text-slate-600">
                    <span className="font-bold text-slate-900">Manager comment: </span>
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
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <FileCheck2 className="h-4 w-4 text-emerald-600" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Proof of Work</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Manager Comment</Label>
            <Textarea
              value={rejectComment}
              onChange={(event) => setRejectComment(event.target.value)}
              placeholder="Explain what evidence or detail is missing."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
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
