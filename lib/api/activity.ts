import client from "./client";
import { Activity } from "@/types/activity";

export const activityApi = {
    getMyActivity: () => client.get<Activity[]>('/activity/me'),
    getWorkspaceActivity: (workspaceId: number) =>
        client.get<Activity[]>(`/activity/workspace/${workspaceId}`),
};
