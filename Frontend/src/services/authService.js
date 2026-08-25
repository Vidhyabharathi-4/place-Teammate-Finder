import api from "./api";

// --------------------
// Login
// --------------------

export const login = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post(
    "/api/auth/login",
    formData,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

// --------------------
// Register
// --------------------

export const register = async (userData) => {
  const response = await api.post(
    "/api/auth/register",
    userData
  );

  return response.data;
};

// --------------------
// Current User
// --------------------

export const getCurrentUser = async () => {
  const response = await api.get(
    "/api/auth/me"
  );

  return response.data;
};

// --------------------
// Change Password
// --------------------

export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/api/auth/change-password",
    passwordData
  );

  return response.data;
};