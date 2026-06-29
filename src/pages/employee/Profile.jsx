import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  CalendarDays,
  Phone,
  Mail,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { empProfileApi } from "../../api/employee/profile";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const employeeProfileTab = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "address", label: "Address", icon: MapPin },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "personal", label: "Personal", icon: Heart },
  { id: "salary", label: "Salary", icon: DollarSign },
];

const Profile = ({ readOnly = false }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [basicInfo, setBasicInfo] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
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

  // Handle tab change and navigate
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/employee/profile/${tabId}`);
  };

  // Sync tab with URL on mount and when location changes
  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const currentSegment = segments[segments.length - 1] || "basic";
    const isValidTab = employeeProfileTab.some((tab) => tab.id === currentSegment);
    if (isValidTab) {
      setActiveTab(currentSegment);
    }
  }, [location.pathname]);

  const handleAvatarChange = async (event, employeeId) => {
    const file = event.target.files[0];
    if (!file) return;
    setAvatarUploading(true);

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
    } finally {
      setAvatarUploading(false);
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

  const formatDate = (value) => {
    if (!value) {
      return loading ? "Loading..." : "N/A";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return loading ? "Loading..." : "N/A";
    }
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fullName = [basicInfo?.first_name, basicInfo?.last_name].filter(Boolean).join(" ") || (loading ? "Loading..." : "Employee");
  const designationTitle = basicInfo?.designation?.title || (loading ? "Loading..." : "Employee");
  const departmentName = basicInfo?.department?.name || (loading ? "Loading..." : "General");
  const locationParts = [
    basicInfo?.address?.city,
    basicInfo?.address?.state,
    basicInfo?.address?.country,
    basicInfo?.city,
    basicInfo?.country,
  ].filter(Boolean);
  const locationLabel = locationParts.length ? locationParts.join(", ") : "Bangalore, India";
  const profileInitials = `${basicInfo?.first_name?.[0] || ""}${basicInfo?.last_name?.[0] || ""}`.trim().toUpperCase();
  const joinedLabel = formatDate(user?.date_of_joining);
  const profileJoinedLabel = formatDate(basicInfo?.date_of_joining);
  const contactValue = (value) => value || (loading ? "Loading..." : "Not provided");

  const contactItems = [
    {
      label: "Email address",
      value: contactValue(basicInfo?.email),
      icon: <Mail className="h-4 w-4" />,
      accentBg: "bg-blue-100 text-blue-700",
    },
    {
      label: "Phone number",
      value: contactValue(basicInfo?.phone_number),
      icon: <Phone className="h-4 w-4" />,
      accentBg: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Location",
      value: locationLabel,
      icon: <MapPin className="h-4 w-4" />,
      accentBg: "bg-violet-100 text-violet-700",
    },
  ];

  const workStats = [
    {
      label: "Employee ID",
      value: basicInfo?.employee_no ?? (loading ? "Loading..." : "N/A"),
      icon: <User className="h-5 w-5" />,
      iconBg: "bg-sky-100 text-sky-700",
    },
    {
      label: "Designation",
      value: designationTitle,
      icon: <Briefcase className="h-5 w-5" />,
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Department",
      value: departmentName,
      icon: <MapPin className="h-5 w-5" />,
      iconBg: "bg-violet-100 text-violet-700",
    },
    {
      label: "Date of Joining",
      value: profileJoinedLabel,
      icon: <Calendar className="h-5 w-5" />,
      iconBg: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header Card */}
      <Card className="border border-slate-200 shadow-lg rounded-md bg-slate-900 text-white">
        <CardContent className="p-5 md:p-7">
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-12 md:col-span-8 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-graphik text-[#FFFFFF]">{fullName}</h1>
              </div>
              <p className="text-[#FFFFFF] font-medium text-sm font-graphik">
                {designationTitle} • {departmentName}
              </p>
              <p className="text-xs text-[#FFFFFF] font-graphik tracking-wider">{basicInfo?.employee_no || "Employee ID"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Card */}
      <Card className="border border-slate-200 shadow-sm rounded-md overflow-hidden bg-white min-h-[600px]">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-[320px,1fr] p-4 md:p-6">
            {/* Left Sidebar - Profile Section */}
            <div className="flex flex-col gap-6">
              {/* Avatar Card */}
              <div className="relative overflow-hidden rounded-md border border-slate-200 bg-white px-6 py-8 shadow-[0_25px_60px_rgba(15,23,42,0.08)] transition dark:border-slate-700/50 dark:bg-slate-900/40">
                <div className="relative z-10 space-y-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center overflow-hidden rounded-2xl border border-white bg-slate-900 shadow-2xl">
                      {basicInfo?.profile ? (
                        <img
                          src={basicInfo.profile}
                          alt={`${basicInfo.first_name} ${basicInfo.last_name}`}
                          className="h-full w-full object-cover font-graphik"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-tight text-white">
                          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : profileInitials || <User className="h-6 w-6" />}
                        </div>
                      )}
                      {avatarUploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-slate-900 text-[#CBEFFF] backdrop-blur-sm">
                          <Loader2 className="h-9 w-9 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold font-graphik text-slate-900 dark:text-white">{fullName}</h2>
                      <p className="text-xs font-semibold font-graphik text-slate-500 dark:text-slate-400">
                        {designationTitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 font-graphik bg-slate-50 px-3 py-1 dark:border-slate-700/40 dark:bg-slate-800/40">
                        <CalendarDays className="h-3.5 w-3.5 text-[#047857]" />
                        Joined {profileJoinedLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 font-graphik bg-slate-50 px-3 py-1 dark:border-slate-700/40 dark:bg-slate-800/40">
                        <User className="h-3.5 w-3.5 text-[#047857]" />
                        ID {basicInfo?.employee_no ?? "—"}
                      </span>
                    </div>
                  </div>

                  {!readOnly && (
                    <div className="flex flex-col gap-2 text-sm">
                      <label className="flex w-full md:w-auto cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center font-semibold text-slate-600 transition hover:border-slate-300 dark:border-slate-700/40 dark:bg-slate-900/40 dark:text-slate-200 hover:bg-slate-500/10 ">
                        <Edit3 className="h-4 w-4" />
                        Update photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAvatarChange(e, basicInfo?.id)}
                          className="sr-only"
                        />
                      </label>
                      {basicInfo?.profile && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-center"
                          onClick={() => setShowRemoveConfirm(true)}
                        >
                          Remove photo
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info Card */}
              <div className="rounded-md border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition font-graphik dark:border-slate-700/50 dark:bg-slate-900/40">
                <div className="space-y-3">
                  {contactItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 font-graphik bg-slate-50/70 px-4 py-3 dark:border-slate-700/40 dark:bg-slate-900/40"
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.accentBg} shadow-sm`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[12px] font-graphik font-medium text-slate-500">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900 font-graphik dark:text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content Area - Tabs and Content */}
            <div className="flex flex-col gap-6">
              {/* Tabs Navigation */}
              <div className="rounded-md bg-white shadow-sm p-4">
                <TabsList className="flex gap-3 bg-transparent p-0 w-full overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal md:flex-wrap -mx-2 px-2">
                  {employeeProfileTab.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex-shrink-0 group inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-100 hover:bg-slate-50 font-graphik data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] group-data-[state=active]:border-transparent group-data-[state=active]:bg-[#e2e8f0] group-data-[state=active]:text-[#047857]">
                        <tab.icon className="h-4 w-4" />
                      </span>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tab Content Container */}
              <div className="min-h-[300px] md:min-h-[400px] rounded-md border border-slate-100 bg-slate-50/70 p-4 md:p-6 shadow-sm transition dark:border-slate-700/50 dark:bg-slate-900/40">
                <TabsContent value="basic" className="mt-0">
                  <Outlet context={{ basicInfo, loading }} />
                </TabsContent>

                <TabsContent value="address" className="mt-0">
                  <Outlet context={{ basicInfo, loading }} />
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                  <Outlet context={{ basicInfo, loading }} />
                </TabsContent>

                <TabsContent value="personal" className="mt-0">
                  <Outlet context={{ basicInfo, loading }} />
                </TabsContent>

                <TabsContent value="salary" className="mt-0">
                  <Outlet context={{ basicInfo, loading }} />
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </Card>

      {/* Work Stats Section */}
      <section className="rounded-md border border-slate-200 bg-white px-6 py-4 shadow-[0_30px_70px_rgba(15,23,42,0.08)] transition dark:border-slate-700/50 dark:bg-slate-900/40">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm transition hover:border-slate-200 dark:border-slate-700/40 dark:bg-slate-900/40"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] capitalize tracking-[0.4em] text-slate-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Remove Avatar Confirmation Dialog */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-200"
            onClick={() => setShowRemoveConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-rose-500" />
              <h3 className="text-lg font-semibold text-slate-900">
                Confirm removal
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete your profile picture?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="ghost"
                onClick={() => setShowRemoveConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowRemoveConfirm(false);
                  handleDeleteAvatar(basicInfo?.id);
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Permanently delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
