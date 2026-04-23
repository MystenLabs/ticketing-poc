"use client";

import dynamic from "next/dynamic";
import { EventsHeader } from "./components/events/EventsHeader";
import { EventsList } from "./components/events/EventsList";
import { AskPermissionSheet } from "./components/notifications/AskPermissionSheet";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

const SignIn = dynamic(
  () => import("./components/landing/SignIn").then((mod) => mod.SignIn),
  {
    ssr: false,
  },
);

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
