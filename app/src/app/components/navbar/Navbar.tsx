"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetNavigations } from "@/app/hooks/useGetNavigations";
import { cloneElement } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

export const Navbar = () => {
  const pathname = usePathname();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { navigations } = useGetNavigations();

  if (pathname === "/" && !address) return null;
  if (pathname.endsWith("/seats")) return null;
  if (pathname.includes("/tickets/0x")) return null;

  return (
    <div className="flex flex-wrap justify-center items-center px-6 py-3 space-x-10 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border border-gray-200/80 z-50 w-[90vw] ml-[5vw] sticky bottom-5 rounded-full backdrop-blur-sm ring-1 ring-black/5">
      {navigations.map(({ title, href, icon, activeIcon }) => {
        const isSelected =
          ((pathname.includes("/events") || pathname === "/") &&
            href === "/") ||
          (href !== "/" && pathname.includes(href));
        const colorClassName = isSelected
          ? "!text-info font-bold"
          : "!text-sui-steel-60 font-[510]";
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center space-y-1 ${colorClassName}`}
            id={href.replace("/", "") || "home"}
          >
            {!!icon &&
              !!activeIcon &&
              cloneElement((isSelected ? activeIcon : icon) as any, {
                className: "w-[24px] h-[24px]",
              })}

            <div className="text-sm">{title}</div>
          </Link>
        );
      })}
    </div>
  );
};
