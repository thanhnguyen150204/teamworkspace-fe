'use client'

import { useWorkspaceStore } from "@/stores/workspace-store"
import { WorkspaceRole } from "@/types"

export interface Permission{
    isOwner: boolean
    isAdmin: boolean
    isMember: boolean
    isManagerOrAbove: boolean

    canEditWorkspace: boolean
    canDeleteWorkspace: boolean

    canCreateProject: boolean
    canEditProject: boolean
    canDeleteProject: boolean

    canInviteMember: boolean
    canUpdateMemberRole: boolean
    canRemoveMember: boolean

    canAccessSettings: boolean
}
export function usePermission(): Permission{
    const {myRole} = useWorkspaceStore()

    const isOwner = myRole === WorkspaceRole.OWNER
    const isAdmin = myRole === WorkspaceRole.ADMIN
    const isMember = myRole === WorkspaceRole.MEMBER
    const isManagerOrAbove = isOwner || isAdmin
    return{
        isOwner,
        isAdmin,
        isMember,
        isManagerOrAbove,

        canEditWorkspace: isManagerOrAbove,
        canDeleteWorkspace: isOwner,
        canCreateProject: isManagerOrAbove,
        canEditProject: isManagerOrAbove,
        canDeleteProject: isManagerOrAbove,
        
        canInviteMember: isManagerOrAbove,
        canRemoveMember: isOwner,
        canUpdateMemberRole: isOwner,

        canAccessSettings: isManagerOrAbove,
    }
}