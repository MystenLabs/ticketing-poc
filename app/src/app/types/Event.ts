import { EventLineUp } from "./EventLineUp";

export interface Event {
  id: number;
  name: string;
  description: string;
  datetime: string;
  location: string;
  venue: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapUrl: string;
  price: number;
  image: string;
  roundedImage: string;
  ticketFrontImage: string;
  lineup: EventLineUp[];
}

export const emptyEvent: Event = {
  id: 0,
  name: "",
  description: "",
  datetime: "",
  location: "",
  venue: "",
  coordinates: {
    lat: 0,
    lng: 0,
  },
  mapUrl: "",
  price: 0,
  image: "",
  roundedImage: "",
  ticketFrontImage: "",
  lineup: [],
};
