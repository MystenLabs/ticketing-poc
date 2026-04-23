import { useLoyalty } from "./useLoyalty";
import { Event } from "../types/Event";
import toast from "react-hot-toast";
import { dateTimeStringToNumber } from "../helpers/dates";
import { Seat } from "../types/Seat";
import { generateRandomSeatNumbers } from "../helpers/seats";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { handleRegisterTicketId } from "../helpers/registerTicketsForUpdate";
import { useMintTicketPermit } from "./useMintTicketPermit";
import { useSignatureTicketMint } from "./useSignatureTicketMint";
import { TicketMintRequest } from "../types/TicketMint";
import { useMintStage } from "./useMintStage";
import { useSponsorSignAndExecute } from "./useSponsorSignAndExecute";

export interface HandleMintTicketProps {
  event: Event;
  seat: Seat;
  quantity: number;
}

export const useMintTicket = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { sponsorSignAndExecute, isLoading } = useSponsorSignAndExecute();
  const { loyalty, reFetchLoyalty } = useLoyalty();
  const {
    createMintPermit,
    isLoading: isCreatingPermit,
    error: permitError,
  } = useMintTicketPermit();
  const {
    mintWithSignature,
    isLoading: isMinting,
    error: mintError,
  } = useSignatureTicketMint();
  const {
    mintStage,
    isLoading: isMintingStage,
    error: stageError,
  } = useMintStage();

  const handleMint = async ({
    event,
    seat,
    quantity,
  }: HandleMintTicketProps) => {
    if (!loyalty) {
      toast.error("You need to have a loyalty card to mint a ticket");
      return;
    }
    if (!address) {
      toast.error("You need to sign in to mint a ticket");
      return;
    }

    try {
      const seatNumbers = generateRandomSeatNumbers(quantity);
      const ticketData: TicketMintRequest = {
        owner: address,
        event_id: String(event.id),
        event_date: dateTimeStringToNumber(event.datetime),
        event_location: event.location,
        venue: event.venue,
        section: seat.name,
        seats: seatNumbers,
        loyalty_points: seat.loyaltyPoints * quantity,
        event_description: event.description,
        event_name: event.name,
        price: seat.price * quantity,
      };

      const mintPermit = await createMintPermit(ticketData);

      const ticketId = await mintWithSignature(mintPermit, loyalty.id);

      await mintStage(ticketId);

      toast.success("Ticket bought successfully!");

      handleRegisterTicketId(ticketId);

      setTimeout(() => {
        router.push(`/tickets`);
        reFetchLoyalty(address);
      }, 4000);
    } catch (error) {
      console.error("Error minting ticket:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to mint ticket";
      toast.error(`Sorry, we could not create your ticket: ${errorMessage}`);
    }
  };

  return {
    isLoading: isLoading || isCreatingPermit || isMinting || isMintingStage,
    handleMint,
    error: permitError || mintError || stageError,
  };
};
