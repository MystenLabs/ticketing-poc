"use client";

import React, { useState, useEffect } from "react";
import { EventsHeader } from "./components/events/EventsHeader";
import { EventsList } from "./components/events/EventsList";
import { SignIn } from "./components/landing/SignIn";
import { AskPermissionSheet } from "./components/notifications/AskPermissionSheet";
import { useCurrentAccount } from "@mysten/dapp-kit";

const LandingPage = () => {
  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    return <SignIn />;
  }

  return (
    <div className="flex flex-col space-y-1 w-full min-h-screen">
      <EventsHeader />
      <div className="px-5 flex-1">
        <AskPermissionSheet />
        <EventsList />
      </div>
    </div>
  );
};

export default LandingPage;
