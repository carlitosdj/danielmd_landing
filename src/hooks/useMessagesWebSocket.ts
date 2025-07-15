import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';

interface MessageCreatedEvent {
  anniversaryId: number;
  message: any;
}

interface MessageUpdatedEvent {
  messageId: number;
  message: any;
}

interface MessageDeletedEvent {
  messageId: number;
  anniversaryId: number;
}

export const useMessagesWebSocket = (anniversaryId?: number) => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!anniversaryId) return;

    const apiUrl = 'http://localhost:3010';
    
    // Connect to messages WebSocket
    const messagesSocket = io(`${apiUrl}/messages`, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = messagesSocket;

    // Messages WebSocket events
    messagesSocket.on('connect', () => {
      console.log('Landing WebSocket connected to messages');
      isConnectedRef.current = true;
      messagesSocket.emit('join-anniversary', { anniversaryId });
    });

    messagesSocket.on('disconnect', () => {
      console.log('Landing WebSocket disconnected from messages');
      isConnectedRef.current = false;
    });

    messagesSocket.on('message-created', (event: MessageCreatedEvent) => {
      console.log('Landing WebSocket: message-created', event);
      if (event.anniversaryId === anniversaryId) {
        // Dispatch action to add message to landing store
        dispatch({
          type: '@messages/MESSAGE_CREATED_RECEIVED',
          payload: { message: event.message }
        });
      }
    });

    messagesSocket.on('message-updated', (event: MessageUpdatedEvent) => {
      console.log('Landing WebSocket: message-updated', event);
      // Dispatch action to update message in landing store
      dispatch({
        type: '@messages/MESSAGE_UPDATED_RECEIVED',
        payload: { messageId: event.messageId, message: event.message }
      });
    });

    messagesSocket.on('message-deleted', (event: MessageDeletedEvent) => {
      console.log('Landing WebSocket: message-deleted', event);
      if (event.anniversaryId === anniversaryId) {
        // Dispatch action to remove message from landing store
        dispatch({
          type: '@messages/MESSAGE_DELETED_RECEIVED',
          payload: { messageId: event.messageId }
        });
      }
    });

    // Cleanup on unmount
    return () => {
      messagesSocket.disconnect();
      isConnectedRef.current = false;
    };
  }, [anniversaryId, dispatch]);

  return {
    connected: isConnectedRef.current,
    socket: socketRef.current,
  };
};