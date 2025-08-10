import { VendorAdapter } from '../interface/notification.interface';

export type ChannelStrategy =
  | 'priority'
  | 'round_robin'
  | 'by_country'
  | 'custom';

export interface ChannelAdapterConfig<TPayload> {
  adapter: VendorAdapter<TPayload>;
  priority?: number; // lower = preferred
  countries?: string[];
}

export interface ChannelPolicy<TPayload> {
  strategy: ChannelStrategy;
  adapters: ChannelAdapterConfig<TPayload>[];
  maxAttempts?: number; // default 3
  pickAdapter?: (ctx: {
    payload: TPayload;
    tenantId?: string;
    attempts: number;
    history: string[];
  }) => VendorAdapter<TPayload>;
}
