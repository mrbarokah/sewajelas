# Validation — 3 November 2026 (WIB)

## GitHub package verification

On 3 November 2026, all 10 existing route/policy tests were rerun successfully and TypeScript passed on the unchanged application source. The sanitized export also completed a portable-profile production build. This build reused the installed dependencies through a temporary local symlink; it was not a clean dependency installation. The GitHub Actions run for source commit `37d31f989aed3cdccbc60a5cb43a07e5bbbf5bd7` subsequently passed a clean dependency install, TypeScript, all 10 tests and the production build: https://github.com/mrbarokah/sewajelas/actions/runs/41581638923 . This verifies source reproducibility in GitHub's Ubuntu runner; it does not prove live Meta behavior. Live Meta requests, hosted account persistence, and actual browser download arrival remain unverified.

The build emitted a Vinext static-route classification notice; compilation completed successfully. The dependency symlink and generated output are excluded from the distribution.

Private MVP release. Not a production security certification. No public launch, autonomous outreach or housing eligibility decisions.

| Check | Status | Evidence / scope |
|---|---|---|
| TypeScript | EXECUTED_PASS | `tsc --noEmit` |
| Route/policy tests | EXECUTED_PASS | 10 Node tests, actual handlers with SQLite-backed D1 test wrapper |
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

Prompt constraints reduce misuse, but do not prove immunity to prompt injection. No external tool is exposed to the model, and API keys never enter its prompt. Test live responses adversarially before adding external tools.

The summary is a quote-based extraction from user text and can miss or select an older statement. It is explicitly labelled as a non-verified excerpt, not property verification.

The UI does not claim free Muse usage. Token accounting covers successful responses only; a provider may charge failed or incomplete responses. Request caps count attempts to bound retries.

Source originated from a private Site repository. The browser QA screenshot is excluded from this distribution. No test key is a real credential.
