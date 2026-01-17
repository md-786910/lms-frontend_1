import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoDataFound from "../../common/NoDataFound";
import ConfirmFn from "../../utility/confirmFn";
import { Edit3, Eye, EyeOff, Plus, Trash2, Users, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "../../api/authapi/authAPI";
import axiosInstance from "../../api/axiosInstance";
import { useFormValidation } from "../../hooks/useFormValidation";

const User = () => {
  const { toast } = useToast();
  const [listUser, setListUser] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [user, setUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [loader, setLoader] = useState(false);

  const initialValues = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
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
        });
        setShowAddModal(false);
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

  const getUser = async () => {
    try {
      const resp = await authAPI.getNewUser();
      if (resp.status == 200) {
        setListUser(resp.data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-blue-100 text-sm">Manage system access and HR users</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Registered Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listUser?.map((u) => (
                  <TableRow key={u.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-800">
                      {u.first_name} {u.last_name}
                    </TableCell>
                    <TableCell className="text-slate-600">{u.email}</TableCell>
                    <TableCell className="text-slate-600">{u.phone_number || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Input
                          type={visiblePasswords[u.id] ? "text" : "password"}
                          value={u.password_without_hash || "********"}
                          readOnly
                          className="h-8 w-40 bg-slate-50 text-xs font-mono"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-blue-600"
                          onClick={() => togglePasswordVisibility(u.id)}
                        >
                          {visiblePasswords[u.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          ConfirmFn({
                            onDelete: async () => {
                              try {
                                const resp = await axiosInstance.delete(
                                  `/user/new-user/${u?.id}`
                                );
                                if (resp?.status === 200) {
                                  getUser();
                                  toast({
                                    title: "User Deleted",
                                    description: "User has been removed successfully",
                                  });
                                }
                              } catch (error) {
                                console.log(error);
                                toast({
                                  title: "Error",
                                  description: "Failed to delete user",
                                  variant: "destructive",
                                });
                              }
                            },
                            text_no: "Cancel",
                            text_yes: "Delete",
                            title: "Delete User",
                            message: "Are you sure you want to delete this user?",
                            warning: true,
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {listUser?.length === 0 && (
              <div className="py-12">
                 <NoDataFound />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-5 w-5 text-blue-600" />
               </div>
               Add New User
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="John"
                  value={user.first_name}
                  onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs">{errors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Doe"
                  value={user.last_name}
                  onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                placeholder="john.doe@example.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="+1 234 567 890"
                value={user.phone_number}
                onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Password <span className="text-red-500">*</span></Label>
              <Input
                type="password"
                placeholder="********"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
            
            <Button
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleSubmit}
              disabled={loader}
            >
              {loader ? "Creating..." : "Create User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default User;
