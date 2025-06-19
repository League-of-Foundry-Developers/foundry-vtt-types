import { expectTypeOf } from "vitest";

import ProseMirrorKeyMaps = foundry.prosemirror.ProseMirrorKeyMaps;

declare const schema: foundry.prosemirror.Schema;

expectTypeOf(
  ProseMirrorKeyMaps.build(schema, { onSave: () => ui.notifications?.success("hi there") }),
).toEqualTypeOf<foundry.prosemirror.Plugin>();

new ProseMirrorKeyMaps(schema);
new ProseMirrorKeyMaps(schema, { onSave: undefined });
const keymaps = new ProseMirrorKeyMaps(schema, { onSave: () => console.warn("saved!") });

if (keymaps.onSave) expectTypeOf(keymaps.onSave()).toEqualTypeOf<void>();

expectTypeOf(keymaps.buildMapping()).toEqualTypeOf<Record<string, ProseMirrorKeyMaps.Command>>();
