# Security and privacy boundaries

This rehearsal MVP is not a production security certification. Prompting alone cannot guarantee prompt-injection resistance.

- Production identity comes from the trusted Sites gateway. Other hosts must reject/replace spoofable headers and verify identity. Do not expose raw routes without this boundary.
- AES-GCM protects account-bound provider credentials. `APP_VAULT_KEY` belongs in runtime secrets. Rotation needs a plan to avoid making stored keys unreadable.
- No external tools are exposed to the model: no platform search, landlord messaging or spending. Input, context and attempted calls are bounded.
- Exports exclude keys but contain private conversations. Review/redact before any public upload.
- The 20-attempt cap is per account, not a global spending cap. Shared-key demos need global budgets and abuse controls.
- Feedback is context, not weight training. Do not turn listing text, landlord replies or OCR into developer instructions.
- Future media fetching needs SSRF protection, URL/redirect/IP restrictions, size/type limits and access rights.
- Future messaging needs specific recipient/action consent, idempotency and refusal handling outside model judgment.

Report security problems privately to the owner through an available private channel or GitHub private reporting if enabled. Do not put credentials or private transcripts in public issues. No bounty or response-time promise is made.
