export type TicketStage =
  | "Purchased"
  | "Activated"
  | "Attended"
  | "Collectible";

export interface Ticket {
  id: string;
  loyaltyId: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  eventName: string;
  eventVenue: string;
  loyaltyPoints: number;
  stage: TicketStage;
  imageUrl: string;
  roundedImageUrl: string;
  frontViewImageUrl: string;
  section: string;
  price: string;
  seats: string[];
}

export interface OnChainTicket {
  event_name: string;
  event_date: string;
  event_description: string;
  event_location: string;
  id: {
    id: string;
  };
  loyalty_id: string;
  loyalty_points: string;
  seats: string[];
  section: string;
  stage: TicketStage | { variant: TicketStage; type: string };
  venue: string;
  price: string;
}
