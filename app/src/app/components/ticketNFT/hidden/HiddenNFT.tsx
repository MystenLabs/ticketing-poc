import { Ticket } from "@/app/types/Ticket";
import React from "react";
import { HiddenNFTFooter } from "./HiddenNFTFooter";
import { HiddenNFTBody } from "./HiddenNFTBody";
import { ShowHideButton } from "../ShowHideButton";
import Link from "next/link";

interface HiddenNFTProps {
  ticket: Ticket;
  handleShow: () => void;
}

export const HiddenNFT = ({ ticket, handleShow }: HiddenNFTProps) => {
  const renderContent = () => {
    return (
      <div
        className="relative w-full rounded-lg pt-5 flex flex-col border-warning-foreground border-2"
        style={{
          backgroundImage: `url('${ticket.frontViewImageUrl}')`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute right-1 top-2 z-1">
          <ShowHideButton
            onClick={(e) => {
              e.preventDefault();
              handleShow();
            }}
          />
        </div>
        <div className="flex flex-col justify-between h-full flex-1 space-y-9 pt-4">
          <HiddenNFTBody ticket={ticket} />
          <HiddenNFTFooter ticket={ticket} />
        </div>
      </div>
    );
  };

  return (
    <Link href={`/tickets/${ticket.id}`} className="w-full">
      {renderContent()}
    </Link>
  );
};
