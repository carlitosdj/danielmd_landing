'use client'

import { useEffect, useState, useRef } from 'react'

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
      {/* Estilo customizado para a galeria */}
      <style jsx>{`
        .photo-gallery-modern {
          /* background: linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(30, 64, 175, 0.08) 100%); */
          /* padding: 3rem 0 4rem 0; */
          
          overflow: hidden;
          position: relative;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
        }
        
        .photo-gallery-track {
          display: flex;
          animation: scroll-photos 40s linear infinite;
          will-change: transform;
          gap: 2rem;
        }
        
        .photo-gallery-modern:hover .photo-gallery-track {
          animation-play-state: paused;
        }
        
        .photo-item-modern {
          flex-shrink: 0;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-colorida);
          transition: all 0.4s ease;
          cursor: pointer;
          position: relative;
        }
        
        .photo-item-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          /* background: linear-gradient(135deg, transparent 0%, rgba(56, 189, 248, 0.1) 100%); */
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }
        
        .photo-item-modern:hover {
          transform: scale(1.05) translateY(-8px);
          box-shadow: var(--shadow-magica);
        }
        
        .photo-item-modern:hover::before {
          opacity: 1;
        }
        
        .photo-thumbnail-modern {
          width: 280px;
          height: 350px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          transition: all 0.4s ease;
        }
        
        @keyframes scroll-photos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        
        .photo-modal-overlay-modern {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          // background: rgba(15, 23, 42, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.3s ease;
        }
        
        .photo-modal-image-modern {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-magica);
          animation: scaleIn 0.3s ease;
        }
        
        .photo-modal-btn {
          background: rgba(56, 189, 248, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }
        
        .photo-modal-btn:hover {
          background: rgba(56, 189, 248, 0.4);
          border-color: rgba(56, 189, 248, 0.6);
          transform: scale(1.1);
        }
        
        .photo-modal-close-modern {
          position: absolute;
          top: -30px;
          right: -50px;
          width: 50px;
          height: 50px;
        }
        
        .photo-modal-nav-modern {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          font-size: 1.5rem;
        }
        
        .photo-modal-prev-modern { left: -80px; }
        .photo-modal-next-modern { right: -80px; }
        
        .photo-modal-counter-modern {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(56, 189, 248, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          padding: 12px 24px;
          border-radius: var(--radius-lg);
          font-weight: 600;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .photo-thumbnail-modern {
            width: 220px;
            height: 280px;
          }
          
          .photo-modal-close-modern {
            top: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 1rem;
          }
          
          .photo-modal-nav-modern {
            width: 45px;
            height: 45px;
            font-size: 1rem;
          }
          
          .photo-modal-prev-modern { left: 20px; }
          .photo-modal-next-modern { right: 20px; }
          
          .photo-modal-counter-modern {
            bottom: 20px;
            padding: 8px 16px;
          }
        }
      `}</style>

      <div className="photo-gallery-modern">
        <div style={{ 
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          //height: '400px',
          padding: '3rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div className="photo-gallery-track">
            {/* Duplicamos as fotos para criar o efeito infinito */}
            {[...photos, ...photos, ...photos].map((photo, index) => (
              <div 
                key={index} 
                className="photo-item-modern"
                onClick={() => openModal(index)}
              >
                <img 
                  src={photo} 
                  alt={`Momento especial ${index + 1}`}
                  className="photo-thumbnail-modern"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de visualização da imagem */}
      {isModalOpen && (
        <div 
          className="photo-modal-overlay-modern"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal()
            }
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Botão fechar */}
            <button 
              className="photo-modal-btn photo-modal-close-modern"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Botão anterior */}
            <button 
              className="photo-modal-btn photo-modal-nav-modern photo-modal-prev-modern"
              onClick={prevPhoto}
            >
              ‹
            </button>

            {/* Imagem */}
            <img 
              src={photos[currentPhotoIndex]} 
              alt={`Momento especial ${currentPhotoIndex + 1}`}
              className="photo-modal-image-modern"
            />

            {/* Botão próxima */}
            <button 
              className="photo-modal-btn photo-modal-nav-modern photo-modal-next-modern"
              onClick={nextPhoto}
            >
              ›
            </button>

            {/* Contador */}
            <div className="photo-modal-counter-modern">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}