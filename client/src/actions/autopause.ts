import toast from "react-hot-toast";
import { api } from "./api";

export interface ScheduleAutoPauseData {
  delayMinutes: number;
}

export const scheduleAutoPauseAction = async ({ delayMinutes }: ScheduleAutoPauseData) => {
  try {
    const response = await api.post("/autopause/remind-later", { delayMinutes });
    toast.success(`Auto‑pause scheduled in ${delayMinutes} minute${delayMinutes > 1 ? "s" : ""}`);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to schedule auto‑pause";
    toast.error(message);
    throw error;
  }
};

export const cancelAutoPauseAction = async () => {
  try {
    const response = await api.post("/autopause/cancel-pause");
    toast.success("Auto‑pause reminder cancelled");
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to cancel auto‑pause";
    toast.error(message);
    throw error;
  }
};
