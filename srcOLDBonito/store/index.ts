import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './ducks/rootReducer'
import rootSaga from './ducks/rootSaga'

// Configuração do saga middleware
const sagaMiddleware = createSagaMiddleware({
  onError: (error: Error) => {
    console.error('Saga Error:', error)
  }
})

// Configuração básica sem Redux DevTools para evitar problemas
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)

// Executar as sagas
try {
  sagaMiddleware.run(rootSaga)
  console.log('Redux sagas iniciadas com sucesso')
} catch (error) {
  console.error('Erro ao iniciar sagas:', error)
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store