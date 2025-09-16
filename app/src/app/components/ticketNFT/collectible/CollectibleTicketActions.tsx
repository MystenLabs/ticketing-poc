import React from "react";
import { ShareTicketSocial } from "./ShareTicketSocial";
import Link from "next/link";
import { getNetworkName } from "@/app/helpers/getNetworkName";
import { Button } from "../../ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Ticket } from "@/app/types/Ticket";

interface CollectibleTicketActionsProps {
  ticket: Ticket;
}
export const CollectibleTicketActions = ({
  ticket,
}: CollectibleTicketActionsProps) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
      <ShareTicketSocial />
      <Button
        asChild
        variant="outline"
        className="w-full bg-white flex space-x-2 py-5 rounded-xl text-sui-steel-60 border-sui-steel-40"
      >
        <Link
          href={`https://suiexplorer.com/object/${
            ticket.id
          }?network=${getNetworkName()}`}
          target="_blank"
          rel="noopenner noreferrer"
        >
          <span>View on Sui Explorer</span>
          <ArrowTopRightIcon />
        </Link>
      </Button>
    </div>
  );
};
