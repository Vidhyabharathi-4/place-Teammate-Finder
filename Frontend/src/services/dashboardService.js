import api from "./api";

const getDashboardStats = async () => {
  const response = await api.get("/api/dashboard/stats");
  return response.data;
};

const getUpcomingEvents = async () => {
  const response = await api.get("/api/dashboard/events");
  return response.data;
};

const dashboardService = {
  getDashboardStats,
  getUpcomingEvents,
};

export default dashboardService;
