export const handleRegisterTicketId = (ticketId: string) => {
  const registeredTicketIds: string[] = JSON.parse(
    localStorage.getItem("registeredTicketIds") || "[]",
  ) as string[];
  const newRegisteredTicketIds = registeredTicketIds.concat(ticketId);
  localStorage.setItem(
    "registeredTicketIds",
    JSON.stringify(newRegisteredTicketIds),
  );
};

export const handleUnRegisterTicketId = (ticketId: string) => {
  const registeredTicketIds: string[] = JSON.parse(
    localStorage.getItem("registeredTicketIds") || "[]",
  ) as string[];
  const newRegisteredTicketIds = registeredTicketIds.filter(
    (id) => id !== ticketId,
  );
  localStorage.setItem(
    "registeredTicketIds",
    JSON.stringify(newRegisteredTicketIds),
  );
};
