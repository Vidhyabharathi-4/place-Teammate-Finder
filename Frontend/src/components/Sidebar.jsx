import { useState, useEffect } from "react";
import {
  Home,
  Users,
  FolderKanban,
  ClipboardList,
  MessageSquare,
  User,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import rathinamLogo from "../assets/rathinam-logo.jpg";
import chatService from "../services/chatService";

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
    name: "Chat",
    icon: MessageSquare,
    path: "/chat",
    showBadge: true,
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const data = await chatService.getUnreadCount();
        if (isMounted) {
          setUnreadCount(data?.total_unread || 0);
        }
      } catch (err) {
        // Silently ignore if not logged in
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  function logout() {
    localStorage.removeItem("access_token");
    navigate("/");
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900 lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Close Sidebar"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="border-b border-slate-200 py-6 dark:border-slate-700">
          <div className="flex flex-col items-center">
            <img
              src={rathinamLogo}
              alt="Rathinam Logo"
              className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            />
            <h1 className="mt-3 text-xl font-bold text-blue-600 sm:text-2xl">
              TeamMate Finder
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Rathinam Student Platform
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-1.5 overflow-y-auto p-4 sm:p-6">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-2.5 font-medium transition-all duration-200 sm:px-5 sm:py-3 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`
                }
              >
                <div className="flex items-center gap-3.5">
                  <Icon size={19} />
                  <span className="text-sm sm:text-base">{item.name}</span>
                </div>

                {item.showBadge && unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <div className="border-t border-slate-200 p-4 sm:p-6 dark:border-slate-700">
          <button
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-red-500 py-2.5 font-semibold text-white transition hover:bg-red-600 sm:py-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;