# Validation — 3 November 2026 (WIB)

## Release 0.4.0 — persistent profile and supervised search

- Executed: 22 route/helper tests. New coverage: evidence-bound profile extraction, manual locks, auto-save opt-out, owner exclusion, profile injection across sessions, actual-tool/citation validation, search approval/auth/origin checks, no private-profile disclosure to search, durable idempotency, failed-search audit, and JSON inclusion.
- Executed in Cloud Chrome, synthetic 390×844 harness: profile editor, manual save/automatic lock, floating navigation, query review, explicit approval and source-card rendering. The harness never called the real provider or social sites and is removed before release.
- TypeScript and production build are release gates. Real-key structured output and web_search access/quality remain to be tested by the owner through the app; this is not a claim of an end-to-end live Meta search. Physical Android/iOS touch and native sharing remain untested.
- Current goal status is bookkeeping, not a scheduler. Direct Meta social API connectors, all-Marketplace coverage, three listing images, outbound contact, and autonomous production execution are not shipped.
- Provider output and source content remain untrusted. Schema validation and evidence checks reduce mistakes but do not prove immunity to prompt injection or semantic extraction errors.


## Release 0.3.0 — compact chat and model selection

- **Executed:** 17 route/helper tests and TypeScript. Two added cases cover credential-scoped catalog retrieval, auth/errors, filtering of unsupported/Contributor models, no generation quota use, selected model sent to provider, model preserved in revisions and exports.
- **Executed in Cloud Chrome with synthetic responses:** 390×844 responsive layout without bottom navigation or visible copy buttons; stationary 700 ms mouse hold opens the message menu; select-text view; floating drawer and settings navigation; catalog loading and choosing Muse Spark 1.2 updates the selected model. Initial header 1.3 alongside a historical 1.2 reply verifies per-message labeling.
- **Not run:** physical Android/iOS touch gestures and native share sheet; real-key catalog response or live generation with a switched model. Synthetic preview harness is removed before release.
- Design preview generated from the user's markup is a visual concept, not a production screenshot or test result.
- Official protocol reviewed: https://dev.meta.ai/docs/api-reference/models/list-models and https://dev.meta.ai/docs/protocols/chat-completions .


## Release 0.2.0 — reconnect, memory and export regression checks

- **Executed:** 15 handler/helper tests and TypeScript. Tests cover explicit mode restoration, legacy mode migration, middle-turn recall input, full export round-trip/counts/revisions, persisted replies recovered without reading the initial response, duplicate recovery without a new provider call, account isolation, provider failure and overflow before billing.
- **Executed in Cloud Chrome, 390×844 iframe:** copy/select menu layout, select-all action, copy success UI, failed-request error with mode remaining Muse, reload retaining Muse and the pending message, and history/export counts. The temporary harness used synthetic in-memory responses plus sessionStorage for reload, not production authentication or Meta. It was removed before packaging.
- **Not independently verified:** native Android/iOS sharing, clipboard contents after HTTP-preview fallback, browser download arrival (event listener timed out), and this release with a real Meta key. Export construction and JSON round-trip are tested independently of browser download delivery.
- **User-reported evidence:** Muse successfully handled several real conversations before this fix. That report is not a new live-provider test performed by the developer.
- Full history is bounded explicitly at 80,000 characters; no first/middle turns are silently omitted. There is no automatic memory merge across accounts or separate sessions.
- No database migration or vault rotation is required. Existing account state is parsed with backward-compatible optional fields.

Private MVP release. Not a production security certification. No public launch, autonomous outreach or housing eligibility decisions.

| Check | Status | Evidence / scope |
|---|---|---|
| TypeScript | EXECUTED_PASS | `tsc --noEmit` |
| Route/policy tests | EXECUTED_PASS | 15 Node tests, actual handlers with SQLite-backed D1 test wrapper |
| Build | EXECUTED_PASS | Vinext/Workers production bundle |
| Local database migration | EXECUTED_PASS | All three tables present in Wrangler local D1 |
| Unauthorized access / wrong origin | EXECUTED_PASS | 401/403 handler assertions |
| User isolation / stale write | EXECUTED_PASS | Alice/Bob isolation and revision conflict, test identities |
| Encryption / quotas | EXECUTED_PASS | Key decrypt scoped to identity, no key in status, atomic cap of 20 |
| Muse request contract | EXECUTED_PASS | Explicit provider mock, correct URL/model/token cap, saved lessons included |
| Actual Meta completion | NOT_RUN | No real API key supplied. App provides private key-entry and test flow |
| Desktop UI | EXECUTED_PASS | Cloud Chrome: input, reply, correction, retry, before/after, summary, lesson/history views |
| Mobile layout | EXECUTED_PASS | Real browser in 390x844 same-origin iframe viewport; all primary controls fit |
| Mobile native keyboard / PWA install | NOT_RUN | No physical Android/iOS test |
| Export text builder | EXECUTED_PASS | Export contains training limits and no secrets |
| Browser download arrival | NOT_RUN | Download listener timed out; no claimed verified downloaded file |
| Production authenticated save/reload | PENDING | Verify after private deployment if browser identity available |

## Fixes discovered during QA

- HTTP preview lacks secure-context `crypto.randomUUID`; IDs now use `getRandomValues` fallback.
- Darkened secondary text and corrected inline icon wrapping.
- Reset composer height after send.
- Added explicit failed-save status and unload warning.
- Simulated owner dialogue no longer asks the time again when a time was already given.

## Remaining limits

Prompt constraints reduce misuse, but do not prove immunity to prompt injection. The chat model has no external tools. The separately approved search call exposes only provider web_search; API keys never enter prompts. Test live responses adversarially before adding external tools.

The summary is a quote-based extraction from user text and can miss or select an older statement. It is explicitly labelled as a non-verified excerpt, not property verification.

The UI does not claim free Muse usage. Token accounting covers successful responses only; a provider may charge failed or incomplete responses. Request caps count attempts to bound retries.

Source is a private Site repository. The screenshot in this directory contains fictional test data only. No test key is a real credential.
