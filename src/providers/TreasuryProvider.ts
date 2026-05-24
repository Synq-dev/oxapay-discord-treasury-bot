import type { ProviderBalance, ProviderPayment, PayoutResult, SwapResult } from '../types.js';
export interface TreasuryProvider{
  ensureStaticAddress():Promise<{address:string;trackId?:string;raw:unknown}>;
  getPayment(trackId:string):Promise<ProviderPayment>;
  listBalances():Promise<ProviderBalance[]>;
  swapLtcToUsdt(amountLtc:string):Promise<SwapResult>;
  payoutUsdtPolygon(amount:string,address:string):Promise<PayoutResult>;
  health():Promise<{ok:boolean;raw?:unknown}>;
}
