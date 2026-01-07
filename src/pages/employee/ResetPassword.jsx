import ResetPassword from "../../components/settings/ResetPassword";

const EmployeeResetPassword = () => {
    return (
        <div className="space-y-6 mb-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-600">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>

            <ResetPassword />
        </div>
    );
};

export default EmployeeResetPassword;
