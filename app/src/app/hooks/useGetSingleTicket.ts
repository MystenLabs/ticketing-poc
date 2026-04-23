import { useEffect, useState } from "react";
import { Ticket } from "../types/Ticket";
import { useSui } from "./useSui";
import { mapTicket } from "../mappers/mapTicket";

export const useGetSingleTicket = (id?: string | null) => {
  const { suiClient } = useSui();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!!id) {
      handleGetTicket(id);
      return;
    } else {
      setTicket(null);
    }
  }, [id]);

  const handleGetTicket = async (id: string) => {
    if (!suiClient) return;
    setIsLoading(true);
    return suiClient
      .getObject({
        objectId: id,
        include: {
          json: true,
        },
      })
      .then((resp) => {
        const ticketJson = resp.object?.json as any;
        const ticketObject = mapTicket((ticketJson?.fields || ticketJson) as any);
        setTicket(ticketObject);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return {
    ticket,
    isLoading,
    handleGetTicket,
  };
};
