import { Ticket } from "@/app/types/Ticket";
import React, { useState } from "react";
import { ActivatedTicketNFT } from "./activated/ActivatedTicketNFT";
import { PurchasedTicketNFT } from "./purchased/PurchasedTicketNFT";
import { AttendedTicketNFT } from "./attended/AttendedTicketNFT";
import { CollectibleTicketNFT } from "./collectible/CollectibleTicketNFT";
import { TICKET_STAGES } from "@/app/data/constants";
import { HiddenPurchasedTicketNFT } from "./purchased/HiddenPurchasedTicketNFT";
import { HiddenAttendedTicketNFT } from "./attended/HiddenAttendedTicketNFT";
import { HiddenCollectibleTicketNFT } from "./collectible/HiddenCollectibleTicketNFT";
import { useFlipHorizontal } from "@/app/hooks/useFlipHorizontal";

// the size prop is used only in the collectible ticket
export interface TicketNFTProps {
  ticket: Ticket;
  refreshTicket: () => void;
  size?: "sm" | "md";
  isFromProfilePage?: boolean;
  transitionClassName?: string;
  isHiddenInit?: boolean;
}

export const TicketNFT = ({
  ticket,
  refreshTicket,
  size = "md",
  isFromProfilePage = false,
  isHiddenInit = true,
}: TicketNFTProps) => {
  const { handleTriggerHidden, isHidden, transitionClassName } =
    useFlipHorizontal({ isHiddenInit });

  // deprecated
  if (ticket.stage === TICKET_STAGES.ACTIVATED) {
    if (isHidden) {
      return (
        <HiddenAttendedTicketNFT
          ticket={ticket}
          handleShow={handleTriggerHidden}
          transitionClassName={transitionClassName}
        />
      );
    }
    return (
      <ActivatedTicketNFT
        ticket={ticket}
        refreshTicket={refreshTicket}
        handleHide={handleTriggerHidden}
      />
    );
  }

  if (ticket.stage === TICKET_STAGES.ATTENDED) {
    if (isHidden) {
      return (
        <HiddenAttendedTicketNFT
          ticket={ticket}
          handleShow={handleTriggerHidden}
          transitionClassName={transitionClassName}
        />
      );
    }
    return (
      <AttendedTicketNFT
        ticket={ticket}
        refreshTicket={refreshTicket}
        handleHide={handleTriggerHidden}
        transitionClassName={transitionClassName}
      />
    );
  }

  if (ticket.stage === TICKET_STAGES.COLLECTIBLE) {
    if (isHidden) {
      return (
        <HiddenCollectibleTicketNFT
          ticket={ticket}
          handleShow={handleTriggerHidden}
          size={size}
          isFromProfilePage={isFromProfilePage}
          showButton={!isFromProfilePage}
          transitionClassName={transitionClassName}
        />
      );
    }
    return (
      <CollectibleTicketNFT
        ticket={ticket}
        handleHide={handleTriggerHidden}
        size={size}
        isFromProfilePage={isFromProfilePage}
        showButton={!isFromProfilePage}
        transitionClassName={transitionClassName}
      />
    );
  }

  if (isHidden) {
    return (
      <HiddenPurchasedTicketNFT
        ticket={ticket}
        handleShow={handleTriggerHidden}
        transitionClassName={transitionClassName}
      />
    );
  }
  return (
    <PurchasedTicketNFT
      ticket={ticket}
      refreshTicket={refreshTicket}
      handleHide={handleTriggerHidden}
      transitionClassName={transitionClassName}
    />
  );
};
