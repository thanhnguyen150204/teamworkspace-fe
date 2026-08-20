'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { useTaskStore } from '@/stores/task-store';
import { Task, TaskStatus } from '@/types';

interface TaskMovedPayload {
  taskId: number;
  oldStatus: TaskStatus;
  newStatus: TaskStatus;
  task: Task;
}

interface TaskDeletedPayload {
  taskId: number;
}

interface Comment {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: { id: number; fullName: string; avatar?: string };
}

/**
 * Connects to the project WebSocket room and wires up real-time event handlers.
 *
 * Call this hook inside the project layout. It automatically:
 *  - joins the room when the component mounts
 *  - leaves the room and cleans up listeners on unmount
 *
 * @param projectId  The numeric project ID to subscribe to
 */
export function useProjectSocket(projectId: number) {
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!projectId || isNaN(projectId)) return;

    const socket = getSocket();

    // Always ensure fresh token is set in handshake auth
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    socket.auth = { token };

    // ── Connection ────────────────────────────────────────────────────────────
    const handleConnect = () => {
      console.log(`[WS] Connected to server. Joining project-${projectId}...`);
      socket.emit('join_project', { projectId });
      joinedRef.current = true;
    };

    socket.on('connect', handleConnect);

    // If already connected, join immediately
    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    // ── Task events ───────────────────────────────────────────────────────────

    /** A new task was created by another user */
    socket.on('task_created', (task: Task) => {
      console.log('[WS] Received event task_created:', task);
      useTaskStore.setState((state) => {
        const kanban = state.kanban;
        if (!kanban) return state;

        const col = kanban[task.status] ?? [];
        const alreadyExists = col.some((t) => t.id === task.id);
        if (alreadyExists) return state;

        return {
          kanban: { ...kanban, [task.status]: [...col, task] },
          tasks: [...state.tasks, task],
        };
      });
    });

    /** A task was moved to a different status column */
    socket.on('task_moved', ({ taskId, oldStatus, newStatus, task }: TaskMovedPayload) => {
      console.log('[WS] Received event task_moved:', { taskId, oldStatus, newStatus, task });
      useTaskStore.setState((state) => {
        const kanban = state.kanban;
        if (!kanban) return state;

        const sourceCol = (kanban[oldStatus] ?? []).filter((t) => t.id !== taskId);
        const destCol   = [...(kanban[newStatus] ?? [])];

        if (!destCol.some((t) => t.id === taskId)) {
          destCol.push(task);
        }

        return {
          kanban: { ...kanban, [oldStatus]: sourceCol, [newStatus]: destCol },
          tasks: state.tasks.map((t) => (t.id === taskId ? task : t)),
          activeTask: state.activeTask?.id === taskId ? task : state.activeTask,
        };
      });
    });

    /** A task's fields (other than status) were updated */
    socket.on('task_updated', (task: Task) => {
      console.log('[WS] Received event task_updated:', task);
      useTaskStore.setState((state) => {
        const kanban = state.kanban;
        return {
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
          activeTask: state.activeTask?.id === task.id ? task : state.activeTask,
          kanban: kanban
            ? {
                ...kanban,
                [task.status]: kanban[task.status].map((t) =>
                  t.id === task.id ? task : t,
                ),
              }
            : null,
        };
      });
    });

    /** A task was soft-deleted */
    socket.on('task_deleted', ({ taskId }: TaskDeletedPayload) => {
      console.log('[WS] Received event task_deleted:', taskId);
      useTaskStore.setState((state) => {
        const kanban = state.kanban;
        const filtered: typeof kanban = kanban
          ? {
              TODO:        kanban.TODO.filter((t) => t.id !== taskId),
              IN_PROGRESS: kanban.IN_PROGRESS.filter((t) => t.id !== taskId),
              REVIEW:      kanban.REVIEW.filter((t) => t.id !== taskId),
              DONE:        kanban.DONE.filter((t) => t.id !== taskId),
            }
          : null;

        return {
          tasks: state.tasks.filter((t) => t.id !== taskId),
          activeTask: state.activeTask?.id === taskId ? null : state.activeTask,
          kanban: filtered,
        };
      });
    });

    // ── Comment events ────────────────────────────────────────────────────────
    socket.on('comment_added', (comment: Comment) => {
      // Dispatch a CustomEvent so CommentSection can append the new comment
      // without re-fetching from the API.
      window.dispatchEvent(
        new CustomEvent('ws:comment_added', { detail: comment }),
      );
    });

    // ── Error handling ────────────────────────────────────────────────────────
    socket.on('error', (err: { message: string }) => {
      console.error('[WS] Server error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('[WS] Disconnected:', reason);
      joinedRef.current = false;
    });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      console.log(`[WS] Leaving project-${projectId}...`);
      socket.emit('leave_project', { projectId });
      socket.off('connect', handleConnect);
      socket.off('task_created');
      socket.off('task_moved');
      socket.off('task_updated');
      socket.off('task_deleted');
      socket.off('comment_added');
      socket.off('error');
      socket.off('disconnect');
      joinedRef.current = false;
    };
  }, [projectId]);
}
