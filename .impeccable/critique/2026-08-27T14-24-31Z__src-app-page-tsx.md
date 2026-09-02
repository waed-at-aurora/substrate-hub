---
target: src/app/page.tsx
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-27T14-24-31Z
slug: src-app-page-tsx
---
Method: dual-agent (A: DesignAssessment · B: EvidenceAssessment)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3/4 | Copy reports `copied` or `selected`, but `selected` does not explain the remaining manual-copy step. |
| 2 | Match System / Real World | 3/4 | Audience-fit language overall; `EOS`, `composites`, and `primitives` remain unexplained for first-time visitors. |
| 3 | User Control and Freedom | 3/4 | Direct install and patterns routes exist, but the primary component-browsing job has no direct route. |
| 4 | Consistency and Standards | 4/4 | Exceptionally cohesive type, color, focus, action, motion, and responsive rules. |
| 5 | Error Prevention | 3/4 | Clipboard fallback preserves the command; the vague primary CTA can still send users down the wrong path. |
| 6 | Recognition Rather Than Recall | 3/4 | Install, patterns, command, version, and inventory are visible; users must infer what “Enter the hub” contains. |
| 7 | Flexibility and Efficiency | n/a | Not meaningful for this short Persuade surface. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Distinct and disciplined; mobile over-allocates space to atmosphere before utility. |
| 9 | Error Recovery | 2/4 | Fallback selection works but gives no actionable recovery instruction. |
| 10 | Help and Documentation | n/a | This front door routes into the documentation rather than containing it. |
| **Total** |  | **24/32** | **Good — strong foundation, material task-routing gaps** |

## Design Specificity Verdict

**LLM assessment:** Strongly authored for Substrate. The near-black drafting grid, monumental variable-weight wordmark, offset ghost, pointer lamp, star burst, technical dateline, rationed yellow, and cyan coordinate readout form a coherent identity that an unrelated product could not adopt unchanged. The weakness is functional specificity: the surface communicates the “Night Portal” identity more clearly than the exact jobs Substrate Hub exists to complete.

**Deterministic scan:** `detect.mjs` scanned `src/app/page.tsx` and `src/components/landing-stage.tsx` together. Exit `0`; `0` findings; no rule names or file locations. That clean result supports the absence of common static-design anti-patterns, but it does not detect the task-routing, mobile hierarchy, or copy-recovery problems found visually.

**Visual evidence:** Assessment A inspected fresh desktop and mobile browser sessions. At 390×844, the wordmark field consumes 363px—43% of the viewport—and the primary CTA begins around y=623. The copy control renders approximately 80×30px. No reliable detector overlay is available: Assessment B’s browser failed before navigation because Chromium could not load `libnspr4.so`; a parent browser fallback also failed because the shared browser daemon was unavailable. No injection or overlay is claimed.

## Overall Impression

Memorable, technically credible, and visually controlled. The landing earns its atmosphere. Its largest opportunity is to make the dominant route as product-specific as the visual identity: today the only yellow CTA says “Enter the hub,” while “browse components”—the primary engineer job—is absent.

**Cognitive load:** Moderate, with 2/8 checklist failures. Four visible choices remain within working-memory limits, but **single focus** and **one thing at a time** fail: users must distinguish overview, guided installation, direct command installation, and patterns before understanding which route best completes their job.

**Emotional journey:** Desktop moves well from provenance → curiosity → identity peak → positioning → action → pragmatic install. Mobile inserts an overlong atmospheric pause before the useful content. Clipboard failure creates the weakest ending: the interface says `selected` when the user needs a concrete next step.

## What’s Working

1. **Ownable identity.** The lamp, revealed grid, responsive letter weight, ghost, mono dateline, and restrained accents operate as one authored system rather than disconnected effects.
2. **Real utility on the first surface.** Live package metadata, inventory counts, direct routes, and the actual CLI command make this a front door rather than a brochure.
3. **Strong implementation fundamentals.** No horizontal page overflow at 1440px or 390px; logical tab order; visible focus; semantic H1; decorative layers hidden from assistive technology; reduced-motion handling; working `/overview` handoff.

## Priority Issues

### [P1] The dominant CTA is outcome-opaque

- **What:** `Enter the hub` receives the only yellow emphasis but describes movement, not value.
- **Why it matters:** Mid-task users cannot predict whether it leads to components, setup, guidance, or status. `/overview` then repeats positioning and actions, making the root feel like an interstitial.
- **Fix:** Rename it to the destination outcome—such as `Open Substrate overview`—or promote the highest-frequency task instead.
- **Suggested command:** `/impeccable clarify`

### [P1] The primary engineer job is absent from the action IA

- **What:** The root offers overview, installation, and patterns, but no direct Components route.
- **Why it matters:** PRODUCT.md makes component lookup a primary job. The inventory has 9 composites and 49 primitives, while Forms is the only established pattern; `Explore patterns` is therefore a plausible but often wrong route.
- **Fix:** Add `Browse components`, or replace the current split with a clearly named `Components & patterns` catalog route. Keep no more than four visible decisions.
- **Suggested command:** `/impeccable shape`

### [P2] Mobile spends too much of the first screen on identity

- **What:** At 390×844, the wordmark field occupies 363px and the body begins around y=451; the primary CTA begins around y=623. The dateline occupies 78px and wraps the year onto a third line.
- **Why it matters:** Users understand the aesthetic before they understand the task. The front door’s operating value arrives too late for distracted or mid-build visitors.
- **Fix:** Reduce the mobile wordmark field, simplify the mobile dateline, and bring positioning plus the yellow CTA into the first 55–60% of the viewport.
- **Suggested command:** `/impeccable adapt`

### [P2] Copy recovery is undersized and under-explained

- **What:** The mobile copy target is approximately 80×30px. When Clipboard API access is unavailable, the command is selected and the button changes only to `selected`.
- **Why it matters:** The target misses the 44px mobile interaction floor, and the state describes what happened without telling users how to finish.
- **Fix:** Give the control a 44px minimum block size. Announce `Command selected — press Ctrl+C` or the platform-appropriate equivalent, without clearing the selection prematurely.
- **Suggested command:** `/impeccable harden`

### [P3] Mobile atmosphere crosses the utility layer

- **What:** Bright star-burst streaks traverse paragraph and action areas.
- **Why it matters:** Decorative motion competes with reading and tapping precisely where the surface should become calm and decisive.
- **Fix:** Mask the burst to the wordmark field on narrow screens or substantially reduce its opacity below the body boundary.
- **Suggested command:** `/impeccable quieter`

## Persona Red Flags

**Jordan — first-timer:** The yellow CTA is visible within five seconds, but `Enter the hub` does not preview the destination. `EOS`, `composites`, and `primitives` add translation cost before Jordan has a mental model.

**Casey — distracted mobile user:** The main buttons are 47px high and thumb-reachable, but metadata plus the 363px wordmark field delay the task. Star-burst motion crosses the action zone, the command needs horizontal inspection, and the copy target is only 30px high.

**Riley — stress tester:** Clipboard failure preserves and selects the command, but `selected` omits the next action and resets after 1.6 seconds. Riley cannot confidently tell whether the installation command is now on the clipboard.

**Maya — EOS engineer mid-build:** The install path is excellent. Component lookup is not named, so Maya must enter the overview or mistake Patterns for the composite catalog—extra navigation directly opposed to the “mid-task visitor first” principle.

**Nina — EOS designer pre-spec:** The shared-layer message establishes direction and Patterns is visible, but the root does not yet explain what products must share versus where differentiation begins. The design is trustworthy; the ownership model remains abstract.

## Minor Observations

- The cyan `LIGHT` readout obeys the live-color rule but can read as debug residue rather than useful evidence.
- The desktop install line sits close to the viewport bottom, creating risk on short wide viewports, zoom, and localization.
- The two-column mobile action grid needs a 320px/text-expansion check because both secondary labels are `nowrap`.
- The full package/version/date dateline is useful on desktop; a lone wrapped year is not worth preserving on mobile.
- Content remains factual and avoids unsupported claims.

## Questions to Consider

1. If the root exists to route colleagues, why is its dominant verb `Enter` rather than `Browse components`?
2. Can the mobile surface preserve the same authored moment without spending 43% of the viewport before the product explanation?
3. Does the root need both `Install Substrate` and the full command, or should one of those affordances buy a direct Components path?
4. Should “room to differ above it” include one concrete shared-versus-product-specific example?
