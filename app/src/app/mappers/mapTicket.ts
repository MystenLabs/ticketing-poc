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
  return {
    id: ticket.id.id,
    loyaltyId: ticket.loyalty_id,
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
