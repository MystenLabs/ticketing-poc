import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet-no-overlay";
import { useState } from "react";
import { SeatsList } from "../seats/SeatsList";
import { Seat } from "@/app/types/Seat";
import { Event } from "@/app/types/Event";
import { SingleSeatDetails } from "../seats/SingleSeatDetails";
import { SeatsQuantityPicker } from "../seats/SeatsQuantityPicker";
import { ApplePayDrawer } from "../pay/ApplePayDrawer";
import Image from "next/image";
import { useMintTicket } from "@/app/hooks/useMintTicket";
import toast from "react-hot-toast";
import { EventCardSubHeader } from "../events/EventCardSubHeader";
import { Chip } from "../general/Chip";
import { useRouter } from "next/navigation";
import { useLoyalty } from "@/app/hooks/useLoyalty";

interface SelectSeatDrawerProps {
  event: Event;
  selectedSeat: Seat | null;
  handleClearSelectedSeat: () => void;
  handleSelectSeat: (seat: Seat) => void;
}

export const SelectSeatDrawer = ({
  event,
  selectedSeat,
  handleSelectSeat: setSelectedSeat,
  handleClearSelectedSeat,
}: SelectSeatDrawerProps) => {
  const router = useRouter();
  const { loyalty } = useLoyalty();
  const { handleMint: handleMintTicket, isLoading } = useMintTicket();
  const [quantity, setQuantity] = useState<number>(1);
  const handleIncreaseQuantity = () => setQuantity(quantity + 1);
  const handleDecreaseQuantity = () =>
    setQuantity(quantity === 0 ? 0 : quantity - 1);

  const handleConfirmPayment = () => {
    if (!selectedSeat) {
      toast.error("Select your section at first");
      return;
    }
    handleMintTicket({
      event,
      seat: selectedSeat!,
      quantity,
    });
  };

  const renderSheetTitle = () => {
    if (!selectedSeat) {
      return (
        <>
          <SheetTitle className="sr-only">Select Seats</SheetTitle>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="link"
                onClick={() => router.back()}
                className="py-0 pl-1"
              >
                <Image src="/arrow_left.svg" width={6} height={6} alt="back" />
              </Button>
              <div className="text-base text-sui-greys-90 font-[590]">
                Select Seats
              </div>
            </div>
            <SeatsQuantityPicker
              quantity={quantity}
              handleIncreaseQuantity={handleIncreaseQuantity}
              handleDecreaseQuantity={handleDecreaseQuantity}
            />
          </div>
        </>
      );
    }
    return (
      <>
        <div className="flex items-center !p-0 relative">
          <div className="absolute left-6">
            <button onClick={handleClearSelectedSeat}>
              <Image
                src="/arrow_left.svg"
                alt="arrow left"
                width={10}
                height={10}
              />
            </button>
          </div>
          <div className="flex flex-col items-center w-full">
            <SheetTitle className="font-bold text-lg">
              {selectedSeat.name}
            </SheetTitle>
          </div>
        </div>
        <div className="text-sm flex items-center space-x-2 text-gray-500 justify-center">
          <div>${selectedSeat.price}</div>
          <div>&bull;</div>
          <Chip variant="warning">
            <Image
              src={"/points_icon_dark.svg"}
              alt="points"
              width={10}
              height={10}
            />
            <div className="text-warning-extra-dark">
              {selectedSeat.loyaltyPoints} Each
            </div>
          </Chip>
        </div>
      </>
    );
  };

  const renderSheetContent = () => {
    if (!selectedSeat) {
      return (
        <div className="pt-5">
          <SeatsList handleSelectSeat={setSelectedSeat} />
        </div>
      );
    }
    return (
      <div className="flex flex-col space-y-6">
        <SingleSeatDetails event={event} seat={selectedSeat} />
        <div
          className="space-y-3 w-screen ml-[-22px] px-5 py-2"
          style={{
            boxShadow: "0px -10px 44px 0px #56687338",
          }}
        >
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center text-sm space-x-1">
              <div className="text-sui-greys-90 font-[590]">Redeem Points</div>
              <div className="flex space-x-[1px]">
                <div>(</div>
                <Image
                  src={"/points_icon_grey.svg"}
                  alt="points"
                  width={10}
                  height={10}
                />
                <div>{loyalty?.loyalty_points}</div>
                <div>)</div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg py-2 px-3">
              <input
                className="bg-white w-[50px] text-sui-steel-40"
                value={0}
                disabled
              />
              <button className="text-info text-xs font-bold" disabled>
                All
              </button>
            </div>
          </div>
          <hr />
          <div className="flex justify-between space-x-2">
            <div>
              <SeatsQuantityPicker
                quantity={quantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
              />
            </div>
            <div className="flex-1">
              <ApplePayDrawer
                quantity={quantity}
                event={event}
                selectedSeat={selectedSeat}
                handleConfirmPayment={handleConfirmPayment}
                isConfirmPaymentLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open>
      <SheetContent
        side="bottom"
        className={`${
          !!selectedSeat ? "bg-[#EEF2F6]" : "bg-[white]"
        } rounded-t-xl pb-4`}
      >
        <SheetHeader>
          {renderSheetTitle()}
          <div className={selectedSeat ? "pt-4" : ""}>
            {renderSheetContent()}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
