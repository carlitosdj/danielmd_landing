'use client'

import { useEffect, useState } from 'react'

interface PhotoGalleryProps {
  slug: string
}

export default function PhotoGalleryNew({ slug }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    // Lista das fotos baseada no slug
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
    setCurrentPhotoIndex(photoIndex)
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
  }, [isModalOpen])

  return (
    <>
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="photo-item"
            onClick={() => openModal(index)}
          >
            <img 
              src={photo} 
              alt={`Momento especial ${index + 1}`}
              className="photo-image"
              loading="lazy"
              draggable={false}
            />
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }} className="photo-overlay">
              🔍 Clique para ampliar
            </div>
          </div>
        ))}
      </div>

      {/* Modal de visualização da imagem */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(10px)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal()
            }
          }}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Botão fechar */}
            <button 
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '-60px',
                right: '-60px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ✕
            </button>

            {/* Botão anterior */}
            <button 
              onClick={prevPhoto}
              style={{
                position: 'absolute',
                left: '-80px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              ‹
            </button>

            {/* Imagem */}
            <img 
              src={photos[currentPhotoIndex]} 
              alt={`Momento especial ${currentPhotoIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            />

            {/* Botão próxima */}
            <button 
              onClick={nextPhoto}
              style={{
                position: 'absolute',
                right: '-80px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              ›
            </button>

            {/* Contador */}
            <div style={{
              position: 'absolute',
              bottom: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 'var(--radius-lg)',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .photo-item:hover .photo-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </>
  )
}