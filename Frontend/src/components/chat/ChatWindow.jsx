import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Users,
  Shield,
  ExternalLink,
  ChevronDown,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { getImageUrl } from "../../utils/imageUrl";

function ChatWindow({
  activeConversation,
  currentUserId,
  messages,
  loadingMessages,
  wsConnected,
  wsConnecting,
  onSendMessage,
  onSendTyping,
  partnerTyping,
  onBackToList,
}) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);
  const isAutoScrollActive = useRef(true);

  // Check if user is near bottom
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < 140) {
      isAutoScrollActive.current = true;
      setShowScrollBottomButton(false);
    } else {
      isAutoScrollActive.current = false;
      setShowScrollBottomButton(true);
    }
  };

  // Scroll to bottom helper
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
      setShowScrollBottomButton(false);
      isAutoScrollActive.current = true;
    }
  };

  // On new messages or when conversation changes, scroll to bottom if user is near bottom
  useEffect(() => {
    if (isAutoScrollActive.current) {
      scrollToBottom(false);
    }
  }, [messages]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-sm">
          <Users size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          No Conversation Selected
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          Choose a conversation from the sidebar or click "New Chat" to start messaging teammates.
        </p>
      </div>
    );
  }

  const isTeam = activeConversation.type === "team";
  const avatarUrl = getImageUrl(activeConversation.avatar);
  const initials = (activeConversation.name || "?").charAt(0).toUpperCase();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/70 dark:bg-slate-900 overflow-hidden relative">
      {/* Chat Header */}
      <header className="px-4 py-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          <button
            onClick={onBackToList}
            className="p-1.5 -ml-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            title="Back to conversations"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Conversation Avatar */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={activeConversation.name}
                className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-2xl text-white font-bold flex items-center justify-center text-sm shadow-2xs ${
                  isTeam
                    ? "bg-linear-to-br from-indigo-500 to-purple-600"
                    : "bg-linear-to-br from-blue-500 to-cyan-600"
                }`}
              >
                {isTeam ? <Users size={18} /> : initials}
              </div>
            )}

            {!isTeam && activeConversation.is_online && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
                title="Online"
              />
            )}
          </div>

          {/* Name & Status */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate leading-snug">
                {activeConversation.name}
              </h2>

              {isTeam && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  Team
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {isTeam ? (
                activeConversation.subtext || "Team Chat"
              ) : activeConversation.is_online ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ● Online
                </span>
              ) : (
                <span>Offline</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Connection Status Indicator */}
          {wsConnecting ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Wifi className="animate-pulse" size={12} />
              Connecting...
            </span>
          ) : wsConnected ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Wifi size={12} />
              Live
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <WifiOff size={12} />
              Reconnecting
            </span>
          )}

          {/* Quick link to Team Details or Student Profile */}
          {isTeam ? (
            <button
              onClick={() => navigate(`/teams/${activeConversation.target_id}`)}
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="View Team Details"
            >
              <ExternalLink size={17} />
            </button>
          ) : (
            <button
              onClick={() => navigate(`/profile/${activeConversation.target_id}`)}
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="View Student Profile"
            >
              <ExternalLink size={17} />
            </button>
          )}
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-1.5 relative"
      >
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full text-sm text-slate-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12 select-none">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Shield size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {isTeam
                ? "Start the conversation with your team"
                : "This is the beginning of your conversation"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {isTeam
                ? "Collaborate on tasks, discuss project deliverables, and coordinate meetings in real-time."
                : "Send a friendly greeting to introduce yourself and start collaborating on exciting projects."}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={isOwn}
                isTeamChat={isTeam}
              />
            );
          })
        )}

        {/* Partner Typing Indicator */}
        {partnerTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-1 italic animate-pulse">
            <span>Someone is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottomButton && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute right-6 bottom-20 z-20 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-lg hover:bg-blue-700 transition transform active:scale-95"
        >
          <span>New messages</span>
          <ChevronDown size={15} />
        </button>
      )}

      {/* Bottom Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onTyping={onSendTyping}
        disabled={loadingMessages}
      />
    </div>
  );
}

export default ChatWindow;
