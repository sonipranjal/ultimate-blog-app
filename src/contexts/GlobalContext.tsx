import React, { createContext, useState } from "react";

export const GlobalContext = createContext<{
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}>(null as any);

const GlobalContextProvider = ({ children }: React.PropsWithChildren) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <GlobalContext.Provider value={{ openModal, setOpenModal }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
