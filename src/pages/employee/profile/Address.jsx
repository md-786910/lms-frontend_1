import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from "../../../common/NoDataFound";
import { LockKeyhole } from "lucide-react";

function Address() {
  const [addressInfo, setAddressInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddressInfo = async () => {
      try {
        const resp = await empProfileApi.getAddress();
        if (resp?.status === 200) {
          setAddressInfo(resp.data?.data || {});
        }
      } catch (error) {
        console.error("Error fetching address info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddressInfo();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!addressInfo) {
    return <NoDataFound />;
  }
  console.log("====================================");
  console.log(addressInfo);
  console.log("====================================");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-8">
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Street Address</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {addressInfo.street || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">City</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {addressInfo.city || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">State</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {addressInfo.state || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">ZIP Code</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between group hover:border-primary/50 transition-colors">
          {addressInfo.zip_code || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Country</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
          {/* {addressInfo.country || "N/A"} */}
          India
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Permanent Address</label>
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white capitalize flex items-center justify-between group hover:border-primary/50 transition-colors">
           {addressInfo.permanent_address || "N/A"}
          <LockKeyhole className="h-4 w-4 textbase text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

export default Address;
