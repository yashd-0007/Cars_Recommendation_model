import CONFIG from "@/config";

const API_URL = `${CONFIG.NODE_API_URL}/compare`;

export const compareApi = {
  addCar: async (userId: number, carId: number) => {
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, carId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add car dynamically to compare list");
    return data;
  },

  removeCar: async (userId: number, carId: number) => {
    const response = await fetch(`${API_URL}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, carId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to remove car securely from compare list");
    return data;
  },

  clearCompare: async (userId: number) => {
    const response = await fetch(`${API_URL}/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to securely wipe compare list");
    return data;
  },

  getCompareList: async (userId: number): Promise<number[]> => {
    const response = await fetch(`${API_URL}/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch compare arrays safely");
    return data.data; // Returns securely structured arrays of numeric car IDs
  },

  checkSaved: async (userId: number, carId: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/check/${userId}/${carId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to verify car compare status");
    return data.isSaved;
  },
};
