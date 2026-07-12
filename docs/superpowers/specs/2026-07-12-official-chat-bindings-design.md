# Official Chat Binding Design

## Goal

Bind every official-provider conversation to its ChatALL sidebar chat after the provider receives its first message. Returning to a sidebar chat must restore each provider's own official conversation in the right-hand panel.

## Data Model

Each ChatALL chat record receives an optional `officialChatBindings` object keyed by provider ID. A value is the exact official conversation URL created by that provider, for example `{ "deepseek": "https://chat.deepseek.com/a/chat/s/..." }`. New ChatALL chats begin without this field, so their first message is sent from the provider root page.

## Lifecycle

`EmptyModelSlots` observes `did-navigate` and `did-navigate-in-page` from every official WebView. When a provider leaves its configured root URL, the component stores that URL against the currently displayed ChatALL chat. Before switching to another sidebar chat, it snapshots existing bound URLs. After switching, it keeps the same WebView element and changes only `src`: the stored bound URL for that provider, or its root URL when the target ChatALL chat has never sent a message to it.

## Constraints

- Use provider ID as the map key so rearranging visual slots does not change the binding identity.
- Preserve existing WebView elements and provider registrations while switching chats.
- Do not send a message or create an official conversation merely by selecting a sidebar chat.
- Keep API-model behavior unchanged.

## Acceptance Criteria

- A first official-model send stores a provider-specific URL in the active ChatALL chat.
- Switching to a different sidebar chat shows its bound provider URLs, or provider root pages when unbound.
- Switching back restores the originally bound URLs without a new BrowserWindow or WebView target.
- A new sidebar chat starts unbound even though it copies the previous chat's model selection.
