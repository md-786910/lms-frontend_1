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
    <div className="min-h-screen bg-[#F5ECE4] flex flex-col lg:flex-row font-sans overflow-hidden text-[#2E2E2E]">
      {/* Left Side: Visual/Branding Section (Consistent with Login) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#24130A] items-center justify-center p-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#734425]/30 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#C26819]/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck className="h-4 w-4 text-[#C26819]" />
            <span className="text-xs font-heading font-bold text-[#F5ECE4] tracking-widest uppercase">Premium HR Suite</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-heading font-black text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 uppercase tracking-tight">
            Secure Password <span className="text-[#C26819]">Recovery.</span>
          </h1>
          
          <p className="text-lg text-[#F5ECE4]/80 mb-10 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Don't worry, it happens to the best of us. We'll help you get back into your account safely and quickly.
          </p>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            {[
              { icon: Send, text: "Instant reset instructions via email", color: "text-[#C26819]" },
              { icon: ShieldCheck, text: "Time-sensitive secure reset links", color: "text-[#C26819]" },
              { icon: CheckCircle2, text: "Simple 3-step recovery process", color: "text-[#C26819]" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10 group-hover:border-[#C26819]/40">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <span className="text-[#F5ECE4] font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info for desktop visual side */}
        <div className="absolute bottom-12 left-12 right-12 py-6 border-t border-white/10 animate-in fade-in duration-1000 delay-500">
          <p className="text-[#F5ECE4]/60 text-sm font-medium">Leanport HR • Advanced Workforce Solutions</p>
        </div>
      </div>

      {/* Right Side: Forgot Password Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 bg-[#FAF6F2] relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8 right-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#734425] rounded-xl shadow-md">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-heading font-black tracking-tight text-[#734425] uppercase">
              Leanport <span className="text-[#C26819]">HR</span>
            </span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="group -ml-2 text-[#734425] hover:text-[#C26819] hover:bg-[#734425]/5 transition-colors font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to login
            </Button>
            <h2 className="text-3xl font-heading font-extrabold text-[#2E2E2E] tracking-tight uppercase">Forgot Password?</h2>
            <p className="text-[#2E2E2E]/70 font-medium">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {apiMessage && (
            <Alert className={`${isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'} rounded-2xl animate-in zoom-in-95 duration-300`}>
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
                <Label htmlFor="email" className="text-sm font-bold text-[#2E2E2E] ml-1">Email Address</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#734425] text-[#2E2E2E]/40">
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
                    className={`h-14 pl-12 rounded-2xl border-2 border-[#E1D4C7] bg-white transition-all focus:bg-white focus:ring-4 focus:ring-[#C26819]/15 focus:border-[#734425] text-[#2E2E2E] font-medium placeholder:text-[#2E2E2E]/40 ${errors.email ? 'border-rose-400' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs font-bold text-rose-600 ml-1 mt-1 animate-in fade-in">{errors.email}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-[#734425] hover:bg-[#5D361D] text-white rounded-2xl font-heading font-bold text-base tracking-wider uppercase shadow-xl shadow-[#734425]/20 transition-all active:scale-[0.98] group relative overflow-hidden"
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
                className="w-full h-14 bg-[#E1D4C7]/60 hover:bg-[#E1D4C7] text-[#2E2E2E] rounded-2xl font-heading font-bold text-base uppercase tracking-wider transition-all active:scale-[0.98]"
              >
                Return to Login
              </Button>
              <p className="text-center text-sm text-[#2E2E2E]/70 font-medium px-4">
                Didn't receive the email? Check your spam folder or 
                <button 
                  onClick={() => {
                    setIsSuccess(false);
                    setApiMessage("");
                  }}
                  className="ml-1 font-bold text-[#734425] hover:text-[#C26819] hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="text-center pt-4">
            <p className="text-[#2E2E2E]/70 text-sm font-medium">
              Remembered your password? 
              <button 
                onClick={() => navigate("/login")}
                className="ml-2 font-bold text-[#734425] hover:text-[#C26819] hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer info for desktop */}
        <div className="hidden lg:block absolute bottom-8 text-[#2E2E2E]/40 text-xs font-heading font-semibold tracking-wider uppercase">
          © {new Date().getFullYear()} Leanport HR • Recovery Portal
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
