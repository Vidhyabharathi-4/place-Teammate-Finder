import { Bell, Check } from "lucide-react";
import { useState, useEffect } from "react";

const STORAGE_KEY = "tmf_notification_preferences";

const DEFAULT_SETTINGS = {
  applications: true,
  accepted: true,
  rejected: true,
  invitations: true,
  announcements: true,
};

function NotificationSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load notification settings:", err);
    }
  }, []);

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const items = [
    {
      key: "applications",
      label: "New Team Applications",
      desc: "Receive alerts when students apply to your teams.",
    },
    {
      key: "accepted",
      label: "Application Accepted",
      desc: "Get notified immediately when you are accepted into a team.",
    },
    {
      key: "rejected",
      label: "Application Rejected",
      desc: "Notifications when an application status is updated.",
    },
    {
      key: "invitations",
      label: "Team Invitations",
      desc: "Invites from team owners seeking your skills.",
    },
    {
      key: "announcements",
      label: "College Announcements",
      desc: "Updates about upcoming campus hackathons and project expos.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl p-8">

      <div className="rounded-3xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">

          <div className="flex items-center gap-4">

            <Bell size={36} />

            <div>

              <h1 className="text-4xl font-bold">
                Notification Settings
              </h1>

              <p className="text-blue-100 mt-2">
                Control what alerts and updates you receive.
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-5 p-8">

          {items.map((item) => (

            <div
              key={item.key}
              onClick={() => toggle(item.key)}
              className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition"
            >

              <div>
                <span className="font-semibold text-slate-800 dark:text-white block">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {item.desc}
                </span>
              </div>

              <input
                type="checkbox"
                checked={settings[item.key] ?? true}
                onChange={() => toggle(item.key)}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-5 accent-blue-600 cursor-pointer"
              />

            </div>

          ))}

          <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleSave}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition"
            >
              Save Settings
            </button>

            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                <Check size={18} />
                Preferences saved successfully!
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default NotificationSettings;