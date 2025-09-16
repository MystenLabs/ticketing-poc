import React from "react";

interface TicketPriceChipProps {
  price: number;
}

export const TicketPriceChip = ({ price }: TicketPriceChipProps) => {
  return (
    <div className="text-xs px-2 py-[2px] bg-red-100 text-error-foreground font-bold rounded-md font-semibold">
      FROM ${price}
    </div>
  );
};
