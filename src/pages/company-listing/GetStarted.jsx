import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Building, Users, Globe, ArrowRight, ArrowLeft } from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { industries } from "../../data/industries";
import { companySizes } from "../../data/companySize";
import axiosInstance from "../../api/axiosInstance";
import { companyPayload } from "../../utility/companyPayload";
import { useAuth } from "../../contexts/AuthContext";
import MotionWrapper from "../../components/MotionWrapper";

const GetStarted = () => {
  const { login, user: userData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [init, setInit] = useState(false);
  const [user, setUser] = useState(null);

  // Define the validation schema for each field
  const validationSchema = {
    companyName: [{ type: "required", message: "Company Name is required" }],
    industry: [{ type: "required", message: "Industry is required" }],
    companySize: [{ type: "required", message: "Company Size is required" }],
    country: [{ type: "required", message: "Country is required" }],
    firstName: [{ type: "required", message: "First Name is required" }],
    lastName: [{ type: "optional", message: "Last Name is required" }],
    email: [
      { type: "required", message: "Email is required" },
      { type: "email", message: "Please enter a valid email" },
    ],
    phone: [
      { type: "required", message: "Phone Number is required" },
      { type: "phone", message: "Please enter a valid phone number" },
    ],
    jobTitle: [{ type: "required", message: "Job Title is required" }],
    password: [{ type: "required", message: "Password is required" }],
    confirmPassword: [
      { type: "required", message: "Confirm Password is required" },
      { type: "match", message: "Passwords must match", value: "password" },
    ],
    agreeToTerms: [
      { type: "required", message: "You must agree to the Terms of Service" },
    ],
  };

  const stepFields = {
    1: ["companyName", "industry", "companySize", "country"],
    2: ["firstName", "lastName", "email", "phone", "jobTitle"],
    3: ["password", "confirmPassword", "agreeToTerms"],
  };

  // Initialize the form validation hook
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
  } = useFormValidation(
    {
      companyName: "",
      industry: "",
      companySize: "",
      country: "india",
      website: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      subscribeNewsletter: false,
    },
    validationSchema
  );

  const steps = [
    { number: 1, title: "Company", icon: Building },
    { number: 2, title: "Admin", icon: Users },
    { number: 3, title: "Account", icon: Globe },
  ];

  // Handle Next Button Click
  const handleNext = async () => {
    const currentStepFields = stepFields[currentStep];

    // Validate only the fields for the current step
    const isValid = await validateForm(currentStepFields);
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1); // Proceed to the next step if the form is valid
      } else {
        handleSubmitForm(); // Submit the form if on the last step
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission after validation
  const handleSubmitForm = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setInit(true);
    const payload = companyPayload(values);

    try {
      const response = await axiosInstance.post("/company/register", payload);
      if (response.status === 201) {
        const { token, user } = response.data?.data;
        setUser(user);
        setTimeout(() => {
          login(user, token);
          navigate(
            user?.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"
          );
          window.location.reload();
        }, 800);
      }
    } catch (error) {
      console.error(
        "Form submission error:",
        error.response?.data || error.message
      );

      toast({
        title: "Submission Failed",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });

      setInit(false); // ✅ restore here only on error
    }
  };

  useEffect(() => {
    if (user) {
      const timeout = setTimeout(() => {
        setInit(false);
        navigate(
          user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"
        );
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [user, navigate, setInit]);

  return (
    <>
      {init && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center p-8 bg-card border border-border shadow-xl rounded-2xl">
            <h5 className="text-lg font-bold mb-4 text-foreground">
              Initializing your workspace...
            </h5>
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-background font-sans flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#020817] -z-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] -z-10" />

        <MotionWrapper className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 mb-6">
                <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-4">
              Setup Your Organization
            </h1>
            <p className="text-xl text-slate-400">
              Complete these steps to access your admin dashboard
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Steps Sidebar */}
            <div className="lg:col-span-4 hidden lg:block sticky top-8">
                <div className="space-y-6">
                    {steps.map((step, index) => (
                        <div key={step.number} className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                            currentStep === step.number 
                                ? "bg-white border-l-4 border-blue-600 shadow-lg" 
                                : currentStep > step.number 
                                    ? "bg-blue-900/20 opacity-60" 
                                    : "opacity-40"
                        }`}>
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                currentStep === step.number ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                            }`}>
                                {currentStep > step.number ? <CheckCircle className="h-6 w-6" /> : <step.icon className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-wider ${currentStep === step.number ? "text-blue-600" : "text-slate-500"}`}>Step 0{step.number}</p>
                                <h3 className={`font-bold ${currentStep === step.number ? "text-slate-900" : "text-slate-400"}`}>{step.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Card */}
            <Card className="lg:col-span-8 border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-slate-100 w-full">
                    <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${(currentStep / 3) * 100}%` }} />
                </div>
                
                <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        {steps[currentStep - 1].title} Details
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="p-8 pt-6 space-y-6">
                    {/* Step 1: Company Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-enter">
                            <div className="space-y-2">
                                <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name *</Label>
                                <Input
                                    id="companyName"
                                    type="text"
                                    value={values.companyName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="companyName"
                                    placeholder="Acme Corp"
                                    className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="industry" className="text-xs font-bold uppercase tracking-wider text-slate-500">Industry *</Label>
                                    <Select
                                        value={values.industry}
                                        onValueChange={(value) => handleChange({ target: { name: "industry", value } })}
                                    >
                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(industries).map(([id, industry]) => (
                                                <SelectItem key={id} value={id}>{industry}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companySize" className="text-xs font-bold uppercase tracking-wider text-slate-500">Size *</Label>
                                    <Select
                                        value={values.companySize}
                                        onValueChange={(value) => handleChange({ target: { name: "companySize", value } })}
                                    >
                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companySizes.map((size) => (
                                                <SelectItem key={size} value={size}>{size}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.companySize && <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>}
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-slate-500">Country</Label>
                                    <Input
                                        id="country"
                                        type="text"
                                        value={values.country}
                                        name="country"
                                        disabled
                                        className="h-12 bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-xs font-bold uppercase tracking-wider text-slate-500">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={values.website}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="website"
                                        placeholder="https://acme.com"
                                        className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Admin Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-enter">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-slate-500">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="firstName"
                                        placeholder="John"
                                        className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="lastName"
                                        placeholder="Doe"
                                        className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="email"
                                    placeholder="john@acme.com"
                                    className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="phone"
                                        placeholder="+1 (555) 000-0000"
                                        className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jobTitle" className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Title *</Label>
                                    <Input
                                        id="jobTitle"
                                        value={values.jobTitle}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="jobTitle"
                                        placeholder="HR Manager"
                                        className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Account Setup */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-enter">
                            <div className="space-y-2">
                                <Label htmlFor="password" class="text-xs font-bold uppercase tracking-wider text-slate-500">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="password"
                                    placeholder="••••••••"
                                    className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" class="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                            
                            <div className="pt-4 space-y-4">
                                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <Checkbox
                                        id="agreeToTerms"
                                        checked={values.agreeToTerms}
                                        onCheckedChange={(checked) => handleChange({ target: { name: "agreeToTerms", value: checked } })}
                                        className="mt-1"
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="agreeToTerms" className="text-sm font-medium text-slate-700 cursor-pointer">
                                            I agree to the Terms of Service and Privacy Policy
                                        </Label>
                                        <p className="text-xs text-slate-500">By creating an account, you agree to our comprehensive terms and data processing agreement.</p>
                                    </div>
                                </div>
                                {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}
                                
                                <div className="flex items-center space-x-3 p-4">
                                    <Checkbox
                                        id="subscribeNewsletter"
                                        checked={values.subscribeNewsletter}
                                        onCheckedChange={(checked) => handleChange({ target: { name: "subscribeNewsletter", value: checked } })}
                                    />
                                    <Label htmlFor="subscribeNewsletter" className="text-sm text-slate-600 font-normal cursor-pointer">
                                        Keep me updated with product news and HR tips
                                    </Label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t border-slate-100">
                        <Button
                            variant="ghost"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="text-slate-500 hover:text-slate-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                        
                        {currentStep < 3 ? (
                            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 h-12 shadow-lg shadow-blue-600/20">
                                Next Step <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => handleSubmitForm()}
                                disabled={errors.agreeToTerms}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 h-12 shadow-lg shadow-emerald-600/20"
                            >
                                Create Account
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
          </div>
        </MotionWrapper>
      </div>
    </>
  );
};

export default GetStarted;