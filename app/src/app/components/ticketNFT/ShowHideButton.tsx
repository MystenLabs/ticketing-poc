import React from "react";
import { Button } from "../ui/button";
import { LoopIcon } from "@radix-ui/react-icons";

interface ShowHideButtonProps {
  onClick: (props: any) => void;
  color?: string;
}

export const ShowHideButton = ({
  onClick,
  color = "gray-300",
}: ShowHideButtonProps) => {
  return (
    <div className={`flex justify-end items-center`}>
      <Button size="xs" variant="link" onClick={onClick}>
        <LoopIcon className={`w-5 h-5 text-${color}`} />
      </Button>
    </div>
  );
};
