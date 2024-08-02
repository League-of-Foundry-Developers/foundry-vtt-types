import { expectTypeOf } from "vitest";

// @ts-expect-error Expected 1-2 arguments, but got 0.
new JournalEntryPage();
new JournalEntryPage({});

const myJournalEntryPage = new JournalEntryPage({ name: "foo" });

expectTypeOf(myJournalEntryPage.toc).toEqualTypeOf<Record<string, JournalEntryPage.JournalEntryPageHeading>>();
expectTypeOf(myJournalEntryPage.sceneNote).toEqualTypeOf<Note | null>();

const headingElement = new HTMLHeadingElement();
expectTypeOf(JournalEntryPage.slugifyHeading(headingElement)).toEqualTypeOf<string>();
expectTypeOf(JournalEntryPage.slugifyHeading("Test string")).toEqualTypeOf<string>();

expectTypeOf(JournalEntryPage.buildTOC([new HTMLElement(), new HTMLElement()], {})).toEqualTypeOf<
  Record<string, JournalEntryPage.JournalEntryPageHeading>
>();
