export interface Anniversary {
  id: number;
  title: string;
  slug: string;
  eventDate: string;
  eventTime: string;
  address: string;
  welcomeMessage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Gift {
  id: number;
  anniversaryId: number;
  name: string;
  linkUrl?: string;
  imageUrl?: string;
  status: 'disponivel' | 'comprado';
  boughtBy?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface GuestRsvp {
  id: number;
  anniversaryId: number;
  guestName: string;
  adultsCount: number;
  childrenCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRsvpRequest {
  guestName: string;
  adultsCount: number;
  childrenCount: number;
}

export interface MarkGiftBoughtRequest {
  boughtBy: string;
  version: number;
  userId?: string;
}

export interface Message {
  id: number;
  anniversaryId: number;
  guestName: string;
  guestEmail?: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageRequest {
  guestName: string;
  guestEmail?: string;
  message: string;
}