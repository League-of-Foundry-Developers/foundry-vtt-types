import { expectTypeOf } from "vitest";

import ContextMenu = foundry.applications.ux.ContextMenu;

const myJournal = new JournalEntry.implementation();

const testAppV1 = new JournalSheet(myJournal);
const testAppV2 = new foundry.applications.sheets.journal.JournalEntrySheet({ document: myJournal });

declare const htmlElement: HTMLElement;
declare const jquery: JQuery;

const menuA = ContextMenu.create(testAppV2, testAppV2.element, ".foobar", {
  jQuery: false,
  fixed: true,
});
expectTypeOf(menuA.fixed).toBeBoolean();
expectTypeOf(menuA.menuItems[0]?.callback(htmlElement)).toBeVoid();
// @ts-expect-error Callback for jQuery: false takes an HTML Element
menuA.menuItems[0]?.callback(jquery);

// Deprecated: Don't pass menu items for appv2
const menuB = ContextMenu.create(testAppV2, testAppV2.element, ".foobar", []);
expectTypeOf(menuB.fixed).toBeBoolean();
expectTypeOf(menuB.menuItems[0]?.callback(jquery)).toBeVoid();
// @ts-expect-error Callback for jQuery: true takes JQuery
menuB.menuItems[0]?.callback(htmlElement);

// Deprecated: Need to pass options with `jQuery` parameter to a boolean
const menuC = ContextMenu.create(testAppV1, testAppV1.element, ".foobar", []);
expectTypeOf(menuC.fixed).toBeBoolean();
expectTypeOf(menuC.menuItems[0]?.callback(jquery)).toBeVoid();
// @ts-expect-error Callback for jQuery: true takes JQuery
menuC.menuItems[0]?.callback(htmlElement);

ContextMenu.create(testAppV1, testAppV1.element, ".foobar", [], { jQuery: true });

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

// Deprecated: Need to pass options
ContextMenu.create(testAppV2, testAppV2.element, ".foobar");
// Deprecated: Need to pass explicit `jQuery` param
ContextMenu.create(testAppV2, testAppV2.element, ".foobar", {});
// Deprecated: jQuery param should be a boolean
ContextMenu.create(testAppV2, testAppV2.element, ".foobar", { jQuery: undefined });

// Deprecated: Need to pass explicit `jQuery` param
ContextMenu.create(testAppV2, testAppV2.element, ".foobar", {
  fixed: true,
});
// Deprecated: jQuery param should be a boolean
ContextMenu.create(testAppV2, testAppV2.element, ".foobar", {
  jQuery: undefined,
  fixed: true,
});
