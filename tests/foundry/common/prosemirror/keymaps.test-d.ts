import { expectTypeOf } from "vitest";
import type { ProseMirrorCommand } from "../../../../src/foundry/common/prosemirror/keymaps.d.mts";

declare const schema: foundry.prosemirror.Schema;

const keymaps = new foundry.prosemirror.ProseMirrorKeyMaps(schema, {});

expectTypeOf(keymaps.onSave()).toEqualTypeOf<void>();
expectTypeOf(keymaps.buildMapping()).toEqualTypeOf<Record<string, ProseMirrorCommand>>();

expectTypeOf(foundry.prosemirror.ProseMirrorKeyMaps.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
