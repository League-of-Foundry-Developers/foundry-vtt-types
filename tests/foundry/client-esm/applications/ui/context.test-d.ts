import { expectTypeOf } from "vitest";

const myJournal = new JournalEntry.implementation();

const testAppV1 = new JournalSheet(myJournal);
const testAppV2 = new foundry.applications.sheets.journal.JournalEntrySheet({ document: myJournal });

declare const htmlElement: HTMLElement;
declare const jquery: JQuery;

const menuA = foundry.applications.ui.ContextMenu.create(testAppV2, testAppV2.element, ".foobar", {
  jQuery: false,
  fixed: true,
});
expectTypeOf(menuA.fixed).toBeBoolean();
expectTypeOf(menuA.menuItems[0]?.callback(htmlElement)).toBeVoid();
// @ts-expect-error Callback for jQuery: false takes an HTML Element
menuA.menuItems[0]?.callback(jquery);

// Need to pass explicit jQuery in options
foundry.applications.ui.ContextMenu.create(testAppV2, testAppV2.element, ".foobar", {
  fixed: true,
});
// Need Jquery to be a boolean
foundry.applications.ui.ContextMenu.create(testAppV2, testAppV2.element, ".foobar", {
  jQuery: undefined,
  fixed: true,
});

// Deprecated menu items for appv2
const menuB = foundry.applications.ui.ContextMenu.create(testAppV2, testAppV2.element, ".foobar", []);
expectTypeOf(menuB.fixed).toBeBoolean();
expectTypeOf(menuB.menuItems[0]?.callback(jquery)).toBeVoid();
// @ts-expect-error Callback for jQuery: true takes JQuery
menuB.menuItems[0]?.callback(htmlElement);

// Need to pass explicit `jQuery` param
foundry.applications.ui.ContextMenu.create(testAppV2, testAppV2.element, ".foobar");
// param should be a boolean
foundry.applications.ui.ContextMenu.create(testAppV2, testAppV2.element, ".foobar", { jQuery: undefined });

// Need to pass explicit `jQuery` parameter
const menuC = foundry.applications.ui.ContextMenu.create(testAppV1, testAppV1.element, ".foobar", []);
expectTypeOf(menuC.fixed).toBeBoolean();
expectTypeOf(menuC.menuItems[0]?.callback(jquery)).toBeVoid();
// @ts-expect-error Callback for jQuery: true takes JQuery
menuC.menuItems[0]?.callback(htmlElement);

foundry.applications.ui.ContextMenu.create(testAppV1, testAppV1.element, ".foobar", [], { jQuery: true });
