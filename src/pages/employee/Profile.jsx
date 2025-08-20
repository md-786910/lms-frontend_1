import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Heart,
  Edit3,
  DollarSign,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { empProfileApi } from "../../api/employee/profile";
import { useToast } from "@/hooks/use-toast";

const employeeProfileTab = [
  {
    id: 1,
    name: "Basic",
    link: "/employee/profile/basic",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 2,
    name: "Address",
    link: "/employee/profile/address",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    id: 3,
    name: "Documents",
    link: "/employee/profile/documents",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 4,
    name: "Personal",
    link: "/employee/profile/personal",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    id: 5,
    name: "Salary",
    link: "/employee/profile/salary",
    icon: <DollarSign className="h-4 w-4" />,
  },
];

const Profile = ({ readOnly = false }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [basicInfo, setBasicInfo] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBasicInfo = async () => {
      try {
        const resp = await empProfileApi.getProfile();
        if (resp?.status === 200) {
          setBasicInfo(resp.data?.data || {});
        }
      } catch (error) {
        console.error("Error fetching basic info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBasicInfo();
  }, []);

  const handleAvatarChange = async (event, employeeId) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploaded = await empProfileApi.uploadFile(formData);
      console.log(uploaded);

      if (uploaded?.fileIds?.[0]?.file_path) {
        const newProfilePath = uploaded.fileIds[0].file_path;

        // update backend
        await empProfileApi.profilePic(employeeId, { profile: newProfilePath });

        // update local state so UI refreshes
        setBasicInfo((prev) => ({
          ...prev,
          profile: newProfilePath,
        }));

        toast({
          title: "Avatar Updated",
          description:
            "Employee profile picture has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: "There was an issue uploading the avatar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-600">
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row lg:flex-col items-center justify-center text-center gap-4 ">
            <div
              className="relative group"
              style={{ width: "8rem", height: "8rem" }}
            >
              {basicInfo?.profile ? (
                <img
                  src={basicInfo.profile}
                  alt={`${basicInfo.first_name} ${basicInfo.last_name}`}
                  className="w-full h-full object-cover rounded-md border border-slate-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl rounded-md">
                  {basicInfo?.first_name?.[0]}
                  {basicInfo?.last_name?.[0]}
                </div>
              )}
              {!readOnly && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-black bg-opacity-50 rounded-b-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarChange(e, basicInfo?.id)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Edit3 className="text-white w-4 h-4 z-10" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 my-2">
                {basicInfo?.first_name} {basicInfo?.last_name}
              </h3>
              <p className="text-slate-600 mb-1">
                {basicInfo?.designation?.name}
              </p>
              <p className="text-sm text-slate-500 mb-4">
                {basicInfo?.department?.name}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>ID: {basicInfo?.employee_no}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>
                    Joined:{" "}
                    {user?.date_of_joining
                      ? new Date(user.date_of_joining).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Information */}
        <Card className="lg:col-span-3 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5">
                {employeeProfileTab.map((tab, index) => {
                  return (
                    <TabsTrigger
                      key="index"
                      value="basic"
                      className="flex items-center space-x-2"
                    >
                      <NavLink
                        to={tab.link}
                        className={({ isActive }) =>
                          `text-center py-2 px-4 sm:px-8 rounded-md transition-colors whitespace-nowrap ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                              : "bg-transparent hover:bg-gray-200"
                          }`
                        }
                      >
                        <span className="text-xs sm:text-sm">{tab.name}</span>
                      </NavLink>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              <Outlet
                context={activeTab === "basic" ? { basicInfo, loading } : {}}
              />
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Work Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            <span>Work Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              {/* <p className="text-sm text-slate-600">Employee ID</p> */}
              <p className="font-semibold text-slate-800">
                {basicInfo?.employee_no}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-green-600" />
              {/* <p className="text-sm text-slate-600">Position</p> */}
              <p className="font-semibold text-slate-800">
                {basicInfo?.designation?.title || "N/A"}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              {/* <p className="text-sm text-slate-600">Department</p> */}
              <p className="font-semibold text-slate-800">
                {basicInfo?.department?.name || "N/A"}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              {/* <p className="text-sm text-slate-600">Join Date</p> */}
              <p className="font-semibold text-slate-800">
                {basicInfo?.date_of_joining
                  ? new Date(basicInfo.date_of_joining).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
