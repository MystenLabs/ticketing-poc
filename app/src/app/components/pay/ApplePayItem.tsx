import React from "react";

interface ApplePayItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: React.ReactNode | string;
  imagePadding?: number;
}

export const ApplePayItem = ({
  icon,
  title,
  subtitle,
  imagePadding = 1,
}: ApplePayItemProps) => {
  const imageClassName = `rounded-lg text-primary bg-gray-200 mt-1 p-${imagePadding} h-[min-content]`;

  return (
    <div className="flex space-x-2 bg-white p-3 rounded-lg w-full">
      {React.cloneElement(icon as React.ReactElement<any>, {
        className: imageClassName,
      })}
      <div className="flex flex-col space-y-1 text-start flex-1">
        <div className="font-bold">{title}</div>
        <div className="text-gray-500 text-sm">
          <div>{subtitle}</div>
        </div>
      </div>
    </div>
  );
};
