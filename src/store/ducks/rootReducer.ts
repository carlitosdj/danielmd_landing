import { combineReducers } from 'redux'

import anniversary from './anniversary'
import gifts from './gifts'
import rsvp from './rsvp'
import messages from './messages'

export default combineReducers({
  anniversary,
  gifts,
  rsvp,
  messages,
})