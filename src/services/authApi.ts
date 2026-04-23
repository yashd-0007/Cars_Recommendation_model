// API Configuration pointing to our newly created Node.js auth server
import CONFIG from "@/config";

const API_URL = `${CONFIG.NODE_API_URL}/auth`;

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong during login");
    }

    return data;
  },
  signup: async (name: string, email: string, password: string, city: string) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, city }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong during registration");
    }

    return data;
  },
};
