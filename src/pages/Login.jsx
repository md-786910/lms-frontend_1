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

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

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
    <div className="landing-shell min-h-screen bg-[#eef2ff] text-[#0f172a]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center justify-center overflow-hidden px-4 py-12 md:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-28 -right-24 h-80 w-80 rounded-[220px] bg-[#CBEFFF]/40 blur-[140px]" />
            <div className="absolute bottom-[-60px] left-6 h-[520px] w-[520px] rounded-[260px] bg-white/70 blur-[180px]" />
          </div>
        <div className="relative z-10 w-full">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="floating-badge border-slate-300 text-[#1f2b56] bg-white/80">
                  Secure Portal
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/company")}
                  className="text-[#CBEFFF] bg-[#222875] rounded-full border border-slate-200 px-4 py-4 text-xs font-semibold tracking-[0.35em] shadow-sm shadow-slate-300/40 transition hover:border-[#CBEFFF]"
                >
                  <ArrowLeft className="h-4 w-4 " /> Back to site
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[26px] bg-white shadow-[0_40px_70px_rgba(15,23,42,0.25)]">
                  <Building2 className="h-6 w-6 text-[#5f7be7]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-[#111743]">
                    Leanport HR
                  </p>
                  <p className="text-sm text-slate-500">
                    Leave management for modern teams
                  </p>
                </div>
              </div>
              <h1 className="landing-h1 max-w-3xl text-[#0f172a]">
                Sign in to Leanport HR
              </h1>
              <p className="landing-body leading-relaxed max-w-2xl text-[#1b2b56]">
                Access the same workforce, payroll, and compliance controls that
                power the public marketing site—now behind a secure,
                industry-grade portal.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  "Live Insights",
                  "Curated Notifications",
                  "End-to-end security",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.35em] text-[#5f7be7] shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Card className="relative z-10 max-w-lg overflow-hidden rounded-[32px] border border-white/60 bg-white/95 shadow-[0_35px_80px_rgba(15,23,42,0.16)] backdrop-blur">
                <div className="pointer-events-none absolute inset-0 scale-[1.05] rounded-[32px] bg-white/80 opacity-80" />
                <div className="relative z-10">
                  <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="landing-h2 landing-h2-dark text-[#0f172a]">
                      Welcome back
                    </CardTitle>
                    <CardDescription className="landing-body landing-body-dark text-[#1f2b56]">
                      Enter your credentials to unlock your dashboards and
                      automation workflows.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-10 pt-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-[#0f172a]"
                        >
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
                            className="pl-10 h-14 rounded-2xl border border-[#d5def5] bg-white/90 text-[#0f172a]"
                            placeholder="you@company.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-rose-600">{errors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold text-[#0f172a]"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-[#6b7bd6]" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="pl-10 pr-10 h-14 rounded-2xl border border-[#d5def5] bg-white/90 text-[#0f172a]"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-5 text-[#6b7bd6] hover:text-[#0f172a]"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-rose-600">
                            {errors.password}
                          </p>
                        )}
                      </div>
                      {apiError && (
                        <Alert
                          className="border-rose-200 bg-rose-50 text-rose-700"
                          onClick={() => setApiError("")}
                        >
                          <AlertDescription className="text-rose-700">
                            {apiError}
                          </AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-4">
                        <Button
                          type="submit"
                          className="w-full rounded-2xl bg-[#5f7be7] text-white font-semibold h-14"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                        <div className="text-center">
                          <button
                            type="button"
                            className="text-sm font-semibold uppercase tracking-[0.35em] text-[#222875] hover:text-[#1b1b68]"
                            onClick={() => navigate("/forgot-password")}
                          >
                            Forgot password?
                          </button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
