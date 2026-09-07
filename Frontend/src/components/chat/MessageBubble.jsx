import { Check, CheckCheck } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

function formatMessageTime(dateString) {
  if (!dateString) return "";
  let iso = String(dateString);
  if (!iso.endsWith("Z") && !iso.includes("+") && !iso.slice(10).includes("-")) {
    iso += "Z";
  }
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return timeStr;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `Yesterday, ${timeStr}`;

  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
}

function MessageBubble({
  message,
  isOwn,
  showSender = false,
  isTeamChat = false,
}) {
  const avatarUrl = getImageUrl(message.sender_profile_picture);
  const senderInitials = (message.sender_name || "U").charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-end gap-2.5 my-1.5 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* Sender Avatar for other users in team chat */}
      {!isOwn && isTeamChat && (
        <div className="shrink-0 mb-1">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={message.sender_name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-2xs">
              {senderInitials}
            </div>
          )}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[82%] sm:max-w-[70%] md:max-w-[62%] px-4 py-2.5 shadow-xs transition-all ${
          isOwn
            ? "bg-blue-600 text-white rounded-2xl rounded-br-xs"
            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl rounded-bl-xs"
        }`}
      >
        {/* Sender Name in Team Chat for other users */}
        {!isOwn && (showSender || isTeamChat) && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {message.sender_name || `User #${message.sender_id}`}
            </span>
            {message.sender_department && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                • {message.sender_department}
              </span>
            )}
          </div>
        )}

        {/* Message Text */}
        <p className="text-sm sm:text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">
          {message.message}
        </p>

        {/* Timestamp & Read Status */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[10.5px] select-none ${
            isOwn ? "text-blue-100/90" : "text-slate-400 dark:text-slate-500"
          }`}
        >
          <span>{formatMessageTime(message.created_at)}</span>

          {isOwn && (
            <span className="ml-0.5 inline-flex items-center">
              {message.is_read ? (
                <CheckCheck size={14} className="text-white" title="Read" />
              ) : (
                <Check size={14} className="text-blue-200" title="Sent" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
