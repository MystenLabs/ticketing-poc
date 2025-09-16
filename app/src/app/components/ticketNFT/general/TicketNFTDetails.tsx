import { Ticket } from "@/app/types/Ticket";
import React from "react";
import { TicketNFTDetailsItem } from "./TicketNFTDetailsItem";
import {
  getDateStringFromDateTime,
  getTimeStringFromDateTime,
} from "@/app/helpers/dates";
import Link from "next/link";
import Image from "next/image";

interface TicketNFTDetailsProps {
  ticket: Ticket;
}

export const TicketNFTDetails = ({ ticket }: TicketNFTDetailsProps) => {
  return (
    <div className="space-y-3">
      <TicketNFTDetailsItem
        title="Venue"
        text={`${ticket.eventVenue}, ${ticket.eventLocation}`}
      />
      <TicketNFTDetailsItem
        title="Date & Time"
        text={`${getDateStringFromDateTime(
          ticket.eventDate,
        )} - ${getTimeStringFromDateTime(ticket.eventDate)}`}
      />
      <div className="flex justify-between items-center">
        <TicketNFTDetailsItem
          title="Seating"
          text={`${ticket.section}, ${ticket.seats.join(", ")}`}
        />
        <TicketNFTDetailsItem
          title="Cost"
          text={`$${ticket.price}`}
          textStart={false}
        />
      </div>
      <TicketNFTDetailsItem
        title="Notes"
        text={
          <div className="pt-1">
            <div className="flex items-center space-x-1">
              <div>•</div>
              <Image
                src="/points_icon_light.svg"
                alt="points"
                width={12}
                height={12}
              />
              <span className="text-warning-foreground">
                {ticket.loyaltyPoints} Loyalty Points Earned
              </span>
            </div>
            <div className="flex text-sui-steel-80 font-[400] items-center space-x-1">
              <div>•</div>
              <div>
                <span className="font-bold">FREE drink</span> voucher at the
                event
              </div>
            </div>
          </div>
        }
      />
      <div className="flex justify-center pt-2">
        <div className="text-white bg-black px-8 py-2 m-auto rounded-xl flex space-x-2 items-center">
          <Image src="/apple_pay.svg" width={25} height={25} alt="apple-pay" />
          <div>Add to Apple Wallet</div>
        </div>
      </div>
    </div>
  );
};
