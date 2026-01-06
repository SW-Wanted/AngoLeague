import React from "react";
import { Icons } from "../ui/icons";
import type { User } from "../../types";

const NavItem: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active
        ? "bg-emerald-50 text-emerald-700 font-bold"
        : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    <span className={active ? "text-emerald-600" : "text-gray-400"}>
      {icon}
    </span>
    {label}
  </button>
);

const MobileNavItem: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-2 ${active ? "text-emerald-600" : "text-gray-400"}`}
  >
    {icon}
  </button>
);

export const Layout: React.FC<{
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: User;
}> = ({ children, activeTab, setActiveTab, user }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 md:pl-64">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 hidden md:flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <Icons.SoccerBall />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-emerald-900">
            AngoLeague
          </span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
            icon={<Icons.Layout />}
            label="Dashboard"
          />
          <NavItem
            active={activeTab === "matches"}
            onClick={() => setActiveTab("matches")}
            icon={<Icons.Calendar />}
            label="Jogos"
          />
          <NavItem
            active={activeTab === "teams"}
            onClick={() => setActiveTab("teams")}
            icon={<Icons.Users />}
            label="Equipas"
          />
          <NavItem
            active={activeTab === "recruitment"}
            onClick={() => setActiveTab("recruitment")}
            icon={<Icons.Search />}
            label="Recrutamento"
          />
          <NavItem
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            icon={<Icons.Users />}
            label="Perfil"
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || `https://picsum.photos/seed/${user?.id}/100`}
              className="w-10 h-10 rounded-full border border-gray-200"
              alt="Avatar"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.province}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-md text-white">
            <Icons.SoccerBall />
          </div>
          <span className="text-lg font-bold text-emerald-900">AngoLeague</span>
        </div>
        <button className="text-gray-500">
          <Icons.Bell />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-3 md:hidden z-20">
        <MobileNavItem
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
          icon={<Icons.Layout />}
        />
        <MobileNavItem
          active={activeTab === "matches"}
          onClick={() => setActiveTab("matches")}
          icon={<Icons.Calendar />}
        />
        <div className="relative -top-6">
          <button
            onClick={() => setActiveTab("create-match")}
            className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/40"
          >
            <Icons.Plus />
          </button>
        </div>
        <MobileNavItem
          active={activeTab === "recruitment"}
          onClick={() => setActiveTab("recruitment")}
          icon={<Icons.Search />}
        />
        <MobileNavItem
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
          icon={<Icons.Users />}
        />
      </nav>
    </div>
  );
};
