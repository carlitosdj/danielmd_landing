'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from '../hooks/useTypedSelector'
import { createRsvpRequest } from '../store/ducks/rsvp/actions'

interface RsvpSectionProps {
  slug: string
  submitted: boolean
}

export default function RsvpSection({ slug, submitted }: RsvpSectionProps) {
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
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="modern-card p-5 text-center">
            <div className="mb-4">
              <i className="fas fa-check-circle fa-4x text-success bounce"></i>
            </div>
            <h2 className="mb-4 text-success">Presença Confirmada! 🎉</h2>
            <p className="fs-5 mb-4">
              Muito obrigado por confirmar sua presença! Estamos ansiosos para 
              comemorar este dia especial com você.
            </p>
            <div className="p-4 bg-light rounded-3 mb-4">
              <h5 className="mb-3">
                <i className="fas fa-info-circle text-primary me-2"></i>
                Lembrete importante:
              </h5>
              <ul className="list-unstyled text-start">
                <li className="mb-2">
                  <i className="fas fa-calendar text-primary me-2"></i>
                  Não esqueça da data da festa
                </li>
                <li className="mb-2">
                  <i className="fas fa-clock text-primary me-2"></i>
                  Chegue no horário para não perder nada
                </li>
                <li className="mb-2">
                  <i className="fas fa-gift text-primary me-2"></i>
                  Confira a lista de presentes se quiser contribuir
                </li>
                <li>
                  <i className="fas fa-heart me-2" style={{ color: 'var(--light-blue)' }}></i>
                  Traga muito amor e alegria!
                </li>
              </ul>
            </div>

            {/* Botões de navegação */}
            <div className="row g-3">
              <div className="col-md-6">
                <button 
                  className="btn btn-primary-standard w-100"
                  onClick={() => document.getElementById('gifts-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fas fa-gift me-2"></i>
                  Ver Lista de Presentes
                </button>
              </div>
              <div className="col-md-6">
                <button 
                  className="btn btn-secondary-standard w-100"
                  onClick={() => document.getElementById('messages-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fas fa-heart me-2"></i>
                  Deixar Mensagem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="modern-card p-5">
          <div className="text-center mb-5">
            <i className="fas fa-calendar-plus fa-3x text-primary mb-3 wiggle"></i>
            <h2 className="mb-3">Confirme sua Presença</h2>
            <p className="fs-5 text-muted">
              Sua presença é muito importante para nós! Por favor, confirme 
              se você virá à festa para podermos nos organizar melhor.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 mb-4">
                <label className="form-label h5">
                  <i className="fas fa-user text-primary me-2"></i>
                  Seu nome ou nome da família:
                </label>
                <input
                  type="text"
                  className="form-control form-control-modern"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  placeholder="Digite seu nome"
                  required
                  maxLength={100}
                />
              </div>

              <div className="col-md-6 mb-4">
                <label className="form-label h5">
                  <i className="fas fa-users text-primary me-2"></i>
                  Quantos adultos:
                </label>
                <select 
                  className="form-select form-control-modern"
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

              <div className="col-md-6 mb-4">
                <label className="form-label h5">
                  <i className="fas fa-child text-primary me-2"></i>
                  Quantas crianças:
                </label>
                <select 
                  className="form-select form-control-modern"
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
              <div className="alert alert-info d-flex align-items-center mb-4">
                <i className="fas fa-info-circle me-3"></i>
                <div>
                  <strong>Total:</strong> {totalPeople} pessoa{totalPeople !== 1 ? 's' : ''} 
                  ({formData.adultsCount} adulto{formData.adultsCount !== 1 ? 's' : ''} 
                  {formData.childrenCount > 0 && ` + ${formData.childrenCount} criança${formData.childrenCount !== 1 ? 's' : ''}`})
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4">
                <i className="fas fa-exclamation-triangle me-3"></i>
                <div>{error}</div>
              </div>
            )}

            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary-standard btn-lg"
                disabled={loading || !formData.guestName.trim()}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2"></div>
                    Confirmando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Confirmar Presença 🎉
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <small className="text-muted">
              <i className="fas fa-shield-alt me-1"></i>
              Seus dados são seguros e serão usados apenas para organização da festa.
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}