# 0.6.5

- Contoh kueri berfokus pada jenis hunian dan lokasi singkat; konteks kebutuhan tetap terpisah untuk penilaian. Instruksi meminta Meta memprioritaskan threads.com dan tidak memperpanjang kata kunci. Meta menentukan kueri aktual.
- Tambahkan akses jalan/mobil, transportasi, patokan dan mutu foto yang benar-benar tersedia ke panduan analisis listing.

# 0.6.4

- Kenali permintaan dengan kata “keywords” dan persetujuan “lanjutkan cari dulu”.
- Tampilkan kueri aktual hanya bila Meta mengembalikannya, serta hitungan kandidat dan hasil terpilih. Bukan integrasi langsung platform.

# 0.6.3

- Tampilkan waktu sejak pencarian dimulai dan durasi pencarian yang selesai. Status yang belum pasti dan pemeriksaan yang berhenti ditampilkan secara terpisah; waktu berlalu bukan bukti Meta masih memproses.
- Login Facebook, Instagram, dan Threads masih belum tersedia.

# 0.6.2

- Tambah jurnal aktivitas server per akun untuk sebagian peristiwa pencarian dan analisis, serta ekspor 200 peristiwa terbaru dari Riwayat. Jurnal ikut terhapus saat penghapusan data akun.
- Belum mencakup seluruh peristiwa keamanan, penyimpanan immutable, retensi, atau sertifikasi. Lihat docs/AUDIT_READINESS.md.
- Integrasi sosial langsung dan pembacaan penuh tautan belum aktif.

# 0.6.1

- Simpan dan tampilkan cuplikan hasil pencarian yang disediakan Meta; pengguna dapat meminta analisis cuplikan terhadap profil dengan biaya API. Cuplikan tidak dianggap isi lengkap atau bukti terverifikasi.
- Integrasi sosial langsung, pembacaan penuh halaman, dan audit log server terpisah belum tersedia.

# Changelog

## 0.6.0 — 2026-11-04

- Add user-initiated screenshot or text listing analysis with profile context, evidence labels, unknowns and owner questions. Images are not stored in the app; results are saved in chat.
- Meta is called only upon sending the analysis request; no link scraping or outreach. Provider vision capability remains unverified on the owner's live account.

## 0.5.3 — 2026-11-04

- Add privacy, terms and data-deletion information and an authenticated, explicitly confirmed in-app deletion of account data. Deletion does not remove external provider copies or exports.
- Legal pages inherit the Site's access controls; public availability for external review must be configured separately.

## 0.5.2 — 2026-11-04

- Limit results to five individual public posts with title/snippet evidence of housing and the approved area; omit results without sufficient evidence. Price and availability remain unverified.
- Add an explicit capability registry for future social connectors. No direct platform authorization is configured; Threads, Instagram and Marketplace coverage is not guaranteed.

## 0.5.1 — 2026-11-04

- Default the renter experience to live Muse and remove practice entry points from the main flow. Existing session history is preserved.
- Request Meta web-search hits and display allowed-domain hits without citations as unverified search results, separate from cited answers. No direct social-platform integration is provided.
- Real-world platform coverage and search quality remain subject to live testing and provider access.

## 0.5.0 — 2026-11-04

- Propose short example keywords separately from comparison criteria before approval. Muse chooses actual provider queries; direct Marketplace filters remain unavailable.
- Show expandable observed search stages, without claiming access to private reasoning. Repair search-intent handoff and correct export version.
- Search is still one approved Meta request; the provider may run multiple searches. Live provider behavior requires user verification.

## 0.4.9 — 2026-11-04

- Distinguish Meta incomplete, failed, and cancelled responses with safe reason-specific messages; recheck a prior failure without submitting another search.
- Increase the output-token allowance to 4096 and use low reasoning effort for search; the actual cause of the reported failure remains unconfirmed pending live diagnostics. More generated tokens can cost more.

## 0.4.8 — 2026-11-03

- Recover interrupted search approvals without mistaking an uncertain older request for a new approval. A new search still requires explicit consent; uncertain requests are retained.
- Accept nullable optional provider response fields and refine natural-language search queries. Source cards still require provider citations.
- Search failures remain under investigation; live Meta search has not been independently verified with the user's key.

## 0.4.7 — 2026-11-03

- Construct reviewable search keywords from profile fields without appending generic user instructions, retaining additional user-specified terms.
- Add editable work location to profile and include it in approved search context; route distance is not calculated or invented.
- Search remains a reported unresolved live issue. No successful live Meta search is claimed.

## 0.4.6 — 2026-11-03

- Submit approved search to Meta Responses in background, persist its response ID and poll via short authenticated requests. Recover known running jobs after reload and prevent repeat submissions for the same approval. Unknown submission state is not silently retried.
- Show daily recorded input/output token use and optional current per-minute team/model token limit from response headers. Remaining credit is not inferred.
- Add synthetic tests for recovery, account isolation, idempotency, uncertain submissions and rate headers. Live Meta search remains unverified.

## 0.4.5 — 2026-11-03

- Add Setuju, lanjutkan and Batal buttons to the chat search proposal. Record the selection as a chat message and require the existing server-side approval check before searching.
- Keep the proposal available when a key is not connected; disable repeat clicks while saving. Existing proposals and typed responses remain compatible.

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
