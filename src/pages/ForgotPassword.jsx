import { useState } from "react";
import { useFormValidation } from "../hooks/useFormValidation";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/authapi/authAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Building2,
  ArrowRight,
  Send
} from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-montserrat overflow-hidden">
      {/* Left Side: Visual/Branding Section (Consistent with Login) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] items-center justify-center p-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#0F172A]/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0F172A]/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck className="h-4 w-4 text-[#90D7F5]" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">Premium HR Suite</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Secure Password <span className="text-[#90D7F5]">Recovery.</span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Don't worry, it happens to the best of us. We'll help you get back into your account safely and quickly.
          </p>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            {[
              { icon: Send, text: "Instant reset instructions via email", color: "text-[#90D7F5]" },
              { icon: ShieldCheck, text: "Time-sensitive secure reset links", color: "text-[#90D7F5]" },
              { icon: CheckCircle2, text: "Simple 3-step recovery process", color: "text-[#90D7F5]" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10 group-hover:border-white/20">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <span className="text-slate-200 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info for desktop visual side */}
        <div className="absolute bottom-12 left-12 right-12 py-6 border-t border-white/10 animate-in fade-in duration-1000 delay-500">
          <p className="text-slate-400 text-sm font-medium">Leanport HR • Advanced Workforce Solutions</p>
        </div>
      </div>

      {/* Right Side: Forgot Password Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 bg-white relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8 right-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#222875] rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#222875]">Leanport <span className="text-slate-400">HR</span></span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="group -ml-2 text-slate-500 hover:text-[#222875] transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to login
            </Button>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h2>
            <p className="text-slate-500 font-medium">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {apiMessage && (
            <Alert className={`${isSuccess ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'} rounded-2xl animate-in zoom-in-95 duration-300`}>
              <AlertDescription className="flex items-center font-medium">
                {isSuccess ? (
                  <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-600" />
                ) : (
                  <span className="mr-2 italic text-lg font-bold">!</span>
                )}
                {apiMessage}
              </AlertDescription>
            </Alert>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#222875] text-slate-400">
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
                    className={`h-14 pl-12 rounded-2xl border-2 border-slate-100 bg-slate-50 transition-all focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-[#222875] text-slate-900 font-medium placeholder:text-slate-400 ${errors.email ? 'border-rose-200' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs font-bold text-rose-500 ml-1 mt-1 animate-in fade-in">{errors.email}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-[#222875] hover:bg-[#1a1f5c] text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] group relative overflow-hidden"
              >
                <span className={`flex items-center justify-center transition-all ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                  Send Reset Link
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <div className="pt-4 space-y-4">
              <Button
                onClick={() => navigate("/login")}
                className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]"
              >
                Return to Login
              </Button>
              <p className="text-center text-sm text-slate-500 font-medium px-4">
                Didn't receive the email? Check your spam folder or 
                <button 
                  onClick={() => {
                    setIsSuccess(false);
                    setApiMessage("");
                  }}
                  className="ml-1 font-bold text-[#222875] hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="text-center pt-4">
            <p className="text-slate-500 text-sm font-medium">
              Remembered your password? 
              <button 
                onClick={() => navigate("/login")}
                className="ml-2 font-bold text-[#222875] hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer info for desktop */}
        <div className="hidden lg:block absolute bottom-8 text-slate-400 text-xs font-medium tracking-wider uppercase">
          © {new Date().getFullYear()} Leanport HR • Recovery Portal
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
