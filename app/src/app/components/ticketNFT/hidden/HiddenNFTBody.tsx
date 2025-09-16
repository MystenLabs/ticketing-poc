import { Ticket } from "@/app/types/Ticket";
import Image from "next/image";
import React from "react";
import { SuiExplorerLink } from "../../general/SuiExplorerLink";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface HiddenNFTProps {
  ticket: Ticket;
}

export const HiddenNFTBody = ({ ticket }: HiddenNFTProps) => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  return (
    <div className="flex flex-col items-center space-y-5">
      <Image
        src="/hidden_ticket_icon.svg"
        alt="hidden"
        width={100}
        height={100}
      />
      <div className="text-center space-y-1">
        <div className="text-sm text-primary">TICKET</div>
        <div className="text-3xl text-white">{ticket.eventName}</div>
      </div>
      <div
        className="rounded-lg bg-opacity-10 backdrop-blur-md flex flex-col items-center w-[90%] space-y-1 p-4"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="text-xs text-warning-foreground">OWNED BY</div>
        <SuiExplorerLink
          type="address"
          id={address || ""}
          className="text-white text-sm"
        />
      </div>
    </div>
  );
};
