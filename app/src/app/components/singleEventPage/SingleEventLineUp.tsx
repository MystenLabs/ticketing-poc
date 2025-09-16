import React from "react";
import { EventLineUpItem } from "./EventLineUpItem";
import { EventLineUp } from "@/app/types/EventLineUp";

interface SingleEventLineUpProps {
  lineup: EventLineUp[];
}

export const SingleEventLineUp = ({ lineup }: SingleEventLineUpProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-start text-sui-steel-80 font-[590]">Lineup</div>
      {lineup.map((lineUpItem, index) => (
        <EventLineUpItem key={index} {...lineUpItem} />
      ))}
    </div>
  );
};
