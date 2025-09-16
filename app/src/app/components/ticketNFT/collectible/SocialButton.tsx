import React from "react";
import { Button } from "../../ui/button";
import Image from "next/image";

interface SocialButtonProps {
  iconSrc: string;
  alt: string;
  className?: string;
}
export const SocialButton = ({
  iconSrc,
  alt,
  className = "",
}: SocialButtonProps) => {
  return (
    <Button
      variant="outline"
      className={`${className} py-4 bg-white rounded-xl border-sui-steel-40 shadow-none`}
    >
      <Image src={iconSrc} alt={alt} width={20} height={20} />
    </Button>
  );
};
