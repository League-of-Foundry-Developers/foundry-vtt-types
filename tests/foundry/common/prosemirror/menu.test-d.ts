import { expectTypeOf } from "vitest";
import type { EditorView } from "prosemirror-view";
import type * as PMMNamespace from "../../../../src/foundry/common/prosemirror/menu.d.mts";
import { Plugin } from "prosemirror-state";

declare const schema: foundry.prosemirror.Schema;
declare const view: EditorView;

const proseMirrorMenu = new foundry.prosemirror.ProseMirrorMenu(schema, view);

expectTypeOf(proseMirrorMenu.view).toEqualTypeOf<EditorView>();
expectTypeOf(proseMirrorMenu.items).toEqualTypeOf<PMMNamespace.ProseMirrorMenu.Item[]>();
expectTypeOf(proseMirrorMenu.id).toEqualTypeOf<Readonly<`prosemirror-menu-${string}`>>();
expectTypeOf(proseMirrorMenu.options).toEqualTypeOf<PMMNamespace.ProseMirrorMenu.ProseMirrorMenuOptions>();
expectTypeOf(proseMirrorMenu.dropdowns).toEqualTypeOf<PMMNamespace.ProseMirrorDropDown.Entry[]>();
expectTypeOf(proseMirrorMenu.render()).toEqualTypeOf<foundry.prosemirror.ProseMirrorMenu>();

declare const html: HTMLMenuElement;
expectTypeOf(proseMirrorMenu.activateListeners(html)).toEqualTypeOf<void>();
expectTypeOf(proseMirrorMenu.update(view, view)).toEqualTypeOf<void>();
expectTypeOf(proseMirrorMenu.destroy()).toEqualTypeOf<void>();

expectTypeOf(foundry.prosemirror.ProseMirrorMenu.build(schema)).toEqualTypeOf<Plugin>();
