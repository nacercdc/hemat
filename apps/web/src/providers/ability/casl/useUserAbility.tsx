import { useAbility } from "@casl/react";

import { AbilityContext } from "./Can";

export default function useUserAbility() {
  return useAbility(AbilityContext);
}
