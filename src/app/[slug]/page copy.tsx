'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'next/navigation'
import useTypedSelector from '../../hooks/useTypedSelector'
import { loadAnniversaryBySlugRequest } from '../../store/ducks/anniversary/actions'
import { loadGiftsRequest } from '../../store/ducks/gifts/actions'
import { loadMessagesRequest } from '../../store/ducks/messages/actions'
import GiftsSection from '../../components/GiftsSection'
import RsvpSection from '../../components/RsvpSection'
import MessagesSection from '../../components/MessagesSection'
import PhotoGallery from '../../components/PhotoGallery'

export default function AnniversaryPage() {
  const dispatch = useDispatch()
  const params = useParams()
  const slug = params?.slug as string

  const { current: anniversary, loading: anniversaryLoading, error } = useTypedSelector(state => state.anniversary)
  const { items: gifts, loading: giftsLoading } = useTypedSelector(state => state.gifts)
  const { items: messages, loading: messagesLoading } = useTypedSelector(state => state.messages)
  const { submitted: rsvpSubmitted } = useTypedSelector(state => state.rsvp)

  useEffect(() => {
    if (slug) {
      dispatch(loadAnniversaryBySlugRequest(slug))
      dispatch(loadGiftsRequest(slug))
      dispatch(loadMessagesRequest(slug))
    }
  }, [slug, dispatch])

  if (anniversaryLoading) {
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

  if (error || !anniversary) {
    return (
      <div className="main-container d-flex align-items-center justify-content-center">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <div className="modern-card p-5 text-center" style={{ maxWidth: '500px' }}>
          <i className="fas fa-search fa-3x text-muted mb-4"></i>
          <h2 className="mb-3">Festa não encontrada</h2>
          <p className="text-muted mb-4">
            {error || 'Esta festa não existe ou não está mais disponível.'}
          </p>
          <button 
            className="btn btn-primary-fun"
            onClick={() => window.location.href = '/'}
          >
            <i className="fas fa-home me-2"></i>
            Ir para página inicial
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="main-container">
      {/* Decoração de balões flutuantes - tema All Blues */}
      <div className="floating-balloons">
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
        <div className="balloon"></div>
      </div>
      
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Hero Section - Cabeçalho principal */}
      <section className="section-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <div className="mb-5">
                <i className="fas fa-birthday-cake" style={{ fontSize: '4rem', color: 'var(--light-blue)', marginBottom: '2rem', display: 'block' }}></i>
                <h1 className="section-title mb-4">{anniversary.title}</h1>
                <p className="section-subtitle">{anniversary.welcomeMessage}</p>
              </div>
              
              {/* Botão RSVP em destaque máximo */}
              <div className="mb-5">
                <button 
                  className="btn-rsvp-hero"
                  onClick={() => document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fas fa-calendar-check me-3"></i>
                  {rsvpSubmitted ? '✅ Presença Confirmada!' : 'Confirmar Presença'}
                </button>
              </div>

              {/* Info rápida em cards */}
              <div className="row g-4 mt-5">
                <div className="col-md-4">
                  <div className="modern-card p-4 text-center">
                    <i className="fas fa-calendar" style={{ fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: '1rem' }}></i>
                    <h6 className="fw-bold mb-2">Data</h6>
                    <p className="mb-0">{new Date(anniversary.eventDate).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="modern-card p-4 text-center">
                    <i className="fas fa-clock" style={{ fontSize: '2rem', color: 'var(--secondary-blue)', marginBottom: '1rem' }}></i>
                    <h6 className="fw-bold mb-2">Horário</h6>
                    <p className="mb-0">{anniversary.eventTime}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="modern-card p-4 text-center">
                    <i className="fas fa-map-marker-alt" style={{ fontSize: '2rem', color: 'var(--accent-blue)', marginBottom: '1rem' }}></i>
                    <h6 className="fw-bold mb-2">Local</h6>
                    <p className="mb-0">{anniversary.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <PhotoGallery slug={slug} />

      {/* RSVP Section */}
      <section id="rsvp-section" className="section" style={{ background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
        <div className="container">
          <h2 className="section-title">Confirmar Presença</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <RsvpSection 
                slug={slug}
                submitted={rsvpSubmitted}
              />
            </div>
          </div>
        </div>
      </section>

      

      {/* Gifts Section */}
      <section id="gifts-section" className="section">
        <div className="container">
          <h2 className="section-title mb-5">Lista de Presentes</h2>
          <GiftsSection 
            gifts={gifts} 
            loading={giftsLoading} 
            slug={slug}
          />
        </div>
      </section>

      {/* Messages Section */}
      <section id="messages-section" className="section" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
        <div className="container">
          <h2 className="section-title mb-5">Mensagens de Carinho</h2>
          <MessagesSection 
            messages={messages}
            loading={messagesLoading}
            slug={slug}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="section" style={{ background: 'linear-gradient(135deg, var(--dark-blue) 0%, var(--primary-blue) 100%)', color: 'white' }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <i className="fas fa-heart" style={{ fontSize: '3rem', color: 'var(--light-blue)', marginBottom: '2rem' }}></i>
              <h3 className="mb-4" style={{ color: 'white' }}>Obrigado por fazer parte desta celebração!</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Sua presença é o melhor presente que podemos receber. ✨
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}