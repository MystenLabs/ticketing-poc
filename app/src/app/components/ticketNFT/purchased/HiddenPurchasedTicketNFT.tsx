import React, { useMemo } from "react";

import { Ticket } from "@/app/types/Ticket";
import { ShowHideButton } from "../ShowHideButton";
import Link from "next/link";
import { getDateStringFromDateTimeForTicket } from "@/app/helpers/dates";
import Image from "next/image";

interface HiddenPurchasedTicketNFTProps {
  ticket: Ticket;
  handleShow: () => void;
  transitionClassName?: string;
}

export const HiddenPurchasedTicketNFT = ({
  ticket,
  handleShow,
  transitionClassName = "",
}: HiddenPurchasedTicketNFTProps) => {
  const imageId = useMemo(() => {
    return parseInt(ticket.frontViewImageUrl.replace(".svg", "").split("/")[2]);
  }, [ticket.frontViewImageUrl]);

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className={`w-full flex flex-col items-center ${transitionClassName} transition-opacity duration-200 ease-in-out`}
    >
      <div
        className="relative w-full rounded-lg pt-5 flex flex-col h-[500px] max-w-[350px]"
        style={{
          backgroundImage: `url('${ticket.frontViewImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {(imageId === 3 || imageId === 4) && (
          <div className="absolute left-0 top-0">
            <div className="text-white text-lg font-bold mt-4 ml-4">
              {getDateStringFromDateTimeForTicket(ticket.eventDate)}
            </div>
          </div>
        )}

        <div className="absolute right-1 top-2 z-1">
          <ShowHideButton
            onClick={(e) => {
              e.preventDefault();
              handleShow();
            }}
          />
          {imageId !== 3 && imageId !== 4 && (
            <div className="transform rotate-90 text-white text-lg font-bold mt-10 mr-[-30px]">
              {getDateStringFromDateTimeForTicket(ticket.eventDate)}
            </div>
          )}
        </div>
      </div>{" "}
    </Link>
  );
};
