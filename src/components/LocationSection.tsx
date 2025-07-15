"use client";

import { useEffect, useState } from "react";

interface LocationSectionProps {
  address: string;
  id: string;
}

// Declaração de tipos para Google Maps
declare global {
  interface Window {
    google: any;
  }
}

export default function LocationSection({ address, id }: LocationSectionProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carregar Google Maps API
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        return;
      }

      // Verificar se já existe um script carregando
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD1rxTd6i1OHnTfCGpg5k03NXVGhzsTXwQ&libraries=places`; //https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=console.debug&libraries=maps,marker&v=beta
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setMapLoaded(true);
      };

      script.onerror = () => {
        setError("Erro ao carregar o Google Maps");
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  useEffect(() => {
    if (mapLoaded && address) {
      initializeMap();
    }
  }, [mapLoaded, address]);

  const initializeMap = () => {
    const mapElement = document.getElementById("google-map");
    if (!mapElement || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: address }, (results: any, status: any) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;

        const map = new window.google.maps.Map(mapElement, {
          zoom: 15,
          center: location,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ weight: "2.00" }],
            },
            {
              featureType: "all",
              elementType: "geometry.stroke",
              stylers: [{ color: "#9c9c9c" }],
            },
            {
              featureType: "all",
              elementType: "labels.text",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#f2f2f2" }],
            },
            {
              featureType: "landscape",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "landscape.man_made",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "poi",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road",
              elementType: "all",
              stylers: [{ saturation: -100 }, { lightness: 45 }],
            },
            {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [{ color: "#eeeeee" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#7b7b7b" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.highway",
              elementType: "all",
              stylers: [{ visibility: "simplified" }],
            },
            {
              featureType: "road.arterial",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#46bcec" }, { visibility: "on" }],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#c8d7d4" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#070707" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }],
            },
          ],
        });

        // Adicionar marcador
        new window.google.maps.Marker({
          position: location,
          map: map,
          title: address,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e11d48"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 40),
          },
        });
      } else {
        setError("Não foi possível encontrar o endereço no mapa");
      }
    });
  };

  const openInGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      "_blank"
    );
  };

  const openInWaze = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://waze.com/ul?q=${encodedAddress}`, "_blank");
  };

  return (
    <section
      className="modern-section section-bg-light"
      id={id}
      style={{ padding: "4rem 0 0 0" }}
    >
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0" }}>
        <div className="container-modern">
          <div className="section-header">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
            <h2 className="section-title">Como Chegar</h2>
            <p className="section-subtitle">
              Encontre facilmente o local da festa e venha celebrar conosco! 🎉
            </p>
          </div>
        </div>

        {/* Informações e botões */}
        <div className="container-modern">
          {/* Endereço */}
          <div
            className="modern-card"
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📍</div>
            <h3
              style={{
                color: "var(--gray-900)",
                marginBottom: "1rem",
                fontSize: "1.5rem",
              }}
            >
              Endereço da Festa
            </h3>
            <p
              style={{
                color: "var(--gray-600)",
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              {address}
            </p>
          </div>

          {/* Botões de navegação */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              // '@media (min-width: 768px)': {
              //   flexDirection: 'row'
              // }
            }}
          >
            <button
              className="btn-modern"
              onClick={openInGoogleMaps}
              style={{
                flex: 1,
                background: "var(--primary-blue)",
                color: "white",
              }}
            >
              🗺️ Abrir no Google Maps
            </button>
            <button
              className="btn-modern"
              onClick={openInWaze}
              style={{
                flex: 1,
                background: "var(--primary-purple)",
                color: "white",
              }}
            >
              🚗 Abrir no Waze
            </button>
          </div>

          {/* Dicas de navegação */}
          <div
            style={{
              background: "var(--gradient-section)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              marginTop: "2rem",
            }}
          >
            <h4
              style={{
                color: "var(--gray-900)",
                marginBottom: "1.5rem",
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
              💡 Dicas para Chegar
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>🅿️</span>
                <span style={{ fontSize: "0.9rem" }}>
                  Estacionamento disponível no local
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>🚌</span>
                <span style={{ fontSize: "0.9rem" }}>
                  Acesso por transporte público
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>⏰</span>
                <span style={{ fontSize: "0.9rem" }}>
                  Chegue com antecedência
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>📱</span>
                <span style={{ fontSize: "0.9rem" }}>
                  Tenha o endereço salvo no celular
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mapa ocupando toda a largura */}
      <div
        style={{
          width: "100%",
          height: "400px",
          position: "relative",
          marginTop: "2rem",
          //marginBottom: "2rem",
          //backgroundColor: "var(--primary-purple)",
        }}
      >
        {!mapLoaded && !error ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--gray-100)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                color: "var(--gray-500)",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  border: "3px solid var(--gray-300)",
                  borderTop: "3px solid var(--primary-blue)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <span>Carregando mapa...</span>
            </div>
          </div>
        ) : error ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--gray-100)",
              borderRadius: "var(--radius-lg)",
              color: "var(--gray-500)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🗺️</div>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div
            id="google-map"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          ></div>
        )}
      </div>
    </section>
  );
}
