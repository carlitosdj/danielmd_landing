import { Reducer } from 'redux'
import { MessagesState, MessagesAction, MessagesActionTypes } from './types'

const INITIAL_STATE: MessagesState = {
  items: [],
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
}

const reducer: Reducer<MessagesState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MessagesActionTypes.LOAD_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case MessagesActionTypes.CREATE_MESSAGE_REQUEST:
      return {
        ...state,
        submitting: true,
        submitError: null,
      }

    case MessagesActionTypes.LOAD_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.data,
        error: null,
      }

    case MessagesActionTypes.CREATE_MESSAGE_SUCCESS:
      return {
        ...state,
        submitting: false,
        items: [...state.items, action.payload.data],
        submitError: null,
      }

    case MessagesActionTypes.LOAD_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }

    case MessagesActionTypes.CREATE_MESSAGE_FAILURE:
      return {
        ...state,
        submitting: false,
        submitError: action.payload.error,
      }

    case MessagesActionTypes.CLEAR_MESSAGES:
      return INITIAL_STATE

    // WebSocket events
    case MessagesActionTypes.MESSAGE_CREATED_RECEIVED:
      return {
        ...state,
        items: [...state.items, action.payload.message],
      }

    case MessagesActionTypes.MESSAGE_UPDATED_RECEIVED:
      return {
        ...state,
        items: state.items.map(message =>
          message.id === action.payload.messageId ? action.payload.message : message
        ),
      }

    case MessagesActionTypes.MESSAGE_DELETED_RECEIVED:
      return {
        ...state,
        items: state.items.filter(message => message.id !== action.payload.messageId),
      }

    default:
      return state
  }
}

export default reducer