import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Save, Eye, EyeOff } from "lucide-react";
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
            <Card className="border border-border/50 shadow-sm max-w-2xl">
                <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <Lock className="h-5 w-5 text-primary" />
                        <span>Security Settings</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={passwordData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
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
                                <p className="text-destructive text-sm font-medium">{errors.password}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_password"
                                    value={passwordData.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
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
                                <p className="text-destructive text-sm font-medium">{errors.confirm_password}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loader}
                            className="shadow-lg shadow-primary/20"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {loader ? "Updating..." : "Update Password"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default ResetPassword;
