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

function* loadMessages(action: LoadMessagesRequestAction) {
  try {
    // Usa o endpoint público para carregar mensagens aprovadas
    const response: AxiosResponse<Message[]> = yield call(
      api.get,
      `/anniversaries/${action.payload.slug}/messages`
    )
    
    yield put(loadMessagesSuccess(response.data))
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar mensagens'
    yield put(loadMessagesFailure(errorMessage))
  }
}

function* createMessage(action: CreateMessageRequestAction) {
  try {
    const { slug, guestName, guestEmail, message } = action.payload
    
    // Usa o endpoint público para criar mensagens
    const response: AxiosResponse<Message> = yield call(
      api.post,
      `/anniversaries/${slug}/messages`,
      {
        guestName,
        guestEmail,
        message
      }
    )
    
    yield put(createMessageSuccess(response.data))
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao enviar mensagem'
    yield put(createMessageFailure(errorMessage))
  }
}

export default function* messagesSaga() {
  yield takeEvery(MessagesActionTypes.LOAD_MESSAGES_REQUEST, loadMessages)
  yield takeEvery(MessagesActionTypes.CREATE_MESSAGE_REQUEST, createMessage)
}