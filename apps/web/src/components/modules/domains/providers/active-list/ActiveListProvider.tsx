import React, { useState } from "react";
import { ActiveListContext } from "./active-list.context";
interface Props {
  children: React.ReactNode;
}
export default function ActiveListProvider({ children }: Props) {
  const [domainId, setDomainId] = useState<string | null>(null);
  const [componentId, setComponentId] = useState<string | null>(null);
  const [subComponentId, setSubComponentId] = useState<string | null>(null);

  return (
    <ActiveListContext.Provider
      value={{
        domainId,
        componentId,
        subComponentId,
        setDomainId,
        setComponentId,
        setSubComponentId,
      }}
    >
      {children}
    </ActiveListContext.Provider>
  );
}
