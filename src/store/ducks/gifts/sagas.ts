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

function* loadGifts(action: LoadGiftsRequestAction): Generator<any, void, any> {
  const slug = action.payload.slug;
  
  try {
    const response: AxiosResponse<Gift[]> = yield call(
      api.get,
      `/anniversaries/${slug}/gifts`
    );
    
    if (response && response.data) {
      yield put(loadGiftsSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar presentes';
    console.error('❌ Erro ao carregar presentes:', error);
    yield put(loadGiftsFailure(errorMessage));
  }
}

function* markGiftBought(action: MarkGiftBoughtRequestAction): Generator<any, void, any> {
  const { giftId, boughtBy, version, userId } = action.payload;
  
  try {
    const response: AxiosResponse<Gift> = yield call(
      api.put,
      `/gifts/${giftId}/mark-as-bought`,
      {
        boughtBy,
        version,
        userId
      }
    );
    
    if (response && response.data) {
      yield put(markGiftBoughtSuccess(response.data));
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao marcar presente como comprado';
    console.error('❌ Erro ao marcar presente como comprado:', error);
    yield put(markGiftBoughtFailure(errorMessage));
  }
}

export default function* giftsSaga(): Generator<any, void, any> {
  yield takeEvery(GiftsActionTypes.LOAD_GIFTS_REQUEST, loadGifts)
  yield takeEvery(GiftsActionTypes.MARK_GIFT_BOUGHT_REQUEST, markGiftBought)
}