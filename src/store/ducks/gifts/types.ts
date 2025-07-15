import { Gift } from '../../../lib/types'

export interface GiftSelection {
  giftId: number
  userId: string
  userName?: string
  timestamp: number
}

export interface GiftConflict {
  giftId: number
  message: string
  timestamp: number
}

export interface GiftsState {
  items: Gift[]
  loading: boolean
  error: string | null
  
  // Concurrency state
  websocketConnected: boolean
  websocketError: string | null
  activeSelections: GiftSelection[]
  conflictMessages: { [giftId: number]: GiftConflict | undefined }
  giftVersions: { [giftId: number]: number }
  
  // User info
  userId: string | null
  userName: string | null
}

export enum GiftsActionTypes {
  LOAD_GIFTS_REQUEST = '@gifts/LOAD_GIFTS_REQUEST',
  LOAD_GIFTS_SUCCESS = '@gifts/LOAD_GIFTS_SUCCESS',
  LOAD_GIFTS_FAILURE = '@gifts/LOAD_GIFTS_FAILURE',

  MARK_GIFT_BOUGHT_REQUEST = '@gifts/MARK_GIFT_BOUGHT_REQUEST',
  MARK_GIFT_BOUGHT_SUCCESS = '@gifts/MARK_GIFT_BOUGHT_SUCCESS',
  MARK_GIFT_BOUGHT_FAILURE = '@gifts/MARK_GIFT_BOUGHT_FAILURE',

  CLEAR_GIFTS = '@gifts/CLEAR_GIFTS',

  // WebSocket Connection Actions
  WEBSOCKET_CONNECT_REQUEST = 'gifts/websocket/CONNECT_REQUEST',
  WEBSOCKET_CONNECT_SUCCESS = 'gifts/websocket/CONNECT_SUCCESS',
  WEBSOCKET_CONNECT_FAILURE = 'gifts/websocket/CONNECT_FAILURE',
  WEBSOCKET_DISCONNECT = 'gifts/websocket/DISCONNECT',

  // Gift Selection State Actions
  GIFT_BEING_SELECTED_RECEIVED = 'gifts/concurrency/GIFT_BEING_SELECTED_RECEIVED',
  GIFT_SELECTED_RECEIVED = 'gifts/concurrency/GIFT_SELECTED_RECEIVED',
  GIFT_SELECTION_RELEASED_RECEIVED = 'gifts/concurrency/GIFT_SELECTION_RELEASED_RECEIVED',
  GIFT_SELECTION_CONFLICT_RECEIVED = 'gifts/concurrency/GIFT_SELECTION_CONFLICT_RECEIVED',
  GIFT_CONFLICT_RECEIVED = 'gifts/concurrency/GIFT_CONFLICT_RECEIVED',
  CURRENT_SELECTIONS_RECEIVED = 'gifts/concurrency/CURRENT_SELECTIONS_RECEIVED',

  // Local Actions (para UI)
  START_GIFT_SELECTION = 'gifts/concurrency/START_GIFT_SELECTION',
  CANCEL_GIFT_SELECTION = 'gifts/concurrency/CANCEL_GIFT_SELECTION',
  CLEAR_GIFT_CONFLICT_MESSAGE = 'gifts/concurrency/CLEAR_GIFT_CONFLICT_MESSAGE',
  SET_USER_INFO = 'gifts/concurrency/SET_USER_INFO',

  // Update gift versions for optimistic locking
  UPDATE_GIFT_VERSIONS = 'gifts/concurrency/UPDATE_GIFT_VERSIONS',
}

export interface LoadGiftsRequestAction {
  type: GiftsActionTypes.LOAD_GIFTS_REQUEST
  payload: { slug: string }
}

export interface LoadGiftsSuccessAction {
  type: GiftsActionTypes.LOAD_GIFTS_SUCCESS
  payload: { data: Gift[] }
}

export interface LoadGiftsFailureAction {
  type: GiftsActionTypes.LOAD_GIFTS_FAILURE
  payload: { error: string }
}

export interface MarkGiftBoughtRequestAction {
  type: GiftsActionTypes.MARK_GIFT_BOUGHT_REQUEST
  payload: { giftId: number; boughtBy: string; version: number; userId?: string }
}

export interface MarkGiftBoughtSuccessAction {
  type: GiftsActionTypes.MARK_GIFT_BOUGHT_SUCCESS
  payload: { data: Gift }
}

export interface MarkGiftBoughtFailureAction {
  type: GiftsActionTypes.MARK_GIFT_BOUGHT_FAILURE
  payload: { error: string }
}

export interface ClearGiftsAction {
  type: GiftsActionTypes.CLEAR_GIFTS
}

// WebSocket Connection Actions
export interface WebsocketConnectRequestAction {
  type: GiftsActionTypes.WEBSOCKET_CONNECT_REQUEST
  payload: { slug: string }
}

export interface WebsocketConnectSuccessAction {
  type: GiftsActionTypes.WEBSOCKET_CONNECT_SUCCESS
}

export interface WebsocketConnectFailureAction {
  type: GiftsActionTypes.WEBSOCKET_CONNECT_FAILURE
  payload: { error: string }
}

export interface WebsocketDisconnectAction {
  type: GiftsActionTypes.WEBSOCKET_DISCONNECT
}

// Gift Selection State Actions
export interface GiftBeingSelectedReceivedAction {
  type: GiftsActionTypes.GIFT_BEING_SELECTED_RECEIVED
  payload: { giftId: number; userId: string; userName?: string }
}

export interface GiftSelectedReceivedAction {
  type: GiftsActionTypes.GIFT_SELECTED_RECEIVED
  payload: { giftId: number; userId: string; userName: string; gift: Gift }
}

export interface GiftSelectionReleasedReceivedAction {
  type: GiftsActionTypes.GIFT_SELECTION_RELEASED_RECEIVED
  payload: { giftId: number; userId: string }
}

export interface GiftSelectionConflictReceivedAction {
  type: GiftsActionTypes.GIFT_SELECTION_CONFLICT_RECEIVED
  payload: { giftId: number; message: string }
}

export interface GiftConflictReceivedAction {
  type: GiftsActionTypes.GIFT_CONFLICT_RECEIVED
  payload: { giftId: number; userId: string; message: string }
}

export interface CurrentSelectionsReceivedAction {
  type: GiftsActionTypes.CURRENT_SELECTIONS_RECEIVED
  payload: { giftId: number; userId: string }[]
}

// Local Actions (para UI)
export interface StartGiftSelectionAction {
  type: GiftsActionTypes.START_GIFT_SELECTION
  payload: { giftId: number; userId: string; userName?: string }
}

export interface CancelGiftSelectionAction {
  type: GiftsActionTypes.CANCEL_GIFT_SELECTION
  payload: { giftId: number }
}

export interface ClearGiftConflictMessageAction {
  type: GiftsActionTypes.CLEAR_GIFT_CONFLICT_MESSAGE
  payload: { giftId: number }
}

export interface SetUserInfoAction {
  type: GiftsActionTypes.SET_USER_INFO
  payload: { userId: string; userName?: string }
}

// Update gift versions for optimistic locking
export interface UpdateGiftVersionsAction {
  type: GiftsActionTypes.UPDATE_GIFT_VERSIONS
  payload: { [giftId: number]: number }
}

export type GiftsAction =
  | LoadGiftsRequestAction
  | LoadGiftsSuccessAction
  | LoadGiftsFailureAction
  | MarkGiftBoughtRequestAction
  | MarkGiftBoughtSuccessAction
  | MarkGiftBoughtFailureAction
  | ClearGiftsAction
  | WebsocketConnectRequestAction
  | WebsocketConnectSuccessAction
  | WebsocketConnectFailureAction
  | WebsocketDisconnectAction
  | GiftBeingSelectedReceivedAction
  | GiftSelectedReceivedAction
  | GiftSelectionReleasedReceivedAction
  | GiftSelectionConflictReceivedAction
  | GiftConflictReceivedAction
  | CurrentSelectionsReceivedAction
  | StartGiftSelectionAction
  | CancelGiftSelectionAction
  | ClearGiftConflictMessageAction
  | SetUserInfoAction
  | UpdateGiftVersionsAction