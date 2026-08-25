import {
  Home,
  Users,
  FolderKanban,
  ClipboardList,
  User,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import rathinamLogo from "../assets/rathinam-logo.jpg";

const menu = [
  {
    name: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    name: "Browse Teams",
    icon: Users,
    path: "/teams",
  },
  {
    name: "My Teams",
    icon: FolderKanban,
    path: "/my-teams",
  },
  {
    name: "Applications",
    icon: ClipboardList,
    path: "/applications",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access_token");
    navigate("/");
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">

      {/* Logo */}

      <div className="border-b border-slate-200 py-6 dark:border-slate-700">

        <div className="flex flex-col items-center">

          <img
            src={rathinamLogo}
            alt="Rathinam Logo"
            className="h-20 w-20 object-contain"
          />

          <h1 className="mt-3 text-2xl font-bold text-blue-600">
            TeamMate Finder
          </h1>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Rathinam Student Platform
          </p>

        </div>

      </div>

      {/* Navigation */}

      <div className="flex-1 space-y-2 p-6">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-5 py-3 font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`
              }
            >

              <Icon size={20} />

              {item.name}

            </NavLink>

          );

        })}

      </div>

      {/* Logout */}

      <div className="border-t border-slate-200 p-6 dark:border-slate-700">

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;