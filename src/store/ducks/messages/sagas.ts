import { call, put, takeEvery } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import api from '../../../lib/api'
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

function* loadMessages(action: LoadMessagesRequestAction): Generator<any, void, any> {
  const slug = action.payload.slug;
  
  try {
    const response: AxiosResponse<Message[]> = yield call(
      api.get,
      `/anniversaries/${slug}/messages`
    );
    
    if (response && response.data) {
      yield put(loadMessagesSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar mensagens';
    console.error('❌ Erro ao carregar mensagens:', error);
    yield put(loadMessagesFailure(errorMessage));
  }
}

function* createMessage(action: CreateMessageRequestAction): Generator<any, void, any> {
  const { slug, guestName, guestEmail, message } = action.payload;
  
  try {
    const response: AxiosResponse<Message> = yield call(
      api.post,
      `/anniversaries/${slug}/messages`,
      {
        guestName,
        guestEmail,
        message
      }
    );
    
    if (response && response.data) {
      yield put(createMessageSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao enviar mensagem';
    console.error('❌ Erro ao enviar mensagem:', error);
    yield put(createMessageFailure(errorMessage));
  }
}

export default function* messagesSaga(): Generator<any, void, any> {
  yield takeEvery(MessagesActionTypes.LOAD_MESSAGES_REQUEST, loadMessages)
  yield takeEvery(MessagesActionTypes.CREATE_MESSAGE_REQUEST, createMessage)
}