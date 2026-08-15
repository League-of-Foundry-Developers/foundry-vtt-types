import { expectTypeOf } from "vitest";
import type { EditorView } from "prosemirror-view";
import { EditorState, Plugin, Transaction } from "prosemirror-state";

import ProseMirrorMenu = foundry.prosemirror.ProseMirrorMenu;
import ProseMirrorDropDown = foundry.prosemirror.ProseMirrorDropDown;
import type { Attrs, MarkType, Node, NodeType } from "prosemirror-model";
import type ProseMirrorKeyMaps from "../../../../src/foundry/common/prosemirror/keymaps.d.mts";

declare const schema: foundry.prosemirror.Schema;
declare const view: EditorView;

expectTypeOf(ProseMirrorMenu["_MENU_ITEM_SCOPES"]).toExtend<
  Record<keyof ProseMirrorMenu.MenuItemScopes, ProseMirrorMenu.MENU_ITEM_SCOPES>
>();

// construction options tested below
expectTypeOf(ProseMirrorMenu.build(schema, {})).toEqualTypeOf<Plugin>();

expectTypeOf(ProseMirrorMenu.activateListeners()).toBeVoid();
expectTypeOf(ProseMirrorMenu.activateListeners(document, { _deprecated: false })).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(ProseMirrorMenu.eventListeners()).toBeVoid();

new ProseMirrorMenu(schema, view);
new ProseMirrorMenu(schema, view, { compact: true, destroyOnSave: true, onSave: () => alert("foo") });
const pmm = new ProseMirrorMenu(schema, view, {
  compact: undefined,
  destroyOnSave: undefined,
  onSave: undefined,
});

expectTypeOf(pmm.view).toEqualTypeOf<EditorView>();
expectTypeOf(pmm.items).toEqualTypeOf<ProseMirrorMenu.Item[]>();
expectTypeOf(pmm.id).toEqualTypeOf<`prosemirror-menu-${string}`>();
expectTypeOf(pmm.options).toEqualTypeOf<ProseMirrorMenu.ConstructionOptions>();
expectTypeOf(pmm.dropdowns).toEqualTypeOf<ProseMirrorDropDown[]>();
expectTypeOf(pmm.editingSource).toBeBoolean();
expectTypeOf(pmm.render()).toEqualTypeOf<ProseMirrorMenu>();

declare const html: HTMLMenuElement;
expectTypeOf(pmm.activateListeners(html)).toEqualTypeOf<void>();

// neither param is used
expectTypeOf(pmm.update()).toEqualTypeOf<void>();
expectTypeOf(pmm.update(view)).toEqualTypeOf<void>();
expectTypeOf(pmm.update(view, view)).toEqualTypeOf<void>();

declare const previousState: EditorState;

expectTypeOf(pmm["_getDropDownMenus"]()).toEqualTypeOf<Record<string, ProseMirrorDropDown.Config>>();
expectTypeOf(pmm["_getMenuItems"]()).toEqualTypeOf<ProseMirrorMenu.Item[]>();

declare const pmmItem: ProseMirrorMenu.Item;
expectTypeOf(pmm["_isItemActive"](pmmItem)).toBeBoolean();
expectTypeOf(pmm["_isMarkActive"](pmmItem)).toBeBoolean();
expectTypeOf(pmm["_isNodeActive"](pmmItem)).toBeBoolean();

declare const mEvent: MouseEvent;
expectTypeOf(pmm["_onAction"](mEvent)).toBeVoid();

declare const resizeEntry: ResizeObserverEntry;
expectTypeOf(pmm["_onResize"]([resizeEntry])).toBeVoid();

expectTypeOf(pmm["_wrapEditor"]()).toBeVoid();
expectTypeOf(pmm["_handleSave"]()).toBeVoid();

declare const markType: MarkType;
expectTypeOf(pmm["_clearMark"](markType)).toBeVoid();
expectTypeOf(pmm["_fontColorPrompt"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(pmm["_fontSizePrompt"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(pmm["_insertImagePrompt"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(pmm["_insertLinkPrompt"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(pmm["_insertTablePrompt"]()).toEqualTypeOf<Promise<void>>();

expectTypeOf(pmm["_showDialog"]("action", "just text <span>or html</span>")).toEqualTypeOf<
  Promise<HTMLDialogElement>
>();
expectTypeOf(pmm["_showDialog"]("action", "{{template}}", { data: { template: "hi there" } })).toEqualTypeOf<
  Promise<HTMLDialogElement>
>();

expectTypeOf(pmm["_clearFormatting"]()).toBeVoid();

declare const dispatch: ProseMirrorKeyMaps.DispatchFunction;
expectTypeOf(pmm["_placeInsert"](previousState, dispatch, view, "<p>Insert</p>")).toBeVoid();
expectTypeOf(pmm["_placeInsert"](previousState, dispatch, view, "<span>Inline</span>", { inline: true })).toBeVoid();
expectTypeOf(pmm["_toggleMatches"]()).toEqualTypeOf<Promise<void>>();

declare const pmNode: Node;
declare const pmNodeType: NodeType;
const toggleBlockWrapCommand = (node: NodeType, attrs?: Attrs) => {
  const t = new Transaction(pmNode);
  return (state: EditorState, dispatch: ProseMirrorKeyMaps.DispatchFunction, view: EditorView) => {
    dispatch(t);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return !!state.selection && !!view.dragging && node.isInline && (attrs?.["foo"] as boolean);
  };
};

expectTypeOf(pmm["_toggleBlock"](pmNodeType, toggleBlockWrapCommand)).toBeVoid();
expectTypeOf(
  // nonsense Attrs, but it *is* Record<string, any>
  pmm["_toggleBlock"](pmNodeType, toggleBlockWrapCommand, { attrs: { fizz: new Set(), buzz: new PIXI.Container() } }),
).toBeVoid();
expectTypeOf(pmm["_toggleBlock"](pmNodeType, toggleBlockWrapCommand, { attrs: null })).toBeVoid();

expectTypeOf(pmm["_toggleMark"](markType)).toBeVoid();
expectTypeOf(pmm["_toggleMark"](markType, null)).toBeVoid();

// again, attrs could be anything
expectTypeOf(pmm["_toggleTextBlock"](pmNodeType, { attrs: {} })).toBeVoid();
expectTypeOf(pmm["_toggleTextBlock"](pmNodeType, { attrs: null })).toBeVoid();

expectTypeOf(pmm["getActionElement"]("save")).toEqualTypeOf<HTMLElement | null>();

const menuItem: ProseMirrorMenu.Item = {
  action: "save",
  title: "EDITOR.Save",
  cmd: () => {},
  cssClass: "right",
  group: 1,
  menu: "format",
  scope: ProseMirrorMenu["_MENU_ITEM_SCOPES"].TEXT,
  weight: 100,
};
expectTypeOf(menuItem).toEqualTypeOf<ProseMirrorMenu.Item>();
