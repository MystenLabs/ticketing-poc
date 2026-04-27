import { getTicketImages } from "../helpers/getTicketImageUrl";
import { OnChainTicket, Ticket } from "../types/Ticket";

export const mapTicket = (ticket: OnChainTicket): Ticket => {
  // Extract stage from the variant field if it's an object
  const stage =
    typeof ticket.stage === "object" &&
    ticket.stage &&
    "variant" in ticket.stage
      ? (ticket.stage as any).variant
      : ticket.stage;

  const { image, roundedImage, ticketFrontImage } = getTicketImages(ticket);
  const ticketId = typeof ticket.id === "string" ? ticket.id : ticket.id.id;
  const loyaltyId =
    typeof ticket.loyalty_id === "string"
      ? ticket.loyalty_id
      : (ticket.loyalty_id as any)?.id || "";

  return {
    id: ticketId,
    loyaltyId,
    eventDate: ticket.event_date,
    eventLocation: ticket.event_location,
    eventDescription: ticket.event_description,
    eventName: ticket.event_name,
    eventVenue: ticket.venue,
    loyaltyPoints: parseInt(ticket.loyalty_points),
    stage: stage,
    imageUrl: image,
    roundedImageUrl: roundedImage,
    frontViewImageUrl: ticketFrontImage,
    section: ticket.section,
    price: ticket.price,
    seats: ticket.seats,
  };
};
