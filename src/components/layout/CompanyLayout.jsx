import { Outlet } from "react-router-dom";
import CompanyHeader from "./CompanyHeader";
import CompanyFooter from "./CompanyFooter";

const CompanyLayout = () => {
  return (
    <div className="min-h-screen bg-[#020817] flex flex-col">
      <CompanyHeader />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <CompanyFooter />
    </div>
  );
};

export default CompanyLayout;
