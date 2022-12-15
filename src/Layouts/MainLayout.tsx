import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { Fragment, useContext } from "react";
import AnimatedSidebar from "../components/AnimatedSidebar";
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

      <AnimatedSidebar
        onClose={() => setToggleLeftSidebar(false)}
        toggleSidebar={toggleLeftSidebar}
        fullScreen={true}
        side="left"
      >
        <div className="flex h-full w-full items-center justify-center text-white">
          hello world
        </div>
      </AnimatedSidebar>
      <FormModal openModal={openModal} closeModal={() => setOpenModal(false)} />
      <TagFormModal />
    </div>
  );
};

export default MainLayout;
