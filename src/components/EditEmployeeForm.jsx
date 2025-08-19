import { useState, useEffect, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  MapPin,
  FileText,
  Heart,
  DollarSign,
  Calendar,
} from "lucide-react";

import BasicInfoForm from "./EditEmplyee/Basicinfo";
import AddressForm from "./EditEmplyee/AddressInfo";
import DocumentsForm from "./EditEmplyee/DocumentsInfo";
import PersonalInfoForm from "./EditEmplyee/PersonalInfo";
import SalaryForm from "./EditEmplyee/SalaryInfo";
import { employeeAPI } from "../api/employeeApi";
import { getTabPayload, validateTabForm } from "../utility/employeeUpdate";
import { formatPersonalInfo } from "../utility/destructure/personalInfo";
import { formatBasicInfo } from "../utility/destructure/basicInfo";
import { formatAddressInfo } from "../utility/destructure/addressInfo";
import { formatSalaryInfo } from "../utility/destructure/formatSalaryInfo";
import { getCategoryIdFromType } from "../utility/getCategory";
import { buildDocumentUploadPayload } from "../utility/document";
import LeaveInfoForm from "./EditEmplyee/LeaveInfoForm";
import { leaveApi } from "../api/employeeLeave/employeeLeave";
import {
  mapApiToLeaveForm,
  mapLeaveFormToDeltaPayload,
} from "../utility/leaveMapper";
import { generalAPI } from "../api/generalApi";
import axiosInstance from "../api/axiosInstance";

const EditEmployeeForm = ({
  employeeId,
  onClose,
  onSuccess,
  handleTabActive,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [hit, setHit] = useState(Math.random());
  const [loader, setLoader] = useState(false);
  const basicInfoRef = useRef();
  const addressInfoRef = useRef();
  const documentsRef = useRef();
  const personalRef = useRef();
  const salaryRef = useRef();
  const leaveRef = useRef();

  const [basicInfo, setBasicInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "",
    martial_status: "",
    date_of_joining: "",
    date_of_birth: "",
    department_id: "",
    designation_id: "",
    nationality: "",
  });

  const [addressInfo, setAddressInfo] = useState({
    street: "",
    city: "",
    state: "",
    zip_code: "",
    permanent_address: "",
    country: "",
  });

  const [documents, setDocuments] = useState([]);

  const [newDocs, setNewDocs] = useState([]);

  const [personalInfo, setPersonalInfo] = useState({
    emergency_contact_person: "",
    emergency_contact_number: "",
    emergency_contact_relationship: "",
    blood_group: "",
    medical_conditions: "",
    hobbies: "",
    epf_no: "",
    esic_no: "",
    pan_no: "",
    aadhaar_no: "",
    passport_no: "",
    uan_no: "",
  });

  const [salaryInfo, setSalaryInfo] = useState({
    bank_account_number: "",
    bank_name: "",
    base_salary: 0,
    bonus: 0,
    cca: 0,
    epf: "",
    epf_admin: 0,
    epf_pension: 0,
    hra: 0,
    ifsc_code: "",
    is_epf_applicable: false,
    payable_salary: 0,
    salary_with_allowance: 0,
    total_allowance: 0,
    total_deduction_allowance: 0,
  });

  const [leaveInfo, setLeaveInfo] = useState([]);

  // Flags to ensure one-time fetch per tab
  const [loadedTabs, setLoadedTabs] = useState({
    basic: false,
    address: false,
    documents: false,
    personal: false,
    salary: false,
    leave: false,
  });

  useEffect(() => {
    const fetchTabData = async () => {
      try {
        if (activeTab === "basic") {
          const [basicRes, deptData, desigData] = await Promise.all([
            employeeAPI.getBasicInfo(employeeId),
            generalAPI.getDepartments(),
            generalAPI.getDesignations(),
          ]);

          setEmployee(basicRes.data);
          setBasicInfo(formatBasicInfo(basicRes.data));
          setDepartments(deptData.data || []);
          setDesignations(desigData.data || []);
          setLoadedTabs((prev) => ({ ...prev, basic: true }));
        }

        if (activeTab === "address") {
          const res = await employeeAPI.getAddressInfo(employeeId);
          setAddressInfo(formatAddressInfo(res.data));
          setLoadedTabs((prev) => ({ ...prev, address: true }));
        }

        if (activeTab === "documents") {
          const res = await employeeAPI.getDocumentsInfo(employeeId);
          setDocuments(res.data); // Use formatting function if needed
          setLoadedTabs((prev) => ({ ...prev, documents: true }));

          const resp1 = await axiosInstance.get(`/setting/document-category`);
          if (resp1.status == 200) {
            const data = resp1.data?.data;
            setDocumentType(Array.isArray(data) ? data : []);
          }
        }

        if (activeTab === "personal") {
          const res = await employeeAPI.getPersonalInfo(employeeId);
          setPersonalInfo(formatPersonalInfo(res.data));
          setLoadedTabs((prev) => ({ ...prev, personal: true }));
        }

        if (activeTab === "salary") {
          const res = await employeeAPI.getSalaryInfo(employeeId);
          setSalaryInfo(formatSalaryInfo(res.data));
          setLoadedTabs((prev) => ({ ...prev, salary: true }));
        }

        if (activeTab === "leave") {
          const res = await leaveApi.getAllLeave(employeeId);
          setLeaveInfo(res.data);
          setLoadedTabs((prev) => ({ ...prev, leave: true }));
        }
      } catch (error) {
        console.error(`Error loading ${activeTab} data:`, error);
      }
    };

    fetchTabData();
  }, [activeTab, employeeId, hit]);

  const handleSave = async () => {
    setLoader(true);
    const isValid = await validateTabForm(activeTab, {
      basicInfoRef,
      addressInfoRef,
      documentsRef,
      personalRef,
      salaryRef,
      leaveRef,
    });

    if (!isValid) {
      setLoader(false);
      toast({
        title: "Please fill all required fields.",
        status: "error",
        duration: 800,
        isClosable: true,
      });
      return;
    }

    const payload = getTabPayload({
      activeTab,
      employeeId,
      basicInfo,
      addressInfo,
      documents,
      personalInfo,
      salaryInfo,
    });
    try {
      switch (activeTab) {
        case "basic":
          await employeeAPI.updateBasicInfo(employeeId, payload);
          break;
        case "address":
          await employeeAPI.updateAddressInfo(employeeId, payload);
          break;
        case "documents":
          const documentPayload = await buildDocumentUploadPayload(newDocs);
          await employeeAPI.updateDocumentsInfo(employeeId, documentPayload);
          break;
        case "personal":
          await employeeAPI.updatePersonalInfo(employeeId, payload);
          break;
        case "salary":
          await employeeAPI.updateSalaryInfo(employeeId, payload);
          break;
        case "leave":
          const leavePayload = mapLeaveFormToDeltaPayload(leaveInfo);
          await leaveApi.updateLeave(employeeId, leavePayload);
          break;
        default:
          break;
      }

      toast({
        title: "Employee Updated Successfully!",
        description: `${employee?.first_name || ""} ${
          employee?.last_name || ""
        }'s ${activeTab} information has been updated.`,
      });
      setHit(Math.random());
      setLoader(false);
      // onSuccess();
      // onClose();
    } catch (error) {
      toast({
        title: "Error updating employee",
        description:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating employee:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto min-h-[80vh] max-h-[80vh] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto px-6">
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            handleTabActive(val);
          }}
          className="w-full"
        >
          <div className="sticky top-0 z-10 bg-white py-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger
                value="basic"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Basic Info</span>
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Address</span>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger
                value="personal"
                className="flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger
                value="salary"
                className="flex items-center space-x-2"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Salary</span>
              </TabsTrigger>
              <TabsTrigger
                value="leave"
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Leave</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basic">
            <BasicInfoForm
              key={activeTab} //Prop to Force Re-render with Updated data
              ref={basicInfoRef}
              initialValues={basicInfo}
              onChange={setBasicInfo}
              departments={departments}
              designations={designations}
            />
          </TabsContent>

          <TabsContent value="address">
            <AddressForm
              key={activeTab} //Prop to Force Re-render with Updated data
              ref={addressInfoRef}
              addressInfo={addressInfo}
              setAddressInfo={setAddressInfo}
            />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsForm
              key={activeTab}
              ref={documentsRef}
              documents={documents}
              employeeId={employeeId}
              setDocuments={setDocuments}
              documentType={documentType}
              setNewDocs={setNewDocs}
            />
          </TabsContent>

          <TabsContent value="personal">
            <PersonalInfoForm
              key={activeTab} //Prop to Force Re-render with Updated data
              ref={personalRef}
              personalInfo={personalInfo}
              setPersonalInfo={setPersonalInfo}
            />
          </TabsContent>

          <TabsContent value="salary">
            <SalaryForm
              key={activeTab} //Prop to Force Re-render with Updated data
              ref={salaryRef}
              salaryInfo={salaryInfo}
              setSalaryInfo={setSalaryInfo}
            />
          </TabsContent>

          <TabsContent value="leave">
            <LeaveInfoForm
              key={activeTab} //Prop to Force Re-render with Updated data
              ref={leaveRef}
              leaveInfo={leaveInfo}
              setLeaveInfo={setLeaveInfo}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <div className="flex justify-end space-x-4 py-4 mr-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={loader}
        >
          {loader ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
};

export default EditEmployeeForm;
