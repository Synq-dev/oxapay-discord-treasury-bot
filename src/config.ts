import 'dotenv/config';
import { z } from 'zod';
const bool=(v:string|undefined,d:boolean)=>v===undefined?d:['1','true','yes','on'].includes(v.toLowerCase());
const csv=(v:string|undefined)=>v? v.split(',').map(x=>x.trim()).filter(Boolean):[];
const schema=z.object({
  DISCORD_BOT_TOKEN:z.string().min(1), DISCORD_OWNER_ID:z.string().min(1), DISCORD_ADMIN_IDS:z.string().optional(),
  PUBLIC_BASE_URL:z.string().url(), PORT:z.coerce.number().default(8080), DATABASE_URL:z.string().min(1), REDIS_URL:z.string().min(1),
  PROVIDER_NAME:z.string().default('oxapay'), OXAPAY_MERCHANT_API_KEY:z.string().min(1), OXAPAY_GENERAL_API_KEY:z.string().optional().default(''), OXAPAY_PAYOUT_API_KEY:z.string().optional().default(''),
  LTC_STATIC_ADDRESS:z.string().optional().default(''), LTC_CONFIRMATIONS_REQUIRED:z.coerce.number().int().positive().default(6),
  MIN_PROCESS_LTC:z.string().default('0.001'), MAX_AUTO_PROCESS_LTC:z.string().default('5'), MANUAL_REVIEW_LTC:z.string().default('1'),
  AUTO_SWAP_ENABLED:z.string().optional(), AUTO_WITHDRAW_ENABLED:z.string().optional(), DIRECT_PAYOUT_ENABLED:z.string().optional(), DRY_RUN:z.string().optional(), EMERGENCY_STOP:z.string().optional(),
  USDT_POLYGON_WITHDRAW_ADDRESS:z.string().min(42).max(42), USDT_POLYGON_ALLOWLIST:z.string().min(42), LOG_LEVEL:z.string().default('info')
});
const parsed=schema.parse(process.env);
export const env={...parsed, ADMIN_IDS:[parsed.DISCORD_OWNER_ID,...csv(parsed.DISCORD_ADMIN_IDS)], AUTO_SWAP_ENABLED:bool(parsed.AUTO_SWAP_ENABLED,true), AUTO_WITHDRAW_ENABLED:bool(parsed.AUTO_WITHDRAW_ENABLED,true), DIRECT_PAYOUT_ENABLED:bool(parsed.DIRECT_PAYOUT_ENABLED,true), DRY_RUN:bool(parsed.DRY_RUN,true), EMERGENCY_STOP:bool(parsed.EMERGENCY_STOP,false), CALLBACK_URL:`${parsed.PUBLIC_BASE_URL.replace(/\/$/,'')}/webhooks/oxapay`, ALLOWLIST:csv(parsed.USDT_POLYGON_ALLOWLIST).map(x=>x.toLowerCase())};
