import React from "react";

interface GeneralCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode | string;
  action?: React.ReactNode;
  iconPadding?: number;
}

export const GeneralCard = ({
  icon,
  title,
  subtitle,
  action,
  iconPadding = 7,
}: GeneralCardProps) => {
  return (
    <div className="flex space-x-2 justify-between items-center bg-white py-[12px] px-[14px] rounded-lg w-full">
      <div className="flex space-x-2 items-center">
        {React.cloneElement(icon as React.ReactElement<any>, {
          className: `w-[30px] h-[30px] rounded-xl mt-1`,
          style: {
            background:
              "linear-gradient(165.96deg, #E6F5FF 9.97%, #EBECFF 94.97%)",
            padding: iconPadding,
          },
        })}
        <div className="flex flex-col text-start flex-1">
          <div className="text-base font-bold text-sm !text-sui-greys-90 !font-[590]">
            {title}
          </div>
          {!!subtitle && (
            <div className="text-gray-400 text-xs">
              <div>{subtitle}</div>
            </div>
          )}
        </div>
      </div>
      {!!action && action}
    </div>
  );
};
