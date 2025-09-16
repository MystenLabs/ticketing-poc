import { mockEvents } from "../data/mockEvents";
import { OnChainTicket } from "../types/Ticket";

export const getTicketImages = (ticket: OnChainTicket) => {
  const mockEvent = mockEvents.find(
    (event) => event.description === ticket.event_description,
  );
  return {
    image: (mockEvent || mockEvents[0]).image,
    roundedImage: (mockEvent || mockEvents[0]).roundedImage,
    ticketFrontImage: (mockEvent || mockEvents[0]).ticketFrontImage,
  };
};

export const getTicketImageUrl = (ticket: OnChainTicket) => {
  const mockEvent = mockEvents.find(
    (event) => event.description === ticket.event_description,
  );
  return (mockEvent || mockEvents[0]).image;
};

export const getRoundedTicketImageUrl = (ticket: OnChainTicket) => {
  const mockEvent = mockEvents.find(
    (event) => event.description === ticket.event_description,
  );
  return (mockEvent || mockEvents[0]).roundedImage;
};

export const getTicketFrontViewImageUrl = (ticket: OnChainTicket) => {
  const mockEvent = mockEvents.find(
    (event) => event.description === ticket.event_description,
  );
  return (mockEvent || mockEvents[0]).ticketFrontImage;
};
