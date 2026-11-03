# SewaJelas handover

Current application version: **0.2.0**. Read `README.md`, `CHANGELOG.md`, `docs/VALIDATION.md`, then the source before editing.

## Product and constraints

Private Indonesian rental-agent rehearsal; no actual listing search or owner outreach. Keep the UI responsive and concise. Never pretend simulation responses are Muse responses. User corrections are prompt context, not model fine-tuning.

## Source map

- `app/page.tsx`: state load/save queue, selected mode, connection recovery, export UI.
- `components/message-actions.tsx`: copy, select, share menu.
- `lib/studio.ts`: schema, context policy, prompt, simulation, export manifest, version.
- `lib/server.ts`: account identity, D1, revision CAS, vault and provider protocol.
- `app/api/chat/route.ts`: canonical saved session context, successful reply persistence and recovery.
- `tests/app.test.mjs`: synthetic regression fixtures, real handlers with SQLite-backed D1 and mocked Meta.

## Continue with any coding assistant

Use this Git repository as the source of truth. Give the assistant repository access, the branch, a concrete change request and acceptance criteria. A chat without repository write access cannot commit changes. Avoid simultaneous edits to the same branch. Commit source and update this handover/changelog; do not commit transcripts, keys, account identifiers or local test fixtures.

Run `npm test`, `npm run typecheck` and the documented build. Record executed checks separately from assumptions. Use a branch/PR for concurrent or substantial work. Release tags are milestones; commits preserve every change. Application deployment is separate from committing to GitHub: there is no automatic GitHub-to-Sites deployment in this MVP.

## Data and release safety

Keep existing access permissions and account identities. Never rotate APP_VAULT_KEY casually; stored keys depend on it. Read and preserve the hosting project binding in the deployment checkout. The portable GitHub distribution intentionally has no owner's project ID. No schema migration is required for 0.2.0; the optional preferredMode/revisions/replyTo fields remain compatible with state version 1.

Muse memory is the full active session plus the latest eight active style lessons; it is not automatic recall across separate sessions or accounts. At 80,000 context characters stop with an explicit message. Server state can store 30 sessions, 200 messages per session and 30 lessons, subject to the byte limit. All saved sessions are included in JSON export, not only the active session.

## Known limitations

A failed response before server persistence may still need retry. Simultaneous live requests can each incur a provider call before the revision check rejects one. Physical Android/iOS native sharing and keyboard behavior need device testing. A larger history consumes more input tokens. Test-only provider mocks do not demonstrate real Muse quality.
