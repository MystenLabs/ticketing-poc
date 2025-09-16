import React, { useEffect, useState } from "react";
import { useNotifications } from "@/app/hooks/useNotifications";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { Button } from "../ui/button";
import { BellIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

export const AskPermissionSheet = () => {
  const { handleRequestNotificationPermission } = useNotifications();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadyAsked = localStorage.getItem("askedPermission");
    if (!!alreadyAsked) {
      return;
    }
    const newOpen =
      "Notification" in window && Notification.permission !== "granted";
    if (!!newOpen) {
      localStorage.setItem("askedPermission", "true");
    }
    setOpen(newOpen);
  }, ["Notification" in window, Notification.permission]);

  const handleAccept = () => {
    handleRequestNotificationPermission();
    setOpen(false);
  };

  const handleClose = () => {
    toast.success("You can enable notifications in your profile page");
    setOpen(false);
  };

  return (
    <Sheet open={open}>
      <SheetContent side="bottom" className="bg-gray-100 rounded-xl">
        <SheetHeader>
          <div className="flex items-center justify-center space-x-2">
            <BellIcon className="w-5 h-5 text-sui-greys-90" />
            <SheetTitle className="text-sui-greys-90">
              Notifications Permission
            </SheetTitle>
          </div>
          <SheetDescription className="pt-4 h-[100px]">
            We would like to send you notifications about your tickets
          </SheetDescription>
          <SheetFooter className="flex flex-row space-x-5 px-5 items-center justify-between wrap">
            <Button
              onClick={handleClose}
              className="flex-1 text-sui-steel-80 bg-gray-300 hover:bg-gray-300/60 rounded-xl px-3 py-2"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              className="text-white flex-1 rounded-xl bg-info"
              id="update-ticket-button"
              size="lg"
            >
              Allow
            </Button>{" "}
          </SheetFooter>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
