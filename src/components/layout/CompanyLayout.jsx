import { Outlet } from "react-router-dom";
import CompanyHeader from "../landing/CompanyHeader";
import CompanyFooter from "../landing/CompanyFooter";
import CookieConsent from "../landing/CookieConsent";

const CompanyLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CompanyHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CompanyFooter />
      <CookieConsent />
    </div>
  );
};

export default CompanyLayout;
