import {
  Settings,
  Lock,
  Bell,
  Info,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function SettingsPage() {

  const navigate = useNavigate();

  const {
    darkMode,
    setDarkMode,
  } = useTheme();

  const cards = [
    {
      title: "Change Password",
      icon: <Lock size={30} />,
      desc: "Update your account password securely.",
      color: "bg-blue-100 text-blue-600",
      onClick: () => navigate("/change-password"),
    },

    {
      title: "Notification Preferences",
      icon: <Bell size={30} />,
      desc: "Control alerts, invitations and application updates.",
      color: "bg-yellow-100 text-yellow-600",
      onClick: () => navigate("/notification-settings"),
    },

    {
      title: "About TeamMate Finder",
      icon: <Info size={30} />,
      desc: "Version, privacy policy and support information.",
      color: "bg-green-100 text-green-600",
      onClick: () => navigate("/about"),
    },
  ];

  function logout() {
    localStorage.removeItem("access_token");
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-7xl p-8">

      {/* Heading */}

      <div className="mb-10 flex items-center gap-4">

        <div className="rounded-2xl bg-blue-600 p-4 text-white">
          <Settings size={32} />
        </div>

        <div>

          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Settings
          </h1>

          <p className="mt-1 text-slate-500 dark:text-slate-300">
            Manage your account preferences
          </p>

        </div>

      </div>

      {/* Cards */}

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

        {cards.map((card) => (

          <div
            key={card.title}
            onClick={card.onClick}
            className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
          >

            <div
              className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${card.color}`}
            >
              {card.icon}
            </div>

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {card.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-500 dark:text-slate-300">
              {card.desc}
            </p>

          </div>

        ))}

      </div>

      {/* Dark Mode */}

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">

              {darkMode ? (
                <Moon className="text-yellow-400" />
              ) : (
                <Sun className="text-orange-500" />
              )}

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Dark Mode
              </h2>

              <p className="text-slate-500 dark:text-slate-300">
                Switch between light and dark appearance.
              </p>

            </div>

          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative h-8 w-16 rounded-full transition ${
              darkMode
                ? "bg-blue-600"
                : "bg-slate-300"
            }`}
          >

            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                darkMode
                  ? "left-9"
                  : "left-1"
              }`}
            />

          </button>

        </div>

      </div>

      {/* Logout */}

      <div className="mt-12">

        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-red-700"
        >

          <LogOut size={22} />

          Logout

        </button>

      </div>

    </div>
  );
}

export default SettingsPage;