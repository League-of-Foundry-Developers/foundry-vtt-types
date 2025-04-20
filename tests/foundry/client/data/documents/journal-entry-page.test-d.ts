import { expectTypeOf } from "vitest";

// @ts-expect-error data is required
new JournalEntryPage.implementation();

// @ts-expect-error name is required
new JournalEntryPage.implementation({});

const myJournalEntryPage = new JournalEntryPage.implementation({ name: "foo" });

expectTypeOf(myJournalEntryPage.toc).toEqualTypeOf<Record<string, JournalEntryPage.JournalEntryPageHeading>>();
expectTypeOf(myJournalEntryPage.sceneNote).toEqualTypeOf<Note.Object | null>();

const headingElement = new HTMLHeadingElement();
expectTypeOf(JournalEntryPage.slugifyHeading(headingElement)).toEqualTypeOf<string>();
expectTypeOf(JournalEntryPage.slugifyHeading("Test string")).toEqualTypeOf<string>();

expectTypeOf(JournalEntryPage.buildTOC([new HTMLElement(), new HTMLElement()], {})).toEqualTypeOf<
  Record<string, JournalEntryPage.JournalEntryPageHeading>
>();
