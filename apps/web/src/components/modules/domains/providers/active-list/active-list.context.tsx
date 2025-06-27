import { createContext } from "react";
interface ActiveListContext {
  domainId: string | null;
  componentId: string | null;
  setDomainId: React.Dispatch<React.SetStateAction<string | null>>;
  setComponentId: React.Dispatch<React.SetStateAction<string | null>>;
}
export const ActiveListContext = createContext<ActiveListContext>({
  domainId: null,
  componentId: null,
  setDomainId: () => null,
  setComponentId: () => null,
});
