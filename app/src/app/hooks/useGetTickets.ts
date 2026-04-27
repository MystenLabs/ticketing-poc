import { useEffect, useState } from "react";
import { useSui } from "./useSui";
import { mapTicket } from "../mappers/mapTicket";
import { Ticket } from "../types/Ticket";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

export const useGetTickets = () => {
  const { suiClient } = useSui();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!address) {
      getTickets();
    } else {
      setTickets([]);
    }
  }, [address]);
  const getTickets = async () => {
    setIsLoading(true);
    suiClient
      .listOwnedObjects({
        owner: address!,
        include: {
          json: true,
        },
      })
      .then((resp) => {
        const ticketOnChainObjects = resp.objects.filter(
          (object) =>
            object.type === `${process.env.NEXT_PUBLIC_PACKAGE}::ticket::Ticket`,
        );
        const ticketObjects = ticketOnChainObjects.map(
          (object) => {
            const ticketJson = object.json as any;
            const ticketFields = ticketJson?.fields || ticketJson;
            return mapTicket(ticketFields);
          },
        );
        setTickets(ticketObjects);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return {
    tickets,
    isLoading,
  };
};
