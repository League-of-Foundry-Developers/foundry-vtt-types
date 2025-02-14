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
expectTypeOf(menuA.fixed).toEqualTypeOf<true>();
expectTypeOf(menuA.menuItems[0]?.callback(htmlElement)).toBeVoid();
// @ts-expect-error Callback for jQuery: false takes an HTML Element
menuA.menuItems[0]?.callback(jquery);

// Deprecated menu items for appv2
const menuB = foundry.applications.ui.ContextMenu.create(testAppV2, testAppV2.element, ".foobar", []);
expectTypeOf(menuB.fixed).toEqualTypeOf<false>();
expectTypeOf(menuB.menuItems[0]?.callback(jquery)).toBeVoid();
// @ts-expect-error Callback for jQuery: true takes JQuery
menuB.menuItems[0]?.callback(htmlElement);

const menuC = foundry.applications.ui.ContextMenu.create(testAppV1, testAppV1.element, ".foobar", []);
expectTypeOf(menuC.fixed).toEqualTypeOf<false>();
expectTypeOf(menuC.menuItems[0]?.callback(jquery)).toBeVoid();
// @ts-expect-error Callback for jQuery: true takes JQuery
menuC.menuItems[0]?.callback(htmlElement);
