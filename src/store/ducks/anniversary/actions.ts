import { action } from 'typesafe-actions'
import { AnniversaryActionTypes } from './types'
import { Anniversary } from '../../../lib/types'

export const loadAnniversaryBySlugRequest = (slug: string) =>
  action(AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_REQUEST, { slug })

export const loadAnniversaryBySlugSuccess = (data: Anniversary) =>
  action(AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_SUCCESS, { data })

export const loadAnniversaryBySlugFailure = (error: string) =>
  action(AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_FAILURE, { error })

export const loadActiveAnniversaryRequest = () =>
  action(AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_REQUEST)

export const loadActiveAnniversarySuccess = (data: Anniversary) =>
  action(AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_SUCCESS, { data })

export const loadActiveAnniversaryFailure = (error: string) =>
  action(AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_FAILURE, { error })

export const clearAnniversary = () =>
  action(AnniversaryActionTypes.CLEAR_ANNIVERSARY)