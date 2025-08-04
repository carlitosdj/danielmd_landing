'use client'

import { Provider } from 'react-redux'
import store from '../store'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Daniel Marques Defelícibus</title>
        <meta name="description" content="1 Aninho do Daniel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph meta tags for WhatsApp sharing */}
        <meta property="og:title" content="Daniel Marques Defelícibus" />
        <meta property="og:description" content="Meu Primeiro Aninho! Confirme sua presença!" />
        <meta property="og:image" content="https://danielmd.com.br/imgs/1-ano/img6.jpg" />
        <meta property="og:url" content="https://danielmd.com.br" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daniel Marques Defelícibus" />
        <meta name="twitter:description" content="Meu Primeiro Aninho! Confirme sua presença!" />
        <meta name="twitter:image" content="https://danielmd.com.br/imgs/1-ano/img6.jpg" />
        
        {/* Bootstrap CSS */}
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
        
        {/* Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Comic+Neue:wght@300;400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
        
        {/* Bootstrap JS */}
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        />
      </body>
    </html>
  )
}