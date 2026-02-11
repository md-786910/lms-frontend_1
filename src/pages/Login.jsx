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

const highlightPills = [
  "Live insights",
  "Human-centered security",
  "Curated notifications",
  "24/7 support",
];

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
    <div className="landing-shell min-h-screen bg-[#CBEFFF] text-[#2D5356]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-full items-center justify-center overflow-hidden px-4 py-10 md:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-20 h-80 w-80 rounded-[220px] bg-[#222875]/30 blur-[120px]" />
            <div className="absolute bottom-[-80px] left-8 h-[480px] w-[480px] rounded-[260px] bg-white/70 blur-[160px]" />
            <div className="absolute top-6 left-10 h-28 w-28 rounded-full border border-white/80 blur-sm" />
            <div className="absolute bottom-32 right-20 h-32 w-32 rounded-full border border-[#2D5356]/40 bg-transparent" />
          </div>
        <div className="relative z-10 max-w-[1580px] m-auto w-full ">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="floating-badge border-[#2D5356]/40 text-[#2D5356] bg-white/80">
                  Secure Portal
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/company")}
                  className="text-[#222875] bg-white/90 rounded-full border border-[#222875] px-4 py-1 text-[10px] uppercase tracking-[0.35em] font-semibold shadow-sm transition hover:border-[#2D5356]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to site
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
              <div className="grid gap-4 sm:grid-cols-2">
                {highlightPills.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#222875]/30 bg-white/90 px-5 py-4 text-sm font-semibold tracking-wide text-[#222875] shadow-[0_20px_50px_rgba(34,40,117,0.15)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Card className="relative z-10 max-w-lg overflow-hidden rounded-[36px] border border-white/70 bg-white/95 shadow-[0_45px_90px_rgba(34,40,117,0.18)]">
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
                          className="text-sm font-semibold text-[#2D5356]"
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
                          className="text-sm font-semibold text-[#2D5356]"
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
                          className="w-full rounded-2xl bg-[#222875] px-6 py-4 text-lg font-semibold text-white shadow-[0_15px_40px_rgba(34,40,117,0.35)] transition hover:bg-[#202898]"
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
