import { useSearchEvents } from "@/app/hooks/useSearchEvents";
import React, { useMemo } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const SearchedEventsHistory = () => {
  const { getSearchedEvents } = useSearchEvents();
  const searchedEvents = useMemo(() => getSearchedEvents(), []);

  if (!searchedEvents?.length) return null;
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-sui-steel-80 font-[590]">Recent Searches</div>
      <div className="space-y-2">
        {searchedEvents.map((event) => (
          <Link
            key={event.id}
            className="flex items-center justify-between"
            href={`/events/${event.id}`}
          >
            <div className="flex items-center space-x-2">
              <div className="bg-secondary rounded-full p-1">
                <Image src="/clock.svg" alt="clock" width={20} height={20} />
              </div>
              <div className="font-[590] text-sui-greys-90">{event.name}</div>
            </div>
            <Image
              src="arrow_right.svg"
              alt="arrow right"
              width={5}
              height={5}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
