# chat_all README Design

## Goal

Replace inherited ChatALL README content with concise, accurate documentation for
the `chat_all` desktop application in every supported README language.

## Scope

- Use `chat_all` as the public product and repository name.
- Keep the existing language selector, logo, screenshot, and the final sponsor
  heading in each README.
- Remove inherited static provider tables, vendor-specific installation channels,
  upstream contributor material, and sponsor copy.
- Describe capabilities implemented in this repository: official web login for
  supported providers, API and OpenAI-compatible endpoints, one-to-six panel
  comparisons, prompt enhancement, text-file context, image generation, quick
  summaries, and consensus/difference analysis.
- State that chats, settings, and credentials remain local and that users need
  a supported account or API key plus network access.
- Provide current development and packaging commands from `package.json`.

## Content Structure

Each README uses the same structure in its own language:

1. Product name and concise purpose.
2. Screenshot.
3. Current capabilities.
4. Requirements and privacy.
5. Development and build commands.
6. Repository issue link and the retained empty sponsor heading.

## Constraints

- Do not claim support for a provider unless the current bot registry exposes
  it; avoid a static provider matrix that becomes stale quickly.
- Do not change application code, package metadata, or build configuration in
  this documentation pass.
- Preserve upstream license files; this README rewrite is not a license change.

## Verification

- Confirm every README uses `chat_all`, retains a language selector and its
  final sponsor heading, and contains no `ai-shifu/ChatALL` reference.
- Run `git diff --check` after normalizing the Korean README's CRLF line endings
  to its tracked format.
