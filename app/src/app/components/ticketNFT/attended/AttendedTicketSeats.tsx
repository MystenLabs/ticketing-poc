import React from "react";
import { Ticket } from "@/app/types/Ticket";
import { truncateString } from "@/app/helpers/truncateString";

interface AttendedTicketSeatsProps {
  ticket: Ticket;
  isFrontView?: boolean;
}

export const AttendedTicketSeats = ({
  ticket,
  isFrontView = false,
}: AttendedTicketSeatsProps) => {
  return (
    <div className="rounded-xl border-2 border-warning">
      <div
        className={`${
          isFrontView ? "text-white" : "text-gray-500"
        } text-center font-semibold bg-gray-200 py-2 rounded-t-xl`}
        {...(isFrontView
          ? {
              style: {
                background:
                  "linear-gradient(29.93deg, #7E73FF 0%, #FF5E41 52.7%, #FFCD82 99.7%), linear-gradient(29.93deg, rgba(126, 115, 255, 0.3) 0%, rgba(255, 94, 65, 0.3) 52.7%, rgba(255, 205, 130, 0.3) 99.7%)",
              },
            }
          : {})}
      >
        Your seats
      </div>
      <div
        className={`flex items-center justify-center rounded-b-xl p-1 py-3 space-x-1 bg-opacity-50 backdrop-blur-xs ${
          isFrontView ? "bg-[#FF5E41] text-white" : ""
        }`}
      >
        <div
          key={"section"}
          className="flex flex-1 flex-col justify-between items-center h-[inherit] text-center min-w-[100px]"
        >
          <div className="text-xs">SECTION</div>
          <div className="text-lg font-[590]">
            {truncateString(ticket.section.replace("Section ", ""), 20)}
          </div>
        </div>
        <div
          key={"seats"}
          className="flex flex-col justify-between items-center h-full text-center min-w-[100px]"
        >
          <div className="text-xs">SEATS</div>
          <div className="text-lg font-[590]">{ticket.seats.join(", ")}</div>
        </div>
      </div>
    </div>
  );
};
