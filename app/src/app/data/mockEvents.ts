import { Event } from "../types/Event";
import { EventLineUp } from "../types/EventLineUp";

const magicLightLineUp: EventLineUp = {
  name: "Magic Light",
  image: "/magicLight.svg",
  genre: "Electronic",
  subgenre: "Tropical House",
};

export const mockEvents: Event[] = [
  {
    id: 1,
    name: "Magic Light in Singapore",
    description: "A vibrant night of dance and music with tropical vibes.",
    datetime: "2025-10-02T20:00:00.000Z",
    location: "Marina Bay Sands, Singapore",
    venue: "Ocean Drive Club",
    coordinates: { lat: 1.2838, lng: 103.8591 },
    mapUrl: "https://maps.app.goo.gl/w6KJSwqw9ewrYko48",
    price: 45,
    image: "/events/1.svg",
    roundedImage: "/events/1_rounded.svg",
    ticketFrontImage: "/frontViews/1.svg",
    lineup: [
      magicLightLineUp,
      {
        name: "Beach Beatmaster",
        image: "/artist.svg",
        genre: "Electronic",
        subgenre: "Chillwave",
      },
    ],
  },
  {
    id: 2,
    name: "Magic Light in SF",
    description:
      "Get ready to rock out at the biggest stadium concert of the year! Experience electrifying performances from top rock artists as the crowd comes alive in a celebration of music.",
    datetime: "2025-10-03T18:30:00.000Z",
    location: "San Francisco, California",
    venue: "Bay Area Stadium",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    mapUrl: "https://goo.gl/maps/something",
    price: 75,
    image: "/events/2.svg",
    roundedImage: "/events/2.svg",
    ticketFrontImage: "/frontViews/2.svg",
    lineup: [magicLightLineUp],
  },
  {
    id: 3,
    name: "Magic Light in IT",
    description:
      "Step into a world of mystery and elegance at our grand masquerade ball.",
    datetime: "2025-10-02T20:00:00.000Z",
    location: "Venice, Italy",
    venue: "Royal Masked Hall",
    coordinates: { lat: 45.4408, lng: 12.3155 },
    mapUrl: "https://goo.gl/maps/4gGyvPCjnZC8vttw7",
    price: 100,
    image: "/events/3.svg",
    roundedImage: "/events/3.svg",
    ticketFrontImage: "/frontViews/3.svg",
    lineup: [
      magicLightLineUp,
      {
        name: "Maestro Vivaldi",
        image: "/artist.svg",
        genre: "Classical",
        subgenre: "Baroque",
      },
    ],
  },
  {
    id: 4,
    name: "Magic Light in Amsterdam",
    description:
      "Experience the pulse of electronic beats with top DJs spinning the decks.",
    datetime: "2025-10-02T20:00:00.000Z",
    location: "Amsterdam, Netherlands",
    venue: "The Groove Hub",
    coordinates: { lat: 52.3676, lng: 4.9041 },
    mapUrl: "https://goo.gl/maps/k8ZydDjp5QPNjzCb8",
    price: 40,
    image: "/events/4.svg",
    roundedImage: "/events/4.svg",
    ticketFrontImage: "/frontViews/4.svg",
    lineup: [
      magicLightLineUp,
      {
        name: "Bassline Bender",
        image: "/artist.svg",
        genre: "Electronic",
        subgenre: "Drum & Bass",
      },
    ],
  },
  {
    id: 5,
    name: "Magic Light in LA",
    description:
      "Step into the world of electronic symphonies as our maestro guides you through an evening of synth-driven melodies. From ambient to energetic, experience a soundscape like no other.",
    datetime: "2025-10-05T20:00:00.000Z",
    location: "Los Angeles, California",
    venue: "Electro Echo Club",
    coordinates: { lat: 34.0522, lng: -118.2437 },
    mapUrl: "https://goo.gl/maps/something",
    price: 45,
    image: "/events/5.svg",
    roundedImage: "/events/5.svg",
    ticketFrontImage: "/frontViews/5.svg",
    lineup: [magicLightLineUp],
  },
];
