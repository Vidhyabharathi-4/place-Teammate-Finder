import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Settings,
  User,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import notificationService from "../services/notificationService";
import groupLogo from "../assets/grp-logo.jpg";

import { getImageUrl } from "../utils/imageUrl";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        if (isMounted) {
          setUnreadCount(count || 0);
        }
      } catch (err) {
        // Silently ignore if not logged in or endpoint fails
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/teams?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const displayName = user?.name || "Student";
  const displayRole = user?.role || user?.department || "Student";
  const avatarUrl = getImageUrl(user?.profile_picture);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
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
            title="Notifications"
          >

            <Bell
              size={22}
              className="text-slate-600 dark:text-slate-300"
            />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}

          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Settings"
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

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-11 w-11 rounded-full object-cover border-2 border-blue-600 shrink-0"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div>

              <h3 className="font-semibold text-slate-800 dark:text-white">
                {displayName}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {displayRole}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;