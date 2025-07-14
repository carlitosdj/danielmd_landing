import { action } from 'typesafe-actions'
import { RsvpActionTypes } from './types'

export const createRsvpRequest = (
  slug: string, 
  guestName: string, 
  adultsCount: number, 
  childrenCount: number
) =>
  action(RsvpActionTypes.CREATE_RSVP_REQUEST, { 
    slug, 
    guestName, 
    adultsCount, 
    childrenCount 
  })

export const createRsvpSuccess = () =>
  action(RsvpActionTypes.CREATE_RSVP_SUCCESS)

export const createRsvpFailure = (error: string) =>
  action(RsvpActionTypes.CREATE_RSVP_FAILURE, { error })

export const clearRsvp = () =>
  action(RsvpActionTypes.CLEAR_RSVP)