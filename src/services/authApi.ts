// API Configuration pointing to our newly created Node.js auth server
const API_URL = "http://localhost:5000/api/auth";

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
};
