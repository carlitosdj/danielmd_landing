'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'next/navigation'
import useTypedSelector from '../../hooks/useTypedSelector'
import { loadAnniversaryBySlugRequest } from '../../store/ducks/anniversary/actions'
import { loadGiftsRequest } from '../../store/ducks/gifts/actions'
import { loadMessagesRequest } from '../../store/ducks/messages/actions'
import GiftsSection from '../../components/GiftsSection'
import RsvpSectionNew from '../../components/RsvpSectionNew'
import MessagesSection from '../../components/MessagesSection'
import PhotoGalleryNew from '../../components/PhotoGalleryNew'

export default function AnniversaryPageNew() {
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
      <div className="hero-section">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <div className="container-modern">
          <div className="text-center">
            <div className="loading-spinner mb-4" style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 2rem'
            }}></div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Carregando a festa...</h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Preparando tudo para você! ✨</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !anniversary) {
    return (
      <div className="hero-section">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <div className="container-modern">
          <div className="modern-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>🎈</div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Festa não encontrada</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
              {error || 'Esta festa não existe ou não está mais disponível.'}
            </p>
            <button 
              className="btn-modern"
              onClick={() => window.location.href = '/'}
              style={{ maxWidth: '200px' }}
            >
              🏠 Página Inicial
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <link rel="stylesheet" href="/new-design.css" />
      
      <div style={{ background: 'var(--white)' }}>
        {/* Hero Section com curva roxa */}
        <section className="hero-section">
          <div className="floating-shapes">
            <div className="shape"></div>
            <div className="shape"></div>
            <div className="shape"></div>
          </div>
          
          <div className="container-modern">
            <div className="hero-content">
              {/* Emojis decorativos */}
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: '2rem',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <span style={{ animation: 'float 2s ease-in-out infinite' }}>🎂</span>
                <span style={{ animation: 'float 2s ease-in-out infinite 0.2s' }}>🎈</span>
                <span style={{ animation: 'float 2s ease-in-out infinite 0.4s' }}>🎁</span>
                <span style={{ animation: 'float 2s ease-in-out infinite 0.6s' }}>🎉</span>
                {/* <span style={{ animation: 'float 2s ease-in-out infinite 0.8s' }}>⭐</span> */}
              </div>
              
              {/* Título do banco de dados */}
              <h1 className="hero-title">{anniversary.title}</h1>
              
              {/* Subtítulo do banco de dados */}
              <p className="hero-subtitle">{anniversary.welcomeMessage}</p>
              
              {/* Botão CTA principal */}
              <button 
                className="hero-cta"
                onClick={() => document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {rsvpSubmitted ? '✅ Presença Confirmada!' : '🎉 Confirmar Presença'}
              </button>

              {/* Cards de informação */}
              <div className="hero-info-cards">
                <div className="hero-info-card">
                  <span className="hero-info-icon">📅</span>
                  <div className="hero-info-title">Quando</div>
                  <div className="hero-info-text">
                    {new Date(anniversary.eventDate).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </div>
                
                <div className="hero-info-card">
                  <span className="hero-info-icon">⏰</span>
                  <div className="hero-info-title">Horário</div>
                  <div className="hero-info-text">{anniversary.eventTime}</div>
                </div>
                
                <div className="hero-info-card">
                  <span className="hero-info-icon">📍</span>
                  <div className="hero-info-title">Local</div>
                  <div className="hero-info-text">{anniversary.address}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Galeria de Momentos Especiais */}
        <section className="modern-section section-bg-white">
          <div className="container-modern">
            <div className="section-header">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
              <h2 className="section-title">Momentos Especiais</h2>
              <p className="section-subtitle">Relembre os melhores momentos dessa jornada incrível!</p>
            </div>
            <PhotoGalleryNew slug={slug} />
          </div>
        </section>

        {/* Confirmação de Presença */}
        <section id="rsvp-section" className="modern-section section-bg-light">
          <div className="container-modern">
            <div className="section-header">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎪</div>
              <h2 className="section-title">Confirmar Presença</h2>
              <p className="section-subtitle">Venha fazer parte desta festa incrível! Sua presença é muito importante para nós! 💖</p>
            </div>
            <RsvpSectionNew 
              slug={slug}
              submitted={rsvpSubmitted}
            />
          </div>
        </section>

        {/* Lista de Presentes */}
        <section id="gifts-section" className="modern-section section-bg-white">
          <div className="container-modern">
            <div className="section-header">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
              <h2 className="section-title">Lista de Presentes</h2>
              <p className="section-subtitle">Escolha um presente especial ou contribua via PIX para tornar este dia ainda mais especial! 💝</p>
            </div>
            <GiftsSection 
              gifts={gifts} 
              loading={giftsLoading} 
              slug={slug}
            />
            
            {/* Seção PIX */}
            <div className="pix-section">
              <div className="pix-content">
                <h3 className="pix-title">💰 Contribuição via PIX</h3>
                <p className="pix-description">
                  Prefere contribuir de forma prática? Use nossa chave PIX e ajude a tornar este dia ainda mais especial!
                </p>
                <div className="pix-card">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                  <div style={{ marginBottom: '1rem', fontWeight: '600' }}>Chave PIX:</div>
                  <div className="pix-key">sua-chave-pix@email.com</div>
                  <button 
                    className="btn-copy"
                    onClick={() => {
                      navigator.clipboard.writeText('sua-chave-pix@email.com')
                      alert('Chave PIX copiada! 📋')
                    }}
                  >
                    📋 Copiar Chave PIX
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Presentes já Escolhidos */}
        <section className="modern-section section-bg-light">
          <div className="container-modern">
            <div className="section-header">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h2 className="section-title">Presentes Escolhidos</h2>
              <p className="section-subtitle">Veja quem já demonstrou carinho escolhendo um presente especial!</p>
            </div>
            
            <div className="grid-3">
              {gifts.filter(gift => gift.status === 'comprado').length === 0 ? (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '3rem',
                  color: 'var(--gray-500)' 
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎁</div>
                  <p>Seja o primeiro a escolher um presente especial!</p>
                </div>
              ) : (
                gifts.filter(gift => gift.status === 'comprado').map((gift, index) => (
                  <div key={gift.id} className="modern-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
                    <h4 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>{gift.name}</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                      Escolhido por: <strong>{gift.boughtBy || 'Anônimo'}</strong>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Mensagens de Carinho */}
        <section id="messages-section" className="modern-section section-bg-white">
          <div className="container-modern">
            <div className="section-header">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
              <h2 className="section-title">Mensagens de Carinho</h2>
              <p className="section-subtitle">Deixe uma mensagem especial e veja o carinho que todos têm pelo Daniel! 💕</p>
            </div>
            <MessagesSection 
              messages={messages}
              loading={messagesLoading}
              slug={slug}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="footer-section">
          <div className="container-modern">
            <div className="footer-content">
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '15px'
              }}>
                <span style={{ animation: 'float 2s ease-in-out infinite' }}>💖</span>
                <span style={{ animation: 'float 2s ease-in-out infinite 0.3s' }}>🌟</span>
                <span style={{ animation: 'float 2s ease-in-out infinite 0.6s' }}>💖</span>
              </div>
              <h3 className="footer-title">
                Obrigado por fazer parte desta celebração! 🥰
              </h3>
              <p className="footer-text">
                Sua presença é o melhor presente que podemos receber! Vamos criar memórias incríveis juntos! ✨
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}