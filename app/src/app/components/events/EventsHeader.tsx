import Slider from "react-slick";
import { mockEvents } from "@/app/data/mockEvents";
import { EventCard } from "./EventCard";
import { LoyaltyCard } from "../loyaltyCard/LoyaltyCard";
import { getGreetingsByDateTime } from "@/app/helpers/greetingByDateTime";
import { useGetEventsText } from "@/app/hooks/useGetEventsText";
import { getAccount } from "@/app/helpers/getAccount";
import { useSession } from "@/app/hooks/useSession";

const featuredEvents = mockEvents.slice(0, 5);

export const EventsHeader = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const { text: eventsText, isLoading: isEventsTextLoading } =
    useGetEventsText();

  if (isSessionLoading || !session?.jwt) return null;

  return (
    <div className="relative">
      <div
        className="h-[450px] w-screen absolute top-[-1rem] z-1"
        style={{
          background: "linear-gradient(180deg, #1d4957 0%, #1d3757 100%)",
        }}
      />
      <div className="mt-7 px-5 z-10 relative flex flex-col space-y-5 w-inherit">
        <div className="flex flex-col space-y-1">
          <div className="text-2xl font-semibold text-white ">
            {getGreetingsByDateTime()} {getAccount(session?.jwt).firstName}!
          </div>
          {!isEventsTextLoading && (
            <div
              className="text-xs"
              style={{
                color: "rgba(0, 249, 251, 1)",
              }}
            >
              {eventsText}
            </div>
          )}
        </div>
        <LoyaltyCard />
        <div className="flex flex-col space-y-2">
          <div className="text-gray-300 text-sm">Events For You</div>
          <Slider
            dots
            className="w-full"
            arrows={false}
            // slidesToShow={1.2}
            // slidesToScroll={1}
            // infinite={false}
          >
            {featuredEvents?.map((event) => (
              <div key={event.id} className="pb-6 mb-[-2px] pr-2">
                <EventCard {...event} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};
