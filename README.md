# SewaJelas

**Know the trade-offs before you rent.** An Indonesian rental-assistant rehearsal studio prepared for a proposed Meta Global AI Developer Hackathon submission.

SewaJelas starts from a personal problem: a cheap rental can hide unreliable water, damp rooms, extra fees and unclear repair responsibilities. The long-term product helps renters compare evidence without making landlords relist their properties.

**This release is the conversation rehearsal MVP.** It does not search housing platforms, display property cards, contact landlords, negotiate, or take payments. Those capabilities are planned, not completed integrations. Hackathon eligibility and final submission requirements remain to be confirmed.

## What works now

- Mobile-friendly Indonesian chat for renter interviews and landlord roleplay.
- Explicit free pattern-based simulation and a separate Muse Spark API mode.
- Feedback, example rewrites and regeneration; eight recent active style guidelines enter the model context. This is **not fine-tuning**.
- Per-account history, saved lessons, revision checks and Markdown/JSON exports.
- Server-side provider requests, encrypted account-scoped credentials and a cap of 20 attempted API calls per user per day, resetting at midnight WIB.
- Fifteen automated tests covering actual route handlers, isolation, quotas, encryption, exports and a mocked provider contract.

**Validation boundary:** tests use an explicit Meta mock. The owner reports successful real Muse conversations; the developer regression suite uses synthetic data and has not independently repeated a live-provider call for this release. Current summaries extract quoted snippets rather than verified rental facts. See [validation](docs/VALIDATION.md).

## Try the current web app

[SewaJelas — Ruang Latihan](https://sewajelas-ruang-latihan.tamecreek.chatgpt.site) is access-restricted. It is not yet a judge-accessible public demo.

1. Sign in with an account granted access by the project owner.
2. Enter rental needs in Indonesian. Simulation works without a provider key but is deliberately limited.
3. For the real model, choose **Simulasi → Kunci API Meta → Hubungkan & uji**. Supply your authorized Meta API key through the app, never through a repository or conversation export.
4. Use **Perbaiki gaya**, provide feedback and an example, then retry. Review history and export rehearsal data.

ChatGPT sign-in supplies application identity; it does not supply Meta API credit or turn simulation into a language model. Arrange reviewer access and a funded, bounded live demo before submission.

## Meta integration

`lib/server.ts` calls `https://api.meta.ai/v1/chat/completions` with `muse-spark-1.3`, a `developer` message, bounded history, `reasoning_effort: minimal`, and a completion-token cap. Keys never enter prompts or client responses. Failures are surfaced; failed live requests do not silently become simulated answers.

Protocol reference: https://dev.meta.ai/docs/protocols/chat-completions . Actual credential access and output quality still require a live test.

## Architecture

```mermaid
flowchart TD
    UI[Responsive chat] --> Mode{Selected mode}
    Mode -->|Simulation| Demo[Local pattern engine]
    Mode -->|Muse| Gateway[Authenticated API routes]
    Gateway --> Policy[Validation and quota]
    Policy --> Meta[Meta Model API]
    Gateway --> DB[(D1 account state)]
    Policy --> Vault[Encrypted credential]
    UI --> Export[Private exports]
```

React + Vinext runs on Cloudflare Workers with D1 storage. Production depends on a trusted Sites authentication gateway. **Do not expose the Worker with client-controlled identity headers.** Other hosts need an equivalent verified authentication boundary.

## Local development

Use Node 24 for the SQLite harness and the pnpm version pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --file drizzle/0000_magenta_echo.sql
pnpm dev
```

The migration command targets a **new local database**, not an existing production database. Portable development offers a loopback-only mock sign-in; this is not production authentication. Tests and simulation need no real key. For local live tests configure an uncommitted `APP_VAULT_KEY` in the Worker environment, then enter a Meta key through the UI. Preserve the vault secret while encrypted keys must remain readable.

The original deployment identifier is removed. Bind your own project and D1 before deploying. See [operations](docs/OPERATIONS_ID.md) and [security](SECURITY.md).

## Repository guide

| Path | Purpose |
| --- | --- |
| `app/`, `lib/`, `db/`, `drizzle/` | UI, routes, prompts, schema and migration |
| `tests/` | Actual-handler harness with SQLite-backed D1 substitute |
| `docs/PRODUCT_REVIEW_ID.md` | Indonesian audit, priorities, photo-card design and Telegram roadmap |
| `docs/HACKATHON.md` | Verified information and outstanding submission gates |
| `docs/DEMO_SCRIPT.md` | Suggested demo narrative |
| `docs/EVALUATION.md` | Live test cases and results template |
| `docs/LISTING_CARD_CONTRACT.json` | Proposed card example, not implemented functionality |
| `docs/PROVENANCE.md` | Source revision and packaging changes |

## Next milestone

Interview → editable brief → source-attributed cards with up to three genuine available photos → unresolved questions. Start with authorized materials or clearly labelled fixtures. Telegram is an optional later adapter after the web journey works.

No immunity to prompt injection, property inspection guarantee, damage forecast or universal access to Meta listings is claimed. Original platform photos do not prove current property condition or image authenticity.

## Licensing

No project-wide open-source license has been selected by the owner. Existing third-party notices remain in `vendor/` and `scripts/vite/`. Repository availability does not grant rights to third-party property photos or datasets.

## Version 0.2.0

Muse mode survives reload and temporary connection failures. Live requests use every stored turn in the active session (up to 80,000 characters, with an explicit overflow error). Server-side response persistence allows recovery after a lost response without repeating a completed normal request. JSON export includes all saved sessions, counts, revision history, draft, mode and sync metadata. Message actions support copy, select and device sharing where available.

See [changelog](CHANGELOG.md), [handover](HANDOVER.md) and [validation](docs/VALIDATION.md). Committing to GitHub does not automatically publish to Sites; maintain both release steps. Credentials and private user transcripts must never be committed.
