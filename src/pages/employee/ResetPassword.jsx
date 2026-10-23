import ResetPassword from "../../components/settings/ResetPassword";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeeResetPassword = () => {
    return (
        <div className="space-y-6 mb-7">
            <Card className="border border-[#E1D4C7]/30 shadow-xl rounded-2xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-12 items-center gap-4 relative">
                  <div className="col-span-12 md:col-span-8 space-y-2">
                    <span className="inline-block text-[11px] font-heading font-bold tracking-widest text-[#E1D4C7] uppercase bg-white/10 px-3 py-1 rounded-full">
                      Account Security
                    </span>
                    <h1 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-white">
                      Security Settings
                    </h1>
                    <p className="text-white/80 font-sans text-sm">
                      Manage your password credentials and account authentication preferences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ResetPassword />
        </div>
    );
};

export default EmployeeResetPassword;
