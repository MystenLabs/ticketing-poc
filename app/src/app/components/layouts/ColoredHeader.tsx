import React from "react";

interface ColoredHeaderProps {
  style: any;
}

export const ColoredHeader = ({ style }: ColoredHeaderProps) => {
  return <div className={`absolute w-full`} style={style} />;
};
