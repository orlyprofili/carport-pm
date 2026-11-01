---
name: cmsg
description: Use when the user asks for cmsg, commit message, draft commit message, or cmsg and commit. Drafts or creates a repository-style git commit message from staged and unstaged changes by default.
---

# Commit Message

Draft or create a commit message from the current diff.

## Inputs

1. Inspect status, staged and unstaged diffs, untracked files that may belong to the change, and recent commits for repository style.
2. By default, include both staged and unstaged changes that form one coherent commit.
3. If the user explicitly asks for staged-only, index-only, or already-staged changes, use only the staged diff.
4. For `cmsg and commit`, stage the reviewed files included in the message, including intended untracked files. When staged-only is requested, do not stage additional changes. Do not stage unfamiliar or unrelated files.
5. If there are no changes, or the changes cannot form one coherent commit, report that instead of inventing a message or combining unrelated work.

## Style

- Follow the repository's recent commit style when clear.
- Default to Conventional Commits:

```text
type(scope): imperative summary
```

- Keep the subject at or below 72 characters when practical.
- Use a body when it explains motivation, root cause, risk, or rejected alternatives.
- Do not include `Co-Authored-By` unless explicitly requested.
- Do not include issue-closing keywords unless the user asks or the surrounding workflow requires it.

## Output

For `cmsg`, print only a fenced commit message.

For `cmsg and commit`, run `git commit` with the drafted message, then report the new commit SHA and subject.
