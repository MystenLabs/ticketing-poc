import { mockSeats } from "@/app/data/mockSeats";
import React from "react";
import { SeatsListItem } from "./SeatsListItem";
import { Seat } from "@/app/types/Seat";

interface SeatsListProps {
  handleSelectSeat: (seat: Seat) => void;
}

export const SeatsList = ({ handleSelectSeat }: SeatsListProps) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
      {mockSeats.map((seat) => (
        <div
          key={seat.name}
          onClick={() => handleSelectSeat(seat)}
          className="select-seat-button cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelectSeat(seat);
            }
          }}
        >
          <SeatsListItem {...seat} />
        </div>
      ))}
    </div>
  );
};
