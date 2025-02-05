import React from 'react'
import {Text as NWText} from "../../../nativewindui/components/text/Text"
type Props= React.ComponentProps<typeof NWText>

export const Text = (props: Props) => {
  return <NWText {...props} />
}
