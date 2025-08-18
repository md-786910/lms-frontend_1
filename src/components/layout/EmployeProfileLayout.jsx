import React from "react";
import { Outlet } from "react-router-dom";
import Profile from "../../pages/employee/Profile";

function EmployeProfileLayout() {
  return (
    <div>
      <Profile />
    </div>
  );
}

export default EmployeProfileLayout;
