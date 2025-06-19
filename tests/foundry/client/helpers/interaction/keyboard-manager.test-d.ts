import { expectTypeOf } from "vitest";

import KeyboardManager = foundry.helpers.interaction.KeyboardManager;
import ClientKeybindings = foundry.helpers.interaction.ClientKeybindings;

declare const kbdEvent: KeyboardEvent;

expectTypeOf(KeyboardManager.MODIFIER_KEYS).toExtend<
  Record<keyof KeyboardManager.ModifierKeys, KeyboardManager.MODIFIER_KEYS>
>();
expectTypeOf(KeyboardManager.MODIFIER_CODES).toEqualTypeOf<Record<"Alt" | "Control" | "Shift", string[]>>();
expectTypeOf(KeyboardManager.PROTECTED_KEYS).toEqualTypeOf<string[]>();
expectTypeOf(KeyboardManager.CONTROL_KEY_STRING).toBeString();
expectTypeOf(KeyboardManager.KEYCODE_DISPLAY_MAPPING).toEqualTypeOf<Record<string, string>>();

expectTypeOf(KeyboardManager.emulateKeypress(true, "KeyA")).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();
expectTypeOf(KeyboardManager.emulateKeypress(true, "KeyA", {})).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();
expectTypeOf(
  KeyboardManager.emulateKeypress(true, "KeyA", {
    altKey: false,
    ctrlKey: true,
    force: false,
    repeat: true,
    shiftKey: false,
  }),
).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();
expectTypeOf(
  KeyboardManager.emulateKeypress(true, "KeyA", {
    altKey: undefined,
    ctrlKey: undefined,
    force: undefined,
    repeat: undefined,
    shiftKey: undefined,
  }),
).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();

expectTypeOf(KeyboardManager.getKeycodeDisplayString("KeyA")).toEqualTypeOf<string>();

const context = KeyboardManager.getKeyboardEventContext(kbdEvent);
expectTypeOf(context).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();
expectTypeOf(
  KeyboardManager.getKeyboardEventContext(kbdEvent, true),
).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();
expectTypeOf(
  KeyboardManager.getKeyboardEventContext(kbdEvent, undefined),
).toEqualTypeOf<KeyboardManager.KeyboardEventContext>();

expectTypeOf(KeyboardManager["_getMatchingActions"](context)).toEqualTypeOf<ClientKeybindings.KeybindingAction[]>();

const kbdManager = new KeyboardManager();

expectTypeOf(kbdManager["_activateListeners"]()).toBeVoid();
expectTypeOf(kbdManager.downKeys).toEqualTypeOf<Set<string>>();
expectTypeOf(kbdManager.moveKeys).toEqualTypeOf<Set<string>>();
expectTypeOf(kbdManager.hasFocus).toEqualTypeOf<boolean>();
expectTypeOf(kbdManager.isModifierActive("ALT")).toEqualTypeOf<boolean>();
expectTypeOf(kbdManager.isCoreActionKeyActive("")).toEqualTypeOf<boolean>();

expectTypeOf(kbdManager["_processKeyboardContext"](context)).toBeVoid();
expectTypeOf(kbdManager["_processKeyboardContext"](context, {})).toBeVoid();
expectTypeOf(kbdManager["_processKeyboardContext"](context, { force: true })).toBeVoid();
expectTypeOf(kbdManager["_processKeyboardContext"](context, { force: undefined })).toBeVoid();

expectTypeOf(kbdManager.releaseKeys()).toEqualTypeOf<void>();
expectTypeOf(kbdManager.releaseKeys({})).toEqualTypeOf<void>();
expectTypeOf(kbdManager.releaseKeys({ force: false })).toEqualTypeOf<void>();
expectTypeOf(kbdManager.releaseKeys({ force: undefined })).toEqualTypeOf<void>();

declare const focusEvent: FocusEvent;
expectTypeOf(kbdManager["_onFocusIn"](focusEvent)).toBeVoid();
