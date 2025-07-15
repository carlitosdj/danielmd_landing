import { call, put, takeEvery } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import api from '../../../lib/api'
import { apiReconnectService } from '../../../services/api-reconnect.service'
import { 
  MessagesActionTypes,
  LoadMessagesRequestAction,
  CreateMessageRequestAction
} from './types'
import {
  loadMessagesSuccess,
  loadMessagesFailure,
  createMessageSuccess,
  createMessageFailure
} from './actions'
import { Message } from '../../../lib/types'

function* loadMessages(action: LoadMessagesRequestAction) {
  const slug = action.payload.slug;
  
  // Função da API que será executada com reconexão
  const apiCall = () => api.get<Message[]>(`/anniversaries/${slug}/messages`);
  
  try {
    const response: AxiosResponse<Message[]> = yield call(
      [apiReconnectService, 'executeWithReconnect'],
      `load-messages-${slug}`,
      apiCall,
      undefined, // onSuccess será tratado pelo saga
      undefined, // onError será tratado pelo saga
      Infinity // Tentar infinitamente
    );
    
    if (response && response.data) {
      yield put(loadMessagesSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar mensagens';
    console.log(`🔄 API Messages: Erro capturado, serviço de reconexão ativo`);
    yield put(loadMessagesFailure(errorMessage));
  }
}

function* createMessage(action: CreateMessageRequestAction) {
  const { slug, guestName, guestEmail, message } = action.payload;
  
  // Função da API que será executada com reconexão
  const apiCall = () => api.post<Message>(`/anniversaries/${slug}/messages`, {
    guestName,
    guestEmail,
    message
  });
  
  try {
    const response: AxiosResponse<Message> = yield call(
      [apiReconnectService, 'executeWithReconnect'],
      `create-message-${slug}-${Date.now()}`,
      apiCall,
      undefined, // onSuccess será tratado pelo saga
      undefined, // onError será tratado pelo saga
      5 // Máximo 5 tentativas para ações do usuário
    );
    
    if (response && response.data) {
      yield put(createMessageSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao enviar mensagem';
    console.log(`🔄 API CreateMessage: Erro capturado, serviço de reconexão ativo`);
    yield put(createMessageFailure(errorMessage));
  }
}

export default function* messagesSaga() {
  yield takeEvery(MessagesActionTypes.LOAD_MESSAGES_REQUEST, loadMessages)
  yield takeEvery(MessagesActionTypes.CREATE_MESSAGE_REQUEST, createMessage)
}