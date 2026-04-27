import CONFIG from "@/config";

const API_BASE = `${CONFIG.NODE_API_URL}/analytics`;

export interface LogActivityParams {
  userId?: number;
  activityType: string;
  targetType?: "brand" | "car" | "category";
  targetValue?: string;
  carId?: string | number;
  city?: string;
  details?: any;
}

export const analyticsApi = {
  /**
   * Log user activity to the backend
   */
  async logActivity(params: LogActivityParams): Promise<void> {
    try {
      await fetch(`${API_BASE}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.warn("Analytics logging failed silently", error);
    }
  }
};
