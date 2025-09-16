"use client";

import React, { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import { Header } from "../components/layouts/Header";
import Link from "next/link";
import { TicketNFT } from "../components/ticketNFT/TicketNFT";
import { AnonymousMessage } from "../components/address/AnonymousMessage";
import { useGetTickets } from "../hooks/useGetTickets";
import { Spinner } from "../components/general/Spinner";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { TICKET_STAGES } from "../data/constants";
import { ColoredHeader } from "../components/layouts/ColoredHeader";

const TicketsPage = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "upcoming";

  const handleSelectCategory = (category: string) =>
    router.push(`/tickets?category=${category}`);

  const { tickets, isLoading } = useGetTickets();

  const categoryText = useMemo(() => {
    switch (selectedCategory) {
      case "upcoming":
        return "upcoming";
      case "now":
        return "running";
      case "collectibles":
        return "collectible";
      default:
        return "Now";
    }
  }, [selectedCategory]);

  const renderTicketsList = (category: string) => {
    const ticketsFiltered = tickets.filter(
      ({ stage }) =>
        ((category === "upcoming" || !category) &&
          stage === TICKET_STAGES.PURCHASED) ||
        (category === "now" &&
          (stage === TICKET_STAGES.ACTIVATED ||
            stage === TICKET_STAGES.ATTENDED)) ||
        (category === "collectibles" && stage === TICKET_STAGES.COLLECTIBLE),
    );

    return (
      <>
        {isLoading && <Spinner />}
        {!isLoading && !ticketsFiltered.length && (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[400px]">
            <div className="text-lg text-center mb-4">
              You do not own any tickets for {categoryText} events.
            </div>
            <div className="underline text-info w-full text-center">
              <Link href="/">Explore Events</Link>
            </div>
          </div>
        )}
        {!!ticketsFiltered.length && (
          <div
            className={`gap-4 ${
              ticketsFiltered.length === 1
                ? "flex justify-center items-center flex-1 min-h-[400px]"
                : ticketsFiltered.length === 2
                  ? "grid grid-cols-1 sm:grid-cols-2 justify-center max-w-2xl mx-auto"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {ticketsFiltered.map((ticket) => (
              <TicketNFT
                key={ticket.id}
                ticket={ticket}
                refreshTicket={() => {}}
              />
            ))}
          </div>
        )}
      </>
    );
  };
  if (!address) {
    return <AnonymousMessage />;
  }
  return (
    <div className="w-full relative min-h-screen flex flex-col">
      <ColoredHeader style={{ background: "#1D4957", height: 227 }} />
      <Header
        title="Tickets"
        titleColor="white"
        showBackButton={false}
        backUrl="#"
      />
      <div className="space-y-5 px-5 pt-1 flex-1">
        <Tabs
          defaultValue="upcoming"
          value={selectedCategory}
          className="space-y-4 relative"
        >
          <TabsList className="grid w-full grid-cols-3 bg-[#767680] bg-opacity-10">
            <TabsTrigger
              onClick={() => handleSelectCategory("upcoming")}
              value="upcoming"
              id="upcoming-tab-trigger"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleSelectCategory("now")}
              value="now"
              id="now-tab-trigger"
            >
              Now
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleSelectCategory("collectibles")}
              value="collectibles"
              id="collectibles-tab-trigger"
            >
              Collectibles
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {renderTicketsList("upcoming")}
          </TabsContent>
          <TabsContent value="now">{renderTicketsList("now")}</TabsContent>
          <TabsContent value="collectibles">
            {renderTicketsList("collectibles")}
          </TabsContent>
        </Tabs>
      </div>
      <div id="end-of-page" />
    </div>
  );
};

// Dynamic import to prevent SSR for components using useSearchParams
const DynamicTicketsPage = dynamic(() => Promise.resolve(TicketsPage), {
  ssr: false,
  loading: () => <Spinner />,
});

const TicketsPageWithSuspense = () => (
  <Suspense fallback={<Spinner />}>
    <TicketsPage />
  </Suspense>
);

export default TicketsPageWithSuspense;
