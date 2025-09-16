import { Event } from "@/app/types/Event";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { EventCardSubHeader } from "./EventCardSubHeader";
import { TicketPriceChip } from "../general/TicketPriceChip";
import { LoyaltyPointsChip } from "../general/LoyaltyPointsChip";

export const EventCard = ({
  id,
  name,
  image,
  datetime,
  venue,
  ...rest
}: Event) => {
  return (
    <Link
      className="bg-white rounded-2xl flex flex-col space-y-3 p-2.5 pb-4 min-h-[200px]"
      style={{
        boxShadow: "0px 10px 30px -20px rgba(86, 104, 115, 0.2)",
      }}
      href={`/events/${id}`}
    >
      <div className="w-full h-[130px]">
        <Image
          src={image}
          alt="event"
          width={0}
          height={0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div>
          <div className="text-sui-greys-90 font-semibold text-lg">{name}</div>
          <EventCardSubHeader
            id={id}
            name={name}
            image={image}
            datetime={datetime}
            venue={venue}
            {...rest}
          />
        </div>
        <div className="flex items-center space-x-2">
          <LoyaltyPointsChip points={100} darkText />
          <TicketPriceChip price={10} />
        </div>
      </div>
    </Link>
  );
};
