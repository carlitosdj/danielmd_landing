import { Reducer } from 'redux'
import { GiftsState, GiftsAction, GiftsActionTypes } from './types'

const INITIAL_STATE: GiftsState = {
  items: [],
  loading: false,
  error: null,
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
      return {
        ...state,
        loading: false,
        items: action.payload.data,
        error: null,
      }

    case GiftsActionTypes.MARK_GIFT_BOUGHT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.map(gift =>
          gift.id === action.payload.data.id ? action.payload.data : gift
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

    default:
      return state
  }
}

export default reducer