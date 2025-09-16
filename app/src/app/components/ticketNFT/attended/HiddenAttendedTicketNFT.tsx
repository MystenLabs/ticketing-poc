import React, { useMemo } from "react";

import { Ticket } from "@/app/types/Ticket";
import { ShowHideButton } from "../ShowHideButton";
import Link from "next/link";
import {
  getDateStringFromDateTime,
  getDateStringFromDateTimeForTicket,
} from "@/app/helpers/dates";
import { AttendedTicketSeats } from "./AttendedTicketSeats";

interface HiddenAttendedTicketNFTProps {
  ticket: Ticket;
  handleShow: () => void;
  transitionClassName?: string;
}

export const HiddenAttendedTicketNFT = ({
  ticket,
  handleShow,
  transitionClassName,
}: HiddenAttendedTicketNFTProps) => {
  const imageId = useMemo(() => {
    return parseInt(ticket.frontViewImageUrl.replace(".svg", "").split("/")[2]);
  }, [ticket.frontViewImageUrl]);

  const textPositionClassName = useMemo(() => {
    if (imageId === 1) {
      return "top-[350px] right-[25px] text-end";
    }
    if (imageId === 2) {
      return "top-[280px] right-[5px] text-end text-white";
    }
    if (imageId === 3) {
      return "top-[200px] left-[25px] text-start text-white";
    }
    if (imageId === 4) {
      return "top-[110px] left-1/2 transform -translate-x-1/2 text-center text-white";
    }
    if (imageId === 5) {
      return "top-[20px] right-[5px] left-1/2 transform -translate-x-1/2 text-center text-white";
    }
  }, [imageId]);

  const seatsPositionClassName = useMemo(() => {
    if (imageId === 1) {
      return "top-[200px] ml-[10%] w-[80%]";
    }
    if (imageId === 2) {
      return "bottom-[25px] w-[70%] right-[5px]";
    }
    if (imageId === 3) {
      return "top-[370px] right-[20px] text-start";
    }
    if (imageId === 4) {
      return "bottom-[50px] w-[80%] ml-[10%]";
    }
    if (imageId === 5) {
      return "top-[280px] ml-[10%] w-[80%]";
    }
  }, [imageId]);

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className={`w-full flex flex-col items-center ${transitionClassName}`}
    >
      <div
        className="relative w-full rounded-lg pt-10 pb-5 flex flex-col justify-between h-[500px] max-w-[350px]"
        style={{
          backgroundImage: `url('${ticket.frontViewImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute right-1 top-2 z-10">
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
        {(imageId === 3 || imageId === 4) && (
          <div className="absolute left-0 top-0">
            <div className="text-white text-lg font-bold mt-4 ml-4">
              {getDateStringFromDateTimeForTicket(ticket.eventDate)}
            </div>
          </div>
        )}
      </div>{" "}
    </Link>
  );
};
