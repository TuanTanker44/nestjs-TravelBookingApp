import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

export type PaymentStatus =
  | 'INITIATED'
  | 'REDIRECTED'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'REFUNDED';

export interface PaymentSessionInput {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  returnUrl: string;
}

export interface PaymentSessionRecord extends PaymentSessionInput {
  id: string;
  status: PaymentStatus;
  redirectUrl: string;
  transactionId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface PaymentResult {
  payment: PaymentSessionRecord;
  redirectUrl?: string;
}

let paymentSequence = 0;

const createPaymentId = () => `payment-${++paymentSequence}`;

@Injectable()
export class PaymentServiceService {
  private readonly payments = new Map<string, PaymentSessionRecord>();

  createPaymentSession(input: PaymentSessionInput): PaymentResult {
    if (input.amount <= 0) {
      throw new BadRequestException('amount must be greater than 0');
    }

    const now = new Date().toISOString();
    const id = createPaymentId();
    const redirectUrl = `https://payments.example.com/checkout/${id}`;

    const payment: PaymentSessionRecord = {
      id,
      ...input,
      status: 'REDIRECTED',
      redirectUrl,
      createdAt: now,
      updatedAt: now,
    };

    this.payments.set(id, payment);

    return {
      payment,
      redirectUrl,
    };
  }

  getPayment(id: string): PaymentSessionRecord {
    const payment = this.payments.get(id);

    if (!payment) {
      throw new NotFoundException('Payment session not found');
    }

    return payment;
  }

  confirmPayment(id: string, transactionId: string): PaymentSessionRecord {
    const payment = this.getPayment(id);

    payment.status = 'SUCCEEDED';
    payment.transactionId = transactionId;
    payment.paidAt = new Date().toISOString();
    payment.updatedAt = payment.paidAt;

    return payment;
  }

  failPayment(id: string, failureReason: string): PaymentSessionRecord {
    const payment = this.getPayment(id);

    payment.status = 'FAILED';
    payment.failureReason = failureReason;
    payment.updatedAt = new Date().toISOString();

    return payment;
  }

  refundPayment(id: string, reason: string): PaymentSessionRecord {
    const payment = this.getPayment(id);

    payment.status = 'REFUNDED';
    payment.failureReason = reason;
    payment.updatedAt = new Date().toISOString();

    return payment;
  }
}
