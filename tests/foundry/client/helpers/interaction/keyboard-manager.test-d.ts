import { expectTypeOf } from "vitest";

import KeyboardManager = foundry.helpers.interaction.KeyboardManager;

const keyboard = new KeyboardManager();

expectTypeOf(keyboard.downKeys).toEqualTypeOf<Set<string>>();
expectTypeOf(keyboard.moveKeys).toEqualTypeOf<Set<string>>();
expectTypeOf(keyboard.hasFocus).toEqualTypeOf<boolean>();
expectTypeOf(keyboard.isModifierActive("")).toEqualTypeOf<boolean>();
expectTypeOf(keyboard.isCoreActionKeyActive("")).toEqualTypeOf<boolean>();
expectTypeOf(keyboard.releaseKeys()).toEqualTypeOf<void>();

expectTypeOf(KeyboardManager.MODIFIER_KEYS).toEqualTypeOf<{
  CONTROL: "Control";
  SHIFT: "Shift";
  ALT: "Alt";
}>();
expectTypeOf(KeyboardManager.MODIFIER_CODES).toEqualTypeOf<{
  Alt: ["AltLeft", "AltRight"];
  Control: ["ControlLeft", "ControlRight", "MetaLeft", "MetaRight", "Meta", "OsLeft", "OsRight"];
  Shift: ["ShiftLeft", "ShiftRight"];
}>();
expectTypeOf(KeyboardManager.PROTECTED_KEYS).toEqualTypeOf<
  ["F5", "F11", "F12", "PrintScreen", "ScrollLock", "NumLock", "CapsLock"]
>();
expectTypeOf(KeyboardManager.CONTROL_KEY_STRING).toEqualTypeOf<"⌘" | "Control">();
expectTypeOf(KeyboardManager.KEYCODE_DISPLAY_MAPPING).toEqualTypeOf<{
  ArrowLeft: "←" | "🡸";
  ArrowRight: "→" | "🡺";
  ArrowUp: "↑" | "🡹";
  ArrowDown: "↓" | "🡻";
  Backquote: "`";
  Backslash: "\\";
  BracketLeft: "[";
  BracketRight: "]";
  Comma: ",";
  Control: (typeof KeyboardManager)["CONTROL_KEY_STRING"];
  Equal: "=";
  Meta: "⌘" | "⊞";
  MetaLeft: "⌘" | "⊞";
  MetaRight: "⌘" | "⊞";
  OsLeft: "⌘" | "⊞";
  OsRight: "⌘" | "⊞";
  Minus: "-";
  NumpadAdd: "Numpad+";
  NumpadSubtract: "Numpad-";
  Period: ".";
  Quote: "'";
  Semicolon: ";";
  Slash: "/";
}>();
expectTypeOf(KeyboardManager.emulateKeypress(true, "")).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();
expectTypeOf(KeyboardManager.getKeycodeDisplayString("")).toEqualTypeOf<string>();

declare const event: KeyboardEvent;
expectTypeOf(
  KeyboardManager.getKeyboardEventContext(event, true),
).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();
