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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-8">
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Emergency Contact Name</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {personalInfo.emergency_contact_person || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Emergency Contact Phone</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {personalInfo.emergency_contact_number || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Relationship</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {personalInfo.emergency_contact_relationship || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Blood Group</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {personalInfo.blood_group || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Medical Conditions</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
          {personalInfo.medical_conditions || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 capitalize tracking-wider block">Hobbies & Interests</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
          {personalInfo.hobbies || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
