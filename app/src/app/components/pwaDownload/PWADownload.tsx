"use client";

import Image from "next/image";
import React from "react";

export const PWADownload = () => {
  return (
    <div
      className="flex justify-center items-center h-screen w-screen"
      style={{
        background: "linear-gradient(165.96deg, #E5F5FF 9.97%, #FBFFF0 94.97%)",
      }}
    >
      <div
        className="flex flex-col items-center w-[90%] border-2 rounded-lg p-5 space-y-6"
        style={{
          background:
            "linear-gradient(165.96deg, #E5F5FF 9.97%, #FBFFF0 94.97%)",
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <Image
            src="/logo.svg"
            alt="Download"
            width={80}
            height={80}
            className="rounded-xl"
          />
          <div className="text-2xl font-bold">Tickets Are Us</div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <p className="text">
              Add to Home screen <br /> To enjoy the full experience of the App
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="text-center w-full">
              In your <b>browser menu</b>:
            </div>
            <div
              className="grid grid-cols-3 gap-x-1 gap-y-3 justify-center items-center w-full"
              style={{
                gridTemplateColumns: "30px 30px auto",
              }}
            >
              <div className="text-xs text-center rounded-full bg-secondary py-1 w-[20px] h-[min-content]">
                1
              </div>
              <Image
                src="/share.svg"
                alt="Share"
                width={25}
                height={25}
                className="rounded-xl"
              />
              <div className="text-xs">
                Tap the <b>Share Button</b>
              </div>
              <div className="text-xs text-center rounded-full bg-secondary py-1 w-[20px] h-[min-content]">
                2
              </div>
              <Image
                src="/plus.svg"
                alt="Add"
                width={22}
                height={22}
                className="ml-[1px] rotate-180 border-2 border-black rounded-md p-1"
              />
              <div className="text-xs">Add to Home Screen</div>
              <div className="text-xs text-center rounded-full bg-secondary py-1 w-[20px] h-[min-content]">
                3
              </div>
              <Image
                src="/logo.svg"
                alt="Tickets Are Us"
                width={24}
                height={24}
                className="rounded-lg"
              />
              <div className="text-xs">
                Open <b>Tickets Are Us</b> App <br />
                from your home screen.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
