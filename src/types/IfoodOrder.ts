export interface IfoodOrder {
  _id: string;
  ifoodOrderId: string;
  eventId: string;
  rawPayload?: any;
  status: 'pending' | 'accepted' | 'rejected';
  commandId?: string | null;
  rejectionReason?: string;
  createdAt?: string;
}
