export interface LoyaltyPointRequest {
  loyalty_id: string;
  points_to_add: number;
}

export interface LoyaltyPointResponse {
  signature: string;
  bytes: string;
  nonce: string;
}
