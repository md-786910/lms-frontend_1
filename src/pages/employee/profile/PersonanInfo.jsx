import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { empProfileApi } from "../../../api/employee/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import NoDataFound from "../../../common/NoDataFound";

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!personalInfo) {
    return <NoDataFound />;
  }

  return (
    <div className="space-y-4 mt-6 p-4 border rounded-md shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Emergency Contact Name</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {personalInfo.emergency_contact_person || "N/A"}
          </p>
        </div>
        <div>
          <Label>Emergency Contact Phone</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {personalInfo.emergency_contact_number || "N/A"}
          </p>
        </div>
        <div>
          <Label>Relationship</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {personalInfo.emergency_contact_relationship || "N/A"}
          </p>
        </div>
        <div>
          <Label>Blood Group</Label>
          <p className="mt-1 p-2 bg-slate-50 rounded-md">
            {personalInfo.blood_group || "N/A"}
          </p>
        </div>
      </div>
      <div>
        <Label>Medical Conditions</Label>
        <p className="mt-1 p-2 bg-slate-50 rounded-md">
          {personalInfo.medical_conditions || "N/A"}
        </p>
      </div>
      <div>
        <Label>Hobbies & Interests</Label>
        <p className="mt-1 p-2 bg-slate-50 rounded-md">
          {personalInfo.hobbies || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default PersonalInfo;
