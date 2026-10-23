import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from "../../../common/NoDataFound";
import { LockKeyhole } from "lucide-react";

function PersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const resp = await empProfileApi.getPersonal();
        if (resp?.status === 200) {
          setPersonalInfo(resp.data?.data || {});
        }
      } catch (error) {
        console.error("Error fetching personal info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  if (!personalInfo) {
    return <NoDataFound />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6 font-sans">
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Emergency Contact Name</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {personalInfo.emergency_contact_person || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Emergency Contact Phone</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {personalInfo.emergency_contact_number || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Relationship</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {personalInfo.emergency_contact_relationship || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Blood Group</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {personalInfo.blood_group || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Medical Conditions</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] capitalize flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {personalInfo.medical_conditions || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Hobbies & Interests</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] capitalize flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {personalInfo.hobbies || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
