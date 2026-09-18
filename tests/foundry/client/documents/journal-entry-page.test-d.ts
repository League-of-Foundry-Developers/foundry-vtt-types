import { expectTypeOf, test } from "vitest";

import Note = foundry.canvas.placeables.Note;

test("foundry/client/documents/journal-entry-page", () => {
  // @ts-expect-error data is required
  new JournalEntryPage.implementation();

  // @ts-expect-error name is required
  new JournalEntryPage.implementation({});

  const myJournalEntryPage = new JournalEntryPage.implementation({ name: "foo" });

  expectTypeOf(myJournalEntryPage.toc).toEqualTypeOf<Record<string, JournalEntryPage.Heading>>();
  expectTypeOf(myJournalEntryPage.sceneNote).toEqualTypeOf<Note.Implementation | null>();

  const headingElement = new HTMLHeadingElement();
  expectTypeOf(JournalEntryPage.slugifyHeading(headingElement)).toEqualTypeOf<string>();
  expectTypeOf(JournalEntryPage.slugifyHeading("Test string")).toEqualTypeOf<string>();

  expectTypeOf(JournalEntryPage.buildTOC([new HTMLElement(), new HTMLElement()], {})).toEqualTypeOf<
    Record<string, JournalEntryPage.Heading>
  >();

  class MyJournalEntryPage extends JournalEntryPage {
    protected static override _isHeading(element: HTMLElement): boolean {
      return super._isHeading(element) && !element.classList.contains("no-toc");
    }
  }
  expectTypeOf(MyJournalEntryPage["_isHeading"](new HTMLElement())).toEqualTypeOf<boolean>();
  expectTypeOf(JournalEntryPage["_isHeading"](new HTMLElement())).toEqualTypeOf<boolean>();
});
