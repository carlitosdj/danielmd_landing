'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Message } from '../lib/types'
import useTypedSelector from '../hooks/useTypedSelector'
import { createMessageRequest } from '../store/ducks/messages/actions'

interface MessagesSectionProps {
  messages: Message[]
  loading: boolean
  slug: string
}

export default function MessagesSection({ messages, loading, slug }: MessagesSectionProps) {
  const dispatch = useDispatch()
  const { submitting, submitError } = useTypedSelector(state => state.messages)
  
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.guestName.trim() && formData.message.trim()) {
      dispatch(createMessageRequest(
        slug,
        formData.guestName.trim(),
        formData.message.trim(),
        formData.guestEmail.trim() || undefined
      ))
      
      // Limpar formulário após envio
      setFormData({ guestName: '', guestEmail: '', message: '' })
      setShowForm(false)
    }
  }

  const approvedMessages = messages.filter(msg => msg.isApproved)

  return (
    <div>
      {/* Header da seção */}
      <div className="text-center mb-5">
        <h2 className="text-white mb-3">
          <i className="fas fa-comments me-3"></i>
          Mensagens de Carinho
        </h2>
        <p className="text-white-50 fs-5">
          Deixe uma mensagem especial e veja o que outros convidados escreveram! 💕
        </p>
        
        <button 
          className="btn btn-primary-fun btn-lg"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-pen me-2"></i>
          Escrever Mensagem ✨
        </button>
      </div>

      {/* Mensagens existentes */}
      <div className="row">
        {loading ? (
          <div className="text-center py-5">
            <div className="loading-spinner mb-4"></div>
            <h4 className="text-white">Carregando mensagens...</h4>
          </div>
        ) : approvedMessages.length === 0 ? (
          <div className="col-12">
            <div className="modern-card p-5 text-center">
              <i className="fas fa-heart fa-3x text-muted mb-4"></i>
              <h4 className="mb-3">Seja o primeiro a deixar uma mensagem!</h4>
              <p className="text-muted">
                Compartilhe seus sentimentos e faça este dia ainda mais especial.
              </p>
            </div>
          </div>
        ) : (
          approvedMessages.map((message) => (
            <div key={message.id} className="col-lg-6 mb-4">
              <div className="message-card">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="mb-0 fw-bold">{message.guestName}</h6>
                  <small className="opacity-75">
                    {new Date(message.createdAt).toLocaleDateString('pt-BR')}
                  </small>
                </div>
                <p className="mb-0 fs-6 lh-base">"{message.message}"</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal do formulário */}
      {showForm && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}
        >
          <div className="modern-card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="p-4">
              <div className="text-center mb-4">
                <i className="fas fa-heart fa-3x text-primary mb-3"></i>
                <h4>Escreva sua Mensagem</h4>
                <p className="text-muted">
                  Compartilhe seus sentimentos e torne este momento ainda mais especial!
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-user text-primary me-2"></i>
                      Seu nome: *
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-fun"
                      value={formData.guestName}
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                      placeholder="Digite seu nome"
                      required
                      maxLength={100}
                      autoFocus
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-envelope text-primary me-2"></i>
                      Seu email (opcional):
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-fun"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                      placeholder="seu@email.com"
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <i className="fas fa-comment-dots text-primary me-2"></i>
                    Sua mensagem: *
                  </label>
                  <textarea
                    className="form-control form-control-fun"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Escreva uma mensagem carinhosa..."
                    required
                    maxLength={500}
                  />
                  <div className="form-text text-end">
                    {formData.message.length}/500 caracteres
                  </div>
                </div>

                {submitError && (
                  <div className="alert alert-danger d-flex align-items-center mb-4">
                    <i className="fas fa-exclamation-triangle me-3"></i>
                    <div>{submitError}</div>
                  </div>
                )}

                <div className="alert alert-info d-flex align-items-start">
                  <i className="fas fa-info-circle me-3 mt-1"></i>
                  <div>
                    <strong>Moderação:</strong> Sua mensagem será revisada antes de aparecer 
                    para outros convidados. Isso ajuda a manter um ambiente acolhedor para todos!
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button"
                    className="btn btn-secondary-fun me-md-2"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({ guestName: '', guestEmail: '', message: '' })
                    }}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-success-fun"
                    disabled={submitting || !formData.guestName.trim() || !formData.message.trim()}
                  >
                    {submitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Enviar Mensagem 💕
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}