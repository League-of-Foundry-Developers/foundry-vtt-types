import { expectTypeOf } from "vitest";

import ProseMirrorClickHandler = foundry.prosemirror.ProseMirrorClickHandler;
import type { EditorView } from "prosemirror-view";
import type { Node } from "prosemirror-model";

declare const schema: foundry.prosemirror.Schema;

//options is unused
expectTypeOf(ProseMirrorClickHandler.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();

const pmch = new ProseMirrorClickHandler(schema);

declare const view: EditorView;
declare const pointerEvent: PointerEvent;
declare const node: Node;

expectTypeOf(pmch["_onClick"](view, 2, node, 7, pointerEvent, false)).toEqualTypeOf<boolean | void>();
