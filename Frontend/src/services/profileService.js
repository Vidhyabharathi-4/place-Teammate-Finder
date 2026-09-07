import api from "./api";

const getProfile = async () => {
  const response = await api.get("/api/profile");
  return response.data;
};

const getUserProfile = async (userId) => {
  const response = await api.get(`/api/profile/${userId}`);
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put("/api/profile", profileData);
  return response.data;
};

const uploadProfilePhoto = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/api/profile/upload-photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

const profileService = {
  getProfile,
  getUserProfile,
  updateProfile,
  uploadProfilePhoto,
};

export default profileService;