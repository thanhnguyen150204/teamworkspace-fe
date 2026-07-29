'use client'

import { useEffect } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { WorkspaceList } from "@/components/features/workspace/workspace-list";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function WorkspacesPage() {
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Workspaces</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <WorkspaceList
        workspaces={workspaces}
        onRefresh={fetchWorkspaces}
      />
    </div>
  );
}
