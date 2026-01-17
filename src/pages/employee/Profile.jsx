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
  CheckCircle,
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
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="h-32 bg-primary/10 w-full relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
              </div>
              <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center relative z-10">
                <div
                  className="relative group w-24 h-24 rounded-xl shadow-xl bg-card border-4 border-card mb-4 overflow-hidden"
                >
                  {basicInfo?.profile ? (
                    <img
                      src={basicInfo.profile}
                      alt={`${basicInfo.first_name} ${basicInfo.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl uppercase">
                      {loading ? (
                        <Loader2 className="animate-spin h-8 w-8" />
                      ) : (
                        <>
                          {basicInfo?.first_name?.[0]}
                          {basicInfo?.last_name?.[0]}
                        </>
                      )}
                    </div>
                  )}
                  {!readOnly && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm">
                      <div className="flex gap-2">
                        <label className="cursor-pointer p-2 rounded-full hover:bg-white/20 transition-colors text-white">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAvatarChange(e, basicInfo?.id)}
                            className="hidden"
                          />
                          <Edit3 className="w-4 h-4" />
                        </label>
                        {basicInfo?.profile && (
                          <button
                            className="p-2 rounded-full hover:bg-red-500/80 transition-colors text-white"
                            onClick={() => handleDeleteAvatar(basicInfo?.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-foreground">
                  {basicInfo?.first_name} {basicInfo?.last_name}
                </h3>
                <p className="text-sm text-primary font-medium mb-1">
                  {basicInfo?.designation?.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full mt-2">
                  <Briefcase className="h-3 w-3" />
                  {basicInfo?.department?.name}
                </div>
              </div>

              <div className="px-6 pb-6 space-y-4 pt-2">
                <div className="flex items-center justify-between py-3 border-t border-border/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Employee ID
                  </span>
                  <span className="text-sm font-semibold text-foreground">{basicInfo?.employee_no}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-border/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Joined
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {user?.date_of_joining
                      ? new Date(user.date_of_joining).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Information */}
        <div className="lg:col-span-8">
          <Card className="border border-border/50 shadow-sm h-full">
            <CardHeader className="border-b border-border/50 px-6 py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span>Profile Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full flex justify-start gap-2 bg-transparent p-0 mb-6 border-b border-border/50 rounded-none h-auto overflow-x-auto">
                  {employeeProfileTab.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.link.split('/').pop()}
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <NavLink
                        to={tab.link}
                        className="flex items-center gap-2"
                      >
                        {tab.icon}
                        <span>{tab.name}</span>
                      </NavLink>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="min-h-[400px]">
                  <Outlet
                    context={activeTab === "basic" ? { basicInfo, loading } : {}}
                  />
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
