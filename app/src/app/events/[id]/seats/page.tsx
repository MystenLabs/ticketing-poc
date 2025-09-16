"use client";

import { EventCardSubHeader } from "@/app/components/events/EventCardSubHeader";
import { Header } from "@/app/components/layouts/Header";
import { SelectSeatDrawer } from "@/app/components/singleEventPage/SelectSeatDrawer";
import { useGetSingleEvent } from "@/app/hooks/useGetSingleEvent";
import { Seat } from "@/app/types/Seat";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const SingleEventPageSeats = () => {
  const { id } = useParams();
  const { event } = useGetSingleEvent({ id: id as string });
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const handleClearSelectedSeat = () => setSelectedSeat(null);

  if (!event) return null;
  return (
    <div
      className={`w-full h-[60vh] relative flex flex-col items-center`}
      style={{
        background: "linear-gradient(165.96deg, #E5F5FF 9.97%, #FBFFF0 94.97%)",
      }}
    >
      {!selectedSeat && (
        <Header
          title={
            <div className="flex flex-col items-center">
              <div className="font-semibold text-lg text-sui-greys-90">
                {event?.name || "Event"}
              </div>
              <EventCardSubHeader {...event} className="justify-center" />
            </div>
          }
          className="font-semibold z-10"
          titleColor="black"
          showBackButton={false}
          backUrl="#"
        />
      )}
      <img
        src={!!selectedSeat ? "/stadium_selected_seat.svg" : "/stadium.svg"}
        alt="venue"
        style={{
          width: "100%",
          height: selectedSeat ? "40vh" : "30vh",
          marginTop: selectedSeat ? "-20px" : "0px",
        }}
        className="relative"
      />

      {!!event && (
        <SelectSeatDrawer
          event={event}
          selectedSeat={selectedSeat}
          handleClearSelectedSeat={handleClearSelectedSeat}
          handleSelectSeat={setSelectedSeat}
        />
      )}
      <div id="end-of-page" />
    </div>
  );
};

export default SingleEventPageSeats;
