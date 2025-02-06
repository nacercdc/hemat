import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import { TextField as NWTextField } from '../../../nativewindui/components/textfield';
import {omit} from "@e-market/utilities"
import { FormContainer } from '../helpers/FormContainer';


type Props = Omit<ComponentPropsWithoutRef<typeof NWTextField>,"className"|"style"|"labelClassName"|"containerClassName"|"placeholderClassName" > 

export const TextField = ({...props }: Props) => {
return(
<FormContainer errorMessage={props.errorMessage}>
  <NWTextField 
    {...omit(props as ComponentPropsWithoutRef<typeof NWTextField>, "className", "style", "labelClassName", "containerClassName", "placeholderClassName")}
  />
</FormContainer>

) 
  };
    
