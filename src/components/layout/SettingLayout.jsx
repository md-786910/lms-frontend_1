import React from "react";
import { Outlet } from "react-router-dom";
import Settings from "../../pages/admin/Settings";
import ResetPassword from "../settings/ResetPassword";

function SettingLayout() {
  return (
    <>
      <Settings />
      <Outlet />
      <div className="mt-6">
        <ResetPassword />
      </div>
    </>
  );
}

export default SettingLayout;
