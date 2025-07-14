import { Reducer } from 'redux'
import { AnniversaryState, AnniversaryAction, AnniversaryActionTypes } from './types'

const INITIAL_STATE: AnniversaryState = {
  current: null,
  loading: true, // Iniciar com loading true para mostrar loading inicial
  error: null,
}

const reducer: Reducer<AnniversaryState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_REQUEST:
    case AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_SUCCESS:
    case AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_SUCCESS:
      return {
        ...state,
        loading: false,
        current: action.payload.data,
        error: null,
      }

    case AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_FAILURE:
    case AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }

    case AnniversaryActionTypes.CLEAR_ANNIVERSARY:
      return INITIAL_STATE

    default:
      return state
  }
}

export default reducer