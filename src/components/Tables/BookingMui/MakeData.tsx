export type BookingDetail = {
  bookingId: string;
  donationId: string;
  userId: string;
  slotTime: string;
  bookingTime: string; // ISO 8601 date string
  isCompleted: number;
  completionTime: string | null; // Nullable field
  transactionId: string;
  amount: number;
  donationTime: string; // ISO 8601 date string
  purposeId: number;
  referralname: string;
  referralcontact: string; 
  firstName: string;
  lastName: string;
  contact: string;
};