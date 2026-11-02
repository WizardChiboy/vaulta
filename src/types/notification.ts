/** Filter chips on Notifications (15) group these; savings and insights only show under All. */
export type NotificationCategory = 'transactions' | 'security' | 'savings' | 'insights' | 'offers';

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  message: string;
  /** ISO 8601 date-time. */
  createdAt: string;
  read: boolean;
  /** Opens this transaction's details when tapped. */
  transactionId?: string | undefined;
};
