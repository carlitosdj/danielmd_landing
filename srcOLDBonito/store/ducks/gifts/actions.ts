import { action } from 'typesafe-actions'
import { GiftsActionTypes } from './types'
import { Gift } from '../../../lib/types'

export const loadGiftsRequest = (slug: string) =>
  action(GiftsActionTypes.LOAD_GIFTS_REQUEST, { slug })

export const loadGiftsSuccess = (data: Gift[]) =>
  action(GiftsActionTypes.LOAD_GIFTS_SUCCESS, { data })

export const loadGiftsFailure = (error: string) =>
  action(GiftsActionTypes.LOAD_GIFTS_FAILURE, { error })

export const markGiftBoughtRequest = (giftId: number, boughtBy: string) =>
  action(GiftsActionTypes.MARK_GIFT_BOUGHT_REQUEST, { giftId, boughtBy })

export const markGiftBoughtSuccess = (data: Gift) =>
  action(GiftsActionTypes.MARK_GIFT_BOUGHT_SUCCESS, { data })

export const markGiftBoughtFailure = (error: string) =>
  action(GiftsActionTypes.MARK_GIFT_BOUGHT_FAILURE, { error })

export const clearGifts = () =>
  action(GiftsActionTypes.CLEAR_GIFTS)