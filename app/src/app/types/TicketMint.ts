// Type definitions for ticket signature minting

export interface TicketMintRequest {
  owner: string;
  event_id: string;
  event_date: number;
  event_location: string;
  venue: string;
  section: string;
  seats: string[];
  loyalty_points: number;
  event_description: string;
  event_name: string;
  price: number;
}

export interface TicketMintResponse {
  signature: string;
  bytes: string;
  nonce: string;
}
