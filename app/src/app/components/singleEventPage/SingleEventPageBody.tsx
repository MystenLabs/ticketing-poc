import { Event } from "@/app/types/Event";
import Image from "next/image";
import React from "react";
import { EventCardSubHeader } from "../events/EventCardSubHeader";
import { SingleEventLineUp } from "./SingleEventLineUp";
import { TicketPriceChip } from "../general/TicketPriceChip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
} from "../ui/sheet-no-overlay";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { SheetTitle } from "../ui/sheet";
import { LoyaltyPointsChip } from "../general/LoyaltyPointsChip";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface SingleEventPageBodyProps {
  event: Event | null;
}

export const SingleEventPageBody = ({ event }: SingleEventPageBodyProps) => {
  const router = useRouter();

  const handleSelectSeats = () => router.push(`/events/${event?.id}/seats`);

  return (
    <div className="flex flex-col items-center space-y-7 w-full pb-[50px] relative">
      <div className="w-full h-[60vh] overflow-hidden">
        <img
          src={event?.image}
          alt="event"
          style={{
            width: "100%",
            height: "100%",
            top: -40,
            objectFit: "cover",
          }}
          className="relative"
        />
      </div>

      {!!event && (
        <Sheet open>
          <SheetContent side="bottom" className="rounded-t-xl">
            <SheetHeader>
              <div className="flex flex-col space-y-2 relative">
                <div className="grid grid-cols-12 items-center w-full space-x-2">
                  <div className="col-span-6 flex items-center">
                    <Button
                      variant="link"
                      onClick={() => router.back()}
                      className="py-0 pl-1 pr-3"
                    >
                      <Image
                        src="/arrow_left.svg"
                        width={9}
                        height={9}
                        alt="back"
                      />
                    </Button>
                    <SheetTitle className="text-xl font-bold text-start !p-0">
                      {event.name}
                    </SheetTitle>
                  </div>
                  <div className="col-span-6 flex-1 flex space-x-1 justify-end">
                    <LoyaltyPointsChip points={100} />
                    <TicketPriceChip price={10} />
                  </div>
                </div>
                <EventCardSubHeader {...event} showTime={false} />
              </div>
              <div className="flex flex-col space-y-3 w-full pb-[20px] pt-4">
                <SheetDescription className="text-sui-steel-80 font-[400] w-full text-start">
                  {event.description}
                </SheetDescription>
                <SingleEventLineUp lineup={event.lineup} />
              </div>
            </SheetHeader>
            <SheetFooter className="fixed left-[5%] bottom-5 w-[90%]">
              <Button
                size="lg"
                className="text-white flex space-x-2 items-center bg-info rounded-xl"
                id="select-seats-button"
                onClick={handleSelectSeats}
              >
                <span>Select Seats</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
