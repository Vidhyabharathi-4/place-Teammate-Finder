import { Bell } from "lucide-react";
import { useState } from "react";

function NotificationSettings() {

  const [settings, setSettings] = useState({
    applications: true,
    accepted: true,
    rejected: true,
    invitations: true,
    announcements: true,
  });

  const toggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const items = [
    {
      key: "applications",
      label: "New Team Applications",
    },
    {
      key: "accepted",
      label: "Application Accepted",
    },
    {
      key: "rejected",
      label: "Application Rejected",
    },
    {
      key: "invitations",
      label: "Team Invitations",
    },
    {
      key: "announcements",
      label: "College Announcements",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl p-8">

      <div className="rounded-3xl bg-white shadow-lg border">

        <div className="rounded-t-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">

          <div className="flex items-center gap-4">

            <Bell size={36} />

            <div>

              <h1 className="text-4xl font-bold">
                Notification Settings
              </h1>

              <p className="text-blue-100 mt-2">
                Control what notifications you receive.
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-5 p-8">

          {items.map((item) => (

            <div
              key={item.key}
              className="flex items-center justify-between rounded-2xl border p-5"
            >

              <span className="font-semibold">
                {item.label}
              </span>

              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={() => toggle(item.key)}
                className="h-5 w-5"
              />

            </div>

          ))}

          <button
            className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Settings
          </button>

        </div>

      </div>

    </div>
  );
}

export default NotificationSettings;