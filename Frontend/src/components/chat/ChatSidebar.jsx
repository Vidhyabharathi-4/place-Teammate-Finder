import { useState } from "react";
import {
  Search,
  MessageSquarePlus,
  Users,
  User,
  X,
  Sparkles,
  Award,
} from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

const SPECIALIZATION_OPTIONS = [
  "All Specializations",
  "R-Smart",
  "R-Smart-Pro",
  "Intellect",
  "Intellect Engineering",
  "Arts / Others",
];

function formatTimePreview(dateString) {
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

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  totalUnread,
  onStartNewChat,
  availableStudents,
  searchStudentsQuery,
  onSearchStudentsChange,
  studentSpecialization,
  onStudentSpecializationChange,
  searchingStudents,
}) {
  const [filterType, setFilterType] = useState("all"); // 'all', 'direct', 'team'
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (filterType === "direct" && c.type !== "direct") return false;
    if (filterType === "team" && c.type !== "team") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = c.name?.toLowerCase().includes(q);
      const msgMatch = c.last_message?.toLowerCase().includes(q);
      const subtextMatch = c.subtext?.toLowerCase().includes(q);
      return nameMatch || msgMatch || subtextMatch;
    }
    return true;
  });

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 select-none">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              Chats
            </h1>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
                {totalUnread}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowNewChatModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 text-xs font-semibold transition"
            title="Start new direct message"
          >
            <MessageSquarePlus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Conversations Input */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === "all"
                ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("direct")}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === "direct"
                ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setFilterType("team")}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === "team"
                ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Users size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No conversations found
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? "No chats matched your search query."
                : "Start a conversation by messaging a teammate or joining a team."}
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs"
            >
              <MessageSquarePlus size={15} />
              <span>Find Students</span>
            </button>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const avatarUrl = getImageUrl(conv.avatar);
            const initials = (conv.name || "?").charAt(0).toUpperCase();

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`flex items-center gap-3 p-3.5 sm:px-4 cursor-pointer transition-colors relative ${
                  isActive
                    ? "bg-blue-50/90 dark:bg-slate-800 border-l-4 border-blue-600"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {/* Avatar with Status indicator */}
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={conv.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-2xl text-white font-bold flex items-center justify-center text-base shadow-2xs ${
                        conv.type === "team"
                          ? "bg-linear-to-br from-indigo-500 to-purple-600"
                          : "bg-linear-to-br from-blue-500 to-cyan-600"
                      }`}
                    >
                      {conv.type === "team" ? (
                        <Users size={20} />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                  )}

                  {/* Online Status Dot for DMs */}
                  {conv.type === "direct" && conv.is_online && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
                      title="Online"
                    />
                  )}
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h2
                      className={`text-sm font-semibold truncate ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-bold"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {conv.name}
                    </h2>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                      {formatTimePreview(conv.last_message_time)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {conv.last_message || "No messages yet"}
                    </p>

                    {/* Unread Badge */}
                    {conv.unread_count > 0 && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-2xs">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Chat Student Discovery Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    Find Teammates to Message
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connect directly with students by skills & specialization
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Specialization Filter & Search */}
            <div className="py-4 space-y-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by student name, skills, department..."
                  value={searchStudentsQuery}
                  onChange={(e) => onSearchStudentsChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Specialization select */}
              <div className="flex items-center gap-2">
                <Award size={16} className="text-indigo-600 shrink-0" />
                <select
                  value={studentSpecialization}
                  onChange={(e) =>
                    onStudentSpecializationChange(e.target.value)
                  }
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-hidden"
                >
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Results List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 pr-1">
              {searchingStudents ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  Searching students...
                </div>
              ) : availableStudents.length === 0 ? (
                <div className="py-12 text-center">
                  <User size={32} className="mx-auto text-slate-400 mb-2 opacity-60" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No students found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try changing your search keywords or specialization filter.
                  </p>
                </div>
              ) : (
                availableStudents.map((student) => {
                  const sAvatar = getImageUrl(student.profile_picture);
                  return (
                    <div
                      key={student.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {sAvatar ? (
                          <img
                            src={sAvatar}
                            alt={student.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                            {student.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {student.department || "Student"}{" "}
                            {student.specialization && (
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                • {student.specialization}
                              </span>
                            )}
                          </p>
                          {student.skills && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              Skills: {student.skills}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowNewChatModal(false);
                          onStartNewChat(student);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shrink-0 shadow-xs"
                      >
                        Message
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default ChatSidebar;
