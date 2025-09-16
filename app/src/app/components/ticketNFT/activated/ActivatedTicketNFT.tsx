import React from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import Link from "next/link";
import { ShowHideButton } from "../ShowHideButton";
import { Ticket } from "@/app/types/Ticket";
import { getNetworkName } from "@/app/helpers/getNetworkName";

export interface TicketNFTInWalletProps {
  ticket: Ticket;
  refreshTicket: () => void;
  handleHide: () => void;
  transitionClassName?: string;
}

export const ActivatedTicketNFT = ({
  ticket,
  refreshTicket,
  handleHide,
}: TicketNFTInWalletProps) => {
  return (
    <div className="bg-secondary rounded-lg relative border-2 border-warning">
      <div className="absolute right-1 top-2 z-10">
        <ShowHideButton onClick={handleHide} />
      </div>
      <Link
        href={`/tickets/${ticket.id}`}
        className="space-y-2 relative rounded-lg"
      >
        <div className="w-full h-[125px]">
          <Image
            src={ticket.imageUrl}
            alt="event-image"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="p-3 px-8 space-y-3 flex flex-col items-center text-center">
          {ticket.id ? (
            <QRCode
              value={`https://suiexplorer.com/object/${ticket.id}?network=${getNetworkName() || "testnet"}`}
              size={150}
              level="M"
              className="bg-white rounded-xl p-2 mt-[-80px]"
            />
          ) : (
            <div className="bg-white rounded-xl p-2 mt-[-80px] w-[150px] h-[150px] flex items-center justify-center text-xs text-gray-500">
              Loading...
            </div>
          )}
          <div className="font-bold text-xl mt-[10px]">
            Are you at {ticket.eventName}?
          </div>
          <div className="text-gray-500 mt-[10px] text-sm">
            Scan the QR core above at the back of your ticket if you are ready
            to check-in.
          </div>
        </div>
        <div className="text-center text-sm rounded-lg py-4 rounded-t-none w-full flex space-x-2 items-center justify-center border-t-[1px] border-white">
          <Image src="/attendees.svg" alt="attendees" width={80} height={30} />
          <div>843 attending</div>
        </div>
      </Link>
    </div>
  );
};
