import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Settings,
  Menu,
  ArrowLeft,
} from "lucide-react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import notificationService from "../services/notificationService";
import groupLogo from "../assets/grp-logo.jpg";
import { getImageUrl } from "../utils/imageUrl";

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
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
    const interval = setInterval(fetchUnreadCount, 30000);

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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-900/95">
      <div className="flex h-16 sm:h-20 items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Menu Button + Back Arrow + Logo + Search */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {/* Hamburger Menu on Mobile */}
          <button
            onClick={onToggleSidebar}
            className="flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>

          {/* Universal Back Arrow Button when navigating away from dashboard */}
          {!isDashboard && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-1.5 rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition font-semibold text-xs sm:text-sm"
              title="Go Back"
              aria-label="Go Back"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <img
            src={groupLogo}
            alt="Rathinam Group"
            className="h-8 sm:h-10 w-auto object-contain shrink-0"
          />

          {/* Search Bar - Responsive */}
          <div className="relative hidden md:block w-48 sm:w-64 lg:w-96">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search teams, members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-9
                pr-4
                text-sm
                text-slate-800
                outline-none
                transition-all
                duration-200
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:placeholder:text-slate-400
              "
            />
          </div>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Notifications */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Settings"
          >
            <Settings size={20} />
          </Link>

          {/* Profile Badge */}
          <div
            onClick={() => navigate("/profile")}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:px-2.5"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-blue-600 shrink-0"
              />
            ) : (
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="hidden sm:block text-left">
              <h3 className="text-sm font-semibold leading-tight text-slate-800 dark:text-white">
                {displayName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
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