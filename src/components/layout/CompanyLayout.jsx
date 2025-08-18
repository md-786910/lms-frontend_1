import { Outlet } from "react-router-dom";
import CompanyHeader from "./CompanyHeader";

const CompanyLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default CompanyLayout;
