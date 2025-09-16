import React, { useState } from "react";

interface UseFlipHorizontalProps {
  isHiddenInit?: boolean;
}

export const useFlipHorizontal = ({
  isHiddenInit = true,
}: UseFlipHorizontalProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionClassName, setTransitionClassName] = useState("");
  const [isHidden, setIsHidden] = useState(isHiddenInit);

  const handleTriggerHidden = () => {
    if (isTransitioning) return;
    setTransitionClassName("show-horizontal");
    // change the image halfway the animation
    setTimeout(() => {
      setIsHidden(!isHidden);
      setTransitionClassName("hide-horizontal");
    }, 1000);
    // reset the animation
    setTimeout(() => {
      setTransitionClassName("");
    }, 2000);
  };

  return {
    isTransitioning,
    transitionClassName,
    isHidden,
    handleTriggerHidden,
  };
};
