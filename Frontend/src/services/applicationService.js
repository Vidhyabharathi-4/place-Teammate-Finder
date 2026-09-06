import api from "./api";

// Apply to a team
const applyToTeam = async (teamId, message) => {
  const response = await api.post(
    `/api/applications/teams/${teamId}`,
    {
      message,
    }
  );

  return response.data;
};

// Get applications for a team (Team Owner)
const getTeamApplications = async (teamId) => {
  const response = await api.get(
    `/api/applications/teams/${teamId}`
  );

  return response.data;
};

// Get my applications (sent by me)
const getMyApplications = async () => {
  const response = await api.get("/api/applications/my");
  return response.data;
};

// Get all applications received for any of my teams
const getReceivedApplications = async () => {
  const response = await api.get("/api/applications/received");
  return response.data;
};

// Accept / Reject application
const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await api.put(
    `/api/applications/${applicationId}`,
    {
      status,
    }
  );

  return response.data;
};

const applicationService = {
  applyToTeam,
  getTeamApplications,
  getMyApplications,
  getReceivedApplications,
  updateApplicationStatus,
};

export default applicationService;