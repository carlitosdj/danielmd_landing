import { Anniversary } from '../../../lib/types'

export interface AnniversaryState {
  current: Anniversary | null
  loading: boolean
  error: string | null
}

export enum AnniversaryActionTypes {
  LOAD_ANNIVERSARY_BY_SLUG_REQUEST = '@anniversary/LOAD_ANNIVERSARY_BY_SLUG_REQUEST',
  LOAD_ANNIVERSARY_BY_SLUG_SUCCESS = '@anniversary/LOAD_ANNIVERSARY_BY_SLUG_SUCCESS',
  LOAD_ANNIVERSARY_BY_SLUG_FAILURE = '@anniversary/LOAD_ANNIVERSARY_BY_SLUG_FAILURE',

  LOAD_ACTIVE_ANNIVERSARY_REQUEST = '@anniversary/LOAD_ACTIVE_ANNIVERSARY_REQUEST',
  LOAD_ACTIVE_ANNIVERSARY_SUCCESS = '@anniversary/LOAD_ACTIVE_ANNIVERSARY_SUCCESS',
  LOAD_ACTIVE_ANNIVERSARY_FAILURE = '@anniversary/LOAD_ACTIVE_ANNIVERSARY_FAILURE',

  CLEAR_ANNIVERSARY = '@anniversary/CLEAR_ANNIVERSARY',
}

export interface LoadAnniversaryBySlugRequestAction {
  type: AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_REQUEST
  payload: { slug: string }
}

export interface LoadAnniversaryBySlugSuccessAction {
  type: AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_SUCCESS
  payload: { data: Anniversary }
}

export interface LoadAnniversaryBySlugFailureAction {
  type: AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_FAILURE
  payload: { error: string }
}

export interface LoadActiveAnniversaryRequestAction {
  type: AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_REQUEST
}

export interface LoadActiveAnniversarySuccessAction {
  type: AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_SUCCESS
  payload: { data: Anniversary }
}

export interface LoadActiveAnniversaryFailureAction {
  type: AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_FAILURE
  payload: { error: string }
}

export interface ClearAnniversaryAction {
  type: AnniversaryActionTypes.CLEAR_ANNIVERSARY
}

export type AnniversaryAction =
  | LoadAnniversaryBySlugRequestAction
  | LoadAnniversaryBySlugSuccessAction
  | LoadAnniversaryBySlugFailureAction
  | LoadActiveAnniversaryRequestAction
  | LoadActiveAnniversarySuccessAction
  | LoadActiveAnniversaryFailureAction
  | ClearAnniversaryAction