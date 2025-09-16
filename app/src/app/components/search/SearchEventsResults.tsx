import { Account } from "@/app/types/Account";
import { Event } from "@/app/types/Event";
import React from "react";
import { EventsListItem } from "../events/EventsListItem";
import { AnonymousMessage } from "../address/AnonymousMessage";

interface SearchEventsResultsProps {
  events: Event[];
  text: string;
}

export const SearchEventsResults = ({
  events,
  text,
}: SearchEventsResultsProps) => {
  return (
    <div className="space-y-2">
      <div className="text-sui-steel-80 font-[590]">
        {!text ? "Trending" : "Results"}
      </div>
      <div className="space-y-2 w-full">
        {events.map((event) => (
          <EventsListItem key={event.id} {...event} isSearchResult />
        ))}
      </div>
      {!events?.length && (
        <div className="text-gray-500 text-lg text-center mt-7">
          No events found fot the term &apos;{text}&apos;
        </div>
      )}
    </div>
  );
};
