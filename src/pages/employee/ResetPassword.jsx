import ResetPassword from "../../components/settings/ResetPassword";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeeResetPassword = () => {
    return (
        <>
            <Card className="border border-slate-200 shadow-md rounded-md bg-slate-900 text-white">
              <CardContent className="p-5 md:p-7">
                <div className="grid grid-cols-12 items-center gap-4 relative">
                  <div className="col-span-12 md:col-span-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold font-montserrat text-[#FFFFFF]">
                        Settings
                      </h1>
                    </div>
                    <p className="text-[#FFFFFF] font-medium text-sm font-montserrat">
                      Manage your account settings and preferences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ResetPassword />
        </>
    );
};

export default EmployeeResetPassword;
