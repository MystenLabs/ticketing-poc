import { useEffect, useState } from "react";
import { useGetTickets } from "./useGetTickets";
import { TICKET_STAGES } from "../data/constants";
import { getDifferenceInDays } from "../helpers/dates";
import { Event } from "../types/Event";
import { Ticket } from "../types/Ticket";

export const useGetEventsText = () => {
  const { tickets, isLoading } = useGetTickets();
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (tickets?.length) {
      const events = tickets.map(({ stage, eventDate, eventName }) => ({
        ticketStage: stage,
        eventDate,
        eventName,
      }));
      const attendedEvents = events.filter(
        ({ ticketStage }) =>
          ticketStage === TICKET_STAGES.ATTENDED ||
          ticketStage === TICKET_STAGES.COLLECTIBLE,
      );
      if (!!attendedEvents?.length) {
        const now = new Date();
        const previousEvents = events.filter(({ ticketStage, eventDate }) => {
          const eventDateTime = new Date(parseInt(eventDate));
          const diff = getDifferenceInDays(now, eventDateTime);
          const isInPast = diff >= 0;
          return (
            isInPast &&
            (ticketStage === TICKET_STAGES.ATTENDED ||
              ticketStage === TICKET_STAGES.COLLECTIBLE)
          );
        });
        const sortedPreviousEvents = previousEvents.sort(
          (a, b) =>
            new Date(parseInt(b.eventDate)).getTime() -
            new Date(parseInt(a.eventDate)).getTime(),
        );
        if (!sortedPreviousEvents?.length) {
          setText("");
          return;
        }
        const latestEvent = sortedPreviousEvents[0];
        const latestEventDateTime = new Date(parseInt(latestEvent.eventDate));
        const diff = getDifferenceInDays(now, latestEventDateTime);
        if (diff < 0) {
          // problem with dummy data, let's ignore for the PoC
          setText("");
        } else {
          setText(`LAST EVENT ATTENDED ${diff} DAYS AGO`);
        }
      } else {
        const now = new Date();

        const upcomingEvents = events.filter(({ ticketStage, eventDate }) => {
          const eventDateTime = new Date(parseInt(eventDate));
          const diff = getDifferenceInDays(eventDateTime, now);
          const isInFuture = diff >= 0;
          return ticketStage === TICKET_STAGES.PURCHASED && isInFuture;
        });
        const sortedUpcomingEvents = upcomingEvents.sort(
          (a, b) =>
            new Date(parseInt(a.eventDate)).getTime() -
            new Date(parseInt(b.eventDate)).getTime(),
        );
        if (!sortedUpcomingEvents?.length) {
          setText("");
          return;
        }
        const nextEvent = sortedUpcomingEvents[0];
        const nextEventDateTime = new Date(parseInt(nextEvent.eventDate));
        const diff = getDifferenceInDays(nextEventDateTime, now);
        if (diff < 0) {
          // problem with dummy data, let's ignore for the PoC
          setText("");
        } else {
          setText(`NEXT EVENT IN ${diff} DAYS`);
        }
      }
    } else {
      setText("");
    }
  }, [tickets]);

  return {
    text,
    isLoading,
  };
};
