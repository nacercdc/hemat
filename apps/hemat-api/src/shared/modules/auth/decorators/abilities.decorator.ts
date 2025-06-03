import { SetMetadata } from '@nestjs/common';
import { AbilityParams } from '../../../types';
import { ABILITIES } from '../../../constants';

export const Abilities = (params: AbilityParams) =>
  SetMetadata(ABILITIES, params);
