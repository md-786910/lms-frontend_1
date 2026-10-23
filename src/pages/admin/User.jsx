import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NoDataFound from "../../common/NoDataFound";
import ConfirmFn from "../../utility/confirmFn";
import { Edit3, Eye, Plus, Trash2, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "../../api/authapi/authAPI";
import axiosInstance from "../../api/axiosInstance";
import { useFormValidation } from "../../hooks/useFormValidation";

const User = () => {
  const { toast } = useToast();
  const [listUser, setListUser] = useState([]);
  const [user, setUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [loader, setLoader] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  const initialValues = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  };

  const validationSchema = {
    first_name: [{ type: "required", message: "First name is required" }],
    last_name: [{ type: "optional", message: "Last name is required" }],
    email: [
      { type: "required", message: "Email is required" },
      { type: "email", message: "Invalid email format" },
    ],
    password: [{ type: "required", message: "Password is required" }],
    phone_number: [{ type: "optional", message: "Phone number is required" }],
  };

  const { errors, formValidation } = useFormValidation(
    initialValues,
    validationSchema
  );

  const validationUserSection = () => {
    return formValidation(
      ["first_name", "last_name", "phone_number", "email", "password"],
      user
    );
  };
  // save
  const handleSubmit = async () => {
    const isValid = validationUserSection();
    if (!isValid) {
      console.error("Please fill all required fields.");
      return;
    }
    setLoader(true);
    try {
      const { email, password, first_name } = user;
      if (!email || !password || !first_name) {
        return toast({
          title: "Error",
          description: "Please fill the required fields",
          variant: "destructive",
        });
      }
      const res = await authAPI.addNewUser(user);
      if (res.status == 201) {
        getUser();
        toast({
          title: "New user created",
          description: "User created successfully",
          //   variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoader(false);
      setUser({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone_number: "",
      });
    }
  };

  //   get user
  const getUser = async () => {
    const resp = await authAPI.getNewUser();
    if (resp.status == 200) {
      setListUser(resp.data?.data);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="space-y-6 mb-7">
      <Card className="border border-[#E1D4C7]/30 shadow-xl rounded-2xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-12 md:col-span-8 space-y-2">
              <span className="inline-block text-[11px] font-heading font-bold tracking-widest text-[#E1D4C7] uppercase bg-white/10 px-3 py-1 rounded-full">
                Administration
              </span>
              <h1 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-white">
                User Management
              </h1>
              <p className="text-white/80 font-sans text-sm">
                Manage system users, access credentials, and login permissions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-6 bg-[#FAF6F2] border border-[#E1D4C7] rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
              Create System User
            </h2>
            <p className="text-xs text-[#2E2E2E]/60 font-sans">
              Add new administrative and manager credentials to the platform
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425] mb-2 block">First name *</Label>
            <Input
              className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/70 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              placeholder="First name"
              name="first name"
              value={user.first_name}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425] mb-2 block">Last name</Label>
            <Input
              className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/70 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              placeholder="Last name"
              name="last name"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425] mb-2 block">Phone number</Label>
            <Input
              className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/70 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              placeholder="Phone number"
              name="phone number"
              value={user.phone_number}
              onChange={(e) =>
                setUser({ ...user, phone_number: e.target.value })
              }
            />
            {errors.phone_number && (
              <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
            )}
          </div>
          <div>
            <Label className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425] mb-2 block">Email *</Label>
            <Input
              className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/70 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              placeholder="Email address"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425] mb-2 block">Password *</Label>
            <Input
              className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/70 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
              placeholder="Initial password"
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
        </div>
        <Button
          className="mt-6 bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md transition-all px-6 py-2.5 flex items-center gap-2"
          onClick={() => handleSubmit()}
        >
          <Plus className="h-4 w-4" />
          {loader ? "Saving data..." : "Add User"}
        </Button>
      </div>

      {/* Existing Users */}
      <div className="space-y-4">
        {listUser?.map((dept) => (
          <div
            key={dept.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-[#E1D4C7] bg-[#FAF6F2] rounded-2xl gap-4 hover:border-[#734425] transition-all shadow-sm"
          >
            <div>
              <h4 className="font-heading font-bold text-base text-[#24130A]">
                {dept.first_name + " " + (dept.last_name || "")}
              </h4>
              <p className="text-sm font-sans text-[#2E2E2E]/70 mt-0.5">{dept.email}</p>
            </div>
            <div className="flex space-x-2 items-center">
              <div className="flex items-center">
                <Label className="text-xs font-heading font-bold text-[#734425] uppercase tracking-wider mr-2">Password</Label>
                <Input
                  className="h-9 border border-[#E1D4C7] bg-[#F5ECE4]/70 rounded-xl mx-2 focus:border-[#734425] transition-all text-xs"
                  placeholder="password"
                  type={`${viewPassword ? "text" : "password"}`}
                  name="password"
                  readOnly
                  value={dept.password_without_hash}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#734425] hover:bg-[#734425]/10 rounded-xl"
                  onClick={() => {
                    setViewPassword(!viewPassword);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 rounded-xl"
                onClick={() => {
                  ConfirmFn({
                    onDelete: async () => {
                      try {
                        const resp = await axiosInstance.delete(
                          `/user/new-user/${dept?.id}`
                        );
                        if (resp?.status === 200) {
                          getUser();
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    },
                    text_no: "Cancel",
                    text_yes: "Delete",
                  });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {listUser?.length == 0 && <NoDataFound />}
    </div>
  );
};

export default User;
