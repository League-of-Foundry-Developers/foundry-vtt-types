import { expectTypeOf } from "vitest";

import ProseMirrorHighlightMatchesPlugin = foundry.prosemirror.ProseMirrorHighlightMatchesPlugin;

declare const schema: foundry.prosemirror.Schema;

// options is unused
expectTypeOf(ProseMirrorHighlightMatchesPlugin.build(schema, {})).toEqualTypeOf<
  foundry.prosemirror.Plugin<ProseMirrorHighlightMatchesPlugin.HighlightMatchesPluginSpec>
>();

// options is unused
new ProseMirrorHighlightMatchesPlugin(schema);
new ProseMirrorHighlightMatchesPlugin(schema, {});
