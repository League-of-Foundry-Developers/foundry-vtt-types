import { expectTypeOf } from "vitest";

declare const schema: foundry.prosemirror.Schema;

// options is unused
expectTypeOf(foundry.prosemirror.ProseMirrorDirtyPlugin.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
