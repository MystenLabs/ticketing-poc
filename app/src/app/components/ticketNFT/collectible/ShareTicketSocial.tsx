import React from "react";
import { SocialButton } from "./SocialButton";

export const ShareTicketSocial = () => {
  return (
    <div className="flex justify-between items-center space-x-5">
      <SocialButton className="flex-1" iconSrc="/twitter.svg" alt="Twitter" />
      <SocialButton
        className="flex-1"
        iconSrc="/instagram.svg"
        alt="Instagram"
      />
      <SocialButton className="flex-1" iconSrc="/facebook.svg" alt="Facebook" />
    </div>
  );
};
