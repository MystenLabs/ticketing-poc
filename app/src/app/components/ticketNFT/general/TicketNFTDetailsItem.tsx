import React from "react";

interface TicketNFTDetailsItemProps {
  title: string;
  text: string | React.ReactNode;
  textStart?: boolean;
}

export const TicketNFTDetailsItem = ({
  title,
  text,
  textStart = true,
}: TicketNFTDetailsItemProps) => {
  return (
    <div className="flex flex-col">
      <div
        className={`text-sui-steel-80 font-[400] text-sm ${
          textStart ? "text-left" : "text-right"
        }`}
      >
        {title}
      </div>
      <div
        className={`text-sm text-sui-greys-90 font-[590] ${textStart ? "text-left" : "text-right"}`}
      >
        {text}
      </div>
    </div>
  );
};
