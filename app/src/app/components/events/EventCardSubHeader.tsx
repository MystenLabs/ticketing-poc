import {
  dateTimeStringToNumber,
  getDateStringFromDateTime,
  getTimeStringFromDateTime,
} from "@/app/helpers/dates";
import { Event } from "@/app/types/Event";
import React from "react";
import { truncateString } from "@/app/helpers/truncateString";
import Image from "next/image";

interface EventCardSubHeaderProps extends Event {
  className?: string;
  showTime?: boolean;
}

export const EventCardSubHeader = ({
  datetime,
  venue,
  className,
  showTime = true,
}: EventCardSubHeaderProps) => {
  return (
    <div
      className={`flex space-x-3 items-center text-xs w-full !font-[400] !text-sui-steel-80 ${className}`}
    >
      <div className="flex space-x-1 items-center text-xs">
        <Image src="/calendar.svg" alt="calendar" width={13} height={13} />
        <div>
          {getDateStringFromDateTime(`${dateTimeStringToNumber(datetime)}`)}{" "}
          {!!showTime ? <>&bull; </> : ""}
          {!!showTime
            ? getTimeStringFromDateTime(
                `${dateTimeStringToNumber(datetime)}`,
                true,
              )
            : ""}
        </div>
      </div>
      <div className="flex space-x-1 items-center">
        <Image
          src="/map_pin.svg"
          alt="calendar"
          width={13}
          height={13}
          className="mt-[-2px]"
        />{" "}
        <div>{truncateString(venue, 20)}</div>
      </div>
    </div>
  );
};
