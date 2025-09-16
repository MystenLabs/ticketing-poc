import React from "react";

interface HiddenNFTFooterSectionProps {
  title: string;
  subtitle: string;
}

export const HiddenNFTFooterSection = ({
  title,
  subtitle,
}: HiddenNFTFooterSectionProps) => {
  return (
    <div className="flex flex-col items-center space-y-1 p-2 pt-3">
      <div className="text-gray-400 text-xs">{title}</div>
      <div className="text-white text-sm text-center">{subtitle}</div>
    </div>
  );
};
