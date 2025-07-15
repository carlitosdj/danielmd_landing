import { call, put, takeEvery } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import api from '../../../lib/api'
import { apiReconnectService } from '../../../services/api-reconnect.service'
import { 
  GiftsActionTypes,
  LoadGiftsRequestAction,
  MarkGiftBoughtRequestAction
} from './types'
import {
  loadGiftsSuccess,
  loadGiftsFailure,
  markGiftBoughtSuccess,
  markGiftBoughtFailure
} from './actions'
import { Gift } from '../../../lib/types'

function* loadGifts(action: LoadGiftsRequestAction) {
  const slug = action.payload.slug;
  
  // Função da API que será executada com reconexão
  const apiCall = () => api.get<Gift[]>(`/anniversaries/${slug}/gifts`);
  
  try {
    const response: AxiosResponse<Gift[]> = yield call(
      [apiReconnectService, 'executeWithReconnect'],
      `load-gifts-${slug}`,
      apiCall,
      undefined, // onSuccess será tratado pelo saga
      undefined, // onError será tratado pelo saga
      Infinity // Tentar infinitamente
    );
    
    if (response && response.data) {
      yield put(loadGiftsSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar presentes';
    console.log(`🔄 API Gifts: Erro capturado, serviço de reconexão ativo`);
    yield put(loadGiftsFailure(errorMessage));
  }
}

function* markGiftBought(action: MarkGiftBoughtRequestAction) {
  const { giftId, boughtBy, version, userId } = action.payload;
  
  // Função da API que será executada com reconexão
  const apiCall = () => api.put<Gift>(`/gifts/${giftId}/mark-as-bought`, {
    boughtBy,
    version,
    userId
  });
  
  try {
    const response: AxiosResponse<Gift> = yield call(
      [apiReconnectService, 'executeWithReconnect'],
      `mark-gift-bought-${giftId}`,
      apiCall,
      undefined, // onSuccess será tratado pelo saga
      undefined, // onError será tratado pelo saga
      5 // Máximo 5 tentativas para ações do usuário
    );
    
    if (response && response.data) {
      yield put(markGiftBoughtSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao marcar presente como comprado';
    console.log(`🔄 API MarkGift: Erro capturado, serviço de reconexão ativo`);
    yield put(markGiftBoughtFailure(errorMessage));
  }
}

export default function* giftsSaga() {
  yield takeEvery(GiftsActionTypes.LOAD_GIFTS_REQUEST, loadGifts)
  yield takeEvery(GiftsActionTypes.MARK_GIFT_BOUGHT_REQUEST, markGiftBought)
}