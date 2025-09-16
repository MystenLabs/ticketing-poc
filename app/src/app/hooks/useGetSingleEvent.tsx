import React, { useEffect, useState } from "react";
import { mockEvents } from "../data/mockEvents";
import { Event } from "../types/Event";

interface UseGetSingleEventProps {
  id: string;
}

export const useGetSingleEvent = ({ id }: UseGetSingleEventProps) => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!!id) {
      const e = mockEvents.find((event) => `${event.id}` == (id as string));
      setEvent(e || null);
    } else {
      setEvent(null);
    }
  }, [id as string]);

  return {
    event,
  };
};
