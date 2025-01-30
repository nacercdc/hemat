/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { default as theme } from "./theme.json";
import { default as mapping } from "./mapping.json";
interface Props {
  children: React.ReactNode;
}
export default function UIKittenProvider({ children }: Props) {
  return (
    <ApplicationProvider
      {...eva}
      theme={{ ...eva.light, ...theme }}
      customMapping={mapping}
    >
      {children}
    </ApplicationProvider>
  );
}
