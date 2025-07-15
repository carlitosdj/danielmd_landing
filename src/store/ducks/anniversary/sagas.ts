import { call, put, takeEvery } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import api from '../../../lib/api'
import { apiReconnectService } from '../../../services/api-reconnect.service'
import { 
  AnniversaryActionTypes,
  LoadAnniversaryBySlugRequestAction
} from './types'
import {
  loadAnniversaryBySlugSuccess,
  loadAnniversaryBySlugFailure,
  loadActiveAnniversarySuccess,
  loadActiveAnniversaryFailure
} from './actions'
import { Anniversary } from '../../../lib/types'

function* loadAnniversaryBySlug(action: LoadAnniversaryBySlugRequestAction): Generator<any, void, any> {
  const slug = action.payload.slug;
  
  // Função da API que será executada com reconexão
  const apiCall = () => api.get<Anniversary>(`/anniversaries/by-slug/${slug}`);
  
  try {
    const response: AxiosResponse<Anniversary> = yield call(
      [apiReconnectService, 'executeWithReconnect'],
      `load-anniversary-${slug}`,
      apiCall,
      undefined, // onSuccess será tratado pelo saga
      undefined, // onError será tratado pelo saga
      Infinity // Tentar infinitamente
    );
    
    if (response && response.data) {
      yield put(loadAnniversaryBySlugSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar aniversário';
    console.log(`🔄 API Anniversary: Erro capturado, serviço de reconexão ativo`);
    yield put(loadAnniversaryBySlugFailure(errorMessage));
  }
}

function* loadActiveAnniversary(): Generator<any, void, any> {
  // Função da API que será executada com reconexão
  const apiCall = () => api.get<Anniversary>('/anniversaries/active');
  
  try {
    console.log('🔄 Tentando carregar aniversário ativo...');
    
    const response: AxiosResponse<Anniversary> = yield call(
      [apiReconnectService, 'executeWithReconnect'],
      'load-active-anniversary',
      apiCall,
      undefined, // onSuccess será tratado pelo saga
      undefined, // onError será tratado pelo saga
      Infinity // Tentar infinitamente
    );
    
    if (response && response.data) {
      console.log('✅ Aniversário ativo carregado:', response.data);
      yield put(loadActiveAnniversarySuccess(response.data));
    }
  } catch (error: any) {
    console.error('❌ Erro ao carregar aniversário ativo:', error);
    console.log(`🔄 API ActiveAnniversary: Erro capturado, serviço de reconexão ativo`);
    
    let errorMessage = 'Erro ao carregar aniversário ativo';
    
    if (error.response) {
      errorMessage = error.response.data?.message || `Erro ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'Erro de conexão com a API. Tentando reconectar...';
    } else {
      errorMessage = error.message || 'Erro interno';
    }
    
    yield put(loadActiveAnniversaryFailure(errorMessage));
  }
}

export default function* anniversarySaga(): Generator<any, void, any> {
  yield takeEvery(AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_REQUEST, loadAnniversaryBySlug)
  yield takeEvery(AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_REQUEST, loadActiveAnniversary)
}