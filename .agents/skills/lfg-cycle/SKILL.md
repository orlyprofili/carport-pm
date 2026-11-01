---
name: lfg-cycle
description: Project-agnostic issue workflow for issue create, issue check, issue fix, lfg, or rev. Covers readiness, implementation, independent review, validation, fast-forward merge, branch preservation, and closure.
---

# LFG Cycle

Read repository and user-level agent instructions first. Keep this workflow project-agnostic; discover build, test, flash, run, and monitoring procedures from local skills, scripts, and docs.

## Commands

- `issue create`: create an agent-ready tracker issue from the discussion.
- `issue check <id>`: audit and objectively repair cold-start readiness.
- `issue fix <id>`: implement, verify, and commit on the topic branch; no merge or closure.
- `lfg <id>`: run readiness through closure.
- `rev [make|peer|resp]`: use the review protocol below. Bare `rev` runs `make` then fresh `peer` review of the current scoped diff.

Accept equivalent command spellings with or without a leading slash.

## Rules

- Use one durable tracker issue per scoped deliverable; large trackers may have independently executable children.
- Readiness requires a scope that fits one LFG cycle. Otherwise stop before implementation and report the required split.
- Prefer no PR. Open one only when repository policy or the operator explicitly requires it.
- Preserve a linear graph: branch from the configured base, commit normally, and merge with `--ff-only`. No squash, rebase, merge commits, or topic-branch deletion unless explicitly required. After merge, preserve local and remote topic refs at the completion commit.
- Require a fresh independent reviewer before merge. Self-review is not a substitute.
- Resolve every in-scope finding: fix agreed findings; disputes require concrete evidence and reviewer acceptance.
- Split out work only for a validated major derailment; create its agent-ready issue before proceeding.

## Issue Readiness

`issue create`: reconstruct the problem and solution, verify repository references, self-audit as a cold agent, and create the durable tracker issue—not merely draft prose. Report URL/ID and `READY`, `NEEDS WORK`, or `BLOCKED`.

An agent-ready issue stands alone and includes:

1. Problem/scope: outcome, inclusions, exclusions.
2. Evidence/context: sourced facts, labeled hypotheses/unknowns, prior/conflicting work, relevant base branch/commit when available.
3. Code references: concrete paths, symbols, and useful line anchors.
4. Done criteria: observable pass/fail behavior.
5. Approach: ordered implementation plan.
6. Verification: exact checks and expected evidence. When done criteria depend on integration or actual use, choose a bounded check through the relevant consumer or operating path with project tools. Distinguish its proof from required operational or user acceptance it cannot establish.
7. Dependencies and prerequisites.
8. Regression surface: adjacent behavior, call sites, shared helpers, and prior fixes to re-check.

`issue check <id>`: validate these sections and code references against the current repository. Repair only objectively inferable gaps; stop for operator judgment on scope/acceptance product decisions. Report `READY`, `NEEDS WORK`, or `BLOCKED` and remaining gaps.

Resolve uncertain feasibility prerequisites with the cheapest check that could rule out the approach before expensive work: during readiness when practical, otherwise as a bounded first implementation probe. Reuse evidence that answers the question.

## Operator Verification

The agent owns verification by default. Exhaust available tools, fixtures, emulators, logs, screenshots, hardware, credentials, and reasonable-duration runs before involving the operator.

Use `Operator verification required: <reason>` only for a decisive check the agent cannot perform or would perform inefficiently: e.g. physical interaction, inaccessible hardware, or a long experiment, training job, soak, or scheduled observation better run by the operator.

First run and record the strongest practical smoke, shortened, simulated, or partial check. Provide the operator's exact full command/action, expected evidence, and pass/fail condition. Pending operator verification blocks merge and closure.

## `issue fix` Workflow

1. Read the issue and pass the readiness gate.
2. Create or switch to `<issue-id>-<short-kebab-scope>` from the configured base branch.
3. Implement only the scope. Root owns integration; delegate only disjoint work with explicit ownership.
4. Follow project skills/instructions for cheap iterative and focused pre-commit checks. Use project-enabled autofix; inspect and include intended edits.
5. Run practical additional issue-specific verification.
6. Commit in repository style; leave a clean tree containing only intended changes.
7. Report branch, commits, verification, and blockers. No merge or closure.

## Review Protocol

`rev make`: assemble the compact packet listed in the reviewer prompt below; no PR. Verification includes exact commands/results and known unrun checks.

`rev peer`: give the initial packet and prompt below to a fresh read-only reviewer.

`rev resp`: author validates every finding:

- `fixed`: agree, fix, verify, and commit;
- `disputed`: cite concrete file/line or command evidence;
- `derailment`: confirm it cannot be fixed correctly in scope, create an agent-ready issue, and stop scope expansion.

Return every response and updated packet to the same reviewer to check evidence, fixes, and delta. Author disputes are never self-resolving. Follow the prompt's follow-up rules until that reviewer returns `PASS` for the current behavior.

After three response rounds without `PASS`, stop and report an impasse for operator resolution. Never rotate reviewers to obtain a pass. Restart with a fresh reviewer only if the original is unavailable or implementation materially replaces the reviewed approach.

Reviewer prompt:

```text
Review this scoped diff as a blocking quality gate. Do not edit files.

Inputs: issue or scoped prompt, base branch, current branch, implementation summary, diff, verification summary, known unrun checks, and operator-only validation.
Validate the implementation against scope and done criteria. Check changed functions' call sites, adjacent behavior, regression risk, and whether verification matches the blast radius.
Check that assertions and assumptions reflect the intended behavior; flag passing results obtained by weakening checks, excluding relevant cases, or removing required functionality.
Report major, minor, and nit findings with concrete file/line or command evidence. Avoid generic praise and speculative follow-ups.
For a follow-up review, evaluate the author's responses and changed delta first. Reopen unchanged areas only when the response, delta, or concrete new evidence makes that necessary.
End with REVIEW STATUS: PASS or REVIEW STATUS: CHANGES REQUESTED.
```

## LFG Workflow

1. Run readiness gate. Fetch `origin` and verify the fast-forward sequence below before starting or resuming `issue fix`; stop if impossible. Create new topics from the synchronized base.
2. Fetch and recheck fast-forward eligibility before expensive validation. Run project-defined merge-boundary validation and remaining done-criteria checks before review.
3. Inspect autofixes, fix failures, and commit intended changes. Repeat only invalidated or project-required checks until validation passes.
4. Run `rev make` → `rev peer` → `rev resp`/follow-ups until `PASS` within the review-round limit. Validate review fixes under step 3 before returning to the same reviewer. No automatic full rerun after `PASS`.
5. Merge requires a clean, scoped tree, passed validation, reviewer `PASS`, no pending operator verification, and fast-forward eligibility into the configured base.
6. Recheck fast-forward eligibility after the final fetch; stop if lost. Merge and preserve both refs:

```bash
git fetch origin
git switch <base>
git merge --ff-only origin/<base>
git merge --ff-only <branch>
git push origin <base> <branch>
```

7. Comment with shipped summary, verification evidence, reviewer outcome, and merge SHA; close as completed. Close multi-phase trackers only at the final deliverable.

If merge, push, or tracker access is unavailable, leave the topic branch committed, issue open, and report exact remaining commands. Incomplete work, review, validation, or operator verification also keeps the issue open; comment with the precise reason.

## Stop Conditions

Stop rather than guess on contradictory issues, undocumented acceptance decisions, overwriting unrelated changes, unavailable independent review, review-round exhaustion without `PASS`, pending operator verification, impossible fast-forward merge, or out-of-scope derailments.
