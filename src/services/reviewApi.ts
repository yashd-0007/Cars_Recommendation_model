import CONFIG from "@/config";

const API_URL = `${CONFIG.NODE_API_URL}/reviews`;

export interface Review {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  displayName?: string | null;
  createdAt: string;
  user?: {
    name: string;
    email?: string;
    city?: string;
  };
}

export const reviewApi = {
  submitReview: async (reviewData: {
    userId: number;
    rating: number;
    comment: string;
    displayName?: string;
  }) => {
    console.log("Submitting review data:", reviewData);
    const response = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: "Server returned non-JSON error" };
      }
      console.error("Backend error response:", errorData);
      throw new Error(errorData.message || "Failed to submit review");
    }
    return response.json();
  },

  getApprovedReviews: async () => {
    const response = await fetch(`${API_URL}/approved`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    const data = await response.json();
    return data.reviews as Review[];
  },

  checkUserReview: async (userId: number) => {
    const response = await fetch(`${API_URL}/check/${userId}`);
    if (!response.ok) throw new Error("Failed to check user review status");
    return response.json() as Promise<{ success: boolean; hasReviewed: boolean }>;
  },

  getAdminReviews: async () => {
    const response = await fetch(`${API_URL}/admin`);
    if (!response.ok) throw new Error("Failed to fetch admin reviews");
    const data = await response.json();
    return data.reviews as Review[];
  },

  updateReviewStatus: async (id: number, status: string) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update status");
    return response.json();
  },

  deleteReview: async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete review");
    return response.json();
  },
};
