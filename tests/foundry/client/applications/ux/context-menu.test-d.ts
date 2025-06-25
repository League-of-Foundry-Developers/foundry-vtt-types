import { expectTypeOf } from "vitest";

import ContextMenu = foundry.applications.ux.ContextMenu;
import JournalSheet = foundry.appv1.sheets.JournalSheet;

const myJournal = new JournalEntry.implementation();

const testAppV1 = new JournalSheet(myJournal);
const testAppV2 = new foundry.applications.sheets.journal.JournalEntrySheet({ document: myJournal });

declare const htmlElement: HTMLElement;
declare const jquery: JQuery;

// Deprecated: Need to pass options with `jQuery` parameter to a boolean
// eslint-disable-next-line @typescript-eslint/no-deprecated
const menu = ContextMenu.create(testAppV1, testAppV1.element, ".foobar", []);
expectTypeOf(menu.fixed).toBeBoolean();
expectTypeOf(menu.menuItems[0]?.callback(jquery)).toBeVoid();
// @ts-expect-error Callback for jQuery: true takes JQuery
menu.menuItems[0]?.callback(htmlElement);

// Deprecated in general.
// eslint-disable-next-line @typescript-eslint/no-deprecated
ContextMenu.create(testAppV1, testAppV1.element[0]!, ".foobar", [], { jQuery: true });

// eslint-disable-next-line @typescript-eslint/no-deprecated
ContextMenu.create(testAppV1, testAppV1.element, ".foobar", [], { jQuery: true });

// eslint-disable-next-line @typescript-eslint/no-deprecated
ContextMenu.create(testAppV1, testAppV1.element[0]!, ".foobar", [], { jQuery: undefined });

// eslint-disable-next-line @typescript-eslint/no-deprecated
ContextMenu.create(testAppV1, testAppV1.element, ".foobar", [], { fixed: true });

new ContextMenu(testAppV2.element, ".foobar", [], {
  jQuery: false,
  fixed: true,
});

// Deprecated: Need to pass explicit `jQuery` param
// eslint-disable-next-line @typescript-eslint/no-deprecated
new ContextMenu(testAppV2.element, ".foobar", []);

// Deprecated: Need to pass explicit `jQuery` param
// eslint-disable-next-line @typescript-eslint/no-deprecated
new ContextMenu(testAppV2.element, ".foobar", [], {
  fixed: true,
});

// Deprecated: jQuery param should be a boolean
// eslint-disable-next-line @typescript-eslint/no-deprecated
new ContextMenu(testAppV2.element, ".foobar", [], {
  jQuery: undefined,
  fixed: true,
});
