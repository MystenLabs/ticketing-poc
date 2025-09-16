import {
  dateTimeStringToNumber,
  getDateStringFromDateTime,
  getTimeStringFromDateTime,
} from "@/app/helpers/dates";
import { Event } from "@/app/types/Event";
import { Seat } from "@/app/types/Seat";
import React from "react";
import { SeatDetailsItem } from "./SeatDetailsItem";
import {
  FileTextIcon,
  LightningBoltIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

interface SingleSeatDetailsProps {
  event: Event;
  seat: Seat;
}

export const SingleSeatDetails = ({ event, seat }: SingleSeatDetailsProps) => {
  return (
    <div className="flex flex-col space-y-2 text-black">
      <SeatDetailsItem
        icon={
          <Image src={"/blue_star.svg"} width={30} height={30} alt="tickets" />
        }
        imagePadding={2}
        title={event.name}
        subtitle={
          <div className="space-y-2">
            <div className="space-y-1">
              <div>
                {getDateStringFromDateTime(
                  `${dateTimeStringToNumber(event.datetime)}`,
                )}{" "}
                &bull;{" "}
                {getTimeStringFromDateTime(
                  `${dateTimeStringToNumber(event.datetime)}`,
                )}
              </div>
              <div>
                {event.venue}, {event.location}
              </div>
            </div>
            <div className="w-full h-[100px]">
              <Image
                src={event.image}
                alt="event"
                width={0}
                height={0}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          </div>
        }
      />
      <SeatDetailsItem
        icon={
          <Image
            src={"/blue_tickets.svg"}
            width={25}
            height={25}
            alt="tickets"
          />
        }
        title={"Instant Ticket Delivery"}
        subtitle={"Available in app right after you purchase."}
        imagePadding={1}
      />
      <SeatDetailsItem
        icon={
          <Image
            src={"/blue_interactive_tickets.svg"}
            width={25}
            height={25}
            alt="interactive tickets"
          />
        }
        title={"In-app Interactive Tickets"}
        subtitle={"Watch out your tickets for offers & more!"}
        imagePadding={2}
      />
    </div>
  );
};
