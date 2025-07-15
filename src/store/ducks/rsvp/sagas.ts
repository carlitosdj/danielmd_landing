import { call, put, takeEvery } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import api from '../../../lib/api'
import { 
  RsvpActionTypes,
  CreateRsvpRequestAction
} from './types'
import {
  createRsvpSuccess,
  createRsvpFailure
} from './actions'

function* createRsvp(action: CreateRsvpRequestAction): Generator<any, void, any> {
  const { slug, guestName, adultsCount, childrenCount } = action.payload;
  
  try {
    const response = yield call(
      api.post,
      `/anniversaries/${slug}/rsvp`,
      {
        guestName,
        adultsCount,
        childrenCount
      }
    );
    
    if (response) {
      yield put(createRsvpSuccess());
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao confirmar presença';
    console.error('❌ Erro ao confirmar presença:', error);
    yield put(createRsvpFailure(errorMessage));
  }
}

export default function* rsvpSaga(): Generator<any, void, any> {
  yield takeEvery(RsvpActionTypes.CREATE_RSVP_REQUEST, createRsvp)
}