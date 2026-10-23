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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6 font-sans">
      <div className="space-y-2">
        <label htmlFor="name" className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Full Name</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {basicInfo.first_name} {basicInfo.last_name}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Email Address</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {basicInfo.email}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Phone Number</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {basicInfo.phone_number}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="dateOfBirth" className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Date of Birth</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {basicInfo.date_of_birth
            ? new Date(basicInfo.date_of_birth).toLocaleDateString()
            : "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Gender</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] capitalize flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {basicInfo.gender || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Marital Status</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] capitalize flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {basicInfo.martial_status || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

export default BasicInfo;
