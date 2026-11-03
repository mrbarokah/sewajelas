# Changelog

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
