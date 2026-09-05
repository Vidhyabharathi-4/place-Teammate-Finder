import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import notificationService from "../../services/notificationService";

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Card>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Notifications
        </h2>

        <Link
          to="/notifications"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
          <Bell size={28} className="mx-auto mb-2 text-slate-400 opacity-60" />
          <p className="text-sm">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`border-l-4 pl-4 transition ${
                item.is_read
                  ? "border-slate-300 dark:border-slate-600 opacity-80"
                  : "border-blue-600"
              }`}
            >
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {item.message}
              </p>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                {formatTimeAgo(item.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}

    </Card>
  );
}

export default NotificationPanel;