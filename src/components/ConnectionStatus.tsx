'use client'

import { useEffect, useState } from 'react'
import useTypedSelector from '../hooks/useTypedSelector'

interface ConnectionStatusProps {
  showOnline?: boolean
  className?: string
}

export default function ConnectionStatus({ showOnline = false, className = '' }: ConnectionStatusProps) {
  const { websocketConnected } = useTypedSelector(state => state.gifts)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    if (!websocketConnected) {
      setShowStatus(true)
    } else if (showOnline) {
      setShowStatus(true)
      // Hide online status after 3 seconds
      const timer = setTimeout(() => {
        setShowStatus(false)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShowStatus(false)
    }
  }, [websocketConnected, showOnline])

  if (!showStatus) return null

  return (
    <div className={`connection-status ${websocketConnected ? 'connected' : 'disconnected'} ${className}`}>
      <div className="connection-indicator">
        <div className="connection-dot"></div>
        <span className="connection-text">
          {websocketConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </div>
      
      <style jsx>{`
        .connection-status {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 20px;
          padding: 8px 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .connection-status.connected {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .connection-status.disconnected {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .connection-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .connection-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .connected .connection-dot {
          background: #28a745;
        }
        
        .disconnected .connection-dot {
          background: #dc3545;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .connection-status {
            top: 10px;
            right: 10px;
            font-size: 0.8rem;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  )
}