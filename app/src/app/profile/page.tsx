"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnonymousMessage } from "../components/address/AnonymousMessage";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ProfileAccountCard } from "../components/profile/header/ProfileAccountCard";
import { ProfileTabs } from "../components/profile/body/ProfileTabs";
import { AccountTab } from "../components/profile/body/AccountTabs";
import { RewardsTab } from "../components/profile/body/rewards/RewardsTab";
import { CollectiblesTab } from "../components/profile/body/CollectiblesTab";
import { useRouter, useSearchParams } from "next/navigation";
import { ColoredHeader } from "../components/layouts/ColoredHeader";
import { ProfileRewardsCard } from "../components/profile/header/ProfileRewardsCard";
import { Spinner } from "../components/general/Spinner";

const ProfilePage = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabs = useMemo(
    () => [
      {
        name: "Account",
        value: "account",
        content: <AccountTab />,
      },
      {
        name: "Rewards",
        value: "rewards",
        content: <RewardsTab />,
      },
      {
        name: "Collectibles",
        value: "collectibles",
        content: <CollectiblesTab />,
      },
    ],
    [],
  );
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) {
      setSelectedTab(tabs[0].value);
    } else {
      const tabIndex = tabs.findIndex(
        (tab) => tab.value === searchParams.get("tab"),
      );
      if (!tabIndex) {
        setSelectedTab(tabs[0].value);
      } else {
        setSelectedTab(tabs[tabIndex].value);
      }
    }
  }, [searchParams.get("tab")]);

  const handleSelectTab = (value: string) => {
    router.push(`/profile?tab=${value}`);
  };

  if (!!address) {
    return (
      <div className="relative space-y-4 w-full min-h-screen flex flex-col">
        <ColoredHeader
          style={{
            background:
              "linear-gradient(159.46deg, #D2EBFA 50.65%, #D5F7EE 86.82%)",
            height: 200,
          }}
        />
        <div className="relative bg-transparent flex flex-col w-full space-y-4 items-center px-5 pt-[10px] flex-1">
          {selectedTab !== "rewards" ? (
            <ProfileAccountCard />
          ) : (
            <ProfileRewardsCard />
          )}
          <ProfileTabs
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTab={handleSelectTab}
          />
        </div>
        <div id="end-of-page" />
      </div>
    );
  }
  return <AnonymousMessage />;
};

// Dynamic import to prevent SSR for components using useSearchParams
const DynamicProfilePage = dynamic(() => Promise.resolve(ProfilePage), {
  ssr: false,
  loading: () => <Spinner />,
});

const ProfilePageWithSuspense = () => (
  <Suspense fallback={<Spinner />}>
    <ProfilePage />
  </Suspense>
);

export default ProfilePageWithSuspense;
