export class InvitationCreatedEvent {
  constructor(
    public readonly email: string,
    public readonly token: string,
    public readonly invitationId: string,
    public readonly assessmentName?: string,
    public readonly groupName?: string,
    public readonly extraData?: Record<string, any>
  ) {}
} 