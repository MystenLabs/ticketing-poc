import { EventLineUp } from "@/app/types/EventLineUp";
import Image from "next/image";
import React from "react";

export const EventLineUpItem = ({
  name,
  image,
  genre,
  subgenre,
}: EventLineUp) => {
  return (
    <div className="flex space-x-2 items-center text-start">
      <div className="w-[30px] h-[30px]">
        <Image
          src={image}
          alt="artist"
          width={0}
          height={0}
          className="rounded-lg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div className="flex flex-col">
        <div className="font-[590] text-sui-greys-90">{name}</div>
        <div className="text-sui-steel-80 text-sm">
          {genre} &bull; {subgenre}
        </div>
      </div>
    </div>
  );
};
