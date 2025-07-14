'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from '../hooks/useTypedSelector'
import { createRsvpRequest } from '../store/ducks/rsvp/actions'

interface RsvpSectionProps {
  slug: string
  submitted: boolean
}

export default function RsvpSectionNew({ slug, submitted }: RsvpSectionProps) {
  const dispatch = useDispatch()
  const { loading, error } = useTypedSelector(state => state.rsvp)
  
  const [formData, setFormData] = useState({
    guestName: '',
    adultsCount: 1,
    childrenCount: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.guestName.trim()) {
      dispatch(createRsvpRequest(
        slug,
        formData.guestName.trim(),
        formData.adultsCount,
        formData.childrenCount
      ))
    }
  }

  const totalPeople = formData.adultsCount + formData.childrenCount

  if (submitted) {
    return (
      <div className="modern-card" style={{ 
        textAlign: 'center', 
        maxWidth: '600px', 
        margin: '0 auto',
        padding: '3rem'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>✅</div>
        <h2 style={{ 
          color: 'var(--primary-blue)', 
          marginBottom: '1.5rem',
          fontSize: '2rem'
        }}>
          Presença Confirmada! 🎉
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--gray-500)', 
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          Muito obrigado por confirmar sua presença! Estamos ansiosos para 
          comemorar este dia especial com você.
        </p>
        
        <div style={{
          background: 'var(--gradient-section)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h4 style={{ 
            color: 'var(--gray-900)', 
            marginBottom: '1.5rem',
            fontSize: '1.2rem'
          }}>
            📝 Lembretes Importantes:
          </h4>
          <div style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>📅</span>
              <span>Não esqueça da data da festa</span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>⏰</span>
              <span>Chegue no horário para não perder nada</span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>🎁</span>
              <span>Confira a lista de presentes se quiser contribuir</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>💖</span>
              <span>Traga muito amor e alegria!</span>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ gap: '1rem' }}>
          <button 
            className="btn-modern"
            onClick={() => document.getElementById('gifts-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            🎁 Ver Presentes
          </button>
          <button 
            className="btn-modern"
            style={{ background: 'var(--gray-200)', color: 'var(--gray-700)' }}
            onClick={() => document.getElementById('messages-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            💌 Deixar Mensagem
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-modern">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍👩‍👧‍👦</div>
        <h3 style={{ color: 'var(--gray-900)', marginBottom: '1rem' }}>
          Confirme sua Presença
        </h3>
        <p style={{ color: 'var(--gray-500)' }}>
          Sua presença é muito importante para nós! Por favor, confirme 
          se você virá à festa para podermos nos organizar melhor.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            👤 Seu nome ou nome da família:
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.guestName}
            onChange={(e) => setFormData({...formData, guestName: e.target.value})}
            placeholder="Digite seu nome"
            required
            maxLength={100}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              👥 Quantos adultos:
            </label>
            <select 
              className="form-input"
              value={formData.adultsCount}
              onChange={(e) => setFormData({...formData, adultsCount: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'adulto' : 'adultos'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              🧒 Quantas crianças:
            </label>
            <select 
              className="form-input"
              value={formData.childrenCount}
              onChange={(e) => setFormData({...formData, childrenCount: parseInt(e.target.value)})}
            >
              {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'criança' : 'crianças'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalPeople > 1 && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>ℹ️</span>
            <div>
              <strong>Total:</strong> {totalPeople} pessoa{totalPeople !== 1 ? 's' : ''} 
              ({formData.adultsCount} adulto{formData.adultsCount !== 1 ? 's' : ''} 
              {formData.childrenCount > 0 && ` + ${formData.childrenCount} criança${formData.childrenCount !== 1 ? 's' : ''}`})
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--gray-700)'
          }}>
            <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn-modern"
          disabled={loading || !formData.guestName.trim()}
          style={{
            opacity: (loading || !formData.guestName.trim()) ? 0.6 : 1,
            cursor: (loading || !formData.guestName.trim()) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <span style={{ 
                display: 'inline-block', 
                width: '20px', 
                height: '20px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '0.5rem'
              }}></span>
              Confirmando...
            </>
          ) : (
            <>✅ Confirmar Presença</>
          )}
        </button>
      </form>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem',
        fontSize: '0.9rem',
        color: 'var(--gray-500)'
      }}>
        <span style={{ marginRight: '0.5rem' }}>🔒</span>
        Seus dados são seguros e serão usados apenas para organização da festa.
      </div>
    </div>
  )
}