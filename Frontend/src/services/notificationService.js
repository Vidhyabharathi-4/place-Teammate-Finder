import api from "./api";

const getNotifications = async () => {
  const response = await api.get("/api/notifications/");
  return response.data;
};

const getUnreadCount = async () => {
  const response = await api.get("/api/notifications/unread-count");
  return response.data.count;
};

const markAsRead = async (notificationId) => {
  const response = await api.put(`/api/notifications/${notificationId}/read`);
  return response.data;
};

const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
};

export default notificationService;
