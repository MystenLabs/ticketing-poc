import { useEffect, useState } from "react";
import { Ticket, TicketStage } from "../types/Ticket";
import { toast } from "react-hot-toast";
import { TICKET_STAGES } from "../data/constants";
import { useSearchParams } from "next/navigation";
import {
  handleRegisterTicketId,
  handleUnRegisterTicketId,
} from "../helpers/registerTicketsForUpdate";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { useSponsorSignAndExecute } from "./useSponsorSignAndExecute";
import { useSui } from "./useSui";

interface HandleUpdateTicketStageProps {
  ticketId: string;
  stage: TicketStage;
  loyaltyPoints?: number;
  refresh: () => void;
}

interface UseUpdateTicketStageProps {
  ticket: Ticket;
  refreshTicket: () => void;
}

export const useUpdateTicketStage = ({
  ticket,
  refreshTicket,
}: UseUpdateTicketStageProps) => {
  const { suiClient } = useSui();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { isLoading, sponsorSignAndExecute } = useSponsorSignAndExecute();
  const searchParams = useSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    if (
      ticket.stage !== TICKET_STAGES.COLLECTIBLE &&
      !!searchParams.get("update")
    ) {
      handleOpenDrawer();
    }
  }, [searchParams.get("update")]);

  const handleUpdateTicketStage = async ({
    ticketId,
    stage,
    loyaltyPoints,
    refresh,
  }: HandleUpdateTicketStageProps): Promise<void> => {
    if (!address) {
      toast.error("Please sign in to update ticket stage");
      return;
    }

    try {
      const stageTransition = await suiClient.listOwnedObjects({
        owner: ticketId,
        type: `${process.env.NEXT_PUBLIC_PACKAGE}::ticket_stage::StageTransition<${process.env.NEXT_PUBLIC_PACKAGE}::ticket_stage::${stage}>`,
      });

      const stageTransitionId = stageTransition?.objects?.[0]?.objectId;
      if (!stageTransitionId) {
        toast.error("Could not find stage transition object");
        return;
      }

      const tx = new Transaction();
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE}::ticket::update_stage`,
        arguments: [tx.object(ticketId), tx.object(stageTransitionId)],
        typeArguments: [
          `${process.env.NEXT_PUBLIC_PACKAGE}::ticket_stage::${stage}`,
        ],
      });
      tx.setSender(address);

      const resp = await sponsorSignAndExecute({
        tx,
        include: {
          objectTypes: true,
          effects: true,
        },
      });

      if (resp) {
        const txResult = resp.Transaction ?? resp.FailedTransaction;
        if (!txResult) {
          throw new Error("Transaction result missing");
        }
        if (!txResult.status.success) {
          throw new Error(
            txResult.status.error?.message || "Transaction execution failed",
          );
        }
        const message =
          stage === TICKET_STAGES.ACTIVATED
            ? "You are getting close!"
            : stage === TICKET_STAGES.ATTENDED
              ? "Welcome to the event!"
              : "Thanks for coming! See you soon!";
        toast.success(message);
        setTimeout(() => {
          refresh();
          handleRegisterTicketId(ticketId);
        }, 4000);
      }
    } catch (err) {
      toast.error("Could not update ticket stage");
      throw err; // Re-throw to let the calling function know it failed
    }
  };

  const updateTicketStage = async () => {
    try {
      if (
        ticket.stage === TICKET_STAGES.ACTIVATED ||
        ticket.stage === TICKET_STAGES.PURCHASED
      ) {
        await handleUpdateTicketStage({
          ticketId: ticket.id,
          stage: TICKET_STAGES.ATTENDED,
          refresh: refreshTicket,
          loyaltyPoints: ticket.loyaltyPoints,
        });
      } else if (ticket.stage === TICKET_STAGES.ATTENDED) {
        const refresh = () => {
          refreshTicket();
          handleUnRegisterTicketId(ticket.id);
        };
        await handleUpdateTicketStage({
          ticketId: ticket.id,
          stage: TICKET_STAGES.COLLECTIBLE,
          refresh,
          loyaltyPoints: ticket.loyaltyPoints,
        });
      }
    } catch (error) {
    } finally {
      handleCloseDrawer();
    }
  };

  return {
    isLoading,
    isDrawerOpen,
    handleCloseDrawer,
    updateTicketStage,
  };
};
