const API_URL = "http://localhost:5001/api/wishlist";

export const wishlistApi = {
  addCar: async (userId: number, carId: number) => {
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, carId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add car to wishlist");
    return data;
  },

  removeCar: async (userId: number, carId: number) => {
    const response = await fetch(`${API_URL}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, carId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to remove car from wishlist");
    return data;
  },

  getWishlist: async (userId: number): Promise<number[]> => {
    const response = await fetch(`${API_URL}/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch wishlist");
    return data.data; // Returns array of numeric car IDs
  },

  checkSaved: async (userId: number, carId: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/check/${userId}/${carId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to verify car save status");
    return data.isSaved;
  },
};
