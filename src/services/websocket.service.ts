import { io, Socket } from 'socket.io-client';

export interface GiftBeingSelectedEvent {
  giftId: number;
  userId: string;
  userName?: string;
}

export interface GiftSelectedEvent {
  giftId: number;
  userId: string;
  userName: string;
  gift: any;
}

export interface GiftUpdatedEvent {
  giftId: number;
  gift: any;
}

export interface GiftConflictEvent {
  giftId: number;
  userId: string;
  message: string;
}

export interface GiftSelectionReleasedEvent {
  giftId: number;
  userId: string;
}

export interface GiftSelectionConflictEvent {
  giftId: number;
  message: string;
}

export interface CurrentSelectionsEvent {
  giftId: number;
  userId: string;
}

export interface GiftCreatedEvent {
  gift: any;
}

export interface GiftDeletedEvent {
  giftId: number;
  anniversaryId: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private currentSlug: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;

  // Callbacks para eventos
  private onGiftBeingSelectedCallback?: (event: GiftBeingSelectedEvent) => void;
  private onGiftSelectedCallback?: (event: GiftSelectedEvent) => void;
  private onGiftUpdatedCallback?: (event: GiftUpdatedEvent) => void;
  private onGiftCreatedCallback?: (event: GiftCreatedEvent) => void;
  private onGiftDeletedCallback?: (event: GiftDeletedEvent) => void;
  private onGiftConflictCallback?: (event: GiftConflictEvent) => void;
  private onGiftSelectionReleasedCallback?: (event: GiftSelectionReleasedEvent) => void;
  private onGiftSelectionConflictCallback?: (event: GiftSelectionConflictEvent) => void;
  private onCurrentSelectionsCallback?: (events: CurrentSelectionsEvent[]) => void;
  private onConnectionChangeCallback?: (connected: boolean) => void;

  connect(slug: string): void {
    if (this.socket && this.isConnected && this.currentSlug === slug) {
      return; // Já conectado para este slug
    }

    this.disconnect(); // Desconectar se já estiver conectado

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const socketUrl = `${apiUrl}/gifts`;

    console.log('Conectando WebSocket para:', socketUrl);

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectInterval,
    });

    this.currentSlug = slug;
    this.setupEventListeners(socketUrl);
    this.joinAnniversary(slug);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentSlug = null;
    this.reconnectAttempts = 0;
    this.onConnectionChangeCallback?.(false);
  }

  private setupEventListeners(socketUrl: string): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.onConnectionChangeCallback?.(true);
      console.log('WebSocket conectado para:', socketUrl);
      
      // Rejoin anniversary se necessário
      if (this.currentSlug) {
        this.joinAnniversary(this.currentSlug);
      }
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.onConnectionChangeCallback?.(false);
      console.log('WebSocket desconectado');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão WebSocket:', error);
      this.isConnected = false;
      this.onConnectionChangeCallback?.(false);
    });

    // Eventos de presentes
    this.socket.on('gift-being-selected', (event: GiftBeingSelectedEvent) => {
      console.log('WebSocket: gift-being-selected', event);
      this.onGiftBeingSelectedCallback?.(event);
    });

    this.socket.on('gift-selected', (event: GiftSelectedEvent) => {
      console.log('WebSocket: gift-selected', event);
      this.onGiftSelectedCallback?.(event);
    });

    this.socket.on('gift-updated', (event: GiftUpdatedEvent) => {
      console.log('WebSocket: gift-updated', event);
      this.onGiftUpdatedCallback?.(event);
    });

    this.socket.on('gift-created', (event: GiftCreatedEvent) => {
      console.log('WebSocket: gift-created', event);
      this.onGiftCreatedCallback?.(event);
    });

    this.socket.on('gift-deleted', (event: GiftDeletedEvent) => {
      console.log('WebSocket: gift-deleted', event);
      this.onGiftDeletedCallback?.(event);
    });

    this.socket.on('gift-conflict', (event: GiftConflictEvent) => {
      console.log('WebSocket: gift-conflict', event);
      this.onGiftConflictCallback?.(event);
    });

    this.socket.on('gift-selection-released', (event: GiftSelectionReleasedEvent) => {
      console.log('WebSocket: gift-selection-released', event);
      this.onGiftSelectionReleasedCallback?.(event);
    });

    this.socket.on('gift-selection-conflict', (event: GiftSelectionConflictEvent) => {
      console.log('WebSocket: gift-selection-conflict', event);
      this.onGiftSelectionConflictCallback?.(event);
    });

    this.socket.on('current-selections', (events: CurrentSelectionsEvent[]) => {
      console.log('WebSocket: current-selections', events);
      this.onCurrentSelectionsCallback?.(events);
    });
  }

  private joinAnniversary(slug: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-anniversary', { slug });
    }
  }

  // Métodos para emitir eventos
  notifyGiftBeingSelected(giftId: number, userId: string, userName?: string): void {
    console.log('Enviando gift-being-selected:', { giftId, userId, userName });
    if (this.socket && this.isConnected) {
      this.socket.emit('gift-being-selected', {
        giftId,
        userId,
        userName,
      });
    } else {
      console.warn('WebSocket não conectado, não foi possível enviar gift-being-selected');
    }
  }

  notifyGiftSelectionCancelled(giftId: number): void {
    console.log('Enviando gift-selection-cancelled:', { giftId });
    if (this.socket && this.isConnected) {
      this.socket.emit('gift-selection-cancelled', {
        giftId,
      });
    } else {
      console.warn('WebSocket não conectado, não foi possível enviar gift-selection-cancelled');
    }
  }

  // Métodos para registrar callbacks
  onGiftBeingSelected(callback: (event: GiftBeingSelectedEvent) => void): void {
    this.onGiftBeingSelectedCallback = callback;
  }

  onGiftSelected(callback: (event: GiftSelectedEvent) => void): void {
    this.onGiftSelectedCallback = callback;
  }

  onGiftUpdated(callback: (event: GiftUpdatedEvent) => void): void {
    this.onGiftUpdatedCallback = callback;
  }

  onGiftCreated(callback: (event: GiftCreatedEvent) => void): void {
    this.onGiftCreatedCallback = callback;
  }

  onGiftDeleted(callback: (event: GiftDeletedEvent) => void): void {
    this.onGiftDeletedCallback = callback;
  }

  onGiftConflict(callback: (event: GiftConflictEvent) => void): void {
    this.onGiftConflictCallback = callback;
  }

  onGiftSelectionReleased(callback: (event: GiftSelectionReleasedEvent) => void): void {
    this.onGiftSelectionReleasedCallback = callback;
  }

  onGiftSelectionConflict(callback: (event: GiftSelectionConflictEvent) => void): void {
    this.onGiftSelectionConflictCallback = callback;
  }

  onCurrentSelections(callback: (events: CurrentSelectionsEvent[]) => void): void {
    this.onCurrentSelectionsCallback = callback;
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.onConnectionChangeCallback = callback;
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }

  get currentAnniversarySlug(): string | null {
    return this.currentSlug;
  }

  // Método para gerar um ID único para o usuário
  generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();