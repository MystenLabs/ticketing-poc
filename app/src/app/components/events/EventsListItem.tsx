import {
  dateTimeStringToNumber,
  getDateStringFromDateTime,
} from "@/app/helpers/dates";
import { Event } from "@/app/types/Event";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Chip } from "../general/Chip";
import { useSearchEvents } from "@/app/hooks/useSearchEvents";
import { truncateString } from "@/app/helpers/truncateString";
interface EventsListItemProps extends Event {
  isSearchResult?: boolean;
}

export const EventsListItem = ({
  id,
  name,
  image,
  datetime,
  venue,
  isSearchResult = false,
}: EventsListItemProps) => {
  const { storeSearchInLocalStorage } = useSearchEvents();

  const onClick = (e: any) => {
    storeSearchInLocalStorage(id);
  };

  return (
    <Link
      className="flex justify-between items-center events-list-item"
      href={`/events/${id}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <div className="w-[36px] h-[36px]">
          <Image
            src={image}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <div className="font-[590] text-sui-greys-90">{name}</div>
          <div className="flex space-x-4 text-sui-steel-80 font-400 text-xs">
            <div className="flex space-x-1">
              <Image
                src="/calendar.svg"
                alt="calendar"
                width={13}
                height={13}
              />
              <div className="w-[59px]">
                {getDateStringFromDateTime(
                  `${dateTimeStringToNumber(datetime)}`,
                )}
              </div>
            </div>
            <div className="flex space-x-1">
              <Image src="/map_pin.svg" alt="pin" width={13} height={13} />
              <div>{truncateString(venue, 12)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-1 items-center">
        <Chip variant="warning" outlined className="bg-inherit">
          <Image
            src={"/points_icon_light.svg"}
            alt="points"
            width={10}
            height={10}
          />
          <div>100</div>
        </Chip>
        <Image src="/arrow_right.svg" alt="arrow" width={5} height={5} />
      </div>
    </Link>
  );
};
