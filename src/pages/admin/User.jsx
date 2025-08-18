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
    password: "",
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-600">Manage users to your HR system</p>
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-lg">
        <h3 className="font-medium text-slate-800 mb-4">Add New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>First name *</Label>
            <Input
              placeholder="first name"
              name="first name"
              value={user.first_name}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name}</p>
            )}
          </div>
          <div>
            <Label>Last name</Label>
            <Input
              placeholder="first name"
              name="last name"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name}</p>
            )}
          </div>{" "}
          <div>
            <Label>Phone number</Label>
            <Input
              placeholder="first name"
              name="phone number"
              value={user.phone_number}
              onChange={(e) =>
                setUser({ ...user, phone_number: e.target.value })
              }
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm">{errors.phone_number}</p>
            )}
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <Label>Password *</Label>
            <Input
              placeholder="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>{" "}
        </div>
        <Button
          className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => handleSubmit()}
        >
          <Plus className="h-4 w-4 mr-2" />
          {loader ? "saving data..." : "Add User"}
        </Button>
      </div>

      {/* Existing Departments */}
      <div className="space-y-4">
        {listUser?.map((dept) => (
          <div
            key={dept.id}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
          >
            <div>
              <h4 className="font-medium text-slate-800">
                {dept.first_name + " " + dept.last_name + ""}
              </h4>
              <p className="text-sm text-slate-500">{dept.email}</p>
            </div>
            <div className="flex space-x-2 items-center">
              <div className="flex items-center">
                <Label>password</Label>
                <Input
                  placeholder="password"
                  type={`${viewPassword ? "text" : "password"}`}
                  name="password"
                  value={dept.password_without_hash}
                  className="h-6 w-32 mx-2"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600"
                  onClick={() => {
                    setViewPassword(!viewPassword);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>{" "}
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
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
