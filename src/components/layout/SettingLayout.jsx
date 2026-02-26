import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Settings from "../../pages/admin/Settings";
import ResetPassword from "../settings/ResetPassword";

function SettingLayout() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname?.toLowerCase() || ""
  );

  useEffect(() => {
    setActiveTab(location.pathname?.toLowerCase() || "");
  }, [location.pathname]);

  const isResetPasswordActive = activeTab.includes("/reset-password");

  return (
    <Settings>
      <div className="space-y-6">
        {isResetPasswordActive ? <ResetPassword /> : <Outlet />}
      </div>
    </Settings>
  );
}

export default SettingLayout;
