import React, { ReactElement } from "react";

interface StatisticsCardProps {
  title: string | ReactElement;
  subtitle: string;
}

export const StatisticsCard = ({ title, subtitle }: StatisticsCardProps) => {
  return (
    <div
      className={`flex flex-col space-y-4 items-center shadow-xl bg-secondary p-4 w-full rounded-xl`}
    >
      {typeof title === "string" ? (
        <div className="font-bold text-xl text-center">{title}</div>
      ) : (
        React.cloneElement(title)
      )}
      <div className="text-gray-500 text-center">{subtitle}</div>
    </div>
  );
};
