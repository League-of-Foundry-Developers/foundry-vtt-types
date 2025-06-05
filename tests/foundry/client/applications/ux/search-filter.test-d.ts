import { expectTypeOf } from "vitest";

const SearchFilter = foundry.applications.ux.SearchFilter;

// @ts-expect-error - A SearchFilter requires data.
new SearchFilter();

// @ts-expect-error - A SearchFilter requires an `inputSelector` and a `contentSelector`.
new SearchFilter({});

expectTypeOf(
  new SearchFilter({
    inputSelector: "input",
    contentSelector: ".my-class",
    callback: (event: KeyboardEvent | null, query: string, rgx: RegExp, content: HTMLElement | null): void => {
      rgx.exec(content?.textContent ?? "");
    },
  }),
).toEqualTypeOf<SearchFilter>();

const filter = new SearchFilter({
  inputSelector: "input",
  contentSelector: ".my-class",
  callback: (event: KeyboardEvent | null, query: string, rgx: RegExp, content: HTMLElement | null): void => {
    rgx.exec(content?.textContent ?? "");
  },
  initial: "Type here",
  delay: 100,
});

expectTypeOf(filter.query).toEqualTypeOf<string>();
expectTypeOf(filter.callback).toEqualTypeOf<
  (event: KeyboardEvent | null, query: string, rgx: RegExp, content: HTMLElement | null) => void
>();
expectTypeOf(filter.rgx).toEqualTypeOf<RegExp | undefined>();
expectTypeOf(filter.bind(new HTMLDivElement())).toEqualTypeOf<void>();
expectTypeOf(filter.filter(new KeyboardEvent("keyup"), "Typed")).toEqualTypeOf<void>();

expectTypeOf(SearchFilter.cleanQuery(" my-query")).toEqualTypeOf<string>();
