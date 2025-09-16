import Image from "next/image";
import React from "react";
import QRCode from "react-qr-code";

export const VoucherCard = () => {
  return (
    <div
      className="rounded-xl space-y-1 p-3"
      style={{
        background:
          "linear-gradient(159.46deg, #D2EBFA 50.65%, #D5F7EE 86.82%), linear-gradient(0deg, rgba(21, 82, 123, 0.1), rgba(21, 82, 123, 0.1))",
      }}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-4">
          <Image src={"/drink.svg"} width={40} height={40} alt="drink" />
          <div className="text-xs text-[#008C65] px-1 border-[1px] border-[#2DD7A7] bg-[#D5F7EE] rounded-xl">
            VOUCHER
          </div>
        </div>
        <div>
          <QRCode
            value="https://cdn.pixabay.com/photo/2014/04/03/10/40/beer-311090_640.png"
            size={85}
            level="M"
            className="h-[85px] w-[85px] p-1 rounded-xl bg-white"
          />
        </div>
      </div>
      <div className="font-[590] text-lg text-[#182435]">Free Drink</div>
      <div className="text-sui-steel-80 font-[510] text-sm">
        Show this voucher at the beverage counter to receive your free drink!
      </div>
    </div>
  );
};
