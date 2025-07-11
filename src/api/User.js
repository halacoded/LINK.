import instance from ".";
import { storeToken, getToken } from "./storage";

const signup = async (userData) => {
  try {
    const { data } = await instance.post("/users/signup", userData);
    storeToken(data.token);
    return data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
};

const login = async (credentials) => {
  try {
    const { data } = await instance.post("/users/login", credentials);
    storeToken(data.token);
    return data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

const getMe = async () => {
  try {
    const token = getToken();

    const { data } = await instance.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache", // ← add this
      },
    });

    return data;
  } catch (error) {
    console.error("GetMe error:", error.response?.data || error.message);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const encodedUsername = encodeURIComponent(username);
    const { data } = await instance.get(`/users/${encodedUsername}`);
    return data;
  } catch (error) {
    console.error(
      "Fetch user by username error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getAllUsers = async () => {
  const { data } = await instance.get("/users/all");
  return data;
};

const updateUser = async (userData) => {
  try {
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }

    const { data } = await instance.put("/users/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.error("Update user error:", error.response?.data || error.message);
    throw error;
  }
};

const completeProfile = async (userData) => {
  try {
    const token = getToken();

    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }

    const { data } = await instance.put("/users/update", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.error(
      "Complete profile error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getCompanyUsers = async () => {
  try {
    const { data } = await instance.get("/users/company-users", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return data;
  } catch (error) {
    console.error(
      "Get company users error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export {
  signup,
  login,
  getMe,
  getUserByUsername,
  getAllUsers,
  updateUser,
  completeProfile,
  getCompanyUsers,
};
