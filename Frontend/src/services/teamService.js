import api from "./api";

// Get all available teams
const getAllTeams = async () => {
  const response = await api.get("/api/teams");
  return response.data;
};

// Get a single team by ID
const getTeamById = async (teamId) => {
  const response = await api.get(`/api/teams/${teamId}`);
  return response.data;
};

// Create a new team
const createTeam = async (teamData) => {
  const response = await api.post("/api/teams", teamData);
  return response.data;
};

// Get teams created by the logged-in user
const getMyTeams = async () => {
  const response = await api.get("/api/teams/my");
  return response.data;
};

// Get members of a specific team
const getTeamMembers = async (teamId) => {
  const response = await api.get(`/api/teams/${teamId}/members`);
  return response.data;
};

const teamService = {
  getAllTeams,
  getTeamById,
  createTeam,
  getMyTeams,
  getTeamMembers,
};

export default teamService;