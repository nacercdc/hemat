import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import { TextField as NWTextField } from '../../../nativewindui/components/textfield';
import {omit} from "@e-market/utilities"
import { View } from '../../presentations/view/View';
import { Text } from '../../presentations/text/Text';


type Props = Omit<ComponentPropsWithoutRef<typeof NWTextField>,"className"|"style"|"labelClassName"|"containerClassName"|"placeholderClassName" > 

export const TextField = ({...props }: Props) => {
return(
    <View>
    <NWTextField 
    containerClassName='border-transparent'
      {...omit(props as ComponentPropsWithoutRef<typeof NWTextField>, "className", "style", "labelClassName", "containerClassName", "placeholderClassName")}
    />
     {props.errorMessage && (
       <Text className="text-destructive mt-1">
         {props.errorMessage}
       </Text>
     )}
   </View>
) 
  };
    
