export interface Activity {
    id: number;
    action: string;
    entityType: string;
    entityId: number;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    description: string | null;
    createdAt: string;
    userId: number;
}