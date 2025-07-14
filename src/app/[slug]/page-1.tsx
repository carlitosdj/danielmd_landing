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
      {/* Fundo clean e minimalista */}
      <div className="clean-background"></div>

      {/* Hero Section - Cabeçalho principal */}
      <section className="section-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <div className="mb-5">
                {/* Emojis decorativos animados */}
                <div style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ animation: 'party-bounce 2s ease-in-out infinite' }}>🎂</span>
                  <span style={{ animation: 'party-bounce 2s ease-in-out infinite 0.2s' }}>🎈</span>
                  <span style={{ animation: 'party-bounce 2s ease-in-out infinite 0.4s' }}>🎁</span>
                  <span style={{ animation: 'party-bounce 2s ease-in-out infinite 0.6s' }}>🎉</span>
                  <span style={{ animation: 'party-bounce 2s ease-in-out infinite 0.8s' }}>⭐</span>
                </div>
                
                <h1 className="section-title mb-4">{anniversary.title}</h1>
                <p className="section-subtitle">{anniversary.welcomeMessage}</p>
                
                {/* Faixa divertida */}
                <div style={{
                  background: 'var(--gradient-azul-diversao)',
                  height: '4px',
                  borderRadius: '2px',
                  margin: '2rem auto',
                  maxWidth: '200px',
                  animation: 'blue-glow 2s ease-in-out infinite alternate'
                }}></div>
              </div>
              
              {/* Botão RSVP em destaque máximo */}
              <div className="mb-5">
                <button 
                  className="btn-rsvp-hero"
                  onClick={() => document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ padding: '24px 80px' }}
                >
                  {rsvpSubmitted ? '✅ Presença Confirmada!' : 'Confirmar Presença'}
                </button>
              </div>

              {/* Info rápida em cards */}
              <div className="row g-4 mt-5">
                <div className="col-md-4">
                  <div className="info-card text-center glass-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
                    <h6 className="fw-bold mb-2 text-white">Quando</h6>
                    <p className="mb-0 text-white">{new Date(anniversary.eventDate).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="info-card text-center glass-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏰</div>
                    <h6 className="fw-bold mb-2 text-white">Que horas</h6>
                    <p className="mb-0 text-white">{anniversary.eventTime}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="info-card text-center glass-card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
                    <h6 className="fw-bold mb-2 text-white">Onde</h6>
                    <p className="mb-0 text-white">{anniversary.address}</p>
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
      <section id="rsvp-section" className="section" style={{ 
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(56, 189, 248, 0.08) 50%, rgba(125, 211, 252, 0.05) 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <div className="text-center mb-5">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎪</div>
            <h2 className="section-title">Confirmar Presença</h2>
            <p className="section-subtitle">Venha fazer parte desta festa incrível! 🎊</p>
          </div>
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
      <section id="gifts-section" className="section" style={{ 
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(30, 64, 175, 0.08) 100%)' 
      }}>
        <div className="container">
          <div className="text-center mb-5">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
            <h2 className="section-title mb-3">Lista de Presentes</h2>
            <p className="section-subtitle">Escolha um presente especial para o Daniel! 💝</p>
          </div>
          <GiftsSection 
            gifts={gifts} 
            loading={giftsLoading} 
            slug={slug}
          />
        </div>
      </section>

      {/* Messages Section */}
      <section id="messages-section" className="section" style={{ 
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(125, 211, 252, 0.08) 50%, rgba(224, 242, 254, 0.05) 100%)' 
      }}>
        <div className="container">
          <div className="text-center mb-5">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
            <h2 className="section-title mb-3">Mensagens de Carinho</h2>
            <p className="section-subtitle">Deixe uma mensagem especial para o Daniel! 💕</p>
          </div>
          <MessagesSection 
            messages={messages}
            loading={messagesLoading}
            slug={slug}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="section" style={{ 
        background: 'var(--gradient-azul-diversao)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '15px'
              }}>
                <span style={{ animation: 'party-bounce 2s ease-in-out infinite' }}>💖</span>
                <span style={{ animation: 'party-bounce 2s ease-in-out infinite 0.3s' }}>🌟</span>
                <span style={{ animation: 'party-bounce 2s ease-in-out infinite 0.6s' }}>💖</span>
              </div>
              <h3 className="mb-4" style={{ 
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                Obrigado por fazer parte desta celebração!
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.1rem'
              }}>
                Sua presença é o melhor presente que podemos receber! ✨
              </p>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                height: '3px',
                borderRadius: '2px',
                margin: '2rem auto',
                maxWidth: '150px',
                animation: 'blue-glow 3s ease-in-out infinite alternate'
              }}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}