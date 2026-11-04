# Social provider integration plan

Current capability is public web search through the model API only. `GET /api/integrations` requires the existing account identity and reports capability state; it does not connect accounts. The capability registry is not an OAuth implementation. No direct Facebook Marketplace search or Instagram/Threads connector is enabled.

## First implementation: Threads

1. Confirm Meta App use case, application-review requirements and whether renter search is an allowed purpose; obtain official approval before enabling public accounts.
2. Implement provider-specific authorization-code flow with exact registered HTTPS redirect URI, one-use random `state` bound to signed-in SewaJelas account and short TTL, plus PKCE S256 only if documented/supported by the selected Meta flow. Never trust an account ID in callback parameters. Handle denial, expiry and replay.
3. Exchange code and refresh tokens server-side using short-lived secrets from managed runtime configuration. Never print tokens or send to AI, client, logs or exports. Store encrypted tokens per user and provider with cryptographic associated data; provide disconnect, revocation where supported, expiry and deletion.
4. Add approved Threads keyword search using documented fields and permissions, preserving user-approved query, provenance and bounded requests; return only user-authorized public content. Meta may impose access and rate restrictions. Do not claim Marketplace capability.
5. Test OAuth replay, account switching, concurrent callbacks, denied scopes, encrypted storage, disconnect, query consent, API errors, injection, URL allowlisting, data deletion and actual accounts in an authorized staging environment. Threat-model and independently review before public production.

## Other sources

Instagram professional APIs have account and permission constraints; select and review an eligible flow before implementation. Facebook Marketplace has no verified general-purpose direct search API configured in this project; pursue authorized partner access and consult Meta terms. Login itself is not search authorization. Never use credentials, cookies, scraping, or undocumented private endpoints as a shortcut.

References: https://www.postman.com/meta/threads/collection/dht3nzz/threads-api ; https://www.postman.com/meta/threads/request/34203612-b3b2c12a-7ce6-4d86-a3c6-6d31e3b66ea1 ; https://www.postman.com/meta/instagram/collection/6yqw8pt/instagram-api ; https://datatracker.ietf.org/doc/html/rfc9700 .
