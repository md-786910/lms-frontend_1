import { useState } from "react";
import { useFormValidation } from "../hooks/useFormValidation";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/authapi/authAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [apiMessage, setApiMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validationSchema = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "email", message: "Enter a valid email address." },
    ],
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(
    {
      email: "",
    },
    validationSchema
  );

  const onSubmit = async (formValues) => {
    setApiMessage("");
    setIsSuccess(false);
    try {
      const res = await authAPI.forgotPassword(formValues);
      if (res.status) {
        setIsSuccess(true);
        setApiMessage(res.message || "Reset link sent. Please check your email.");
      } else {
        setApiMessage(res.message || "Failed to send reset link.");
      }
    } catch (error) {
      setApiMessage(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 text-[#1f2b56]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center rounded-full bg-white/80 px-4 py-1 text-xs font-semibold capitalize tracking-[0.5em] text-[#222875] shadow-sm shadow-[#222875]/20">
            Leanport HR
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#222875] to-[#2D5356] bg-clip-text text-transparent">
            Forgot Password
          </h1>
          <p className="text-sm text-[#1f2b56]">
            Enter your email to receive reset instructions
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-[#222875]">
              Reset your password
            </CardTitle>
            <CardDescription className="text-center text-[#2D5356]">
              We'll send a reset link to your email
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#2D5356]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#6b7bd6]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="pl-10 h-12 rounded-2xl border border-[#d5def5] bg-white/90 text-[#0f172a]"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-rose-600">{errors.email}</p>
                )}
              </div>

              {apiMessage && (
                <Alert className={isSuccess ? "border-green-200 bg-green-50" : "border-rose-200 bg-rose-50"}>
                  <AlertDescription className={isSuccess ? "text-green-700" : "text-rose-700"}>
                    {apiMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#222875] to-[#2D5356] text-white font-semibold shadow-[0_10px_30px_rgba(34,40,117,0.35)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  className="text-xs font-semibold capitalize tracking-[0.5em] text-[#222875]"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>

          <div className="border-t border-white/40 px-6 pb-6 pt-4 text-center text-xs capitalize tracking-[0.4em] text-[#2D5356]">
            <span>Secure Portal • SOC 2 • 24/7 Support</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
