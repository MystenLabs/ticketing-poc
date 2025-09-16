"use client";

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Account } from "@/app/types/Account";

interface SearchEventsFormProps {
  address: string | null;
  text: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (isFocused: boolean) => void;
}
export const SearchEventsForm = ({
  address,
  text,
  handleChange,
  handleFocus,
}: SearchEventsFormProps) => {
  return (
    <div className="space-y-2 w-full">
      <form className="flex justify-between items-center space-x-2 border-none shadow-none bg-gray-200 rounded-xl px-2">
        <Input
          disabled={!address}
          value={text}
          onChange={handleChange}
          placeholder="Event name, venue or location..."
          id="search-events"
          className="border-none shadow-none focus:border-none"
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
        />
        <Button
          disabled={!address}
          type="submit"
          variant="link"
          className="p-1 pr-0"
        >
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
        </Button>
      </form>
    </div>
  );
};
