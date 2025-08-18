import { VendorAdapter } from '../interface/notification.interface';
import { ChannelPolicy } from './channel-policy';

export class ChannelRouter<TPayload> {
  private rrIndex = 0;

  constructor(private readonly policy: ChannelPolicy<TPayload>) {}

  nextAdapter(ctx: {
    payload: TPayload;
    tenantId?: string;
    attempts: number;
    history: string[];
  }): VendorAdapter<TPayload> {
    const { strategy, adapters, pickAdapter } = this.policy;

    if (pickAdapter) return pickAdapter(ctx);

    switch (strategy) {
      case 'priority': {
        const sorted = [...adapters].sort(
          (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
        );
        const next = sorted.find((a) => !ctx.history.includes(a.adapter.name));
        if (!next) throw new Error('No remaining adapters');
        return next.adapter;
      }
      case 'round_robin': {
        const eligible = adapters.map((a) => a.adapter);
        const start = this.rrIndex++ % eligible.length;
        for (let i = 0; i < eligible.length; i++) {
          const candidate = eligible[(start + i) % eligible.length];
          if (!ctx.history.includes(candidate.name)) return candidate;
        }
        throw new Error('No remaining adapters');
      }
      case 'by_country': {
        const country = (ctx as any).payload?.countryCode;
        const inCountry = adapters.filter((a) =>
          a.countries?.includes(country),
        );
        const pool = (inCountry.length ? inCountry : adapters)
          .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
          .map((a) => a.adapter)
          .filter((a) => !ctx.history.includes(a.name));
        if (!pool.length) throw new Error('No remaining adapters');
        return pool[0];
      }
      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  }

  maxAttempts(): number {
    return this.policy.maxAttempts ?? 3;
  }
}
