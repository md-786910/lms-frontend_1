import React from "react";
import { Outlet } from "react-router-dom";
import Settings from "../../pages/admin/Settings";
import ResetPassword from "../settings/ResetPassword";

function SettingLayout() {
  return (
    <Settings>
      <div className="space-y-6">
        <Outlet />
        <ResetPassword />
      </div>
    </Settings>
  );
}

export default SettingLayout;
