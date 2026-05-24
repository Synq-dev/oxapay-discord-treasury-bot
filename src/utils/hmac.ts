import crypto from 'node:crypto';
export function verifyOxaPayHmac(raw:Buffer, secret:string, received:string|undefined):boolean{ if(!received) return false; const digest=crypto.createHmac('sha512',secret).update(raw).digest('hex'); return crypto.timingSafeEqual(Buffer.from(digest),Buffer.from(received)); }
