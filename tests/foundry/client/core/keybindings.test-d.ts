import { expectTypeOf } from "vitest";

const keybindings = new ClientKeybindings();

expectTypeOf(keybindings.actions).toEqualTypeOf<Map<string, KeybindingActionConfig>>();
expectTypeOf(keybindings.activeKeys).toEqualTypeOf<Map<string, KeybindingAction[]>>();
expectTypeOf(keybindings.bindings).toEqualTypeOf<Map<string, KeybindingActionBinding[]> | undefined>();
expectTypeOf(keybindings.moveKeys).toEqualTypeOf<Set<string>>();
expectTypeOf(keybindings.initialize()).toEqualTypeOf<void>();

declare const kbac: KeybindingActionConfig;

expectTypeOf(keybindings.register("", "", kbac)).toEqualTypeOf<void>();
expectTypeOf(keybindings.get("", "")).toEqualTypeOf<KeybindingActionBinding[]>();
expectTypeOf(keybindings.set("", "")).toEqualTypeOf<Promise<void>>();
expectTypeOf(keybindings.resetDefaults()).toEqualTypeOf<Promise<void>>();

expectTypeOf(ClientKeybindings.MOVEMENT_DIRECTIONS).toEqualTypeOf<ClientKeybindings.MovementDirections>();
expectTypeOf(ClientKeybindings.ZOOM_DIRECTIONS).toEqualTypeOf<ClientKeybindings.ZoomDirections>();
