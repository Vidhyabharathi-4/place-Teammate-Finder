import {
  Bell,
  Search,
  Settings,
  User,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import groupLogo from "../assets/grp-logo.jpg";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">

      <div className="flex h-24 items-center justify-between px-8">

        {/* Left */}

        <div className="flex items-center gap-8">

          <img
            src={groupLogo}
            alt="Rathinam Group"
            className="h-12 w-auto object-contain"
          />

          {/* Search */}

          <div className="relative w-[450px]">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <input
              type="text"
              placeholder="Search teams, members..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-4
                text-slate-800
                outline-none
                transition-all
                duration-300
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:placeholder:text-slate-400
              "
            />

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Notifications */}

          <button
            onClick={() => navigate("/notifications")}
            className="relative rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >

            <Bell
              size={22}
              className="text-slate-600 dark:text-slate-300"
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>

          </button>

          {/* Settings */}

          <Link
            to="/settings"
            className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >

            <Settings
              size={22}
              className="text-slate-600 dark:text-slate-300"
            />

          </Link>

          {/* Profile */}

          <div
            onClick={() => navigate("/profile")}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">

              <User size={20} />

            </div>

            <div>

              <h3 className="font-semibold text-slate-800 dark:text-white">
                Vidhya
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Student
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;