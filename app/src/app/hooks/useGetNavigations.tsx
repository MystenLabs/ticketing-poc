import {
  AvatarIcon,
  FileTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";

interface NavigationLinkProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export const useGetNavigations = () => {
  const getIcon = (src: string) => (
    <Image src={src} alt="icon" width={24} height={24} />
  );

  const navigations = React.useMemo<NavigationLinkProps[]>(() => {
    return [
      {
        title: "Home",
        href: "/",
        icon: getIcon("/navigations/star.svg"),
        activeIcon: getIcon("/navigations/blue_star.svg"),
      },
      {
        title: "Search",
        href: "/search",
        icon: getIcon("/navigations/search.svg"),
        activeIcon: getIcon("/navigations/blue_search.svg"),
      },
      {
        title: "Tickets",
        href: "/tickets",
        icon: getIcon("/tickets.svg"),
        activeIcon: getIcon("/navigations/blue_tickets.svg"),
      },
      {
        title: "Profile",
        href: "/profile",
        icon: getIcon("/navigations/user.svg"),
        activeIcon: getIcon("/navigations/blue_user.svg"),
      },
    ];
  }, []);

  return { navigations };
};
