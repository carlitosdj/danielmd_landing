import { call, put, takeEvery } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import api from '../../../lib/api'
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

function* loadAnniversaryBySlug(action: LoadAnniversaryBySlugRequestAction) {
  try {
    const response: AxiosResponse<Anniversary> = yield call(
      api.get,
      `/anniversaries/by-slug/${action.payload.slug}`
    )
    yield put(loadAnniversaryBySlugSuccess(response.data))
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar aniversário'
    yield put(loadAnniversaryBySlugFailure(errorMessage))
  }
}

function* loadActiveAnniversary() {
  try {
    console.log('Tentando carregar aniversário ativo...')
    
    const response: AxiosResponse<Anniversary> = yield call(
      api.get,
      '/anniversaries/active'
    )
    
    console.log('Resposta da API:', response.data)
    yield put(loadActiveAnniversarySuccess(response.data))
  } catch (error: any) {
    console.error('Erro ao carregar aniversário ativo:', error)
    let errorMessage = 'Erro ao carregar aniversário ativo'
    
    if (error.response) {
      // Erro com resposta da API
      errorMessage = error.response.data?.message || `Erro ${error.response.status}: ${error.response.statusText}`
    } else if (error.request) {
      // Erro de rede
      errorMessage = 'Erro de conexão com a API. Verifique se a API está rodando na porta 3010.'
    } else {
      // Erro na configuração
      errorMessage = error.message || 'Erro interno'
    }
    
    yield put(loadActiveAnniversaryFailure(errorMessage))
  }
}

export default function* anniversarySaga() {
  yield takeEvery(AnniversaryActionTypes.LOAD_ANNIVERSARY_BY_SLUG_REQUEST, loadAnniversaryBySlug)
  yield takeEvery(AnniversaryActionTypes.LOAD_ACTIVE_ANNIVERSARY_REQUEST, loadActiveAnniversary)
}