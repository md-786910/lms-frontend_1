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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { authAPI } from "../api/authapi/authAPI";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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

  // Validation schema
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
    <div className="min-h-screen bg-[#F5ECE4] flex flex-col lg:flex-row font-sans overflow-hidden">
      {/* Left Side: Visual/Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#24130A] items-center justify-center p-12 overflow-hidden border-r border-[#382012]">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C26819]/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#734425]/15 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-from-bottom-4 duration-700 font-heading">
            <ShieldCheck className="h-4 w-4 text-[#C26819]" />
            <span className="text-xs font-bold text-[#FAF6F2] tracking-widest uppercase">Enterprise Grade Security</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 font-heading uppercase">
            The Smartest Way to Manage <span className="text-[#C26819]">Your Workforce.</span>
          </h1>
          
          <p className="text-lg text-stone-300 mb-10 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-sans">
            Streamline leaves, track attendance, and boost productivity with our premium all-in-one HR solution.
          </p>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 font-sans">
            {[
              { icon: Zap, text: "Automated leave approval workflows", color: "text-[#C26819]" },
              { icon: Clock, text: "Real-time attendance & shift tracking", color: "text-[#C26819]" },
              { icon: CheckCircle2, text: "Industry-standard data encryption", color: "text-[#C26819]" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10 group-hover:border-white/20">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <span className="text-stone-200 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Quote or Trust Signal */}
        <div className="absolute bottom-12 left-12 right-12 py-6 border-t border-white/10 animate-in fade-in duration-1000 delay-500 font-sans">
          <p className="text-stone-400 text-sm font-medium">Trusted by leading companies worldwide</p>
          <div className="flex items-center space-x-8 mt-4 opacity-50 grayscale contrast-200">
            <Building2 className="h-6 w-6 text-white" />
            <div className="h-6 w-24 bg-white/20 text-white text-center rounded">abcdef</div>
            <div className="h-6 w-20 bg-white/20 text-white text-center rounded">abcdef</div>
            <div className="h-6 w-28 bg-white/20 text-white text-center rounded">abcdef</div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 bg-[#FAF6F2] relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8 right-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#734425] rounded-lg">
              <Building2 className="h-5 w-5 text-[#FAF6F2]" />
            </div>
            <span className="text-xl font-bold text-[#2E2E2E] font-heading">Leanport <span className="text-[#C26819]">HR</span></span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/company")}
              className="group -ml-2 text-stone-600 hover:text-[#734425] transition-colors font-sans"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to site
            </Button>
            <h2 className="text-3xl font-extrabold text-[#2E2E2E] tracking-tight font-heading uppercase">Welcome Back</h2>
            <p className="text-[#5A524C] font-medium font-sans">Please enter your details to sign in</p>
          </div>

          {apiError && (
            <Alert className="bg-rose-50 border-rose-100 text-rose-700 rounded-2xl animate-in zoom-in-95 duration-300">
              <AlertDescription className="flex items-center font-medium">
                <span className="mr-2 italic text-lg">!</span>
                {apiError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-[#2E2E2E] ml-1 font-heading uppercase">Email Address</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#734425] text-stone-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@company.com"
                    className={`h-14 pl-12 rounded-2xl border-2 border-[#E1D4C7] bg-white transition-all focus:bg-white focus:ring-4 focus:ring-[#C26819]/25 focus:border-[#734425] text-[#2E2E2E] font-medium placeholder:text-stone-400 ${errors.email ? 'border-rose-200' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs font-bold text-rose-500 ml-1 mt-1 animate-in fade-in">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-sm font-bold text-[#2E2E2E] font-heading uppercase">Password</Label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-bold text-[#734425] hover:text-[#C26819] transition-colors font-heading"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#734425] text-stone-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    className={`h-14 pl-12 pr-12 rounded-2xl border-2 border-[#E1D4C7] bg-white transition-all focus:bg-white focus:ring-4 focus:ring-[#C26819]/25 focus:border-[#734425] text-[#2E2E2E] font-medium placeholder:text-stone-400 ${errors.password ? 'border-rose-200' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs font-bold text-rose-500 ml-1 mt-1 animate-in fade-in">{errors.password}</p>}
              </div>
            </div>

            <div className="flex items-start space-x-3 ml-1">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={setRememberMe}
                className="border-2 border-[#E1D4C7] data-[state=checked]:bg-[#734425] data-[state=checked]:border-[#734425] rounded-md transition-all"
              />
              <Label htmlFor="remember" className="text-xs font-semibold text-stone-600 leading-tight cursor-pointer select-none">
                I agree to the <a href="#" className="text-[#734425] hover:text-[#C26819] underline">Terms of Service</a> and <a href="#" className="text-[#734425] hover:text-[#C26819] underline">Privacy Policy</a>.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#734425] hover:bg-[#5D361D] text-[#FAF6F2] rounded-2xl font-bold text-lg shadow-xl shadow-[#734425]/20 transition-all active:scale-[0.98] group relative overflow-hidden font-heading uppercase tracking-wide"
            >
              <span className={`flex items-center justify-center transition-all ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                Sign in to your account
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Footer info for desktop */}
        <div className="hidden lg:block absolute bottom-8 text-stone-400 text-xs font-medium tracking-wider uppercase font-sans">
          © {new Date().getFullYear()} Leanport HR • Built for excellence
        </div>
      </div>
    </div>
  );
};

export default Login;
