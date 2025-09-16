import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

interface ProfileTabsProps {
  tabs: TabProps[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

interface TabProps {
  name: string;
  value: string;
  content: React.ReactElement;
}

export const ProfileTabs = ({
  tabs,
  selectedTab,
  setSelectedTab,
}: ProfileTabsProps) => {
  return (
    <Tabs
      defaultValue={tabs[0].value}
      value={selectedTab}
      className="space-y-4 relative w-full"
    >
      <TabsList
        className={`grid w-full grid-cols-${tabs.length} bg-[#15527B] bg-opacity-10`}
      >
        {tabs.map(({ name, value }) => (
          <TabsTrigger
            key={value}
            onClick={() => setSelectedTab(value)}
            value={value}
            id="upcoming-tab-trigger"
            className="text-sui-greys-90 font-[400]"
          >
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
