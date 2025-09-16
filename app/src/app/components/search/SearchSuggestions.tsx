import Image from "next/image";
import React, { useMemo } from "react";
import { Button } from "../ui/button";

interface SearchSuggestion {
  value: string;
  name: string;
  iconSrc: string;
  iconAlt: string;
}

interface SearchSuggestionsProps {
  handleSelect: (key: string) => void;
}

export const SearchSuggestions = ({ handleSelect }: SearchSuggestionsProps) => {
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    return [
      {
        value: "Electronic",
        name: "Electronic",
        iconSrc: "/trending.svg",
        iconAlt: "genre",
      },
      {
        value: "Amsterdam",
        name: "Amsterdam",
        iconSrc: "/location_pin.svg",
        iconAlt: "location pin",
      },
      {
        value: "Miami",
        name: "Miami",
        iconSrc: "/location_pin.svg",
        iconAlt: "location pin",
      },
      {
        value: "Tropical House",
        name: "Tropical House",
        iconSrc: "/trending.svg",
        iconAlt: "genre",
      },
    ];
  }, []);

  return (
    <div className="space-y-2">
      <div className="text-sui-steel-80 font-[590]">Suggestions</div>
      <div className="flex ml-[-4px] flex-wrap">
        {suggestions.map(({ value, name, iconSrc, iconAlt }) => (
          <Button
            key={value}
            className="bg-white hover:bg-sui-steel-40/10 px-2 py-1 m-1 rounded-full flex space-x-2"
            onClick={() => handleSelect(value)}
          >
            <div className="rounded-full p-1">
              <Image src={iconSrc} alt={iconAlt} width={14} height={14} />
            </div>
            <div className="font-590 text-sui-greys-90">{name}</div>
          </Button>
        ))}
      </div>
    </div>
  );
};
