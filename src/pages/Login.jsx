import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFormValidation } from "../hooks/useFormValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { authAPI } from "../api/authapi/authAPI";
import MotionWrapper from "../components/MotionWrapper";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  //  Validation schema using your custom hook format
  const validationSchema = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "email", message: "Enter a valid email address." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minLength",
        value: 6,
        message: "Password must be at least 6 characters.",
      },
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
      password: "",
    },
    validationSchema
  );

  // Redirect if already authenticated
  if (user?.role) {
    return (
      <Navigate
        to={
          user.role === "admin" || user.role === "light_admin"
            ? "/admin/dashboard"
            : "/employee/dashboard"
        }
        replace
      />
    );
  }

  const onSubmit = async (formValues) => {
    setApiError("");
    try {
      const res = await authAPI.login(formValues);
      if (res.status) {
        const { user, token } = res.data;
        console.log({ user, token });
        setTimeout(() => {
          login(user, token);
          navigate(
            user?.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"
          );
          window.location.reload();
        }, 800);
      } else {
        setApiError(res.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <Button 
        variant="ghost" 
        className="absolute top-8 left-8 text-slate-400 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300 rounded-full px-4"
        onClick={() => navigate("/company")}
      >
        <ArrowLeft className="h-4 w-4" /> <span className="text-xs font-bold uppercase tracking-widest">Exit</span>
      </Button>

      <MotionWrapper className="w-full max-w-md p-4 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Leanport <span className="text-blue-500">HR</span>
          </h1>
          <p className="text-slate-400 mt-3 font-medium tracking-tight">Enterprise Infrastructure Access</p>
        </div>

        <Card className="border border-slate-800 shadow-2xl bg-[#0f172a]/80 backdrop-blur-2xl">
          <CardHeader className="space-y-1 pb-8 border-b border-slate-800/50">
            <CardTitle className="text-xl font-bold text-center text-white tracking-tight">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
              Authorization Required
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Terminal</Label>
                <div className="relative group focus-ring rounded-lg">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="pl-10 h-12 bg-slate-900/50 border-slate-800 focus:border-blue-500 text-white transition-all rounded-lg placeholder:text-slate-600"
                    placeholder="admin@leanport.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Key</Label>
                  <button
                    type="button"
                    className="text-[10px] text-blue-400 font-black uppercase tracking-widest hover:text-blue-300 transition-colors"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Recover
                  </button>
                </div>
                <div className="relative group focus-ring rounded-lg">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="pl-10 pr-10 h-12 bg-slate-900/50 border-slate-800 focus:border-blue-500 text-white transition-all rounded-lg placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors.password}</p>
                )}
              </div>

              {apiError && (
                <Alert variant="destructive" className="py-2 bg-red-500/10 border-red-500/20 rounded-lg">
                  <AlertDescription className="text-[11px] font-bold text-red-400 text-center uppercase tracking-tighter">
                    {apiError}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-xs font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Validating...</span>
                  </div>
                ) : (
                  "Authenticate"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
};

export default Login;
