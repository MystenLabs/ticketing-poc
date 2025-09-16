import Image from "next/image";
import React from "react";

export const ImagesGrid = () => {
  return (
    <div className="grid grid-cols-3 space-x-2 h-[60vh]">
      <div className="col-span-1 space-y-2 flex flex-col">
        <div className="w-full h-full relative">
          <Image
            src={"/landing/landing_1.svg"}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg rounded-l-none"
            priority
          />
        </div>
        <div className="w-full h-full">
          <Image
            src={"/landing/landing_6.svg"}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg rounded-l-none"
          />
        </div>
      </div>
      <div className="col-span-1 space-y-2 flex flex-col">
        <div className="w-full h-full relative">
          <Image
            src={"/landing/landing_2.svg"}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="w-full h-full">
          <Image
            src={"/landing/landing_3.svg"}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="w-full h-full">
          <Image
            src={"/landing/landing_7.svg"}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      </div>
      <div className="col-span-1 space-y-2 flex flex-col">
        <div className="w-full h-full relative">
          <Image
            src={"/landing/landing_4.svg"}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg rounded-r-none"
          />
        </div>
        <div className="w-full h-full">
          <Image
            src={"/landing/landing_5.svg"}
            alt="event"
            width={0}
            height={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-lg rounded-r-none"
          />
        </div>
      </div>
    </div>
  );
};
