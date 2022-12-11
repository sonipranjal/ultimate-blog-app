import React, { createContext, useState } from "react";

export const GlobalContext = createContext<{
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  toggleLeftSidebar: boolean;
  setToggleLeftSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  openTagModal: boolean;
  setOpenTagModal: React.Dispatch<React.SetStateAction<boolean>>;
}>(null as any);

const GlobalContextProvider = ({ children }: React.PropsWithChildren) => {
  const [openModal, setOpenModal] = useState(false);
  const [toggleLeftSidebar, setToggleLeftSidebar] = useState(false);
  const [openTagModal, setOpenTagModal] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        openModal,
        setOpenModal,
        toggleLeftSidebar,
        setToggleLeftSidebar,
        openTagModal,
        setOpenTagModal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
