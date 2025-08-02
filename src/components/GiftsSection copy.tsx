'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Gift } from '../lib/types'
import { markGiftBoughtRequest } from '../store/ducks/gifts/actions'
import { startGiftSelection, cancelGiftSelection, clearGiftConflictMessage } from '../store/ducks/gifts/actions'
import useTypedSelector from '../hooks/useTypedSelector'
import { useWebSocket } from '../hooks/useWebSocket'

interface GiftsSectionProps {
  gifts: Gift[]
  loading: boolean
  slug: string
}

export default function GiftsSection({ gifts, loading, slug }: GiftsSectionProps) {
  const dispatch = useDispatch()
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [buyerName, setBuyerName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

  // WebSocket and concurrency state
  const { 
    websocketConnected, 
    activeSelections, 
    conflictMessages, 
    giftVersions, 
    userId 
  } = useTypedSelector(state => state.gifts)
  
  const { notifyGiftBeingSelected, notifyGiftSelectionCancelled } = useWebSocket(slug)

  const hasGiftConflict = useCallback((giftId: number) => {
    return conflictMessages[giftId] !== undefined
  }, [conflictMessages])

  const handleMarkAsBought = (gift: Gift) => {
    // Clear any existing conflict message
    if (hasGiftConflict(gift.id)) {
      dispatch(clearGiftConflictMessage(gift.id))
    }

    setSelectedGift(gift)
    setShowModal(true)
  }

  const handleConfirmPurchase = () => {
    if (selectedGift && buyerName.trim() && userId) {
      const giftVersion = giftVersions[selectedGift.id] || 1
      
      // Notify WebSocket about selection when user confirms
      notifyGiftBeingSelected(selectedGift.id, buyerName)
      
      // Start local selection
      dispatch(startGiftSelection(selectedGift.id, userId, buyerName))
      
      dispatch(markGiftBoughtRequest(
        selectedGift.id, 
        buyerName.trim(), 
        giftVersion, 
        userId
      ))
      
      setShowModal(false)
      setSelectedGift(null)
      setBuyerName('')
    }
  }

  const handleCancelSelection = () => {
    setShowModal(false)
    setSelectedGift(null)
    setBuyerName('')
  }

  // Auto-close modal when gift is selected by another user
  useEffect(() => {
    if (selectedGift && showModal) {
      const giftInState = gifts.find(g => g.id === selectedGift.id)

      // Check if gift was selected by another user
      if (giftInState && giftInState.status === 'comprado') {
        alert(`Este presente já foi escolhido por ${giftInState.boughtBy || 'outro usuário'}.`)
        handleCancelSelection()
        return
      }

      // Check for conflict messages
      if (hasGiftConflict(selectedGift.id)) {
        const conflict = conflictMessages[selectedGift.id]
        alert(conflict?.message || 'Conflito detectado')
        handleCancelSelection()
        return
      }
    }
  }, [selectedGift, showModal, gifts, hasGiftConflict, conflictMessages])

  const availableGifts = gifts.filter(gift => gift.status === 'disponivel')
  const purchasedGifts = gifts.filter(gift => gift.status === 'comprado')

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="loading-spinner mb-4"></div>
        <h4 className="text-white">Carregando lista de presentes...</h4>
      </div>
    )
  }

  if (gifts.length === 0) {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="modern-card p-5 text-center">
            <i className="fas fa-gift fa-3x text-muted mb-4"></i>
            <h3 className="mb-3">Nenhum presente cadastrado</h3>
            <p className="text-muted">
              A lista de presentes ainda não foi preparada. Volte em breve!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Presentes disponíveis */}
      {availableGifts.length > 0 && (
        <div className="mb-5">
          {/* <div className="text-center mb-4">
            <h2 className="text-white mb-3">
              <i className="fas fa-gift me-3"></i>
              Lista de Presentes
            </h2>
            <p className="text-white-50 fs-5">
              Escolha um presente e ajude a tornar este dia ainda mais especial! 🎁
            </p>
          </div> */}

          <div className="row">
            {availableGifts.map((gift) => (
              <div key={gift.id} className="col-md-6 col-lg-4 mb-4">
                <div className="gift-card h-100">
                  {gift.imageUrl && (
                    <img 
                      src={gift.imageUrl} 
                      alt={gift.name}
                      className="card-img-top"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  )}
                  
                  <div className="p-4">
                    <h5 className="card-title mb-3">{gift.name}</h5>
                    
                    <div className="d-grid gap-2">
                      {gift.linkUrl && (
                        <a 
                          href={gift.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary rounded-pill"
                        >
                          <i className="fas fa-external-link-alt me-2"></i>
                          Ver na loja
                        </a>
                      )}
                      
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleMarkAsBought(gift)}
                      >
                        <i className="fas fa-heart me-2"></i>
                        Vou dar este! 💝
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Card PIX como último item */}
            {/* <div className="col-md-6 col-lg-4 mb-4">
              <div className="gift-card h-100" style={{ 
                background: 'var(--gradient-secondary)',
                color: 'white',
                border: 'none'
              }}>
                <div className="d-flex align-items-center justify-content-center" style={{ 
                  height: '250px',
                  background: 'linear-gradient(135deg, var(--ocean-blue) 0%, var(--sky-blue) 100%)'
                }}>
                  <div className="text-center">
                    <i className="fas fa-mobile-alt" style={{ fontSize: '4rem', marginBottom: '1rem' }}></i>
                    <h4 className="mb-0">Contribuição PIX</h4>
                  </div>
                </div>
                
                <div className="p-4">
                  <h5 className="card-title mb-3">💝 Contribuição via PIX</h5>
                  <p className="mb-3" style={{ fontSize: '0.9rem', opacity: '0.9' }}>
                    Prefere contribuir de forma prática? Faça um PIX de qualquer valor!
                  </p>
                  
                  <div className="d-grid gap-2">
                    <div className="pix-card p-3 mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <small>Chave PIX:</small>
                          <div style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '1rem' }}>
                            01605743666
                          </div>
                        </div>
                        <button 
                          className={`btn btn-copy-pix ${pixCopied ? 'copied' : ''}`}
                          onClick={() => {
                            navigator.clipboard.writeText('01605743666')
                            setPixCopied(true)
                            setTimeout(() => setPixCopied(false), 2000)
                          }}
                          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                        >
                          <i className={`fas ${pixCopied ? 'fa-check' : 'fa-copy'}`}></i>
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        navigator.clipboard.writeText('01605743666')
                        setPixCopied(true)
                        setTimeout(() => setPixCopied(false), 2000)
                      }}
                    >
                      <i className="fas fa-heart me-2"></i>
                      {pixCopied ? 'PIX Copiado! 💝' : 'Vou contribuir! 💝'}
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* Presentes já comprados */}
      {/* {purchasedGifts.length > 0 && (
        <div>
          <div className="text-center mb-4">
            <h3 className="text-white mb-3">
              <i className="fas fa-check-circle me-3"></i>
              Presentes já escolhidos
            </h3>
            <p className="text-white-50">
              Obrigado a quem já escolheu um presente! 💕
            </p>
          </div>

          <div className="row">
            {purchasedGifts.map((gift) => (
              <div key={gift.id} className="col-md-6 col-lg-4 mb-4">
                <div className="gift-card purchased h-100">
                  {gift.imageUrl && (
                    <img 
                      src={gift.imageUrl} 
                      alt={gift.name}
                      className="card-img-top"
                      style={{ height: '250px', objectFit: 'cover', filter: 'grayscale(0.5)' }}
                    />
                  )}
                  
                  <div className="p-4">
                    <h5 className="card-title mb-2">{gift.name}</h5>
                    {gift.boughtBy && (
                      <p className="text-muted mb-0">
                        <i className="fas fa-heart me-2" style={{ color: 'var(--light-blue)' }}></i>
                        Escolhido por: <strong>{gift.boughtBy}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Modal de confirmação */}
      {showModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}
        >
          <div className="modern-card" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="p-4">
              <div className="text-center mb-4">
                <i className="fas fa-gift fa-3x text-primary mb-3"></i>
                <h4>Confirmar escolha do presente</h4>
                <p className="text-muted">
                  Você escolheu: <strong>{selectedGift?.name}</strong>
                </p>
                
                {/* Connection status indicator */}
                {!websocketConnected && (
                  <div className="alert alert-warning" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Conexão instável. Atualizações em tempo real podem não funcionar.
                  </div>
                )}
                
                {/* Conflict message */}
                {selectedGift && hasGiftConflict(selectedGift.id) && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {conflictMessages[selectedGift.id]?.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Seu nome:</label>
                <input
                  type="text"
                  className="form-control form-control-modern"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Digite seu nome"
                  maxLength={100}
                  autoFocus
                />
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button 
                  type="button"
                  className="btn btn-secondary-standard me-md-2"
                  onClick={handleCancelSelection}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button 
                  type="button"
                  className="btn btn-primary-standard"
                  onClick={handleConfirmPurchase}
                  disabled={!buyerName.trim()}
                >
                  <i className="fas fa-check me-2"></i>
                  Confirmar escolha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}