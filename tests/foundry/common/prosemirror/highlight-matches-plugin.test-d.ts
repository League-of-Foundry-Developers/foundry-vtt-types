import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";
import type { EditorState, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

import ProseMirrorHighlightMatchesPlugin = foundry.prosemirror.ProseMirrorHighlightMatchesPlugin;

declare const schema: foundry.prosemirror.Schema;

// options is unused
const builtPlugin = ProseMirrorHighlightMatchesPlugin.build(schema, {});
expectTypeOf(builtPlugin).toEqualTypeOf<ProseMirrorHighlightMatchesPlugin.HighlightMatchesPlugin>();
expectTypeOf(builtPlugin.spec.key).toEqualTypeOf<PluginKey<undefined>>();
expectTypeOf(builtPlugin.spec.isHighlightMatchesPlugin).toEqualTypeOf<true>();

// options is unused
new ProseMirrorHighlightMatchesPlugin(schema);
const plugin = new ProseMirrorHighlightMatchesPlugin(schema, {});
expectTypeOf(plugin.options).toEqualTypeOf<AnyObject>();

declare const tooltip: ProseMirrorHighlightMatchesPlugin.PossibleMatchesTooltip;
declare const view: EditorView;
declare const state: EditorState;
expectTypeOf(tooltip.tooltip).toEqualTypeOf<HTMLElement | undefined>();
expectTypeOf(tooltip.update(view, state)).toEqualTypeOf<Promise<void>>();
expectTypeOf(tooltip.update(view, null)).toEqualTypeOf<Promise<void>>();
expectTypeOf(builtPlugin.spec.view(view)).toEqualTypeOf<ProseMirrorHighlightMatchesPlugin.PossibleMatchesTooltip>();
expectTypeOf(builtPlugin.getState(state)).toEqualTypeOf<undefined>();
