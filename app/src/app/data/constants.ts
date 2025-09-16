import { TicketStage } from "../types/Ticket";

interface TicketStagesProps {
  [key: string]: TicketStage;
}

export const TICKET_STAGES: TicketStagesProps = {
  PURCHASED: "Purchased",
  ACTIVATED: "Activated",
  ATTENDED: "Attended",
  COLLECTIBLE: "Collectible",
};
