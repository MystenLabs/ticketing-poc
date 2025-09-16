import React from "react";
import { Button, ButtonProps } from "../ui/button";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
}

// Custom spinner component compatible with React 19
const Spinner = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="animate-spin"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeOpacity="0.25"
      strokeWidth="2"
    />
    <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z" />
  </svg>
);

export const LoadingButton = ({
  isLoading,
  disabled,
  children,
  className,
  size,
  ...rest
}: LoadingButtonProps) => {
  const dim = size === "sm" ? 15 : size === "lg" ? 20 : 18;
  return (
    <Button
      disabled={isLoading || !!disabled}
      className={`${className} flex items-center space-x-2`}
      size={size}
      {...rest}
    >
      {isLoading && <Spinner size={dim} />}
      <span>{children}</span>
    </Button>
  );
};
