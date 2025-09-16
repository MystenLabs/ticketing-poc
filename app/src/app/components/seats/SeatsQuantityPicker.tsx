import React from "react";
import { Button } from "../ui/button";
import {
  FileTextIcon,
  MinusCircledIcon,
  MinusIcon,
  PlusCircledIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import toast from "react-hot-toast";

interface SeatsQuantityPickerProps {
  quantity: number;
  handleIncreaseQuantity: () => void;
  handleDecreaseQuantity: () => void;
}

export const SeatsQuantityPicker = ({
  quantity,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}: SeatsQuantityPickerProps) => {
  const handlePreDecreaseQuantity = () => {
    if (quantity === 1) {
      toast.error("You can't have less than 1 ticket");
      return;
    }
    handleDecreaseQuantity();
  };
  return (
    <div
      className="flex space-x-2 justify-center items-center bg-secondary rounded-xl h-full"
      style={{
        border: "1px solid hsla(202, 23%, 70%, 1)",
        background:
          "linear-gradient(0deg, #F3F6F8, #F3F6F8), linear-gradient(0deg, #A0B6C3, #A0B6C3)",
      }}
    >
      <Button
        onClick={handlePreDecreaseQuantity}
        variant="link"
        className="p-2 py-1 text-sui-steel-80"
        disabled
      >
        <MinusIcon className="w-4 h-4" />
      </Button>
      <div className="flex space-x-1 items-center text-black">
        <Image src="/tickets.svg" alt="tickets" width={14} height={14} />
        <div className="font-bold text-sui-greys-90 text-xs">
          {quantity} Tickets
        </div>
      </div>
      <Button
        variant="link"
        onClick={handleIncreaseQuantity}
        id="tickets-increase-quantity-button"
        className="p-2 py-1 text-sui-steel-80"
        disabled
      >
        <PlusIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};
