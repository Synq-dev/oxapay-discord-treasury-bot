# OxaPay Discord Treasury Bot

Production-oriented Discord treasury bot for a managed OxaPay Litecoin static address. It detects OxaPay payment webhooks, sends Discord DM alerts, waits for confirmation-safe states, records all state in PostgreSQL, optionally swaps LTC to USDT, and creates a USDT Polygon payout to one allowlisted EVM address.

> Important architecture note: this project does **not** sweep from a self-custody Litecoin private key. OxaPay can only auto-convert funds it receives into an OxaPay-managed static address. If you configure `LTC_STATIC_ADDRESS`, startup fails unless it matches the OxaPay-managed static address. This prevents the unsafe mistake of watching one address while funds are deposited somewhere else.

## Stack

- Node.js 20 + TypeScript
- Discord.js slash commands
- PostgreSQL + Prisma
- Redis + BullMQ workers
- Express webhook/health server
- Docker Compose / PM2 support

## Safety defaults

- `DRY_RUN=true` by default. The bot will simulate swap and payout until you deliberately turn it off.
- `OXAPAY_STATIC_AUTO_WITHDRAWAL=false` by default. This avoids double-withdrawal when `DIRECT_PAYOUT_ENABLED=true`.
- Direct payouts are restricted to `USDT_POLYGON_WITHDRAW_ADDRESS` and `USDT_POLYGON_ALLOWLIST`.
- The only accepted payout network in this implementation is exactly `Polygon Network`.
- Emergency stop and `/pause` are available.
- Transaction hash and database uniqueness prevent duplicate processing.

## How the money flow works

### Recommended mode: bot-controlled payout

1. Bot creates or finds an OxaPay Litecoin static address with:
   - `network=Litecoin Network`
   - `to_currency=USDT`
   - `auto_withdrawal=0`
   - `callback_url=https://your-domain/webhooks/oxapay`
2. OxaPay sends signed payment callbacks.
3. Bot records `paying`/pending and confirmation updates.
4. Bot waits until OxaPay reports `paid` or the configured confirmation threshold is met.
5. Bot records the auto-converted USDT amount from OxaPay payment info if available; otherwise it can call the OxaPay swap API.
6. Bot calls OxaPay payout API to send USDT on `Polygon Network` to the allowlisted address.

### Alternative mode: OxaPay dashboard Address List auto-withdrawal

Set:

```env
OXAPAY_STATIC_AUTO_WITHDRAWAL=true
DIRECT_PAYOUT_ENABLED=false
```

In this mode, OxaPay handles withdrawal to the address configured in its dashboard Address List. The bot records and notifies; it does not create a second payout.

## Install on Ubuntu VPS

```bash
sudo apt update
sudo apt install -y git curl docker.io docker-compose-plugin
sudo systemctl enable --now docker

git clone <your-repo-url> oxapay-discord-treasury-bot
cd oxapay-discord-treasury-bot
cp .env.example .env
nano .env

docker compose up -d --build
```

Then check:

```bash
docker compose logs -f bot
curl http://127.0.0.1:8080/health
```

## Required `.env`

```env
DISCORD_BOT_TOKEN=
DISCORD_OWNER_ID=
DISCORD_ADMIN_IDS=
PUBLIC_BASE_URL=https://your-domain.example
DATABASE_URL=postgresql://treasury:treasury_password@postgres:5432/treasury?schema=public
REDIS_URL=redis://redis:6379
OXAPAY_MERCHANT_API_KEY=
OXAPAY_GENERAL_API_KEY=
OXAPAY_PAYOUT_API_KEY=
USDT_POLYGON_WITHDRAW_ADDRESS=0x...
USDT_POLYGON_ALLOWLIST=0x...
DRY_RUN=true
```

Run preflight before disabling dry run:

```bash
npm install
npx prisma generate
npm run preflight
```

## Discord commands

- `/status` — transaction counts, static address, dry-run state
- `/balance` — OxaPay account balances
- `/tx <hash>` — stored transaction info
- `/settings` — safety settings
- `/pause` — pause automation
- `/resume` — resume automation
- `/manual-sweep <hash>` — enqueue manual sweep for an eligible confirmed transaction
- `/health` — provider health
- `/logs` — recent audit logs

Commands are admin-only. Admins are `DISCORD_OWNER_ID` plus comma-separated `DISCORD_ADMIN_IDS`.

## Webhook setup

Your webhook endpoint is:

```text
https://your-domain.example/webhooks/oxapay
```

OxaPay must be able to reach this over public HTTPS.

## Production notes

- Keep repo private if possible.
- Never commit `.env`.
- Use OxaPay API keys with the minimum required permissions.
- Start with `DRY_RUN=true` and confirm Discord notifications first.
- Only set `DRY_RUN=false` after preflight passes and you have tested a small deposit.
