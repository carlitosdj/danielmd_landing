import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { websocketService } from '../services/websocket.service';
import {
  websocketConnectSuccess,
  websocketConnectFailure,
  websocketDisconnect,
  giftBeingSelectedReceived,
  giftSelectedReceived,
  giftSelectionReleasedReceived,
  giftSelectionConflictReceived,
  giftConflictReceived,
  currentSelectionsReceived,
  setUserInfo,
} from '../store/ducks/gifts/actions';
import useTypedSelector from './useTypedSelector';

export const useWebSocket = (slug: string) => {
  const dispatch = useDispatch();
  const { userId } = useTypedSelector(state => state.gifts);
  const isConnectedRef = useRef(false);
  const slugRef = useRef<string | null>(null);

  useEffect(() => {
    // Generate user ID if not exists
    if (!userId) {
      const newUserId = websocketService.generateUserId();
      dispatch(setUserInfo(newUserId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (!slug || !userId) return;

    // Only connect if slug changed or not connected
    if (slugRef.current !== slug || !isConnectedRef.current) {
      // Setup callbacks
      websocketService.onConnectionChange((connected) => {
        isConnectedRef.current = connected;
        if (connected) {
          dispatch(websocketConnectSuccess());
        } else {
          dispatch(websocketDisconnect());
        }
      });

      websocketService.onGiftBeingSelected((event) => {
        dispatch(giftBeingSelectedReceived(event.giftId, event.userId, event.userName));
      });

      websocketService.onGiftSelected((event) => {
        dispatch(giftSelectedReceived(event.giftId, event.userId, event.userName, event.gift));
      });

      websocketService.onGiftSelectionReleased((event) => {
        dispatch(giftSelectionReleasedReceived(event.giftId, event.userId));
      });

      websocketService.onGiftSelectionConflict((event) => {
        dispatch(giftSelectionConflictReceived(event.giftId, event.message));
      });

      websocketService.onGiftConflict((event) => {
        dispatch(giftConflictReceived(event.giftId, event.userId, event.message));
      });

      websocketService.onCurrentSelections((events) => {
        dispatch(currentSelectionsReceived(events));
      });

      // Connect to WebSocket
      try {
        websocketService.connect(slug);
        slugRef.current = slug;
      } catch (error) {
        dispatch(websocketConnectFailure({ error: 'Erro ao conectar WebSocket' }));
      }
    }

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
      isConnectedRef.current = false;
      slugRef.current = null;
    };
  }, [slug, userId, dispatch]);

  return {
    connected: isConnectedRef.current,
    notifyGiftBeingSelected: (giftId: number, userName?: string) => {
      if (userId) {
        websocketService.notifyGiftBeingSelected(giftId, userId, userName);
      }
    },
    notifyGiftSelectionCancelled: (giftId: number) => {
      websocketService.notifyGiftSelectionCancelled(giftId);
    },
  };
};