'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import useTypedSelector from '../hooks/useTypedSelector'
import { loadActiveAnniversaryRequest } from '../store/ducks/anniversary/actions'

export default function HomePage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { current: anniversary, loading, error } = useTypedSelector(state => state.anniversary)

  useEffect(() => {
    dispatch(loadActiveAnniversaryRequest())
  }, [dispatch])

  useEffect(() => {
    if (anniversary && !loading) {
      router.push(`/${anniversary.slug}`)
    }
  }, [anniversary, loading, router])

  // Sempre priorizar o loading
  if (loading) {
    return (
      <div className="main-container d-flex align-items-center justify-content-center">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <h2 className="text-white">Carregando a festa...</h2>
          <p className="text-white-50">Preparando tudo para você!</p>
        </div>
      </div>
    )
  }

  // Depois verificar se há erro
  if (error) {
    return (
      <div className="main-container d-flex align-items-center justify-content-center">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <div className="modern-card p-5 m-3 text-center " style={{ maxWidth: '500px' }}>
          <i className="fas fa-birthday-cake fa-3x text-muted mb-4"></i>
          <h2 className="mb-3 ">Ops! Algo deu errado</h2>
          <p className="text-muted mb-4">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => dispatch(loadActiveAnniversaryRequest())}
          >
            <i className="fas fa-redo me-2"></i>
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // Por último verificar se não há aniversário (quando loading é false e não há erro)
  if (!anniversary) {
    return (
      <div className="main-container d-flex align-items-center justify-content-center">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <div className="modern-card p-5 text-center" style={{ maxWidth: '600px' }}>
          <i className="fas fa-birthday-cake fa-4x text-primary mb-4 bounce"></i>
          <h1 className="mb-4">DanielMD 🎉</h1>
          <h3 className="mb-4">Festas de Aniversário</h3>
          
          {error && error.includes('Nenhum aniversário ativo encontrado') ? (
            <div>
              <p className="fs-5 mb-4">
                No momento não há nenhuma festa ativa, mas em breve teremos novidades! 
              </p>
              <p className="text-muted mb-4">
                Este é o site oficial das festas de aniversário do Daniel. 
                Quando houver uma festa ativa, você será redirecionado automaticamente.
              </p>
            </div>
          ) : (
            <div>
              <p className="fs-5 mb-4 text-danger">
                Ops! Não conseguimos carregar as informações da festa.
              </p>
              <p className="text-muted mb-4">
                {error || 'Erro desconhecido'}
              </p>
            </div>
          )}
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <button 
              className="btn btn-primary-fun"
              onClick={() => dispatch(loadActiveAnniversaryRequest())}
            >
              <i className="fas fa-redo me-2"></i>
              Tentar novamente
            </button>
            <button 
              className="btn btn-secondary-fun"
              onClick={() => window.open('http://localhost:3010/anniversaries/debug', '_blank')}
            >
              <i className="fas fa-bug me-2"></i>
              Debug API
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-top">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Se você é administrador, acesse o <a href="http://localhost:3000" target="_blank" className="text-decoration-none">painel admin</a> para criar aniversários.
            </small>
          </div>
        </div>
      </div>
    )
  }

  return null
}