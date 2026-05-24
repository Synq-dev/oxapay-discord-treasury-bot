import { env } from '../config.js';
import { OxaPayProvider } from './oxapay/OxaPayProvider.js';
import type { TreasuryProvider } from './TreasuryProvider.js';
export function createProvider():TreasuryProvider{ if(env.PROVIDER_NAME!=='oxapay') throw new Error('Only oxapay provider is implemented'); return new OxaPayProvider(); }
