"use client";

import { Header } from "@/app/components/layouts/Header";
import { SingleEventPageBody } from "@/app/components/singleEventPage/SingleEventPageBody";
import { mockEvents } from "@/app/data/mockEvents";
import { useGetSingleEvent } from "@/app/hooks/useGetSingleEvent";
import { Event } from "@/app/types/Event";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SingleEventPage = () => {
  const { id } = useParams();
  const { event } = useGetSingleEvent({ id: id as string });

  return (
    <div className="w-full relative flex flex-col items-center">
      <Header
        title="Event"
        className="!absolute top-0 font-semibold"
        titleColor={event?.id === 1 ? "black" : "white"}
        arrowLeftIconSrc="/arrow_left_white.svg"
        showBackButton={false}
        backUrl="#"
      />
      <SingleEventPageBody event={event} />
      <div id="end-of-page" />
    </div>
  );
};

export default SingleEventPage;
