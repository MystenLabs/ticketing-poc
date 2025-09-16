import Image from "next/image";
import QRCode from "react-qr-code";
import { TicketNFTDetails } from "../general/TicketNFTDetails";
import { TicketNFTProps } from "../TicketNFT";
import Link from "next/link";
import { ShowHideButton } from "../ShowHideButton";
import { getNetworkName } from "@/app/helpers/getNetworkName";

interface PurchasedNFTTicketProps extends TicketNFTProps {
  handleHide: () => void;
}

export const PurchasedTicketNFT = ({
  ticket,
  handleHide,
  transitionClassName = "",
}: PurchasedNFTTicketProps) => {
  return (
    <div
      className={`space-y-2 pb-2 relative rounded-lg bg-secondary w-full bg-opacity-10 min-h-[500px] max-w-[350px] ${transitionClassName} transition-opacity duration-100 ease-in-out border-warning-foreground border-2`}
    >
      <div className="absolute right-1 top-2 z-10">
        <ShowHideButton onClick={handleHide} />
      </div>
      <Link href={`/tickets/${ticket.id}`} className="w-full">
        <div className="w-full h-[121px]">
          <Image
            src={ticket.imageUrl}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="p-3 px-[30px]">
          <div
            className="font-bold text-2xl mt-[10px] pb-[15px]"
            style={{
              width: "calc(100% - 90px)",
            }}
          >
            {ticket.eventName}
          </div>
          {ticket.id ? (
            <QRCode
              value={`https://suiexplorer.com/object/${ticket.id}?network=${getNetworkName() || "testnet"}`}
              size={90}
              level="M"
              className="bg-white rounded-xl p-2 absolute right-[30px] top-[100px]"
            />
          ) : (
            <div className="bg-white rounded-xl p-2 absolute right-[30px] top-[100px] w-[90px] h-[90px] flex items-center justify-center text-xs text-gray-500">
              Loading...
            </div>
          )}
          <TicketNFTDetails ticket={ticket} />
        </div>
      </Link>
    </div>
  );
};
