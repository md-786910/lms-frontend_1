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
import { CheckCircle, Building, Users, Globe } from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { industries } from "../../data/industries";
import { companySizes } from "../../data/companySize";
import axiosInstance from "../../api/axiosInstance";
import { companyPayload } from "../../utility/companyPayload";
import { useAuth } from "../../contexts/AuthContext";

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
    lastName: [{ type: "required", message: "Last Name is required" }],
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
    { number: 1, title: "Company Information", icon: Building },
    { number: 2, title: "Admin Details", icon: Users },
    { number: 3, title: "Account Setup", icon: Globe },
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
        // localStorage.setItem("token", token);
        // localStorage.setItem("user", JSON.stringify(user?.role));
        login(user, token);
        setUser(user);
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
        <div className="fixed min-h-screen z-30  w-full bg-gradient-background">
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 text-center">
            <h5 className="text-lg font-medium mb-4">
              Initializing company, please wait...
            </h5>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        </div>
      )}
      <div className=" min-h-screen bg-gradient-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Get Started with Our HRMS
            </h1>
            <p className="text-xl text-muted-foreground">
              Create your company account and start your free trial today
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      currentStep >= step.number
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`font-medium ${
                        currentStep >= step.number
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden sm:block w-16 h-0.5 ml-8 ${
                        currentStep > step.number
                          ? "bg-primary"
                          : "bg-muted-foreground"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card className="max-w-2xl mx-auto bg-gradient-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle>
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={values.companyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="companyName"
                      placeholder="Enter your country"
                      // disabled
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm">
                        {errors.companyName}
                      </p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry *</Label>
                      <Select
                        value={values.industry}
                        onValueChange={(value) =>
                          handleChange({ target: { name: "industry", value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(industries).map(([id, industry]) => (
                            <SelectItem key={id} value={id}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industry && (
                        <p className="text-red-500 text-sm">
                          {errors.industry}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="companySize">Company Size *</Label>
                      <Select
                        value={values.companySize}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "companySize", value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.companySize && (
                        <p className="text-red-500 text-sm">
                          {errors.companySize}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        type="text"
                        value={values.country}
                        // onChange={handleChange}
                        // onBlur={handleBlur}
                        name="country"
                        placeholder="Enter your company"
                        disabled
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm">{errors.country}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        type="url"
                        value={values.website}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="website"
                        placeholder="https://yourcompany.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Admin Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="firstName"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="lastName"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="email"
                      placeholder="your.email@company.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        type="text"
                        value={values.jobTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="jobTitle"
                        placeholder="e.g., HR Manager"
                      />
                      {errors.jobTitle && (
                        <p className="text-red-500 text-sm">
                          {errors.jobTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Account Setup */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="password"
                      placeholder="Create a strong password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={values.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleChange({
                            target: { name: "agreeToTerms", value: checked },
                          })
                        }
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>{" "}
                        *
                      </Label>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-sm">
                          {errors.agreeToTerms}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="subscribeNewsletter"
                        checked={values.subscribeNewsletter}
                        onCheckedChange={(checked) =>
                          handleChange({
                            target: {
                              name: "subscribeNewsletter",
                              value: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="subscribeNewsletter" className="text-sm">
                        Subscribe to our newsletter for updates and tips
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 3 ? (
                  <Button onClick={handleNext} className="bg-primary">
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubmitForm()}
                    disabled={errors.agreeToTerms}
                    className="bg-primary"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GetStarted;
