'use client'

import { useEffect, useState } from 'react'

interface PhotoGalleryProps {
  slug: string
}

export default function PhotoGallery({ slug }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    // Lista das fotos baseada no slug (hardcoded por enquanto)
    const photoList = [
      `/imgs/${slug}/img1.jpg`,
      `/imgs/${slug}/img2.jpg`,
      `/imgs/${slug}/img3.jpg`,
      `/imgs/${slug}/img4.jpg`,
      `/imgs/${slug}/img5.jpg`,
      `/imgs/${slug}/img6.jpg`,
    ]
    setPhotos(photoList)
  }, [slug])

  const openModal = (photoIndex: number) => {
    // Como duplicamos as fotos, precisamos calcular o índice real
    const realIndex = photoIndex % photos.length
    setCurrentPhotoIndex(realIndex)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
    if (e.key === 'ArrowRight') nextPhoto()
    if (e.key === 'ArrowLeft') prevPhoto()
  }

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isModalOpen, handleKeyDown])

  return (
    <>
      <section className="photo-gallery-section">
        <div className="container-fluid px-0">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 text-center">
              <h2 className="section-title">Momentos Especiais</h2>
              <p className="section-subtitle">
                Reviva os melhores momentos e prepare-se para criar novos! 📸✨
              </p>
            </div>
          </div>
          
          <div className="photo-gallery-container">
            <div className="photo-gallery-track">
              {/* Duplicamos as fotos para criar o efeito infinito */}
              {[...photos, ...photos, ...photos].map((photo, index) => (
                <div 
                  key={index} 
                  className="photo-item"
                  onClick={() => openModal(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={photo} 
                    alt={`Momento especial ${index + 1}`}
                    className="photo-thumbnail"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de visualização da imagem */}
      {isModalOpen && (
        <div 
          className="photo-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal()
            }
          }}
        >
          <div className="photo-modal-container">
            {/* Botão fechar */}
            <button 
              className="photo-modal-close"
              onClick={closeModal}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Botão anterior */}
            <button 
              className="photo-modal-nav photo-modal-prev"
              onClick={prevPhoto}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {/* Imagem */}
            <img 
              src={photos[currentPhotoIndex]} 
              alt={`Momento especial ${currentPhotoIndex + 1}`}
              className="photo-modal-image"
            />

            {/* Botão próxima */}
            <button 
              className="photo-modal-nav photo-modal-next"
              onClick={nextPhoto}
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            {/* Contador */}
            <div className="photo-modal-counter">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}