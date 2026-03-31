import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { KeySquare, Save, Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

function ResetPassword() {
    const { user } = useAuth();
    const [loader, setLoader] = useState(false);
    const [passwordData, setPasswordData] = useState({
        password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!passwordData.password) {
            newErrors.password = "Password is required";
        } else if (passwordData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!passwordData.confirm_password) {
            newErrors.confirm_password = "Confirm password is required";
        } else if (passwordData.password !== passwordData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoader(true);
        try {
            // Determine endpoint based on role
            const endpoint = user?.role === "employee"
                ? "/employee/user/change-password"
                : "/user/change-password";

            const resp = await axiosInstance.post(endpoint, {
                password: passwordData.password,
                confirm_password: passwordData.confirm_password,
            });

            if (resp.status === 200) {
                toast.success("Password changed successfully");
                setPasswordData({
                    password: "",
                    confirm_password: "",
                });
            }
        } catch (error) {
            console.error("Password change failed:", error);
            toast.error(error?.response?.data?.message || "Failed to change password");
        } finally {
            setLoader(false);
        }
    };

    return (
        <>
            <Card className="border-0 shadow-md mt-5 rounded-md">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-slate-700 font-montserrat capitalize tracking-wider">
                        <span className="border-[#e2e8f0] bg-[#e2e8f0] text-[#047857] flex h-10 w-10 items-center justify-center rounded-md">
                            <KeySquare className="h-5 w-5" />
                        </span>
                        <span>Reset Password</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="password"  className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">New Password</Label>
                            <div className="relative">
                                <Input
                                    className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={passwordData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password" className="text-sm font-bold text-slate-700 font-montserrat capitalize tracking-wider">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    className="h-11 border border-slate-200 focus:border-slate-900 transition-all font-montserrat"
                                    id="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_password"
                                    value={passwordData.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <p className="text-red-500 text-sm">{errors.confirm_password}</p>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={loader}
                        className="border-slate-900 bg-slate-800 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/20 font-Montserrat"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {loader ? "Saving..." : "Save New Password"}
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}

export default ResetPassword;
