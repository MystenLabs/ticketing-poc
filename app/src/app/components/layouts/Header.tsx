import Link from "next/link";
import React, { cloneElement } from "react";
import Image from "next/image";

interface HeaderProps {
  title: string | React.ReactElement;
  titleColor?: string;
  backButton?: React.ReactNode;
  arrowLeftIconSrc?: string;
  className?: string;
  showBackButton?: boolean;
  backUrl: string;
}

export const Header = ({
  title,
  titleColor,
  backButton,
  backUrl,
  arrowLeftIconSrc = "/arrow_left.svg",
  className,
  showBackButton = true,
}: HeaderProps) => {
  return (
    <div
      className={`${className} relative w-full text-lg pt-4 pb-1 z-10 ${
        titleColor ? "text-" + titleColor : ""
      }`}
    >
      {!!showBackButton && (
        <Link href={backUrl} className="absolute left-2 top-5">
          <Image
            src={arrowLeftIconSrc}
            alt="arrow-left"
            width={0}
            height={0}
            className="w-5 h-5"
          />
          {!!backButton && backButton}
        </Link>
      )}

      {typeof title === "string" ? (
        <div className="flex-1 text-center font-[590]">{title}</div>
      ) : (
        cloneElement(title)
      )}
    </div>
  );
};
