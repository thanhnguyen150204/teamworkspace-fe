import client from "./client";
import { Activity } from "@/types/activity";

export const activityApi = {
    getMyActivity: () => client.get<any, Activity[]>('/activity/me'),
    getWorkspaceActivity: (workspaceId: number) =>
        client.get<any, Activity[]>(`/activity/workspace/${workspaceId}`),
};
