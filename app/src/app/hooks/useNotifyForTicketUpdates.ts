"use client";

import { useEffect } from "react";
import { useNotifications } from "./useNotifications";
import { useSui } from "./useSui";
import { mapTicket } from "../mappers/mapTicket";
import { Ticket } from "../types/Ticket";
import { TICKET_STAGES } from "../data/constants";
import { handleUnRegisterTicketId } from "../helpers/registerTicketsForUpdate";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";

export const useNotifyForTicketUpdates = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { suiClient } = useSui();
  const {
    sendNotification,
    canReceiveNotifications,
    hasServiceWorker,
    hasGivenPermission,
  } = useNotifications();

  useEffect(() => {
    //Implementing the setInterval method
    if (!canReceiveNotifications || !hasServiceWorker || !hasGivenPermission) {
      return;
    }

    const interval = setInterval(async () => {
      const ticket = await handleChooseTicketForUpdate();
      if (!ticket) {
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      if (
        window.location.pathname === `/tickets/${ticket.id}` &&
        !!searchParams.get("update")
      ) {
        return;
      } else {
        handleNotifyTicketUpdate(ticket);
      }
    }, 60_000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [canReceiveNotifications, hasGivenPermission, hasServiceWorker, address]);

  const handleChooseTicketForUpdate = async (): Promise<Ticket | undefined> => {
    const registeredTickets = JSON.parse(
      localStorage.getItem("registeredTicketIds") || "[]",
    );
    if (!registeredTickets?.length) {
      return undefined;
    }
    for (let ticketId of registeredTickets) {
      const ticket = await suiClient
        .getObject({
          id: ticketId,
          options: {
            showContent: true,
            showType: true,
            showOwner: true,
          },
        })
        .then((resp) => {
          const owner = (resp.data?.owner as any)?.AddressOwner!;
          if (owner === address) {
            const ticketObject = mapTicket((resp.data?.content as any)?.fields);
            return ticketObject;
          }
          return undefined;
        })
        .catch((err) => {
          return undefined;
        });
      if (ticket) {
        return ticket;
      }
    }
    return;
  };

  const handleNotifyTicketUpdate = (ticket: Ticket) => {
    let body = "";
    if (ticket.stage === TICKET_STAGES.PURCHASED) {
      body = `We noticed that you're at ${ticket.eventVenue}, would you like to check-in for ${ticket.eventName}?`;
    } else if (ticket.stage === TICKET_STAGES.ACTIVATED) {
      body = `We noticed that you're at ${ticket.eventVenue}, would you like to check-in for ${ticket.eventName}?`;
    } else if (ticket.stage === TICKET_STAGES.ATTENDED) {
      body = `The event ${ticket.eventName} has ended, would you like to update your ticket to a collectible?`;
    } else if (ticket.stage === TICKET_STAGES.COLLECTIBLE) {
      handleUnRegisterTicketId(ticket.id);
      return;
    }
    sendNotification({
      title: "Tickets Are Us",
      body,
      url: `/tickets/${ticket.id}?update=true`,
    });
  };
};
