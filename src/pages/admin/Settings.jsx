import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "react-quill/dist/quill.snow.css";
import { NavLink } from "react-router-dom";
import settingTabs from "../../data/settingTab";

const Settings = () => {
  // const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="space-y-6 mb-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
          <p className="text-slate-600">
            Configure your HR system preferences and policies
          </p>
        </div>
      </div>

      <Tabs>
        <TabsList className={`grid w-full grid-cols-7`}>
          {settingTabs?.map((tab, index) => {
            const { id, name, link } = tab;
            return (
              <TabsTrigger key={id}>
                <NavLink
                  to={link}
                  className={({ isActive }) =>
                    `text-center py-2 w-full rounded-md transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        : "bg-transparent hover:bg-gray-200"
                    }`
                  }
                >
                  {name}
                </NavLink>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Settings;
