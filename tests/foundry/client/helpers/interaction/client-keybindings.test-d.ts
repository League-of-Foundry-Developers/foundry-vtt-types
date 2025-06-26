import { expectTypeOf } from "vitest";

import ClientKeybindings = foundry.helpers.interaction.ClientKeybindings;
import KeyboardManager = foundry.helpers.interaction.KeyboardManager;

declare const action1: ClientKeybindings.KeybindingAction;
declare const action2: ClientKeybindings.KeybindingAction;

expectTypeOf(ClientKeybindings.MOVEMENT_DIRECTIONS).toEqualTypeOf<ClientKeybindings.MovementDirections>();
expectTypeOf(ClientKeybindings.ZOOM_DIRECTIONS).toEqualTypeOf<ClientKeybindings.ZoomDirections>();
// _compareActions only cares about two properties (the `ActionComparison` interface) but realistically
// it will be passed full `KeybindingAction`s
expectTypeOf(ClientKeybindings["_compareActions"](action1, action2)).toBeNumber();

const keybindings = new ClientKeybindings();

expectTypeOf(keybindings.actions).toEqualTypeOf<
  Map<`${string}.${string}`, ClientKeybindings.StoredKeybindingActionConfig>
>();
expectTypeOf(keybindings.activeKeys).toEqualTypeOf<Map<string, ClientKeybindings.KeybindingAction[]>>();
expectTypeOf(keybindings.bindings).toEqualTypeOf<
  Map<string, ClientKeybindings.StoredKeybindingActionBinding[]> | undefined
>();
expectTypeOf(keybindings.moveKeys).toEqualTypeOf<Set<string>>();
expectTypeOf(keybindings.initialize()).toEqualTypeOf<void>();

expectTypeOf(
  keybindings.register("core", "someAction", {
    name: "Do the Action",
    editable: [{ key: "KeyA", logicalKey: "KeyA", modifiers: [KeyboardManager.MODIFIER_KEYS.ALT] }],
    uneditable: [{ key: "Numpad7", logicalKey: "Numpad7", modifiers: ["CONTROL"] }],
    hint: "Some description of the action to be done",
    onDown: (context: KeyboardManager.KeyboardEventContext) => (!context.repeat ? true : undefined),
    onUp: (_context: KeyboardManager.KeyboardEventContext) => !!(Math.random() > 0.5),
    precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
    repeat: false,
    reservedModifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT],
    restricted: true,
  }),
).toEqualTypeOf<void>();

expectTypeOf(keybindings.get("core", "someOtherAction")).toEqualTypeOf<
  ClientKeybindings.StoredKeybindingActionBinding[]
>();

// setting with no value or explicit undefined clears bindings
expectTypeOf(keybindings.set("core", "yetAnother")).toEqualTypeOf<Promise<void>>();
expectTypeOf(keybindings.set("core", "yetAnother", undefined)).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  keybindings.set("core", "yetAnother", [{ key: "F7", logicalKey: "F7", modifiers: ["SHIFT"] }]),
).toEqualTypeOf<Promise<void>>();

expectTypeOf(keybindings.resetDefaults()).toEqualTypeOf<Promise<void>>();

declare const view: "game" | "stream";
expectTypeOf(keybindings["_registerCoreKeybindings"](view)).toBeVoid();
