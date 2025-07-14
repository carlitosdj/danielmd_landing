import { all } from 'redux-saga/effects'

import anniversarySaga from './anniversary/sagas'
import giftsSaga from './gifts/sagas'
import rsvpSaga from './rsvp/sagas'
import messagesSaga from './messages/sagas'

export default function* rootSaga() {
  yield all([
    anniversarySaga(),
    giftsSaga(),
    rsvpSaga(),
    messagesSaga(),
  ])
}