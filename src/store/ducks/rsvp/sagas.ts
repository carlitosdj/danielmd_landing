import { call, put, takeEvery } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import api from '../../../lib/api'
import { apiReconnectService } from '../../../services/api-reconnect.service'
import { 
  RsvpActionTypes,
  CreateRsvpRequestAction
} from './types'
import {
  createRsvpSuccess,
  createRsvpFailure
} from './actions'

function* createRsvp(action: CreateRsvpRequestAction) {
  const { slug, guestName, adultsCount, childrenCount } = action.payload;
  
  // Função da API que será executada com reconexão
  const apiCall = () => api.post(`/anniversaries/${slug}/rsvp`, {
    guestName,
    adultsCount,
    childrenCount
  });
  
  try {
    const response = yield call(
      [apiReconnectService, 'executeWithReconnect'],
      `create-rsvp-${slug}-${Date.now()}`,
      apiCall,
      undefined, // onSuccess será tratado pelo saga
      undefined, // onError será tratado pelo saga
      5 // Máximo 5 tentativas para ações do usuário
    );
    
    if (response) {
      yield put(createRsvpSuccess());
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao confirmar presença';
    console.log(`🔄 API CreateRSVP: Erro capturado, serviço de reconexão ativo`);
    yield put(createRsvpFailure(errorMessage));
  }
}

export default function* rsvpSaga() {
  yield takeEvery(RsvpActionTypes.CREATE_RSVP_REQUEST, createRsvp)
}