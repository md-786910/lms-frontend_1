import React from "react";
import { Outlet } from "react-router-dom";
import Settings from "../../pages/admin/Settings";
function SettingLayout() {
  return (
    <>
      <Settings />
      <Outlet />
    </>
  );
}

export default SettingLayout;
