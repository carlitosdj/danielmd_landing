import { Gift } from '../../../lib/types'

export interface GiftsState {
  items: Gift[]
  loading: boolean
  error: string | null
}

export enum GiftsActionTypes {
  LOAD_GIFTS_REQUEST = '@gifts/LOAD_GIFTS_REQUEST',
  LOAD_GIFTS_SUCCESS = '@gifts/LOAD_GIFTS_SUCCESS',
  LOAD_GIFTS_FAILURE = '@gifts/LOAD_GIFTS_FAILURE',

  MARK_GIFT_BOUGHT_REQUEST = '@gifts/MARK_GIFT_BOUGHT_REQUEST',
  MARK_GIFT_BOUGHT_SUCCESS = '@gifts/MARK_GIFT_BOUGHT_SUCCESS',
  MARK_GIFT_BOUGHT_FAILURE = '@gifts/MARK_GIFT_BOUGHT_FAILURE',

  CLEAR_GIFTS = '@gifts/CLEAR_GIFTS',
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
  payload: { giftId: number; boughtBy: string }
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

export type GiftsAction =
  | LoadGiftsRequestAction
  | LoadGiftsSuccessAction
  | LoadGiftsFailureAction
  | MarkGiftBoughtRequestAction
  | MarkGiftBoughtSuccessAction
  | MarkGiftBoughtFailureAction
  | ClearGiftsAction