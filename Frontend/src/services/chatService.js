import api from "./api";

/**
 * Helper to get the appropriate WebSocket base URL
 * Supports local dev (ws://127.0.0.1:8000) and production on Render (wss://place-teammate-finder.onrender.com)
 */
export const getWebSocketBaseUrl = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL.replace(/\/+$/, "");
  }

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/^http/, "ws").replace(/\/+$/, "");
  }

  if (import.meta.env.PROD) {
    return "wss://place-teammate-finder.onrender.com";
  }

  return "ws://127.0.0.1:8000";
};

// -------------------------------------------------------------------
// REST API Operations
// -------------------------------------------------------------------

// 1. Get all active conversations (DMs & Team Chats)
const getConversations = async () => {
  const response = await api.get("/api/chat/conversations");
  return response.data;
};

// 2. Get unread message count
const getUnreadCount = async () => {
  const response = await api.get("/api/chat/unread-count");
  return response.data;
};

// 3. Search students with optional search term and specialization filter
const searchChatUsers = async (params = {}) => {
  const response = await api.get("/api/chat/users", { params });
  return response.data;
};

// 4. Get direct message history between logged in user and target user
const getDirectMessages = async (userId, limit = 50, offset = 0) => {
  const response = await api.get(`/api/chat/direct/${userId}`, {
    params: { limit, offset },
  });
  return response.data;
};

// 5. Send direct message (REST fallback)
const sendDirectMessage = async (userId, message) => {
  const response = await api.post(`/api/chat/direct/${userId}`, { message });
  return response.data;
};

// 6. Mark direct messages from a user as read
const markDirectAsRead = async (userId) => {
  const response = await api.post(`/api/chat/direct/${userId}/read`);
  return response.data;
};

// 7. Get team group chat messages
const getTeamMessages = async (teamId, limit = 50, offset = 0) => {
  const response = await api.get(`/api/chat/team/${teamId}`, {
    params: { limit, offset },
  });
  return response.data;
};

// 8. Send team group chat message (REST fallback)
const sendTeamMessage = async (teamId, message) => {
  const response = await api.post(`/api/chat/team/${teamId}`, { message });
  return response.data;
};

const chatService = {
  getWebSocketBaseUrl,
  getConversations,
  getUnreadCount,
  searchChatUsers,
  getDirectMessages,
  sendDirectMessage,
  markDirectAsRead,
  getTeamMessages,
  sendTeamMessage,
};

export default chatService;
