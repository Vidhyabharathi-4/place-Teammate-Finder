import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  Users,
  UserPlus,
  AlertCircle,
  Check,
} from "lucide-react";
import notificationService from "../services/notificationService";

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
}

function getNotificationIcon(type) {
  switch (type?.toUpperCase()) {
    case "ACCEPTED":
      return <CheckCircle className="text-green-600 dark:text-green-400 shrink-0" size={24} />;
    case "REJECTED":
      return <AlertCircle className="text-red-600 dark:text-red-400 shrink-0" size={24} />;
    case "APPLICATION":
      return <UserPlus className="text-blue-600 dark:text-blue-400 shrink-0" size={24} />;
    default:
      return <Users className="text-purple-600 dark:text-purple-400 shrink-0" size={24} />;
  }
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell size={34} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Notifications
          </h1>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {notifications.filter((n) => !n.is_read).length} Unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-lg">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Bell size={48} className="mx-auto mb-4 text-slate-400 dark:text-slate-500 opacity-60" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            No Notifications Yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            You'll receive alerts here when teammates apply to your teams or accept your applications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl shadow-sm border p-6 transition flex items-start justify-between gap-4 ${
                item.is_read
                  ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-80"
                  : "bg-blue-50/50 dark:bg-slate-800/90 border-blue-200 dark:border-blue-900/60"
              }`}
            >
              <div className="flex gap-4 min-w-0">
                <div className="mt-1">
                  {getNotificationIcon(item.notification_type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg text-slate-800 dark:text-white">
                      {item.title}
                    </h2>
                    {!item.is_read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm break-words">
                    {item.message}
                  </p>

                  <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 block">
                    {formatTimeAgo(item.created_at)}
                  </span>
                </div>
              </div>

              {!item.is_read && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  title="Mark as read"
                  className="shrink-0 p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 transition"
                >
                  <Check size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Notifications;