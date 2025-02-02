import { expectTypeOf } from "vitest";
import type { AnyDocument } from "../../../../src/foundry/client/data/abstract/client-document.d.mts";

declare const schema: foundry.prosemirror.Schema;

const proseMirrorContentLinkPlugin = new foundry.prosemirror.ProseMirrorContentLinkPlugin(schema, {});
expectTypeOf(proseMirrorContentLinkPlugin.document).toEqualTypeOf<Readonly<AnyDocument>>();
expectTypeOf(proseMirrorContentLinkPlugin.relativeLinks).toEqualTypeOf<Readonly<boolean>>();

expectTypeOf(
  foundry.prosemirror.ProseMirrorContentLinkPlugin.build(schema, {}),
).toEqualTypeOf<foundry.prosemirror.Plugin>();
