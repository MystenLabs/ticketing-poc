import { ImagesGrid } from "./ImagesGrid";
import Image from "next/image";
import { useDAppKit, useWallets } from "@mysten/dapp-kit-react";
import { isEnokiWallet, AuthProvider, getWalletMetadata } from "@mysten/enoki";
import type { UiWallet } from "@mysten/dapp-kit-react";
import Link from "next/link";

export const SignIn = () => {
  const dAppKit = useDAppKit();

  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = wallets.reduce(
    (map, wallet) => {
      const provider = getWalletMetadata(wallet)?.provider;
      if (provider) {
        map.set(provider, wallet);
      }
      return map;
    },
    new Map<AuthProvider, UiWallet>(),
  );

  const googleWallet = walletsByProvider.get("google");

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="z-[1]">
        <ImagesGrid />
      </div>
      <div className="flex flex-col flex-1 mt-[-30vh] pt-[30vh] z-[10] relative pb-10 px-5 items-center justify-between space-y-3 bg-gradient-to-t via-white from-white">
        <div className="flex flex-col space-y-2 items-center px-3">
          <div className="text-info font-[590] text-sm">WELCOME TO</div>
          <div className="font-semibold text-2xl">Tickets are Us</div>
          <div className="text-gray-500 text-center text-sm">
            Discover concerts, games, and shows near you—or in any city. Pick
            your seats, pay in seconds, and your tickets live on your phone.
          </div>
        </div>
        <div className="flex space-x-1 items-center pt-5 pb-5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        <Link
          href="#"
          onClick={async (e) => {
            e.preventDefault();
            if (googleWallet) {
              await dAppKit.connectWallet({ wallet: googleWallet });
            }
          }}
          className="flex items-center justify-center space-x-2 w-full max-w-[500px] px-4 py-2 bg-white text-center text-sui-steel-80 border border-sui-steel-40 rounded-lg"
        >
          <Image src={"/google-icon.svg"} alt="Google" width={20} height={20} />
          <div className="text-center">Sign In with Google</div>
        </Link>
      </div>
    </div>
  );
};
