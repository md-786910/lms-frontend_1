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
      icon: <Mail className="h-5 w-5" />,
      accentBg: "bg-blue-100 text-blue-700",
    },
    {
      label: "Phone number",
      value: contactValue(basicInfo?.phone_number),
      icon: <Phone className="h-5 w-5" />,
      accentBg: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Location",
      value: locationLabel,
      icon: <MapPin className="h-5 w-5" />,
      accentBg: "bg-violet-100 text-violet-700",
    },
  ];

  const workStats = [
    {
      label: "Employee ID",
      value: basicInfo?.employee_no ?? (loading ? "Loading..." : "N/A"),
      icon: <User className="h-6 w-6" />,
      iconBg: "bg-sky-100 text-sky-700",
    },
    {
      label: "Designation",
      value: designationTitle,
      icon: <Briefcase className="h-6 w-6" />,
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Department",
      value: departmentName,
      icon: <MapPin className="h-6 w-6" />,
      iconBg: "bg-violet-100 text-violet-700",
    },
    {
      label: "Date of Joining",
      value: profileJoinedLabel,
      icon: <Calendar className="h-6 w-6" />,
      iconBg: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header Card */}
      <Card className="border border-[#E1D4C7]/30 shadow-xl rounded-2xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-12 md:col-span-8 space-y-2">
              <span className="inline-block text-[11px] font-heading font-bold tracking-widest text-[#E1D4C7] uppercase bg-white/10 px-3 py-1 rounded-full">
                Personal Profile
              </span>
              <h1 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-white">{fullName}</h1>
              <p className="text-white/85 font-medium text-sm font-sans">
                {designationTitle} • {departmentName}
              </p>
              <p className="text-xs text-[#E1D4C7] font-sans tracking-widest uppercase">{basicInfo?.employee_no || "Employee ID"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Card */}
      <Card className="border border-[#E1D4C7] shadow-sm rounded-2xl overflow-hidden bg-[#FAF6F2] min-h-[600px]">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-[320px,1fr] p-5 md:p-6">
            {/* Left Sidebar - Profile Section */}
            <div className="flex flex-col gap-6">
              {/* Avatar Card */}
              <div className="relative overflow-hidden rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] px-6 py-8 shadow-sm">
                <div className="relative z-10 space-y-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#E1D4C7] bg-[#24130A] shadow-xl">
                      {basicInfo?.profile ? (
                        <img
                          src={basicInfo.profile}
                          alt={`${basicInfo.first_name} ${basicInfo.last_name}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-heading font-bold text-white">
                          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : profileInitials || <User className="h-6 w-6" />}
                        </div>
                      )}
                      {avatarUploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#24130A]/80 text-[#FAF6F2] backdrop-blur-sm">
                          <Loader2 className="h-9 w-9 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">{fullName}</h2>
                      <p className="text-xs font-sans text-[#734425] mt-0.5 font-medium">
                        {designationTitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-sans text-[#2E2E2E]/70">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#E1D4C7] bg-[#F5ECE4] px-3 py-1">
                        <CalendarDays className="h-3.5 w-3.5 text-[#734425]" />
                        Joined {profileJoinedLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#E1D4C7] bg-[#F5ECE4] px-3 py-1">
                        <User className="h-3.5 w-3.5 text-[#C26819]" />
                        ID {basicInfo?.employee_no ?? "—"}
                      </span>
                    </div>
                  </div>

                  {!readOnly && (
                    <div className="flex flex-col gap-2 text-sm">
                      <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E1D4C7] bg-[#F5ECE4] px-4 py-2.5 text-center font-heading font-bold uppercase tracking-wider text-xs text-[#734425] hover:bg-[#FAF6F2] transition-all shadow-sm">
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
                          className="w-full justify-center rounded-xl border-[#E1D4C7] text-xs font-heading font-semibold uppercase tracking-wider text-[#2E2E2E]/70 hover:bg-red-50 hover:text-red-600"
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
              <div className="rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] p-5 shadow-sm">
                <div className="space-y-3">
                  {contactItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-xl border border-[#E1D4C7]/60 bg-[#F5ECE4]/70 px-4 py-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#734425]/10 text-[#734425] border border-[#E1D4C7] shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#734425]">{item.label}</p>
                        <p className="text-sm font-semibold text-[#24130A] mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content Area - Tabs and Content */}
            <div className="flex flex-col gap-6">
              {/* Tabs Navigation */}
              <div className="rounded-2xl bg-[#FAF6F2] border border-[#E1D4C7] shadow-sm p-3">
                <TabsList className="flex gap-2.5 bg-transparent p-0 w-full overflow-x-auto whitespace-nowrap">
                  {employeeProfileTab.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex-shrink-0 group inline-flex items-center gap-2 rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-[#2E2E2E] shadow-sm transition hover:border-[#734425] hover:bg-[#FAF6F2] data-[state=active]:border-[#734425] data-[state=active]:bg-[#734425] data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] group-data-[state=active]:border-white/20 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                        <tab.icon className="h-3.5 w-3.5" />
                      </span>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tab Content Container */}
              <div className="min-h-[300px] md:min-h-[400px] rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] p-5 md:p-6 shadow-sm">
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
      <section className="rounded-2xl border border-[#E1D4C7] bg-[#FAF6F2] p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#E1D4C7] bg-[#F5ECE4]/70 p-4 shadow-sm hover:border-[#734425] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#734425]/10 text-[#734425] border border-[#E1D4C7]">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#734425]">{stat.label}</p>
                  <p className="text-base font-heading font-bold text-[#24130A] mt-0.5">{stat.value}</p>
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
          <div className="relative w-full max-w-sm rounded-2xl bg-[#FAF6F2] p-6 shadow-2xl space-y-4 border border-[#E1D4C7]">
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
