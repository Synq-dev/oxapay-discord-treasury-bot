export type PaymentStatus='new'|'waiting'|'paying'|'paid'|'manual_accept'|'underpaid'|'refunding'|'refunded'|'expired';
export type TreasuryStatus='DETECTED'|'PENDING'|'CONFIRMING'|'CONFIRMED'|'SWAP_QUEUED'|'SWAPPING'|'SWAPPED'|'WITHDRAW_QUEUED'|'WITHDRAWING'|'WITHDRAWN'|'FAILED'|'MANUAL_REVIEW';
export interface ProviderPayment { trackId:string; txHash:string; address:string; amountLtc:string; confirmations:number; status:PaymentStatus; raw:unknown }
export interface ProviderBalance { currency:string; balance:string; available?:string }
export interface SwapResult { orderId?:string; fromAmount:string; toAmount:string; fee?:string; raw:unknown }
export interface PayoutResult { withdrawalId?:string; txHash?:string; amount:string; fee?:string; status:string; raw:unknown }
