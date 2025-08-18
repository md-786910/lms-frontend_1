import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Building2,
  DollarSign,
  Users,
  FileText,
  Calendar,
  Settings as SettingsIcon,
  Plus,
  Edit3,
  Trash2,
  Save,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "../../api/axiosInstance";
import Company from "../../components/settings/Company";
import Prefix from "../../components/settings/Prefix";
import Currency from "../../components/settings/Currency";
import Departments from "../../components/settings/Departments";
import Designations from "../../components/settings/Designations";
import Leave from "../../components/settings/Leave";

function Templates({ value }) {
  // Template state management
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templates, setTemplates] = useState({
    payslip: {
      type: "pdf",
      content: `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="color: #1E40AF; margin: 0;">{{company_name}}</h1>
    <h2 style="color: #64748B; margin: 10px 0;">Monthly Payslip</h2>
    <p style="margin: 0;">{{company_address}}</p>
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
    <div>
      <h3 style="color: #1E40AF; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px;">Employee Information</h3>
      <p><strong>Name:</strong> {{employee_name}}</p>
      <p><strong>Employee ID:</strong> {{employee_id}}</p>
      <p><strong>Department:</strong> {{department}}</p>
      <p><strong>Designation:</strong> {{designation}}</p>
      <p><strong>Date of Joining:</strong> {{joining_date}}</p>
    </div>
    <div>
      <h3 style="color: #1E40AF; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px;">Pay Period</h3>
      <p><strong>Month/Year:</strong> {{month_year}}</p>
      <p><strong>Pay Date:</strong> {{pay_date}}</p>
      <p><strong>Working Days:</strong> {{working_days}}</p>
      <p><strong>Days Worked:</strong> {{days_worked}}</p>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
    <div style="background: #F8FAFC; padding: 20px; border-radius: 8px;">
      <h3 style="color: #059669; margin-top: 0;">Earnings</h3>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Basic Salary:</span><span>{{currency}} {{basic_salary}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>House Rent Allowance:</span><span>{{currency}} {{hra}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Transport Allowance:</span><span>{{currency}} {{transport_allowance}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Medical Allowance:</span><span>{{currency}} {{medical_allowance}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Other Allowances:</span><span>{{currency}} {{other_allowances}}</span>
      </div>
      <hr style="border: 1px solid #059669;">
      <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px;">
        <span>Gross Salary:</span><span>{{currency}} {{gross_salary}}</span>
      </div>
    </div>
    
    <div style="background: #FEF2F2; padding: 20px; border-radius: 8px;">
      <h3 style="color: #DC2626; margin-top: 0;">Deductions</h3>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Provident Fund (EPF):</span><span>{{currency}} {{epf}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Employee State Insurance:</span><span>{{currency}} {{esi}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Professional Tax:</span><span>{{currency}} {{professional_tax}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Income Tax (TDS):</span><span>{{currency}} {{income_tax}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 10px 0;">
        <span>Other Deductions:</span><span>{{currency}} {{other_deductions}}</span>
      </div>
      <hr style="border: 1px solid #DC2626;">
      <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px;">
        <span>Total Deductions:</span><span>{{currency}} {{total_deductions}}</span>
      </div>
    </div>
  </div>

  <div style="background: #1E40AF; color: white; padding: 20px; border-radius: 8px; text-align: center;">
    <h2 style="margin: 0; font-size: 24px;">Net Salary: {{currency}} {{net_salary}}</h2>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Amount in words: {{net_salary_words}}</p>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; color: #64748B;">
    <p>This is a computer-generated payslip and does not require a signature.</p>
    <p>For any queries, please contact HR Department at {{hr_email}}</p>
  </div>
</div>`,
    },

    leave: {
      type: "email",
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1E40AF; text-align: center;">Leave Application Approved</h2>
  <p>Dear {{employee_name}},</p>
  <p>We are pleased to inform you that your leave application has been <strong style="color: #059669;">approved</strong>.</p>
  
  <div style="background: #F8FAFC; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1E40AF; margin-top: 0;">Leave Details:</h3>
    <p><strong>Leave Type:</strong> {{leave_type}}</p>
    <p><strong>From Date:</strong> {{start_date}}</p>
    <p><strong>To Date:</strong> {{end_date}}</p>
    <p><strong>Total Days:</strong> {{total_days}}</p>
    <p><strong>Reason:</strong> {{reason}}</p>
  </div>

  <p>Please ensure all pending work is completed or properly handed over before your leave begins.</p>
  <p>We wish you a pleasant time off!</p>
  
  <p>Best regards,<br>
  HR Department<br>
  {{company_name}}</p>
</div>`,
    },

    employment: {
      type: "email",
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1E40AF; text-align: center;">Employment Verification</h2>
  <p>To Whom It May Concern,</p>
  
  <p>This letter serves to verify the employment of <strong>{{employee_name}}</strong> with {{company_name}}.</p>
  
  <div style="background: #F8FAFC; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1E40AF; margin-top: 0;">Employee Details:</h3>
    <p><strong>Full Name:</strong> {{employee_name}}</p>
    <p><strong>Employee ID:</strong> {{employee_id}}</p>
    <p><strong>Designation:</strong> {{designation}}</p>
    <p><strong>Department:</strong> {{department}}</p>
    <p><strong>Date of Joining:</strong> {{joining_date}}</p>
    <p><strong>Employment Status:</strong> {{employment_status}}</p>
    <p><strong>Current Salary:</strong> {{currency}} {{salary}}</p>
  </div>

  <p>This verification is provided based on our records as of {{current_date}}.</p>
  <p>Should you require any additional information, please feel free to contact our HR department.</p>
  
  <p>Sincerely,<br>
  HR Department<br>
  {{company_name}}<br>
  {{hr_email}}</p>
</div>`,
    },

    invitation: {
      type: "email",
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="margin: 0; font-size: 28px;">Welcome to {{company_name}}!</h1>
    <p style="font-size: 18px; margin: 10px 0; opacity: 0.9;">We're excited to have you on board</p>
  </div>

  <div style="background: white; color: #334155; padding: 25px; border-radius: 8px;">
    <p>Dear {{employee_name}},</p>
    <p>Congratulations! We are delighted to welcome you to our team as a <strong>{{designation}}</strong> in the {{department}} department.</p>
    
    <div style="background: #F1F5F9; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h3 style="color: #1E40AF; margin-top: 0;">Your Details:</h3>
      <p><strong>Employee ID:</strong> {{employee_id}}</p>
      <p><strong>Start Date:</strong> {{start_date}}</p>
      <p><strong>Department:</strong> {{department}}</p>
      <p><strong>Reporting Manager:</strong> {{manager_name}}</p>
      <p><strong>Office Location:</strong> {{office_location}}</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <p style="margin-bottom: 15px;">To complete your onboarding, please set up your account:</p>
      <a href="{{setup_link}}" style="background: #3B82F6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Set Up Your Account</a>
    </div>

    <p>Your first day orientation will begin at 9:00 AM. Please bring the required documents as mentioned in the attached checklist.</p>
    
    <p>We look forward to working with you and wish you great success in your new role!</p>
    
    <p>Best regards,<br>
    HR Team<br>
    {{company_name}}<br>
    {{hr_email}}</p>
  </div>
</div>`,
    },
  });

  const [currentTemplateContent, setCurrentTemplateContent] = useState("");

  const openTemplateEditor = (templateType) => {
    setSelectedTemplate(templateType);
    setCurrentTemplateContent(templates[templateType].content);
    setTemplateDialogOpen(true);
  };

  const saveTemplate = () => {
    if (selectedTemplate) {
      setTemplates({
        ...templates,
        [selectedTemplate]: {
          ...templates[selectedTemplate],
          content: currentTemplateContent,
        },
      });
      setTemplateDialogOpen(false);
      toast({
        title: "Template Updated",
        description: `${selectedTemplate} template has been saved successfully.`,
      });
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Template Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* PDF Templates Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-red-600" />
              PDF Templates
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-6 border-2 border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-red-600" />
                      Payslip Template
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      PDF template for employee payslips with automatic data
                      mapping (salary, EPF, ESI, tax calculations)
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        Auto-calculate EPF
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Tax deductions
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Salary breakdown
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => openTemplateEditor("payslip")}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit PDF Template
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Email Templates Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Email Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h4 className="font-medium text-slate-800 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-green-600" />
                  Leave Approval
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  Email template for leave approvals and notifications
                </p>
                <Button
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50"
                  onClick={() => openTemplateEditor("leave")}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Template
                </Button>
              </Card>

              <Card className="p-4 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h4 className="font-medium text-slate-800 mb-2 flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-purple-600" />
                  Employment Letter
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  Email template for employment verification letters
                </p>
                <Button
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50"
                  onClick={() => openTemplateEditor("employment")}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Template
                </Button>
              </Card>

              <Card className="p-4 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h4 className="font-medium text-slate-800 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-emerald-600" />
                  Welcome Email
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  Email template for new employee welcome and invitations
                </p>
                <Button
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50"
                  onClick={() => openTemplateEditor("invitation")}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Template
                </Button>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {templates[selectedTemplate]?.type === "pdf" ? (
                <FileText className="h-5 w-5 text-red-600" />
              ) : (
                <Mail className="h-5 w-5 text-blue-600" />
              )}
              <span>
                Edit{" "}
                {selectedTemplate.charAt(0).toUpperCase() +
                  selectedTemplate.slice(1)}
                {templates[selectedTemplate]?.type === "pdf"
                  ? " PDF"
                  : " Email"}{" "}
                Template
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Template Content</Label>
              <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={currentTemplateContent}
                  onChange={setCurrentTemplateContent}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ align: [] }],
                      ["link", "image"],
                      [{ color: [] }, { background: [] }],
                      [{ font: [] }, { size: [] }],
                      ["clean"],
                    ],
                  }}
                  style={{ height: "400px" }}
                />
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Employee Variables
                </h4>
                <div className="grid grid-cols-1 gap-1 text-sm text-blue-700">
                  <code>{"{{employee_name}}"}</code>
                  <code>{"{{employee_id}}"}</code>
                  <code>{"{{department}}"}</code>
                  <code>{"{{designation}}"}</code>
                  <code>{"{{joining_date}}"}</code>
                  <code>{"{{manager_name}}"}</code>
                </div>
              </div>

              {selectedTemplate === "payslip" && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Salary & Deduction Variables
                  </h4>
                  <div className="grid grid-cols-1 gap-1 text-sm text-green-700">
                    <code>{"{{basic_salary}}"}</code>
                    <code>{"{{hra}}"}</code>
                    <code>{"{{epf}}"}</code>
                    <code>{"{{esi}}"}</code>
                    <code>{"{{professional_tax}}"}</code>
                    <code>{"{{income_tax}}"}</code>
                    <code>{"{{gross_salary}}"}</code>
                    <code>{"{{net_salary}}"}</code>
                  </div>
                </div>
              )}

              {selectedTemplate !== "payslip" && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Company & Date Variables
                  </h4>
                  <div className="grid grid-cols-1 gap-1 text-sm text-purple-700">
                    <code>{"{{company_name}}"}</code>
                    <code>{"{{company_address}}"}</code>
                    <code>{"{{hr_email}}"}</code>
                    <code>{"{{current_date}}"}</code>
                    <code>{"{{setup_link}}"}</code>
                    <code>{"{{leave_type}}"}</code>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setTemplateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={saveTemplate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Templates;
