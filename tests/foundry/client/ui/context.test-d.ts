import { expectTypeOf } from "vitest";

declare const element: JQuery;
new ContextMenu(element, undefined, []);
new ContextMenu(element, null, []);
new ContextMenu(element, ".some-class", []);
new ContextMenu(element, ".some-class", [{ name: "Item", icon: "", condition: true, callback: () => undefined }]);
new ContextMenu(element, ".some-class", [{ name: "Item", icon: "", callback: () => undefined }]);
const contextMenu = new ContextMenu(element, ".some-class", [
  {
    name: "Item",
    icon: "",
    condition: () => true,
    callback: (target: JQuery) => {
      console.log(target);
    },
  },
]);
expectTypeOf(contextMenu.element).toEqualTypeOf<JQuery>();
expectTypeOf(contextMenu.selector).toEqualTypeOf<string>();
expectTypeOf(contextMenu.eventName).toEqualTypeOf<string>();
expectTypeOf(contextMenu.menuItems).toEqualTypeOf<ContextMenuEntry[]>();
expectTypeOf(contextMenu.onOpen).toEqualTypeOf<ContextMenu.ContextMenuCallback>();
expectTypeOf(contextMenu.onClose).toEqualTypeOf<ContextMenu.ContextMenuCallback>();
expectTypeOf(contextMenu.menu).toEqualTypeOf<JQuery>();

declare const app: foundry.applications.api.ApplicationV2.Any;
expectTypeOf(ContextMenu.create(app, new HTMLElement(), ".class", [])).toEqualTypeOf<ContextMenu>();
expectTypeOf(contextMenu.bind()).toEqualTypeOf<void>();
expectTypeOf(contextMenu.close()).toEqualTypeOf<Promise<void>>();
expectTypeOf(contextMenu.render(element)).toEqualTypeOf<void | Promise<JQuery | void>>();
expectTypeOf(contextMenu.menuItems).toEqualTypeOf<ContextMenuEntry[]>();
