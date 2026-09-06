import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  Users,
  UserPlus,
  AlertCircle,
  Check,
  CheckCheck,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import notificationService from "../services/notificationService";

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

function getNotificationIcon(type) {
  switch (type?.toUpperCase()) {
    case "ACCEPTED":
      return <CheckCircle className="text-green-600 dark:text-green-400 shrink-0" size={22} />;
    case "REJECTED":
      return <AlertCircle className="text-red-600 dark:text-red-400 shrink-0" size={22} />;
    case "APPLICATION":
      return <UserPlus className="text-blue-600 dark:text-blue-400 shrink-0" size={22} />;
    default:
      return <Users className="text-purple-600 dark:text-purple-400 shrink-0" size={22} />;
  }
}

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();

    // Auto-poll notifications every 15 seconds
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchNotifications(false);
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

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, is_read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <Bell size={26} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
              Notifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Real-time updates on team applications and member actions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/80 transition"
              title="Mark all as read"
            >
              <CheckCheck size={16} />
              Mark All Read
            </button>
          )}

          <button
            onClick={handleManualRefresh}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            title="Refresh Notifications"
          >
            <RotateCcw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400 text-base">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <Bell size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            No Notifications Yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-md mx-auto">
            You will receive instant alerts here whenever a student applies to your team or accepts your invite.
          </p>
          <button
            onClick={() => navigate("/teams")}
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20"
          >
            Explore Teams
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl shadow-xs border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
                item.is_read
                  ? "bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 opacity-85"
                  : "bg-blue-50/70 dark:bg-slate-800 border-blue-200 dark:border-blue-900/60 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="mt-0.5 shrink-0">
                  {getNotificationIcon(item.notification_type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-white leading-snug">
                      {item.title}
                    </h2>
                    {!item.is_read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0"></span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm break-words leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-slate-500">
                    <span>{formatTimeAgo(item.created_at)}</span>
                    <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400">
                      {item.notification_type.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700 w-full sm:w-auto justify-end">
                {item.notification_type?.toUpperCase() === "APPLICATION" && (
                  <Link
                    to="/applications"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <span>View Application</span>
                    <ExternalLink size={13} />
                  </Link>
                )}

                {!item.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    title="Mark as read"
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 transition"
                  >
                    <Check size={15} />
                    <span className="hidden sm:inline">Mark Read</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;