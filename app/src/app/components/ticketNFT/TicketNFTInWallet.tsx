import { TicketNFTProps } from "./TicketNFT";
import { ActivatedTicketNFT } from "./activated/ActivatedTicketNFT";
import { AttendedTicketNFT } from "./attended/AttendedTicketNFT";
import { CollectibleTicketNFT } from "./collectible/CollectibleTicketNFT";
import { TICKET_STAGES } from "@/app/data/constants";
import { useUpdateTicketStage } from "@/app/hooks/useUpdateTicketStage";

import { CollectibleTicketActions } from "./collectible/CollectibleTicketActions";
import { VoucherCard } from "./attended/VoucherCard";
import { TicketActionsDrawer } from "./TicketActionsDrawer";
import { HiddenPurchasedTicketNFT } from "./purchased/HiddenPurchasedTicketNFT";
import { PurchasedTicketNFT } from "./purchased/PurchasedTicketNFT";
import { HiddenAttendedTicketNFT } from "./attended/HiddenAttendedTicketNFT";
import { HiddenCollectibleTicketNFT } from "./collectible/HiddenCollectibleTicketNFT";
import { useFlipHorizontal } from "@/app/hooks/useFlipHorizontal";

export const TicketNFTInWallet = ({
  ticket,
  refreshTicket,
}: TicketNFTProps) => {
  const { handleTriggerHidden, isHidden, transitionClassName } =
    useFlipHorizontal({
      isHiddenInit: true,
    });

  const refreshTicketAndUnHide = () => {
    refreshTicket();
    handleTriggerHidden();
  };

  const { isLoading, isDrawerOpen, handleCloseDrawer, updateTicketStage } =
    useUpdateTicketStage({
      ticket,
      refreshTicket: refreshTicketAndUnHide,
    });

  const renderTicket = () => {
    if (ticket.stage === TICKET_STAGES.ATTENDED) {
      if (isHidden) {
        return (
          <div className="space-y-4">
            <HiddenAttendedTicketNFT
              ticket={ticket}
              handleShow={handleTriggerHidden}
              transitionClassName={transitionClassName}
            />
            <VoucherCard />
          </div>
        );
      }
      return (
        <div className="space-y-4 flex flex-col items-center">
          <AttendedTicketNFT
            ticket={ticket}
            refreshTicket={refreshTicket}
            handleHide={handleTriggerHidden}
            transitionClassName={transitionClassName}
          />
          <VoucherCard />
        </div>
      );
    }
    if (ticket.stage === TICKET_STAGES.COLLECTIBLE) {
      if (isHidden) {
        return (
          <div className="space-y-4 w-full">
            <HiddenCollectibleTicketNFT
              ticket={ticket}
              handleShow={handleTriggerHidden}
              transitionClassName={transitionClassName}
              isFromProfilePage={false}
              showButton
            />
            <CollectibleTicketActions ticket={ticket} />
          </div>
        );
      }
      return (
        <div className="space-y-4 w-full flex flex-col items-center">
          <CollectibleTicketNFT
            ticket={ticket}
            handleHide={handleTriggerHidden}
            transitionClassName={transitionClassName}
            isFromProfilePage={false}
            showButton
          />
          <CollectibleTicketActions ticket={ticket} />
        </div>
      );
    }

    if (isHidden) {
      return (
        <HiddenPurchasedTicketNFT
          ticket={ticket}
          handleShow={handleTriggerHidden}
          transitionClassName={transitionClassName}
        />
      );
    }
    return (
      <PurchasedTicketNFT
        ticket={ticket}
        refreshTicket={refreshTicket}
        handleHide={handleTriggerHidden}
        transitionClassName={transitionClassName}
      />
    );
  };

  return (
    <>
      <div className="px-5 flex flex-col items-center">{renderTicket()}</div>
      <TicketActionsDrawer
        ticket={ticket}
        isOpen={isDrawerOpen}
        handleClose={handleCloseDrawer}
        handleAccept={updateTicketStage}
        isLoading={isLoading}
      />
    </>
  );
};
