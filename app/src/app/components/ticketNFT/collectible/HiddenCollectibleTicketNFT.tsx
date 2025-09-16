import React from "react";

import { Ticket } from "@/app/types/Ticket";
import Link from "next/link";
import { getDateStringFromDateTime } from "@/app/helpers/dates";
import Image from "next/image";
import { ShowHideButton } from "../ShowHideButton";

interface HiddenCollectibleTicketNFTProps {
  ticket: Ticket;
  handleShow: () => void;
  size?: "sm" | "md";
  isFromProfilePage?: boolean;
  showButton?: boolean;
  transitionClassName?: string;
}

export const HiddenCollectibleTicketNFT = ({
  ticket,
  handleShow,
  size = "md",
  isFromProfilePage = false,
  showButton = true,
  transitionClassName = "",
}: HiddenCollectibleTicketNFTProps) => {
  const renderContent = () => {
    return (
      <div
        className={`relative w-full rounded-lg ${
          size === "sm"
            ? "py-5 pb-[50px] h-[242px]"
            : "py-10 pb-[115px] h-[500px] max-w-[350px]"
        } flex flex-col justify-between border-warning-foreground overflow-hidden`}
        style={{
          backgroundImage: `url('${ticket.frontViewImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!!showButton && (
          <div className="absolute right-1 top-2 z-1">
            <ShowHideButton
              onClick={(e) => {
                e.preventDefault();
                handleShow();
              }}
            />
          </div>
        )}
      </div>
    );
  };

  if (isFromProfilePage) {
    return renderContent();
  }

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className={`w-full flex flex-col items-center ${transitionClassName}`}
    >
      {renderContent()}
    </Link>
  );
};
