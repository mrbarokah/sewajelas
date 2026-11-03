# Changelog

## 0.4.4 — 2026-11-03

- Move supervised public-web search into the existing conversation: user requests search, reviews the exact query in chat, and types yes or cancel. No search runs before explicit consent.
- Persist proposed query and require matching final approval in account-scoped session state; keep search audit, source validation and existing account boundaries.
- Remove the separate search button and fix the outdated assistant prompt. Automated tests use a mock provider; live search still needs verification.

## 0.4.3 — 2026-11-03

- Accept fenced JSON and independently validate profile updates when optional fields are absent or malformed, while retaining evidence checks and manual locks.
- Report whether an explicit profile save actually changed state instead of trusting the model claim. Unreadable responses still show an error; live-provider validation is pending.

## 0.4.2 — 2026-11-03

- Remove the application-imposed 20 daily attempt cap while retaining daily usage accounting. Provider limits and costs remain applicable.
- Update settings, handover and the regression test for more than 20 attempts.

## 0.4.1 — 2026-11-03

- Allow explicit requests to save a completed renter interview to use evidence from earlier user messages in the same session, while keeping manual locks and excluding assistant messages.
- Add a regression test and a portable agent handover. Live provider verification remains outstanding.

## 0.4.0 — 2026-11-03

- Persist an editable housing profile and current goal across chat sessions. Extract changes from the latest renter message alongside the reply in one structured-output call. Preserve evidence, manual locks and opt-out; exclude owner roleplay.
- Add a supervised public-web search approval sheet and citation source cards. Use Meta Responses web_search only after explicit approval; record jobs before calling the provider and never silently repeat an approval ID.
- Include profiles, goals, search approvals and sources in exports. Keep live-mode restore, canonical session history and private account boundaries.
- Add five regression cases (22 tests total). Document limited public-web coverage, actual API costs and deferred autonomous production tasks.
- Includes the compact navigation/model-selection work from 0.3.0 in the same hosted release.

## 0.3.0 — 2026-11-03

- Replace chat branding with the complete selected model name; remove user-name labels and repeated assistant branding from bubbles.
- Move bottom navigation and rehearsal disclosure into an accessible floating upper-left drawer.
- Keep copy/select/share inside the ellipsis menu, also opened by a stationary 550 ms press. Movement cancels the gesture.
- Read the Meta model catalog using the encrypted account key; offer supported Standard Muse Spark 1.1, 1.2 and 1.3 models returned by the catalog. No generation is made when reading the catalog.
- Persist the selected model and record model identity on new answers, revisions and JSON export. Legacy live replies were generated with the fixed 1.3 adapter and retain that label.
- Add catalog isolation/filtering and selected-model propagation tests (17 tests total).

## 0.2.0 — 2026-11-03

- Restore the account's selected Muse/simulation mode after reload. Temporary connection errors never select simulation automatically; checking a stored connection does not consume a provider call.
- Send the full saved session to Muse in order. Removed first-four/last-sixteen truncation that could drop budget periods and room counts. Reject sessions over 80,000 context characters explicitly instead of silently discarding turns.
- Read live context from the account's server-side session. Save successful replies before returning them; repeated recovery requests reuse an already saved answer. Stale multi-tab writes remain protected by revision checks.
- Export every session in the snapshot with message/lesson/revision counts, timestamp, storage revision, sync status, prompt version, mode and unsent composer draft. Preserve subsequent answer revisions. Keys and credentials are excluded.
- Add Salin and an accessible message menu for selecting text and sharing where the browser supports Web Share. Native text selection remains available.
- Raise per-session storage from 60 to 200 messages; add a 1.9 MB serialized state limit with explicit error. Do not silently truncate provider responses.
- Add five regression tests, bringing the suite to 15.

Older intermediate regenerated answers that were never stored cannot be reconstructed. The quote-based brief remains an approximation; the full transcript is authoritative.

## 0.1.0 — 2026-11-03

Initial private rehearsal MVP: Muse adapter, encrypted per-account credentials, style lessons, simulation, revision-based storage, exports and daily request limits.
