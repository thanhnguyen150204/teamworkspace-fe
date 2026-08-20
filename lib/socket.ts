import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Returns a singleton socket instance.
 * Automatically reads JWT from localStorage and attaches it to the handshake auth.
 */
export function getSocket(): Socket {
  if (!socket) {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;

    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      withCredentials: true,
      autoConnect: false, // connect manually via useProjectSocket
      transports: ['websocket'], // skip long-polling
    });
  }
  return socket;
}

/**
 * Updates the token on the socket instance (call this after token refresh).
 * Must be called before reconnecting.
 */
export function updateSocketToken(token: string) {
  const s = getSocket();
  s.auth = { token };
}

/**
 * Disconnects and destroys the singleton (call this on logout).
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
