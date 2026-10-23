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
            <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-2xl mt-5">
                <CardHeader className="border-b border-[#E1D4C7]/60 pb-5">
                    <CardTitle className="flex items-center space-x-3 text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
                        <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
                            <KeySquare className="h-5 w-5" />
                        </span>
                        <div>
                            <span>Reset Password</span>
                            <p className="text-xs text-[#2E2E2E]/60 font-sans normal-case tracking-normal mt-0.5 font-normal">
                                Update your account security credentials with a strong and unique password
                            </p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">New Password</Label>
                            <div className="relative">
                                <Input
                                    className="h-11 border border-[#E1D4C7] bg-white rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#734425]/60 hover:text-[#734425] focus:outline-none"
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
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    className="h-11 border border-[#E1D4C7] bg-white rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#734425]/60 hover:text-[#734425] focus:outline-none"
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
                                <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={loader}
                        className="bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md px-6 py-2.5"
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
