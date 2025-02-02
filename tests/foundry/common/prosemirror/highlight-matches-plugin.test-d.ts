import { expectTypeOf } from "vitest";

declare const schema: foundry.prosemirror.Schema;

new foundry.prosemirror.ProseMirrorHighlightMatchesPlugin(schema, {});

expectTypeOf(
  foundry.prosemirror.ProseMirrorHighlightMatchesPlugin.build(schema, {}),
).toEqualTypeOf<foundry.prosemirror.Plugin>();

// TODO: build() should actually returns not just any plugin, but a plugin where spec.view is a function:
//   view(e: editorView) => PossibleMatchesTooltip
// that returns a PossibleMatchesTooltip that we can then test the properties of
