import { expectTypeOf } from "vitest";

declare const schema: foundry.prosemirror.Schema;

const proseMirrorContentLinkPlugin = new foundry.prosemirror.ProseMirrorContentLinkPlugin(schema, {});
expectTypeOf(proseMirrorContentLinkPlugin.document).toEqualTypeOf<foundry.abstract.Document.Any>();
expectTypeOf(proseMirrorContentLinkPlugin.relativeLinks).toEqualTypeOf<Readonly<boolean>>();

expectTypeOf(
  foundry.prosemirror.ProseMirrorContentLinkPlugin.build(schema, {}),
).toEqualTypeOf<foundry.prosemirror.Plugin>();
