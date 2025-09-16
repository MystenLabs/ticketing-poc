"use client";

import React, { useState } from "react";
import { mockEvents } from "../data/mockEvents";

export const useSearchEvents = () => {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const events = React.useMemo(() => {
    const textLower = text.toLocaleLowerCase();
    return mockEvents.filter(({ name, venue, location, lineup }) => {
      const genres = lineup.map(({ genre }) => genre.toLocaleLowerCase());
      const subgenres = lineup.map(({ subgenre }) =>
        subgenre.toLocaleLowerCase(),
      );
      return (
        name.toLocaleLowerCase().includes(textLower) ||
        venue.toLocaleLowerCase().includes(textLower) ||
        location.toLocaleLowerCase().includes(textLower) ||
        genres.some((genre) => genre.includes(textLower)) ||
        subgenres.some((subgenre) => subgenre.includes(textLower))
      );
    });
  }, [text]);

  const storeSearchInLocalStorage = (eventId: number) => {
    const searchedEventsIds: number[] = JSON.parse(
      localStorage.getItem("searchedEventsIds") || "[]",
    );
    if (!searchedEventsIds.includes(eventId)) {
      searchedEventsIds.push(eventId);
      if (searchedEventsIds.length > 4) {
        searchedEventsIds.shift();
      }
      localStorage.setItem(
        "searchedEventsIds",
        JSON.stringify(searchedEventsIds),
      );
    }
  };

  const getSearchedEvents = () => {
    if (typeof window === "undefined") return [];
    const searchedEventsIds = JSON.parse(
      localStorage.getItem("searchedEventsIds") || "[]",
    );
    return mockEvents.filter(({ id }) => searchedEventsIds.includes(id));
  };

  return {
    text,
    handleChange,
    setText,
    events,
    storeSearchInLocalStorage,
    getSearchedEvents,
  };
};
