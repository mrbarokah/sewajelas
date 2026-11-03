# Hackathon submission readiness

Reviewed 3 November 2026, Asia/Jakarta. Preparation checklist; not proof of submission or acceptance.

## Verified public information

The official Meta event page describes an indie track for individuals/students, emphasizing creativity, technical ambition and a working result. “Build for Your World” fits SewaJelas's firsthand rental problem. The project deadline is 4 November 2026, 9 PM ET, equivalent to **5 November 2026, 09:00 WIB**. Check for updates before upload.

Participation is limited to selected applicants; applications closed before the build deadline. Public application-selection weights are not the final project-scoring rubric. Selected participants must accept Official Rules, but the complete rules and submission form were not available in retrieved material.

Sources: https://dev.meta.ai/events/global-hackathon and https://cerebralvalley.ai/e/meta-ai-developer-hackathon (accessed 3 November 2026).

## Outstanding gates

| Requirement / evidence | Status | Next action |
| --- | --- | --- |
| Participant acceptance | Owner confirmation needed | Check acceptance and assigned track |
| Full Official Rules and waiver | Not verified | Review participant portal / organizer rules |
| Eligibility | Not certified | Page excludes several categories including “government-affiliated individuals”; obtain organizer clarification if applicable |
| Build-period / pre-existing code | Full rule unavailable | Disclose starter, AI-assisted development and actual dates |
| Final scoring weights | Not verified | Read actual portal rubric; do not invent percentages |
| Repo visibility and license rules | Not verified | Keep private until known; provide reviewer access or sanitized public source if required |
| Video format and duration | Not verified | Confirm portal fields; suggested script is not an official limit |
| Real Meta usage | Adapter implemented; evidence missing | Record full real-key session, model, usage and outcome |
| Judge-accessible demo | Current access restricted | Verify reviewer account access without exposing training records |
| Reproducibility | Source and lockfile prepared | Run clean-install CI; reused dependencies do not prove a clean install |
| Final submission | Not done | Verify portal attachments and retain receipt |

Repository publication is not hackathon submission. A provider mock or simulation recording does not prove live model use.

## Proposed submission text

**Title:** SewaJelas — Know the trade-offs before you rent.

**Problem:** Renters often discover water problems, hidden fees and unclear repair obligations after committing. Listings alone do not answer the questions that determine suitability.

**Current solution:** An Indonesian rental-conversation rehearsal studio with a Muse Spark adapter, editable style guidance, private history and portable feedback exports. A renter can test how an assistant asks questions before allowing real-world outreach.

**Technical approach:** Server-side Meta requests, developer instructions, bounded history, validated inputs, encrypted account-scoped keys and atomic quotas. Feedback changes context rather than model weights. Actual API routes have SQLite-backed tests with an explicitly mocked provider.

**Limits:** Live Meta validation and reviewer access remain pending. The release does not search platforms or send messages. Structured briefs and evidence cards are next.

**Vision:** A neutral intermediary that confirms renter needs, compares authorized evidence and prepares respectful questions while making uncertainty visible.

Update claims only after features ship and evidence exists. Do not present roadmap functionality as implemented.

## Evidence to collect

1. Real Muse connection and full session with fictional rental needs.
2. Original answer, feedback and regenerated answer with active guideline.
3. Refusal/injection scenario with exact observed response, without claiming immunity.
4. Hosted save/reload and actual JSON/MD download, checked for secrets.
5. Short recording and reviewer-accessible web link.
6. GitHub commit, checks, current/planned feature list and portal receipt.

Freeze scope to web and real-model evidence. Reserve time for access checks, recording and upload well before **5 November 2026, 09:00 WIB**.
