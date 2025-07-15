import { action } from 'typesafe-actions'
import { GiftsActionTypes } from './types'
import { Gift } from '../../../lib/types'

export const loadGiftsRequest = (slug: string) =>
  action(GiftsActionTypes.LOAD_GIFTS_REQUEST, { slug })

export const loadGiftsSuccess = (data: Gift[]) =>
  action(GiftsActionTypes.LOAD_GIFTS_SUCCESS, { data })

export const loadGiftsFailure = (error: string) =>
  action(GiftsActionTypes.LOAD_GIFTS_FAILURE, { error })

export const markGiftBoughtRequest = (giftId: number, boughtBy: string, version: number, userId?: string) =>
  action(GiftsActionTypes.MARK_GIFT_BOUGHT_REQUEST, { giftId, boughtBy, version, userId })

export const markGiftBoughtSuccess = (data: Gift) =>
  action(GiftsActionTypes.MARK_GIFT_BOUGHT_SUCCESS, { data })

export const markGiftBoughtFailure = (error: string) =>
  action(GiftsActionTypes.MARK_GIFT_BOUGHT_FAILURE, { error })

export const clearGifts = () =>
  action(GiftsActionTypes.CLEAR_GIFTS)

// WebSocket Connection Actions
export const websocketConnectRequest = (slug: string) =>
  action(GiftsActionTypes.WEBSOCKET_CONNECT_REQUEST, { slug })

export const websocketConnectSuccess = () =>
  action(GiftsActionTypes.WEBSOCKET_CONNECT_SUCCESS)

export const websocketConnectFailure = (error: string) =>
  action(GiftsActionTypes.WEBSOCKET_CONNECT_FAILURE, { error })

export const websocketDisconnect = () =>
  action(GiftsActionTypes.WEBSOCKET_DISCONNECT)

// Gift Selection State Actions
export const giftBeingSelectedReceived = (giftId: number, userId: string, userName?: string) =>
  action(GiftsActionTypes.GIFT_BEING_SELECTED_RECEIVED, { giftId, userId, userName })

export const giftSelectedReceived = (giftId: number, userId: string, userName: string, gift: Gift) =>
  action(GiftsActionTypes.GIFT_SELECTED_RECEIVED, { giftId, userId, userName, gift })

export const giftSelectionReleasedReceived = (giftId: number, userId: string) =>
  action(GiftsActionTypes.GIFT_SELECTION_RELEASED_RECEIVED, { giftId, userId })

export const giftSelectionConflictReceived = (giftId: number, message: string) =>
  action(GiftsActionTypes.GIFT_SELECTION_CONFLICT_RECEIVED, { giftId, message })

export const giftConflictReceived = (giftId: number, userId: string, message: string) =>
  action(GiftsActionTypes.GIFT_CONFLICT_RECEIVED, { giftId, userId, message })

export const currentSelectionsReceived = (selections: { giftId: number; userId: string }[]) =>
  action(GiftsActionTypes.CURRENT_SELECTIONS_RECEIVED, selections)

// Local Actions (para UI)
export const startGiftSelection = (giftId: number, userId: string, userName?: string) =>
  action(GiftsActionTypes.START_GIFT_SELECTION, { giftId, userId, userName })

export const cancelGiftSelection = (giftId: number) =>
  action(GiftsActionTypes.CANCEL_GIFT_SELECTION, { giftId })

export const clearGiftConflictMessage = (giftId: number) =>
  action(GiftsActionTypes.CLEAR_GIFT_CONFLICT_MESSAGE, { giftId })

export const setUserInfo = (userId: string, userName?: string) =>
  action(GiftsActionTypes.SET_USER_INFO, { userId, userName })

// Update gift versions for optimistic locking
export const updateGiftVersions = (giftVersions: { [giftId: number]: number }) =>
  action(GiftsActionTypes.UPDATE_GIFT_VERSIONS, giftVersions)