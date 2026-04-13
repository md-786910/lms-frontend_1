import { Outlet } from "react-router-dom";
import CompanyHeader from "./CompanyHeader";

const CompanyLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader />
      <main>
        {/* <div className="h-[100vh]"></div> */}
        <Outlet />
      </main>
    </div>
  );
};

export default CompanyLayout;
