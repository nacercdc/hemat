import React from 'react'
import type { TextProps} from "../../../nativewindui/components/text/Text";
import {Text as NWText} from "../../../nativewindui/components/text/Text"
type Props= TextProps
export const Text = (props: Props) => {
  return <NWText {...props} />
}
