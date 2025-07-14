import { Reducer } from 'redux'
import { RsvpState, RsvpAction, RsvpActionTypes } from './types'

const INITIAL_STATE: RsvpState = {
  submitted: false,
  loading: false,
  error: null,
}

const reducer: Reducer<RsvpState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RsvpActionTypes.CREATE_RSVP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case RsvpActionTypes.CREATE_RSVP_SUCCESS:
      return {
        ...state,
        loading: false,
        submitted: true,
        error: null,
      }

    case RsvpActionTypes.CREATE_RSVP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }

    case RsvpActionTypes.CLEAR_RSVP:
      return INITIAL_STATE

    default:
      return state
  }
}

export default reducer