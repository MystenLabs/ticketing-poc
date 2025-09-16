import {
  getDateStringFromDateTime,
  getTimeStringFromDateTime,
} from "@/app/helpers/dates";
import { truncateString } from "@/app/helpers/truncateString";
import { Ticket } from "@/app/types/Ticket";
import React from "react";
import { HiddenNFTFooterSection } from "./HiddenNFTFooterSection";

interface HiddenNFTFooterProps {
  ticket: Ticket;
}

export const HiddenNFTFooter = ({ ticket }: HiddenNFTFooterProps) => {
  return (
    <div className="grid grid-cols-2 border-t border-gray-400 text-sm">
      <div className="col-span-1 border-r border-gray-400 py-3">
        <HiddenNFTFooterSection
          title="Date & Time"
          subtitle={`${getDateStringFromDateTime(
            ticket.eventDate,
          )} - ${getTimeStringFromDateTime(ticket.eventDate)}`}
        />
      </div>
      <div className="col-span-1 py-3">
        <HiddenNFTFooterSection
          title="Venue"
          subtitle={truncateString(ticket.eventVenue, 15)}
        />
      </div>
    </div>
  );
};
