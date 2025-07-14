'use client'

import { Anniversary } from '../lib/types'

interface AnniversaryHeaderProps {
  anniversary: Anniversary
}

export default function AnniversaryHeader({ anniversary }: AnniversaryHeaderProps) {
  const eventDate = new Date(anniversary.eventDate)
  const now = new Date()
  const isToday = eventDate.toDateString() === now.toDateString()
  const isPast = eventDate < now
  const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24))

  return (
    <div className="py-5 text-center text-white position-relative">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className="display-1 mb-4 wiggle">{anniversary.title}</h1>
            
            <div className="row justify-content-center mb-4">
              <div className="col-md-4 mb-3">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <i className="fas fa-calendar-alt fa-2x mb-2"></i>
                  <h5>Data</h5>
                  <p className="mb-0 fs-5">
                    {eventDate.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <i className="fas fa-clock fa-2x mb-2"></i>
                  <h5>Horário</h5>
                  <p className="mb-0 fs-5">{anniversary.eventTime}</p>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <i className="fas fa-hourglass-half fa-2x mb-2"></i>
                  <h5>
                    {isToday ? 'É HOJE!' : isPast ? 'Já aconteceu' : 'Faltam'}
                  </h5>
                  <p className="mb-0 fs-5">
                    {isToday ? 
                      <span className="badge-fun animate-pulse">🎉 DIA DA FESTA 🎉</span> :
                      isPast ? 
                        'Obrigado por participar!' :
                        `${daysDiff} dia${daysDiff !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              </div>
            </div>

            {!isPast && (
              <div className="text-center">
                <h3 className="mb-3">
                  {isToday ? 
                    '🎊 A festa é hoje! Vamos comemorar! 🎊' :
                    '🎈 Não vemos a hora de comemorar com você! 🎈'
                  }
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Balões flutuantes */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        fontSize: '3rem',
        animation: 'float 3s ease-in-out infinite',
        animationDelay: '0s'
      }}>
        🎈
      </div>
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '15%',
        fontSize: '2.5rem',
        animation: 'float 3s ease-in-out infinite',
        animationDelay: '1s'
      }}>
        🎂
      </div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        fontSize: '2rem',
        animation: 'float 3s ease-in-out infinite',
        animationDelay: '2s'
      }}>
        🎉
      </div>
    </div>
  )
}