import React from "react";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Seat } from "@/app/types/Seat";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import {
  dateTimeStringToNumber,
  getDateStringFromDateTime,
  getTimeStringFromDateTime,
} from "@/app/helpers/dates";
import { LoadingButton } from "../general/LoadingButton";
import Image from "next/image";
import { ApplePayItem } from "./ApplePayItem";
import { Event } from "@/app/types/Event";

interface ApplePayDrawerProps {
  quantity: number;
  event: Event;
  selectedSeat: Seat;
  handleConfirmPayment: () => void;
  isConfirmPaymentLoading: boolean;
}

export const ApplePayDrawer = ({
  quantity,
  event,
  selectedSeat,
  handleConfirmPayment,
  isConfirmPaymentLoading,
}: ApplePayDrawerProps) => {
  const dateString = getDateStringFromDateTime(
    `${dateTimeStringToNumber(event.datetime)}`,
  );
  const timeString = getTimeStringFromDateTime(
    `${dateTimeStringToNumber(event.datetime)}`,
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          disabled={!quantity}
          className="flex items-center space-x-2 text-white w-full rounded-xl bg-info hover:bg-info/90"
          id="buy-tickets-button"
          size="lg"
        >
          <span>Buy (${selectedSeat.price * quantity})</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-gray-100 rounded-xl">
        <SheetHeader>
          <SheetTitle>
            <Image
              src="/apple_pay_banner.svg"
              width={70}
              height={70}
              alt="apple-pay"
            />
          </SheetTitle>
          <div className="pt-4">
            <div className="flex flex-col items-start space-y-4">
              <ApplePayItem
                icon={
                  <Image
                    src={"/apple_pay_box.svg"}
                    width={30}
                    height={30}
                    alt="event"
                  />
                }
                imagePadding={2}
                title={event.name}
                subtitle={`${dateString} • ${timeString} • ${event.venue}`}
              />
              <ApplePayItem
                icon={
                  <Image
                    src={"/apple_card.svg"}
                    width={35}
                    height={35}
                    alt="tickets"
                  />
                }
                imagePadding={0}
                title="Apple Card"
                subtitle={
                  <div>
                    <div>••••1234</div>
                    <div>27 Fredrick Butte Rd, Brothers...</div>
                  </div>
                }
              />
              <ApplePayItem
                icon={
                  <Image
                    src={"/apple_contact.svg"}
                    width={30}
                    height={30}
                    alt="tickets"
                  />
                }
                imagePadding={2}
                title="Contact"
                subtitle={
                  <div>
                    <div>j.appleseed@icloud.com</div>
                    <div>(458) 555-2863</div>
                  </div>
                }
              />
            </div>
          </div>
          <SheetFooter>
            <LoadingButton
              onClick={handleConfirmPayment}
              className="text-white w-[90%] ml-[5%] mt-3"
              size="lg"
              isLoading={isConfirmPaymentLoading}
              id="apple-pay-button"
            >
              Confirm payment of ${selectedSeat.price * quantity}
            </LoadingButton>
          </SheetFooter>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
