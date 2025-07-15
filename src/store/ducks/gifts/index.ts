import { Reducer } from 'redux'
import { GiftsState, GiftsActionTypes } from './types'
import { Gift } from '../../../lib/types'

const INITIAL_STATE: GiftsState = {
  items: [],
  loading: false,
  error: null,
  
  // Concurrency state
  websocketConnected: false,
  websocketError: null,
  activeSelections: [],
  conflictMessages: {},
  giftVersions: {},
  
  // User info
  userId: null,
  userName: null,
}

const reducer: Reducer<GiftsState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GiftsActionTypes.LOAD_GIFTS_REQUEST:
    case GiftsActionTypes.MARK_GIFT_BOUGHT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case GiftsActionTypes.LOAD_GIFTS_SUCCESS:
      const giftVersions = action.payload.data.reduce((acc: { [giftId: number]: number }, gift: Gift) => {
        acc[gift.id] = gift.version || 1;
        return acc;
      }, {} as { [giftId: number]: number });
      
      return {
        ...state,
        loading: false,
        items: action.payload.data,
        giftVersions: {
          ...state.giftVersions,
          ...giftVersions,
        },
        error: null,
      }

    case GiftsActionTypes.MARK_GIFT_BOUGHT_SUCCESS:
      const updatedGift = action.payload.data;
      return {
        ...state,
        loading: false,
        items: state.items.map(gift =>
          gift.id === updatedGift.id ? updatedGift : gift
        ),
        giftVersions: {
          ...state.giftVersions,
          [updatedGift.id]: updatedGift.version || 1,
        },
        // Remove active selection for this gift
        activeSelections: state.activeSelections.filter(
          selection => selection.giftId !== updatedGift.id
        ),
        error: null,
      }

    case GiftsActionTypes.LOAD_GIFTS_FAILURE:
    case GiftsActionTypes.MARK_GIFT_BOUGHT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }

    case GiftsActionTypes.CLEAR_GIFTS:
      return INITIAL_STATE

    // WebSocket Connection
    case GiftsActionTypes.WEBSOCKET_CONNECT_SUCCESS:
      return {
        ...state,
        websocketConnected: true,
        websocketError: null,
      }

    case GiftsActionTypes.WEBSOCKET_CONNECT_FAILURE:
      return {
        ...state,
        websocketConnected: false,
        websocketError: action.payload.error,
      }

    case GiftsActionTypes.WEBSOCKET_DISCONNECT:
      return {
        ...state,
        websocketConnected: false,
        websocketError: null,
        activeSelections: [], // Clear selections on disconnect
      }

    // Gift Selection Events
    case GiftsActionTypes.GIFT_BEING_SELECTED_RECEIVED: {
      const { giftId, userId, userName } = action.payload;
      
      // Don't add if already being selected by this user
      const existingSelection = state.activeSelections.find(
        selection => selection.giftId === giftId && selection.userId === userId
      );
      
      if (existingSelection) {
        return state;
      }
      
      return {
        ...state,
        activeSelections: [
          ...state.activeSelections.filter(selection => selection.giftId !== giftId),
          {
            giftId,
            userId,
            userName,
            timestamp: Date.now(),
          },
        ],
      };
    }

    case GiftsActionTypes.GIFT_SELECTED_RECEIVED: {
      const { giftId, gift } = action.payload;
      
      return {
        ...state,
        // Update gift in items
        items: state.items.map(item =>
          item.id === giftId ? { ...item, ...gift } : item
        ),
        // Update gift version
        giftVersions: {
          ...state.giftVersions,
          [giftId]: gift.version || 1,
        },
        // Remove from active selections
        activeSelections: state.activeSelections.filter(
          selection => selection.giftId !== giftId
        ),
        // Clear any conflict messages for this gift
        conflictMessages: {
          ...state.conflictMessages,
          [giftId]: undefined,
        },
      };
    }

    case GiftsActionTypes.GIFT_SELECTION_RELEASED_RECEIVED: {
      const { giftId, userId } = action.payload;
      
      return {
        ...state,
        activeSelections: state.activeSelections.filter(
          selection => !(selection.giftId === giftId && selection.userId === userId)
        ),
      };
    }

    case GiftsActionTypes.GIFT_SELECTION_CONFLICT_RECEIVED: {
      const { giftId, message } = action.payload;
      
      return {
        ...state,
        conflictMessages: {
          ...state.conflictMessages,
          [giftId]: {
            giftId,
            message,
            timestamp: Date.now(),
          },
        },
      };
    }

    case GiftsActionTypes.GIFT_CONFLICT_RECEIVED: {
      const { giftId, message } = action.payload;
      
      return {
        ...state,
        conflictMessages: {
          ...state.conflictMessages,
          [giftId]: {
            giftId,
            message,
            timestamp: Date.now(),
          },
        },
        // Remove from active selections
        activeSelections: state.activeSelections.filter(
          selection => selection.giftId !== giftId
        ),
      };
    }

    case GiftsActionTypes.CURRENT_SELECTIONS_RECEIVED: {
      const selections = action.payload.map((selection: { giftId: number; userId: string }) => ({
        ...selection,
        timestamp: Date.now(),
      }));
      
      return {
        ...state,
        activeSelections: selections,
      };
    }

    // Local Actions
    case GiftsActionTypes.START_GIFT_SELECTION: {
      const { giftId, userId, userName } = action.payload;
      
      return {
        ...state,
        activeSelections: [
          ...state.activeSelections.filter(selection => selection.giftId !== giftId),
          {
            giftId,
            userId,
            userName,
            timestamp: Date.now(),
          },
        ],
      };
    }

    case GiftsActionTypes.CANCEL_GIFT_SELECTION: {
      const { giftId } = action.payload;
      
      return {
        ...state,
        activeSelections: state.activeSelections.filter(
          selection => selection.giftId !== giftId
        ),
      };
    }

    case GiftsActionTypes.CLEAR_GIFT_CONFLICT_MESSAGE: {
      const { giftId } = action.payload;
      
      return {
        ...state,
        conflictMessages: {
          ...state.conflictMessages,
          [giftId]: undefined,
        },
      };
    }

    case GiftsActionTypes.SET_USER_INFO: {
      const { userId, userName } = action.payload;
      
      return {
        ...state,
        userId,
        userName,
      };
    }

    case GiftsActionTypes.UPDATE_GIFT_VERSIONS:
      return {
        ...state,
        giftVersions: {
          ...state.giftVersions,
          ...action.payload,
        },
      };

    default:
      return state
  }
}

export default reducer