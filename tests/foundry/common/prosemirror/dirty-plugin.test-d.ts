import { expectTypeOf } from "vitest";

declare const schema: foundry.prosemirror.Schema;

expectTypeOf(foundry.prosemirror.ProseMirrorDirtyPlugin.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
