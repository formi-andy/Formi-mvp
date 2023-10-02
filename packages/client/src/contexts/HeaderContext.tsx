"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
  useContext,
} from "react";

export interface HeaderContextProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const HeaderContext = createContext<HeaderContextProps>({
  opened: false,
  setOpened: () => {},
});

export function useHeader() {
  return useContext(HeaderContext);
}

export default function HeaderProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);

  const value = {
    opened,
    setOpened,
  };

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}
