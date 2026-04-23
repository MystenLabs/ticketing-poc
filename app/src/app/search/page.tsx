"use client";

import React, { useState } from "react";
import { Header } from "../components/layouts/Header";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useSearchEvents } from "../hooks/useSearchEvents";
import { SearchEventsForm } from "../components/search/SearchEventsForm";
import { SearchEventsResults } from "../components/search/SearchEventsResults";
import { SearchedEventsHistory } from "../components/search/SearchedEventsHistory";
import { SearchSuggestions } from "../components/search/SearchSuggestions";
import { AnonymousMessage } from "../components/address/AnonymousMessage";
import { ColoredHeader } from "../components/layouts/ColoredHeader";

const SearchPage = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { text, handleChange, setText, events } = useSearchEvents();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <ColoredHeader
        style={{
          background: "white",
          height: 105,
        }}
      />
      <Header title="Search" backUrl="#" showBackButton={false} />
      <div className="relative z-10 px-5 space-y-5 flex-1">
        {!address && <AnonymousMessage />}
        {!!address && (
          <>
            <SearchEventsForm
              address={address}
              text={text}
              handleChange={handleChange}
              handleFocus={setIsFocused}
            />
            {!isFocused && (
              <>
                <SearchedEventsHistory />
                <SearchSuggestions handleSelect={setText} />
              </>
            )}

            <SearchEventsResults events={events} text={text} />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
