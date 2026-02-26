import React from "react";
import { useOutletContext } from "react-router-dom";
import { Label } from "@/components/ui/label";
import NoDataFound from "../../../common/NoDataFound";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { LockKeyhole } from "lucide-react";

function BasicInfo() {
  const { basicInfo, loading } = useOutletContext();

  if (!basicInfo) {
    return <NoDataFound />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-8">
      <div className="space-y-4">
        <label htmlFor="name" className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Full Name</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {basicInfo.first_name} {basicInfo.last_name}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label htmlFor="email" className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Email Address</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {basicInfo.email}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label htmlFor="phone" className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Phone Number</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {basicInfo.phone_number}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label htmlFor="dateOfBirth" className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Date of Birth</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {basicInfo.date_of_birth
            ? new Date(basicInfo.date_of_birth).toLocaleDateString()
            : "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Gender</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
          {basicInfo.gender || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Marital Status</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
          {basicInfo.martial_status || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

export default BasicInfo;
