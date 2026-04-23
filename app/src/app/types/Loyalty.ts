export interface Loyalty {
  id: string;
  loyalty_points: number;
  tenure_date: number;
}

export interface OnChainLoyalty {
  id: { id: string } | string;
  loyalty_points: string;
  tenure_date: string;
}
