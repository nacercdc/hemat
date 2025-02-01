/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import {
  defaultEvaConfig,
  UKApplicationProvider,
} from "@e-market/rn-ui-components";
import { default as theme } from "./theme.json";
import { default as mapping } from "./mapping.json";
interface Props {
  children: React.ReactNode;
}
export default function UIKittenProvider({ children }: Props) {
  return (
    <UKApplicationProvider
      {...defaultEvaConfig}
      theme={{ ...defaultEvaConfig.light, ...theme }}
      customMapping={mapping}
    >
      {children}
    </UKApplicationProvider>
  );
}
