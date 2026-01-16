import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Trash2,
  Loader2,
  Check,
  CalendarDays,
  Phone,
  Mail,
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

      if (uploaded?.fileIds?.[0]?.file_path) {
        const newProfilePath = uploaded.fileIds[0].file_path;

        // update backend
        await empProfileApi.profilePic({ profile: newProfilePath });

        // update local state so UI refreshes
        setBasicInfo((prev) => ({
          ...prev,
          profile: newProfilePath,
        }));

        toast({
          title: "Avatar Updated",
          description: "Employee profile picture has been updated successfully.",
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

  const handleDeleteAvatar = async (employeeId) => {
    try {
      setLoading(true);
      await empProfileApi.profilePic({ profile: null });

      // update local state so UI refreshes
      setBasicInfo((prev) => ({
        ...prev,
        profile: null,
      }));

      toast({
        title: "Avatar Removed",
        description: "Employee profile picture has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast({
        title: "Delete Failed",
        description: "There was an issue removing the avatar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profile Information</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your personal information and preferences</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white rounded-md border border-border shadow-card p-8 flex flex-col items-center text-center group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-100"></div>
            <div className="relative z-10 w-24 h-24 bg-white shadow-md mb-3">
              <div className="w-full h-full overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
                {basicInfo?.profile ? (
                  <img
                    src={basicInfo.profile}
                    alt={`${basicInfo.first_name} ${basicInfo.last_name}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl rounded-md uppercase">
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        {basicInfo?.first_name?.[0]}
                        {basicInfo?.last_name?.[0]}
                      </>
                    )}
                  </div>
                )}
                {!readOnly && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-black bg-opacity-50 rounded-b-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <div className="relative flex items-center justify-center w-full h-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAvatarChange(e, basicInfo?.id)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        title="Change Avatar"
                      />
                      <Edit3 className="text-white w-4 h-4 z-10" />
                    </div>
                    {basicInfo?.profile && (
                      <div className="relative flex items-center justify-center w-full h-full border-l border-white border-opacity-20">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-full w-full hover:bg-red-600 rounded-none p-0 group/delete h-8"
                          onClick={() => handleDeleteAvatar(basicInfo?.id)}
                          title="Delete Avatar"
                        >
                          <Trash2 className="text-white w-4 h-4 group-hover/delete:scale-110 transition-transform" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{basicInfo?.first_name} {basicInfo?.last_name}</h2>
              <p className="text-gray-700 font-medium text-md mb-2">{basicInfo?.department?.name}</p>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-center text-xs text-slate-500">
                  <User className="h-4 w-4 text-base" />
                  <span>ID: <span className="font-bold text-slate-700 ">{basicInfo?.employee_no}</span></span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600 bg-slate-100 py-2.5 px-6 rounded-md border border-slate-100">
                  <CalendarDays className="h-4 w-4 text-base" />
                  <span>Joined: 
                    <span className="font-bold text-slate-700 dark:text-slate-200">{user?.date_of_joining
                      ? new Date(user.date_of_joining).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "N/A"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-md border border-border shadow-card overflow-hidden">
            <div className="py-4 px-6 border-b border-slate-100">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">Contact Info</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-base" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">Email Address</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white break-all">{basicInfo?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-base" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{basicInfo?.phone_number}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-base" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Bangalore, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Information */}
        <div className="lg:col-span-9 space-y-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 mb-5">
                {employeeProfileTab.map((tab, index) => {
                  return (
                    <TabsTrigger
                      key="index"
                      value="basic"
                      className="flex items-center space-x-2 "
                    >
                      <NavLink
                        to={tab.link}
                        className={({ isActive }) =>
                          `text-center w-full py-2 px-4 sm:px-8 rounded-md transition-colors whitespace-nowrap ${isActive
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
              <div className="bg-white rounded-md border border-border shadow-card p-6">
                <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-base"/>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Personal Information</h3>
                </div>
                <main className="h-[40vh] max-h-[60vh]">
                  <Outlet
                    context={activeTab === "basic" ? { basicInfo, loading } : {}}
                  />
                </main>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div className="bg-white rounded-md border border-bordershadow-card px-6 py-6">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Work Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Employee ID</p>
              <p className="font-bold text-slate-900 ">{basicInfo?.employee_no}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center gap-3 ">
            <div className="w-12 h-12 rounded-xl bg-green-50  text-green-600 flex items-center justify-center">
              <Briefcase className="h-6 w-6 mx-auto mb-2 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Designation</p>
              <p className="font-bold text-slate-900">{basicInfo?.designation?.title || "N/A"}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Department</p>
              <p className="font-bold text-slate-900">{basicInfo?.department?.name || "N/A"}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center gap-3 ">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Date of Joining</p>
              <p className="font-bold text-slate-900">{basicInfo?.date_of_joining
                  ? new Date(basicInfo.date_of_joining).toLocaleDateString()
                  : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
