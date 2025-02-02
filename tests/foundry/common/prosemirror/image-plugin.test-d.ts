import { expectTypeOf } from "vitest";

declare const schema: foundry.prosemirror.Schema;

new foundry.prosemirror.ProseMirrorImagePlugin(schema, {});

expectTypeOf(foundry.prosemirror.ProseMirrorImagePlugin.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
expectTypeOf(foundry.prosemirror.ProseMirrorImagePlugin.base64ToFile("", "", "")).toEqualTypeOf<File>();
