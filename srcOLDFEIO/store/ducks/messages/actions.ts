import { action } from 'typesafe-actions'
import { MessagesActionTypes } from './types'
import { Message } from '../../../lib/types'

export const loadMessagesRequest = (slug: string) =>
  action(MessagesActionTypes.LOAD_MESSAGES_REQUEST, { slug })

export const loadMessagesSuccess = (data: Message[]) =>
  action(MessagesActionTypes.LOAD_MESSAGES_SUCCESS, { data })

export const loadMessagesFailure = (error: string) =>
  action(MessagesActionTypes.LOAD_MESSAGES_FAILURE, { error })

export const createMessageRequest = (
  slug: string, 
  guestName: string, 
  message: string,
  guestEmail?: string
) =>
  action(MessagesActionTypes.CREATE_MESSAGE_REQUEST, { 
    slug, 
    guestName, 
    guestEmail,
    message 
  })

export const createMessageSuccess = (data: Message) =>
  action(MessagesActionTypes.CREATE_MESSAGE_SUCCESS, { data })

export const createMessageFailure = (error: string) =>
  action(MessagesActionTypes.CREATE_MESSAGE_FAILURE, { error })

export const clearMessages = () =>
  action(MessagesActionTypes.CLEAR_MESSAGES)