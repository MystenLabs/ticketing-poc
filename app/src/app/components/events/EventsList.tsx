import { mockEvents } from "@/app/data/mockEvents";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import { EventsListItem } from "./EventsListItem";
import Image from "next/image";

export const EventsList = () => {
  return (
    <div className="px-3 py-4 flex flex-col space-y-3 bg-white rounded-xl">
      <div className="flex justify-between">
        <div className="text-sui-steel-80 font-[590] text-sm">Trending</div>
        <Link
          className="flex space-x-1 items-center text-info font-bold text-sm"
          href="#"
        >
          <div>See All</div>
          <Image
            src="/arrow_top_right.svg"
            alt="arrow-top-right"
            width={10}
            height={10}
          />
        </Link>
      </div>
      <div className="flex flex-col space-y-3">
        {mockEvents.map((event) => (
          <EventsListItem key={event.id} {...event} />
        ))}
      </div>
      <div id="end-of-page" />
    </div>
  );
};
