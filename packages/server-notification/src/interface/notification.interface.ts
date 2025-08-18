export enum Channel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
}

export interface DeliveryResult {
  vendor: string;
  externalId?: string;
  raw?: any;
}

export interface VendorAdapter<TPayload> {
  readonly name: string;
  send(payload: TPayload, meta?: Record<string, any>): Promise<DeliveryResult>;
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}
