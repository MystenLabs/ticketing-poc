"use client";

import { AnonymousMessage } from "@/app/components/address/AnonymousMessage";
import { Spinner } from "@/app/components/general/Spinner";
import { Header } from "@/app/components/layouts/Header";
import { TicketNFTInWallet } from "@/app/components/ticketNFT/TicketNFTInWallet";
import { TICKET_STAGES } from "@/app/data/constants";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useGetSingleTicket } from "@/app/hooks/useGetSingleTicket";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useEffect, useState } from "react";
import Confetti from "react-confetti";
import dynamic from "next/dynamic";

const SingleTicketPage = () => {
  const searchParams = useSearchParams();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { id } = useParams();
  const [isMounted, setIsMounted] = useState(false);

  const { ticket, isLoading, handleGetTicket } = useGetSingleTicket(
    id as string,
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { backButton, title, backUrl } = useMemo(() => {
    const isFromProfilePage =
      isMounted && searchParams.get("from") === "profile";
    const backUrl = isFromProfilePage
      ? "/profile?tab=collectibles"
      : "/tickets";

    // Always return "Tickets" on server-side or until ticket loads
    if (!isMounted || !ticket) {
      return {
        backUrl,
        backButton: undefined,
        title: "Tickets",
      };
    }

    if (ticket.stage === TICKET_STAGES.ATTENDED) {
      return {
        backUrl,
        backButton: undefined,
        title: (
          <div className="flex flex-col items-center">
            <div className="font-bold text-sui-greys-90">Welcome!</div>
            <div className="text-xs text-sui-steel-80">
              Take a seat and enjoy the show
            </div>
          </div>
        ),
      };
    }
    if (ticket.stage === TICKET_STAGES.COLLECTIBLE) {
      return {
        backUrl,
        backButton: undefined,
        title: (
          <div className="flex flex-col items-center px-[80px] text-center">
            <div className="font-bold text-sui-greys-90">The time flew by!</div>
            <div className="text-sui-steel-80">
              This ticket is now your very own, unique collectible.
            </div>
          </div>
        ),
      };
    }
    return {
      backUrl,
      backButton: undefined,
      title: "Tickets",
    };
  }, [ticket, isMounted, searchParams]);

  const handleRefreshTicket = () => handleGetTicket(id as string);

  if (!address) {
    return <AnonymousMessage />;
  }

  return (
    <>
      {ticket?.stage === TICKET_STAGES.COLLECTIBLE && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/confetti.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}
      {ticket?.stage === TICKET_STAGES.COLLECTIBLE && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Confetti
            width={typeof window !== "undefined" ? window.innerWidth : 400}
            height={typeof window !== "undefined" ? window.innerHeight : 800}
            gravity={0.05}
            numberOfPieces={1000}
            wind={0.01}
            recycle={false}
            confettiSource={{
              x: 0,
              y: -50,
              w: typeof window !== "undefined" ? window.innerWidth : 400,
              h: 0,
            }}
            initialVelocityY={5}
          />
        </div>
      )}
      <div
        className="w-full space-y-5 min-h-screen relative"
        style={{ zIndex: 10 }}
      >
        <div
          className={
            ticket?.stage === TICKET_STAGES.COLLECTIBLE ? "" : "bg-white"
          }
        >
          <Header title={title} backButton={backButton} backUrl={backUrl} />
        </div>
        {isLoading && <Spinner />}
        <div>
          {!!ticket && (
            <TicketNFTInWallet
              ticket={ticket}
              refreshTicket={handleRefreshTicket}
            />
          )}
          {!isLoading && !ticket && (
            <div className="text-center text-gray-500">Ticket not found</div>
          )}

          <div id="end-of-page" />
        </div>
      </div>
    </>
  );
};

// Dynamic import to prevent SSR for components using useSearchParams
const DynamicSingleTicketPage = dynamic(
  () => Promise.resolve(SingleTicketPage),
  {
    ssr: false,
    loading: () => <Spinner />,
  },
);

const SingleTicketPageWithSuspense = () => (
  <Suspense fallback={<Spinner />}>
    <SingleTicketPage />
  </Suspense>
);

export default SingleTicketPageWithSuspense;
