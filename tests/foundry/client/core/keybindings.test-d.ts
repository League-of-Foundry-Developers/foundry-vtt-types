import { expectTypeOf } from "vitest";

const keybindings = new ClientKeybindings();

expectTypeOf(keybindings.actions).toEqualTypeOf<Map<string, ClientKeybindings.KeybindingActionConfig>>();
expectTypeOf(keybindings.activeKeys).toEqualTypeOf<Map<string, ClientKeybindings.KeybindingAction[]>>();
expectTypeOf(keybindings.bindings).toEqualTypeOf<
  Map<string, ClientKeybindings.KeybindingActionBinding[]> | undefined
>();
expectTypeOf(keybindings.moveKeys).toEqualTypeOf<Set<string>>();
expectTypeOf(keybindings.initialize()).toEqualTypeOf<void>();

declare const kbac: ClientKeybindings.KeybindingActionConfig;

expectTypeOf(keybindings.register("", "", kbac)).toEqualTypeOf<void>();
expectTypeOf(keybindings.get("", "")).toEqualTypeOf<ClientKeybindings.KeybindingActionBinding[]>();
expectTypeOf(keybindings.set("", "")).toEqualTypeOf<Promise<void>>();
expectTypeOf(keybindings.resetDefaults()).toEqualTypeOf<Promise<void>>();

expectTypeOf(ClientKeybindings.MOVEMENT_DIRECTIONS).toEqualTypeOf<ClientKeybindings.MovementDirections>();
expectTypeOf(ClientKeybindings.ZOOM_DIRECTIONS).toEqualTypeOf<ClientKeybindings.ZoomDirections>();
