import { useEffect, useState } from "react";
import { useSui } from "./useSui";
import { mapTicket } from "../mappers/mapTicket";
import { Ticket } from "../types/Ticket";
import { useCurrentAccount } from "@mysten/dapp-kit";

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
      .getOwnedObjects({
        owner: address!,
        options: {
          showContent: true,
          showType: true,
        },
      })
      .then((resp) => {
        const ticketOnChainObjects = resp.data.filter(
          ({ data: { type } }: any) =>
            type === `${process.env.NEXT_PUBLIC_PACKAGE}::ticket::Ticket`,
        );
        const ticketObjects = ticketOnChainObjects.map(
          ({ data: { content } }: any) => mapTicket(content.fields),
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
