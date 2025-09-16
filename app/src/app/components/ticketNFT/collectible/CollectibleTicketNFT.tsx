import React, { useMemo } from "react";

import { Ticket } from "@/app/types/Ticket";
import Link from "next/link";
import { getDateStringFromDateTime } from "@/app/helpers/dates";
import Image from "next/image";
import { ShowHideButton } from "../ShowHideButton";

interface CollectibleTicketNFTProps {
  ticket: Ticket;
  size?: "sm" | "md";
  isFromProfilePage?: boolean;
  handleHide: () => void;
  transitionClassName?: string;
  showButton?: boolean;
}

export const CollectibleTicketNFT = ({
  ticket,
  size = "md",
  isFromProfilePage = false,
  handleHide,
  transitionClassName = "",
  showButton = false,
}: CollectibleTicketNFTProps) => {
  const imageId = useMemo(() => {
    return parseInt(ticket.frontViewImageUrl.replace(".svg", "").split("/")[2]);
  }, [ticket.frontViewImageUrl]);

  const textPositionClassName = useMemo(() => {
    if (imageId === 1) {
      return "top-[270px] text-center";
    }
    if (imageId === 2) {
      return "top-[165px] right-[5px] text-end text-white";
    }
    if (imageId === 3) {
      return "top-[200px] left-[25px] text-start text-white";
    }
    if (imageId === 4) {
      return "top-[330px] text-center text-white";
    }
    if (imageId === 5) {
      return "top-[20px] right-[5px] left-1/2 transform -translate-x-1/2 text-center text-white";
    }
  }, [imageId]);

  const attendancePositionClassName = useMemo(() => {
    if (imageId === 1) {
      return "top-[200px] text-center";
    }
    if (imageId === 2) {
      return "bottom-[25px] w-[70%] right-[5px] text-end text-white";
    }
    if (imageId === 3) {
      return "bottom-[25px] right-[20px] text-end";
    }
    if (imageId === 4) {
      return "bottom-[50px] text-white";
    }
    if (imageId === 5) {
      return "top-[340px] left-[25px] text-start text-[#FDF173]";
    }
  }, [imageId]);

  const renderContent = () => {
    return (
      <div className="w-full flex flex-col items-center">
        <div
          className={`font-bold ${
            size === "sm" ? "text-base" : "text-lg"
          } text-center text-white whitespace-pre-wrap bg-clip-text text-transparent ${textPositionClassName} absolute`}
          style={{
            backgroundImage:
              "linear-gradient(180deg, #00EEAC 0%, #008BE9 100%)",
          }}
        >
          {getDateStringFromDateTime(ticket.eventDate)}, {ticket.eventLocation}
          {`\n`}
          {ticket.eventVenue}
        </div>

        <div
          className={`text-center bg-clip-text text-transparent font-bold ${attendancePositionClassName} absolute`}
          style={{
            backgroundImage:
              "linear-gradient(29.93deg, #7E73FF 0%, #FF5E41 52.7%, #FFCD82 99.7%)",
          }}
        >
          <span className={size === "sm" ? "text-lg" : "text-xl"}>888</span>
          <br />
          <span className={size === "sm" ? "text-base" : "text-lg"}>
            OTHERS IN ATTENDANCE
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative w-full rounded-lg ${
        size === "sm" ? "h-[300px] h-[242px]" : "h-[500px] max-w-[350px]"
      } ${transitionClassName} flex flex-col justify-between overflow-hidden`}
      style={{
        backgroundImage: `url('${ticket.frontViewImageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!!showButton && (
        <div className="absolute right-1 top-2 z-10">
          <ShowHideButton onClick={handleHide} />
        </div>
      )}
      {!!isFromProfilePage && <div>{renderContent()}</div>}
      {!isFromProfilePage && (
        <Link
          href={`/tickets/${ticket.id}${
            isFromProfilePage ? "?from=profile" : ""
          }`}
          className="w-full h-full"
        >
          {renderContent()}
        </Link>
      )}
    </div>
  );
};
