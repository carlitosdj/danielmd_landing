import { Message } from '../../../lib/types'

export interface MessagesState {
  items: Message[]
  loading: boolean
  error: string | null
  submitting: boolean
  submitError: string | null
}

export enum MessagesActionTypes {
  LOAD_MESSAGES_REQUEST = '@messages/LOAD_MESSAGES_REQUEST',
  LOAD_MESSAGES_SUCCESS = '@messages/LOAD_MESSAGES_SUCCESS',
  LOAD_MESSAGES_FAILURE = '@messages/LOAD_MESSAGES_FAILURE',

  CREATE_MESSAGE_REQUEST = '@messages/CREATE_MESSAGE_REQUEST',
  CREATE_MESSAGE_SUCCESS = '@messages/CREATE_MESSAGE_SUCCESS',
  CREATE_MESSAGE_FAILURE = '@messages/CREATE_MESSAGE_FAILURE',

  CLEAR_MESSAGES = '@messages/CLEAR_MESSAGES',
}

export interface LoadMessagesRequestAction {
  type: MessagesActionTypes.LOAD_MESSAGES_REQUEST
  payload: { slug: string }
}

export interface LoadMessagesSuccessAction {
  type: MessagesActionTypes.LOAD_MESSAGES_SUCCESS
  payload: { data: Message[] }
}

export interface LoadMessagesFailureAction {
  type: MessagesActionTypes.LOAD_MESSAGES_FAILURE
  payload: { error: string }
}

export interface CreateMessageRequestAction {
  type: MessagesActionTypes.CREATE_MESSAGE_REQUEST
  payload: { 
    slug: string
    guestName: string
    guestEmail?: string
    message: string
  }
}

export interface CreateMessageSuccessAction {
  type: MessagesActionTypes.CREATE_MESSAGE_SUCCESS
  payload: { data: Message }
}

export interface CreateMessageFailureAction {
  type: MessagesActionTypes.CREATE_MESSAGE_FAILURE
  payload: { error: string }
}

export interface ClearMessagesAction {
  type: MessagesActionTypes.CLEAR_MESSAGES
}

export type MessagesAction =
  | LoadMessagesRequestAction
  | LoadMessagesSuccessAction
  | LoadMessagesFailureAction
  | CreateMessageRequestAction
  | CreateMessageSuccessAction
  | CreateMessageFailureAction
  | ClearMessagesAction