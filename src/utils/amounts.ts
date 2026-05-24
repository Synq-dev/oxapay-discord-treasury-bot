import Decimal from 'decimal.js';
export const D=(v:string|number|Decimal)=>new Decimal(v);
export const gte=(a:string,b:string)=>D(a).gte(D(b));
export const lte=(a:string,b:string)=>D(a).lte(D(b));
export const fmt=(v:string|number|Decimal,dp=8)=>D(v).toFixed(dp);
