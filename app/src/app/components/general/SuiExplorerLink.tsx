import { getNetworkName } from "@/app/helpers/getNetworkName";
import { formatAddress } from "@mysten/sui/utils";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

interface SuiExplorerLinkProps {
  type: "address" | "object";
  id: string;
  elementId?: string;
  className?: string;
}

export const SuiExplorerLink = ({
  type,
  id,
  elementId,
  className = "",
}: SuiExplorerLinkProps) => {
  return (
    <Link
      href={`https://suiexplorer.com/${type}/${id}?network=${getNetworkName()}`}
      className={`${className} flex space-x-2 items-center sui-explorer-link`}
      target="_blank"
      rel="noopenner oreferrer"
      {...(elementId ? { id: elementId } : {})}
    >
      <div>{formatAddress(id)}</div>
      <ExternalLinkIcon className="w-5 h-5" />
    </Link>
  );
};
