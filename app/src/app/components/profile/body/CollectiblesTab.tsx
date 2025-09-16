import { TICKET_STAGES } from "@/app/data/constants";
import { useGetTickets } from "@/app/hooks/useGetTickets";
import React, { useMemo, useState } from "react";
import { TicketNFT } from "../../ticketNFT/TicketNFT";
import { Spinner } from "../../general/Spinner";
import { Ticket } from "@/app/types/Ticket";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import Image from "next/image";

export const CollectiblesTab = () => {
  const { tickets, isLoading } = useGetTickets();
  const data = useMemo(
    () => tickets.filter(({ stage }) => stage === TICKET_STAGES.COLLECTIBLE),
    [tickets],
  );

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleClearSelectedTicket = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-2">
      <div className="text-sui-steel-80 text-sm">
        {!!data.length && data.length} Collectibles
      </div>
      <div className="grid grid-cols-2 gap-1">
        {isLoading && <Spinner />}
        {!isLoading && !data?.length && (
          <div className="col-span-2 text-center mt-5">
            You do not own any collectibles yet.
          </div>
        )}
        {data.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => handleSelectTicket(ticket)}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelectTicket(ticket);
              }
            }}
          >
            <TicketNFT
              ticket={ticket}
              refreshTicket={() => {}}
              isFromProfilePage
              size="sm"
            />
          </div>
        ))}
      </div>
      {!!selectedTicket && (
        <Dialog
          open
          onOpenChange={(open: boolean) => {
            if (!open) handleClearSelectedTicket();
          }}
        >
          <DialogContent
            hideCloseButton
            className="p-0 max-w-[350px] rounded-2xl bg-transparent border-none"
            closeButtonClassName="bg-white h-7 w-7 pl-[2px] rounded-xl mt-[500px] left-[175px]"
          >
            <DialogTitle className="sr-only">
              {selectedTicket.eventName} Collectible Ticket
            </DialogTitle>
            <TicketNFT
              ticket={selectedTicket}
              refreshTicket={() => {}}
              isFromProfilePage
              isHiddenInit={false}
            />
            <Button
              variant="link"
              className="p-2"
              onClick={handleClearSelectedTicket}
            >
              <Image src={"/close.svg"} alt="Close" width={50} height={50} />
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
