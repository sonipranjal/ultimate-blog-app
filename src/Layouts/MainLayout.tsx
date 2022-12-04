import { useRouter } from "next/router";
import React from "react";
import Header from "../components/Header";

import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Header />
      <div className="grid w-full grid-cols-12">
        {children}
        {router.pathname === "/" && <Sidebar />}
      </div>
    </div>
  );
};

export default MainLayout;
