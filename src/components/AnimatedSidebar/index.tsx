import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

type AnimatedSidebarProps = {
  toggleSidebar: boolean;
  onClose: () => void;
  fullScreen?: boolean;
  side?: "left" | "right";
};

const AnimatedSidebar = ({
  toggleSidebar,
  onClose,
  fullScreen = false,
  side = "left",
  children,
}: React.PropsWithChildren<AnimatedSidebarProps>) => {
  return (
    <Transition.Root show={toggleSidebar} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 z-50">
          <Transition.Child
            enter="transition duration-1000"
            enterFrom={
              side === "left" ? "-translate-x-full" : "translate-x-full"
            }
            enterTo="translate-x-0"
            leave="transition duration-1000"
            leaveFrom="translate-x-0"
            leaveTo={side === "left" ? "-translate-x-full" : "translate-x-full"}
          >
            <Dialog.Panel
              className={`relative ${
                fullScreen ? "h-screen w-screen" : "h-full w-full"
              }`}
            >
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-100 bg-opacity-10" />
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default AnimatedSidebar;
