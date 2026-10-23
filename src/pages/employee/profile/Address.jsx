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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6 font-sans">
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Street Address</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {addressInfo.street || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">City</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {addressInfo.city || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">State</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {addressInfo.state || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">ZIP Code</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {addressInfo.zip_code || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Country</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] capitalize flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          India
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider block">Permanent Address</label>
        <div className="w-full bg-[#F5ECE4]/60 border border-[#E1D4C7] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E2E2E] capitalize flex items-center justify-between group hover:border-[#734425]/50 transition-colors shadow-sm">
          {addressInfo.permanent_address || "N/A"}
          <LockKeyhole className="h-4 w-4 text-[#734425]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

export default Address;
