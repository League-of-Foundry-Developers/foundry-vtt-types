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

expectTypeOf(contextMenu.bind()).toEqualTypeOf<void>();
expectTypeOf(contextMenu.render(element)).toEqualTypeOf<void | Promise<void>>();
expectTypeOf(contextMenu.menuItems).toEqualTypeOf<ContextMenuEntry[]>();
