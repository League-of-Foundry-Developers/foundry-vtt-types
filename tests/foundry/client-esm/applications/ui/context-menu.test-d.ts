import { expectTypeOf } from "vitest";

import ContextMenu = foundry.applications.ux.ContextMenu;

const myJournal = new JournalEntry.implementation();

const testAppV1 = new JournalSheet(myJournal);
const testAppV2 = new foundry.applications.sheets.journal.JournalEntrySheet({ document: myJournal });

declare const htmlElement: HTMLElement;
declare const jquery: JQuery;

// Deprecated: Need to pass options with `jQuery` parameter to a boolean
const menu = ContextMenu.create(testAppV1, testAppV1.element, ".foobar", []);
expectTypeOf(menu.fixed).toBeBoolean();
expectTypeOf(menu.menuItems[0]?.callback(jquery)).toBeVoid();
// @ts-expect-error Callback for jQuery: true takes JQuery
menu.menuItems[0]?.callback(htmlElement);

ContextMenu.create(testAppV1, testAppV1.element[0]!, ".foobar", [], { jQuery: true });
// Deprecated: expects HTML element
ContextMenu.create(testAppV1, testAppV1.element, ".foobar", [], { jQuery: true });
// Deprecated: jQuery must be defined
ContextMenu.create(testAppV1, testAppV1.element[0]!, ".foobar", [], { jQuery: undefined });
// Deprecated: expects HTML element & jQuery must be defined
ContextMenu.create(testAppV1, testAppV1.element, ".foobar", [], { fixed: true });

// jQuery param deprecation testing

new ContextMenu(testAppV2.element, ".foobar", [], {
  jQuery: false,
  fixed: true,
});

// Deprecated: Need to pass options
new ContextMenu(testAppV2.element, ".foobar", []);

// Deprecated: Need to pass explicit `jQuery` param
new ContextMenu(testAppV2.element, ".foobar", [], {
  fixed: true,
});

// Deprecated: jQuery param should be a boolean
new ContextMenu(testAppV2.element, ".foobar", [], {
  jQuery: undefined,
  fixed: true,
});
