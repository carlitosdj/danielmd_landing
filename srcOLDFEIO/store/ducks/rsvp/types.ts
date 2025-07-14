export interface RsvpState {
  submitted: boolean
  loading: boolean
  error: string | null
}

export enum RsvpActionTypes {
  CREATE_RSVP_REQUEST = '@rsvp/CREATE_RSVP_REQUEST',
  CREATE_RSVP_SUCCESS = '@rsvp/CREATE_RSVP_SUCCESS',
  CREATE_RSVP_FAILURE = '@rsvp/CREATE_RSVP_FAILURE',

  CLEAR_RSVP = '@rsvp/CLEAR_RSVP',
}

export interface CreateRsvpRequestAction {
  type: RsvpActionTypes.CREATE_RSVP_REQUEST
  payload: { 
    slug: string
    guestName: string
    adultsCount: number
    childrenCount: number
  }
}

export interface CreateRsvpSuccessAction {
  type: RsvpActionTypes.CREATE_RSVP_SUCCESS
}

export interface CreateRsvpFailureAction {
  type: RsvpActionTypes.CREATE_RSVP_FAILURE
  payload: { error: string }
}

export interface ClearRsvpAction {
  type: RsvpActionTypes.CLEAR_RSVP
}

export type RsvpAction =
  | CreateRsvpRequestAction
  | CreateRsvpSuccessAction
  | CreateRsvpFailureAction
  | ClearRsvpAction