import React from "react";
import { TICKET_STAGES } from "@/app/data/constants";
import { Ticket } from "@/app/types/Ticket";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetOverlay,
  SheetPortal,
} from "@/app/components/ui/sheet";
import { Button } from "../ui/button";
import { LoadingButton } from "../general/LoadingButton";
import Image from "next/image";
import QRCode from "react-qr-code";
import { getNetworkName } from "@/app/helpers/getNetworkName";

interface TicketActionsDrawerProps {
  ticket: Ticket;
  isOpen: boolean;
  handleClose: () => void;
  handleAccept: () => void;
  isLoading?: boolean;
}

export const TicketActionsDrawer = ({
  ticket,
  isOpen,
  handleAccept,
  handleClose,
  isLoading = false,
}: TicketActionsDrawerProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  if (isOpen) {
    let title = "";
    let message = "";
    let acceptButtonText = "";
    let showQRCode = false;
    let attendancesText = "";

    if (
      ticket.stage === TICKET_STAGES.PURCHASED ||
      ticket.stage === TICKET_STAGES.ACTIVATED
    ) {
      title = `Are you at ${ticket.eventName}?`;
      message =
        "Scan the QR code at the back of your ticket if you are ready to check-in.";
      acceptButtonText = "Yes, I'm here";
      showQRCode = true;
      attendancesText = "attending";
    } else if (ticket.stage === TICKET_STAGES.ATTENDED) {
      title = "Looks like the event was just finished.";
      message = "Accept to turn your ticket into a unique collectible NFT.";
      acceptButtonText = "Yes, I want it";
      showQRCode = false;
      attendancesText = "attended";
    } else {
      // make sure the dialog is not renderred in the collectible ticket view
      return null;
    }

    return (
      <Sheet open onOpenChange={handleOpenChange}>
        <SheetPortal>
          <SheetOverlay className="fixed inset-0 z-50 bg-black/0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <SheetContent
            hideCloseButton
            side="bottom"
            className="bg-gray-100 rounded-3xl flex flex-col justify-between shadow-2xl border-2 border-gray-300"
          >
            <SheetHeader className="mb-5">
              <SheetTitle className="font-semibold text-base !text-sui-greys-90">
                {title}
              </SheetTitle>
              <SheetDescription className="text-sui-steel-80">
                {message}
              </SheetDescription>
              <div className="py-4 flex flex-col items-center space-y-8 h-[220px]">
                <div className="flex space-y-4">
                  <Image
                    src={ticket.roundedImageUrl}
                    alt={ticket.eventName}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                    style={{ width: "100px", height: "100px" }}
                  />
                  {!!showQRCode && (
                    <div className="ml-[-40px] flex items-center w-[100px] h-[100px] justify-center bg-white rounded-full p-3">
                      {ticket.id ? (
                        <QRCode
                          value={`https://suiexplorer.com/object/${ticket.id}?network=${getNetworkName() || "testnet"}`}
                          size={60}
                          level="M"
                        />
                      ) : (
                        <div className="text-xs text-gray-500">Loading...</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="border-y-[1px] text-center text-sm py-2 w-full flex space-x-2 items-center justify-center border-gray-300">
                  <Image
                    src="/attendees.svg"
                    alt="attendees"
                    width={80}
                    height={30}
                  />
                  <div>843 {attendancesText}</div>
                </div>
              </div>
            </SheetHeader>
            <SheetFooter className="flex flex-row flex-wrap space-x-3 justify-between items-center">
              <Button
                onClick={handleClose}
                className="flex-1 text-sui-steel-80 bg-gray-300 hover:bg-gray-300/60 rounded-xl px-3 py-2"
                size="lg"
              >
                Cancel
              </Button>
              <LoadingButton
                onClick={handleAccept}
                className="text-white flex-1 rounded-xl bg-info"
                id="update-ticket-button"
                size="lg"
                isLoading={isLoading}
              >
                {acceptButtonText}
              </LoadingButton>
            </SheetFooter>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    );
  }
  return null;
};
