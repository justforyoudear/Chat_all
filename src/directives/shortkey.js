const bindings = new Map();

function normalize(keys) {
  return (Array.isArray(keys) ? keys : [keys])
    .map((key) => String(key).toLowerCase())
    .sort()
    .join("+");
}

function entries(value) {
  if (Array.isArray(value)) return [["", value]];
  if (typeof value === "string") return [["", [value]]];
  return Object.entries(value || {});
}

function unregister(el) {
  for (const [key, listeners] of bindings) {
    const remaining = listeners.filter((listener) => listener.el !== el);
    if (remaining.length) bindings.set(key, remaining);
    else bindings.delete(key);
  }
}

function register(el, value) {
  unregister(el);
  for (const [name, keys] of entries(value)) {
    const key = normalize(keys);
    const listeners = bindings.get(key) || [];
    listeners.push({ el, name });
    bindings.set(key, listeners);
  }
}

function keyFromEvent(event) {
  const keys = [];
  if (event.ctrlKey) keys.push("ctrl");
  if (event.altKey) keys.push("alt");
  if (event.shiftKey) keys.push("shift");
  if (event.metaKey) keys.push("meta");
  keys.push(event.key.toLowerCase());
  return normalize(keys);
}

document.addEventListener("keydown", (event) => {
  const listeners = bindings.get(keyFromEvent(event));
  if (!listeners?.length) return;
  event.preventDefault();
  for (const { el, name } of listeners) {
    if (!el.isConnected) continue;
    const shortcutEvent = new CustomEvent("shortkey", { bubbles: true });
    Object.defineProperty(shortcutEvent, "srcKey", { value: name });
    el.dispatchEvent(shortcutEvent);
  }
});

export default {
  mounted(el, binding) {
    register(el, binding.value);
  },
  updated(el, binding) {
    register(el, binding.value);
  },
  unmounted(el) {
    unregister(el);
  },
};
