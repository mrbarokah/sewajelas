# SewaJelas handover

Current application version: **0.4.0**. Read `README.md`, `CHANGELOG.md`, `docs/VALIDATION.md`, then the source before editing.

## Product and constraints

Private Indonesian rental-agent rehearsal; approved public-web search, no direct social-platform connector or owner outreach. Keep the UI responsive and concise. Never pretend simulation responses are Muse responses. User corrections are prompt context, not model fine-tuning.

## Source map

- `app/page.tsx`: state load/save queue, selected mode, connection recovery, export UI.
- `components/message-actions.tsx`: ellipsis/long-press copy, select and share menu.
- `lib/models.ts`, `app/api/models/route.ts`: supported Standard model catalog filter; encrypted-account catalog retrieval.
- `lib/studio.ts`: schema, context policy, prompt, simulation, export manifest, version.
- `lib/server.ts`: account identity, D1, revision CAS, vault and provider protocol.
- `app/api/chat/route.ts`: canonical saved session context, successful reply persistence and recovery.
- `tests/app.test.mjs`: synthetic regression fixtures, real handlers with SQLite-backed D1 and mocked Meta.

## Continue with any coding assistant

Use this Git repository as the source of truth. Give the assistant repository access, the branch, a concrete change request and acceptance criteria. A chat without repository write access cannot commit changes. Avoid simultaneous edits to the same branch. Commit source and update this handover/changelog; do not commit transcripts, keys, account identifiers or local test fixtures.

Run `npm test`, `npm run typecheck` and the documented build. Record executed checks separately from assumptions. Use a branch/PR for concurrent or substantial work. Release tags are milestones; commits preserve every change. Application deployment is separate from committing to GitHub: there is no automatic GitHub-to-Sites deployment in this MVP.

## Data and release safety

Keep existing access permissions and account identities. Never rotate APP_VAULT_KEY casually; stored keys depend on it. Read and preserve the hosting project binding in the deployment checkout. The portable GitHub distribution intentionally has no owner's project ID. No database migration is required through 0.4.0; the optional preferredMode/revisions/replyTo fields remain compatible with state version 1.

Muse memory is the full active session, account housing profile/current goal and latest eight active style lessons. Profiles carry between sessions, but full transcripts and other accounts are not merged. At 80,000 context characters stop with an explicit message. Server state can store 30 sessions, 200 messages per session and 30 lessons, subject to the byte limit. All saved sessions are included in JSON export, not only the active session.

## Known limitations

A failed response before server persistence may still need retry. Simultaneous live requests can each incur a provider call before the revision check rejects one. Physical Android/iOS native sharing and keyboard behavior need device testing. A larger history consumes more input tokens. Test-only provider mocks do not demonstrate real Muse quality.


0.3.0 UI: top-left floating drawer contains navigation, practice disclosure and settings. Click the header model selector, then “Periksa model dari API key” to load supported models. The catalog is fetched on demand, not guessed from key text. Model choices use the existing account state CAS; no schema migration. Provider rejection does not silently choose another model. Contributor and non-chat model families are intentionally unsupported.

0.4.0: `lib/profile.ts` validates structured reply + evidence-bound updates. Chat sends one structured-output call for saved renter sessions, preserving plaintext legacy/owner requests. Manual locks/autoSave opt-out are enforced server-side; owner role cannot mutate real profile. `components/housing-profile.tsx` provides manual editing. A single current housing goal is supported, not a general multi-project planner.

`lib/search.ts` validates completed built-in search calls and HTTPS Meta-domain citation cards. `/api/search` claims an approved UUID with state CAS before billing; duplicate IDs never run twice. It sends only the approved query, not private profile/history. Success appends the reply to the latest state; failed or interrupted calls need explicit new approval. No autonomous runner, direct Marketplace access, scraping, photos, outreach or payments. Provider web_search may internally issue several queries; do not promise a single billable tool call. 30 retained jobs is a current cap.

Preserve optional profile/searches/sources/searchId fields when editing state. Never publish QA harness routes. For future task autonomy implement bounded authorization, cancellation, queues and separate social OAuth permissions before enabling actions.
