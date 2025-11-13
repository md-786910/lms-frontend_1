import React from "react";
import { useOutletContext } from "react-router-dom";
import { Label } from "@/components/ui/label";
import NoDataFound from "../../../common/NoDataFound";
import LoadingSpinner from "../../../components/LoadingSpinner";

function BasicInfo() {
  const { basicInfo, loading } = useOutletContext();

  if (!basicInfo) {
    return <NoDataFound />;
  }

  return (
    <div className="space-y-4 mt-6 p-4 border rounded-md shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {basicInfo.first_name} {basicInfo.last_name}
          </p>
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">{basicInfo.email}</p>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {basicInfo.phone_number}
          </p>
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {basicInfo.date_of_birth
              ? new Date(basicInfo.date_of_birth).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <Label>Gender</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {basicInfo.gender || "N/A"}
          </p>
        </div>
        <div>
          <Label>Marital Status</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {basicInfo.martial_status || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BasicInfo;
