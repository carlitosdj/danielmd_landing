import { call, put, takeEvery } from 'redux-saga/effects'
import { AxiosResponse } from 'axios'
import api from '../../../lib/api'
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
  try {
    const response: AxiosResponse<Gift[]> = yield call(
      api.get,
      `/anniversaries/${action.payload.slug}/gifts`
    )
    yield put(loadGiftsSuccess(response.data))
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar presentes'
    yield put(loadGiftsFailure(errorMessage))
  }
}

function* markGiftBought(action: MarkGiftBoughtRequestAction) {
  try {
    const response: AxiosResponse<Gift> = yield call(
      api.put,
      `/gifts/${action.payload.giftId}/mark-as-bought`,
      { boughtBy: action.payload.boughtBy }
    )
    yield put(markGiftBoughtSuccess(response.data))
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao marcar presente como comprado'
    yield put(markGiftBoughtFailure(errorMessage))
  }
}

export default function* giftsSaga() {
  yield takeEvery(GiftsActionTypes.LOAD_GIFTS_REQUEST, loadGifts)
  yield takeEvery(GiftsActionTypes.MARK_GIFT_BOUGHT_REQUEST, markGiftBought)
}