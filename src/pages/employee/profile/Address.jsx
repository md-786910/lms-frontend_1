import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from "../../../common/NoDataFound";

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
    <div className="space-y-4 mt-6 p-4 border rounded-md shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Street Address</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {addressInfo.street || "N/A"}
          </p>
        </div>
        <div>
          <Label>City</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {addressInfo.city || "N/A"}
          </p>
        </div>
        <div>
          <Label>State</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {addressInfo.state || "N/A"}
          </p>
        </div>
        <div>
          <Label>ZIP Code</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {addressInfo.zip_code || "N/A"}
          </p>
        </div>
        <div>
          <Label>Country</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {/* {addressInfo.country || "N/A"} */}
            India
          </p>
        </div>
      </div>
      <div>
        <Label>Permanent Address</Label>
        <p className="mt-1 p-2 bg-slate-50 rounded-md">
          {addressInfo.permanent_address || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default Address;
