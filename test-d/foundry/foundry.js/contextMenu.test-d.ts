import { expectType } from 'tsd';

declare const element: JQuery;
new ContextMenu(element, undefined, []);
new ContextMenu(element, null, []);
new ContextMenu(element, '.some-class', []);
new ContextMenu(element, '.some-class', [{ name: 'Item', icon: '', condition: true, callback: () => undefined }]);
new ContextMenu(element, '.some-class', [{ name: 'Item', icon: '', callback: () => undefined }]);
const contextMenu = new ContextMenu(element, '.some-class', [
  {
    name: 'Item',
    icon: '',
    condition: () => true,
    callback: (target: JQuery) => {
      console.log(target);
    }
  }
]);

expectType<void>(contextMenu.bind());
expectType<void | Promise<void>>(contextMenu.render(element));
expectType<ContextMenuEntry[]>(contextMenu.menuItems);
