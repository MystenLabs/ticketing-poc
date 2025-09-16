"use client";

import { Spinner } from "@/app/components/general/Spinner";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthPage = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    if (currentAccount?.address) {
      router.push("/");
    }
  }, [currentAccount?.address, router]);

  return <Spinner />;
};

export default AuthPage;
