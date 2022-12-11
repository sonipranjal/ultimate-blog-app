import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { Fragment, useContext } from "react";
import FormModal from "../components/FormModal";
import Header from "../components/Header";

import Sidebar from "../components/Sidebar";
import TagFormModal from "../components/TagModal";
import { GlobalContext } from "../contexts/GlobalContext";

const MainLayout = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();

  const { toggleLeftSidebar, setToggleLeftSidebar, openModal, setOpenModal } =
    useContext(GlobalContext);

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center`}
    >
      <Header />
      <div className="grid w-full grid-cols-12">
        {children}
        {router.pathname === "/" && <Sidebar />}
      </div>

      <Transition.Root show={toggleLeftSidebar} as={Fragment}>
        <Dialog
          as="div"
          onClose={() => setToggleLeftSidebar(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 z-50">
            <Transition.Child
              enter="transition duration-1000"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition duration-1000"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative h-screen w-screen bg-black">
                <div className="flex h-full w-full items-center justify-center">
                  <button
                    onClick={() => setToggleLeftSidebar(false)}
                    className=" text-white"
                  >
                    close this sidebar
                  </button>
                </div>
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
            <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" />
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      <FormModal openModal={openModal} closeModal={() => setOpenModal(false)} />
      <TagFormModal />
    </div>
  );
};

export default MainLayout;
