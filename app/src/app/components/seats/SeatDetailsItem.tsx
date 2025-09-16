import React from "react";

interface SeatDetailsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: React.ReactNode | string;
  imagePadding?: number;
}

export const SeatDetailsItem = ({
  icon,
  title,
  subtitle,
  imagePadding = 6,
}: SeatDetailsItemProps) => {
  const imageClassName = `rounded-lg text-primary bg-secondary mt-1 p-${imagePadding} h-[min-content]`;
  return (
    <div className="flex space-x-2 bg-white p-3 rounded-xl w-full">
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: imageClassName,
      })}
      <div className="flex flex-col text-start flex-1">
        <div className="font-bold text-sui-greys-90 text-sm">{title}</div>
        <div className="text-sui-steel-80 text-xs">
          <div>{subtitle}</div>
        </div>
      </div>
    </div>
  );
};
